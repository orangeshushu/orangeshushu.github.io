"""Build a static presentation directory from immediate child folders."""
from pathlib import Path
from html import escape
from urllib.parse import quote
import json
import re

ROOT = Path(__file__).resolve().parent

def build(root=ROOT):
    rows = []
    legacy = None
    for folder in sorted(root.iterdir(), key=lambda p: p.name):
        page = folder / 'index.html'
        if not folder.is_dir() or folder.is_symlink() or folder.name.startswith('.') or not page.is_file():
            continue
        metadata = folder / 'presentation.json'
        data = json.loads(metadata.read_text()) if metadata.exists() else {}
        title = data.get('title')
        if not title:
            match = re.search(r'<title[^>]*>(.*?)</title>', page.read_text(), re.I | re.S)
            from html import unescape
            title = unescape(match.group(1)).strip() if match else folder.name
        href = './' + quote(folder.name, safe='') + '/'
        links = []
        for lang in data.get('languages', []):
            if lang in ('en', 'zh'):
                links.append(f'<a class="open" href="{href}#{lang}/1">{"English" if lang == "en" else "中文"}<span aria-hidden="true"> ↗</span></a>')
        if not links:
            links.append(f'<a class="open" href="{href}">Open presentation <span aria-hidden="true">↗</span></a>')
        if data.get('legacy_hash'):
            if legacy is not None:
                raise ValueError('Only one presentation may own legacy hash links')
            legacy = href
        description = ''.join(f'<p>{escape(str(data[k]))}</p>' for k in ('description', 'description_zh') if data.get(k))
        detail = f'<p class="detail">{escape(str(data["detail"]))}</p>' if data.get('detail') else ''
        rows.append(f'<article><div class="folder" aria-hidden="true">01</div><div class="entry"><p class="path">/{escape(folder.name)}/</p><h2><a href="{href}">{escape(str(title))}</a></h2>{description}{detail}</div><nav aria-label="Open {escape(str(title))}">{"".join(links)}</nav></article>')
    # Number folders in the rendered order, not by metadata or historical identity.
    rows = [r.replace('aria-hidden="true">01</div>', f'aria-hidden="true">{i:02d}</div>') for i,r in enumerate(rows, 1)]
    listing = ''.join(rows) or '<p class="empty">No presentations yet. / 暂无演示。</p>'
    redirect = ''
    if legacy:
        target = json.dumps(legacy).replace('<', '\\u003c')
        redirect = f'<script>if(/^#(en|zh)\/[1-5]$/.test(location.hash))location.replace({target}+location.hash);</script>'
    html = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Presentations | Jiacheng Xie</title><meta name="description" content="Product demonstrations and presentations by Jiacheng Xie."><meta name="theme-color" content="#0e1712">
<style>
*{box-sizing:border-box}body{margin:0;background:#f5f4ee;color:#1d3026;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue","PingFang SC","Microsoft YaHei",sans-serif}a{color:inherit;text-decoration:none}a:hover{text-decoration:underline}a:focus-visible{outline:3px solid #ad7730;outline-offset:5px}header{background:#0e1712;color:#e7eee8;padding:25px max(24px,calc((100% - 1120px)/2));display:flex;justify-content:space-between;gap:20px;font-size:14px}main{max-width:1120px;margin:76px auto;padding:0 24px}.eyebrow{font-size:12px;letter-spacing:.15em;color:#236548;font-weight:600}h1{font-size:clamp(40px,6vw,66px);line-height:1.1;letter-spacing:-.05em;margin:15px 0 20px}.intro{font-size:19px;line-height:1.6;color:#59695f;max-width:720px}.list{margin-top:55px;border-bottom:1px solid #cbd5cb}article{display:grid;grid-template-columns:45px 1fr auto;gap:24px;align-items:center;padding:35px 0;border-top:1px solid #cbd5cb}.folder{align-self:start;color:#236548;font-size:18px;padding-top:4px}.path{font:12px ui-monospace,monospace;color:#59695f;margin:0 0 12px;overflow-wrap:anywhere}h2{font-size:29px;line-height:1.2;letter-spacing:-.025em;margin:0 0 16px}.entry>p:not(.path){font-size:16px;line-height:1.5;margin:5px 0;color:#59695f}.entry .detail{font-size:12px!important;margin-top:18px!important}nav{display:flex;gap:12px;flex-wrap:wrap}.open{display:inline-block;min-height:44px;padding:12px 16px;border:1px solid #a4b8a8;border-radius:8px;font-size:14px}.open:hover{background:#e6ece3}.end{margin-top:30px;font-size:12px;color:#59695f;line-height:1.6}.empty{padding:25px 0}@media(max-width:700px){main{margin:45px auto}header{padding:20px 24px}article{grid-template-columns:26px 1fr;gap:16px}nav{grid-column:2}.intro{font-size:17px}h2{font-size:25px}.list{margin-top:35px}}
</style></head><body><header><a href="/">Jiacheng Xie</a><span>Presentations / 演示目录</span></header><main><p class="eyebrow">ROADSHOW</p><h1>Presentations</h1><p class="intro">Product demonstrations and ideas for collaboration.<br><span lang="zh-Hans">项目演示与合作交流。</span></p><section class="list" aria-label="Presentations">__LIST__</section><p class="end">Jiacheng Xie · jiacheng.website</p></main>__REDIRECT__</body></html>
'''.replace('__LIST__',listing).replace('__REDIRECT__',redirect)
    (root / 'index.html').write_text(html)
    return len(rows)

if __name__ == '__main__':
    print(f'Built directory with {build()} presentation(s).')
