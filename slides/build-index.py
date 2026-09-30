"""Build a static presentation directory from immediate child folders."""
from pathlib import Path
from html import escape
from urllib.parse import quote
import json
import re

ROOT = Path(__file__).resolve().parent

def localized(en, zh):
    """Render English once; keep the alternate copy out of visible text."""
    return f'<span data-en="{escape(str(en), quote=True)}" data-zh="{escape(str(zh), quote=True)}">{escape(str(en))}</span>'


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
        languages = data.get('languages', [])
        en_href = href + '#en/1' if 'en' in languages else href
        zh_href = href + '#zh/1' if 'zh' in languages else en_href
        hrefs = f'href="{en_href}" data-href-en="{en_href}" data-href-zh="{zh_href}"'
        link = f'<a class="open" {hrefs}>{localized("Open presentation", "打开演示")}<span aria-hidden="true"> ↗</span></a>'
        if data.get('legacy_hash'):
            if legacy is not None:
                raise ValueError('Only one presentation may own legacy hash links')
            legacy = href
        description = f'<p>{localized(data["description"], data.get("description_zh", data["description"]))}</p>' if data.get('description') else ''
        detail = f'<p class="detail">{localized(data["detail"], data.get("detail_zh", data["detail"]))}</p>' if data.get('detail') else ''
        heading = localized(title, data.get('title_zh', title))
        rows.append(f'<article><div class="folder" aria-hidden="true"><span>01</span><b>16:9</b></div><div class="entry"><p class="path">/slides/{escape(folder.name)}/</p><h2><a {hrefs}>{heading}</a></h2>{description}{detail}</div><div class="entry-actions">{link}</div></article>')
    # Number folders in the rendered order, not by metadata or historical identity.
    rows = [r.replace('<span>01</span>', f'<span>{i:02d}</span>') for i,r in enumerate(rows, 1)]
    listing = ''.join(rows) or f'<p class="empty">{localized("No presentations yet.", "暂无演示。")}</p>'
    redirect = ''
    if legacy:
        target = json.dumps(legacy).replace('<', '\\u003c')
        redirect = f'<script>if(/^#(en|zh)\/[1-9][0-9]*$/.test(location.hash))location.replace({target}+location.hash);</script>'
    html = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Slides | Jiacheng.website</title><meta name="description" content="Interactive 16:9 product presentations by Jiacheng Xie."><meta name="theme-color" content="#0e1712">
<script src="/visitor-tracker.js?v=20260828.1" defer></script>
<style>
*{box-sizing:border-box}body{margin:0;background:#f5f4ee;color:#1d3026;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue","PingFang SC","Microsoft YaHei",sans-serif}a{color:inherit;text-decoration:none}a:hover{text-decoration:none}a:focus-visible,button:focus-visible{outline:3px solid #ad7730;outline-offset:5px}header{background:#0e1712;color:#e7eee8;padding:23px max(24px,calc((100% - 1120px)/2));display:flex;justify-content:space-between;gap:20px;font-size:14px}main{max-width:1120px;margin:70px auto;padding:0 24px}.eyebrow{font-size:12px;letter-spacing:.15em;color:#236548;font-weight:700}h1{font-size:clamp(44px,6vw,68px);line-height:1.04;letter-spacing:-.055em;margin:15px 0 20px}.intro{font-size:19px;line-height:1.6;color:#59695f;max-width:760px}.list{margin-top:50px;border-bottom:1px solid #cbd5cb}article{display:grid;grid-template-columns:180px minmax(0,1fr) auto;gap:30px;align-items:center;padding:30px 0;border-top:1px solid #cbd5cb}.folder{aspect-ratio:16/9;border-radius:13px;background:linear-gradient(145deg,#173e2b,#09150f);color:#f4f1e8;position:relative;overflow:hidden;box-shadow:0 16px 34px #10271c20;transition:transform .28s ease,box-shadow .28s ease}.folder:before,.folder:after{content:"";position:absolute;border-radius:50%;filter:blur(1px)}.folder:before{width:110px;height:110px;background:#71ad8860;right:-24px;top:-36px}.folder:after{width:70px;height:70px;background:#bc844944;left:-22px;bottom:-25px}.folder span{position:absolute;left:18px;top:16px;font-size:26px;letter-spacing:-.04em;font-weight:650}.folder b{position:absolute;right:14px;bottom:12px;font-size:11px;letter-spacing:.12em;font-weight:650;color:#bed3c3}article:hover .folder{transform:translateY(-5px) rotate(-.5deg);box-shadow:0 22px 44px #10271c2b}.path{font:12px ui-monospace,monospace;color:#59695f;margin:0 0 11px;overflow-wrap:anywhere}h2{font-size:30px;line-height:1.15;letter-spacing:-.03em;margin:0 0 14px}h2 a:hover{color:#236548}.entry>p:not(.path){font-size:16px;line-height:1.5;margin:5px 0;color:#59695f}.entry .detail{font-size:13px!important;margin-top:16px!important}.entry-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}.open{display:inline-flex;align-items:center;min-height:46px;padding:12px 16px;border:1px solid #a4b8a8;border-radius:999px;font-size:14px;transition:transform .22s ease,background .22s ease}.open:hover{background:#e0e9df;transform:translateY(-2px)}.end{margin-top:30px;font-size:12px;color:#59695f;line-height:1.6}.empty{padding:25px 0}@media(max-width:860px){article{grid-template-columns:150px minmax(0,1fr)}.entry-actions{grid-column:2;justify-content:flex-start}}@media(max-width:600px){main{margin:42px auto}header{padding:19px 20px}article{grid-template-columns:1fr;gap:20px}.folder{width:min(100%,280px)}.entry-actions{grid-column:1}.intro{font-size:17px}h2{font-size:26px}.list{margin-top:34px}}
header{align-items:center}.language-switch{display:flex;align-items:center;gap:8px;flex-shrink:0}.language-switch[hidden]{display:none}.language-switch button{font:inherit;min-width:58px;min-height:44px;padding:8px 12px;border:1px solid #607a68;border-radius:999px;background:transparent;color:#e7eee8;cursor:pointer}.language-switch button[aria-pressed="true"]{background:#e7eee8;color:#0e1712;border-color:#e7eee8}.language-switch button:hover{border-color:#e7eee8}.open{gap:8px}@media(prefers-reduced-motion:reduce){*,*:before,*:after{transition:none!important}article:hover .folder,.open:hover{transform:none}}
</style></head><body><header><a href="/">Jiacheng.website</a><div class="language-switch" role="group" aria-label="Language" hidden><button type="button" data-lang="en" lang="en" aria-pressed="true">English</button><button type="button" data-lang="zh" lang="zh-Hans" aria-pressed="false">中文</button></div></header><main><p class="eyebrow">__EYEBROW__</p><h1>__HEADING__</h1><p class="intro">__INTRO__</p><section class="list" aria-label="Presentations">__LIST__</section><p class="end">Jiacheng Xie · jiacheng.website/slides/</p></main>__REDIRECT__
<script>
(() => {
  const switcher = document.querySelector('.language-switch');
  function renderLanguage() {
    const lang = location.hash === '#zh' ? 'zh' : 'en';
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
    document.title = lang === 'zh' ? '演示目录 | Jiacheng.website' : 'Slides | Jiacheng.website';
    document.querySelectorAll('[data-en]').forEach(el => {
      el.textContent = el.getAttribute('data-' + lang);
    });
    document.querySelectorAll('[data-href-en]').forEach(el => {
      el.setAttribute('href', el.getAttribute('data-href-' + lang));
    });
    switcher.setAttribute('aria-label', lang === 'zh' ? '语言' : 'Language');
    document.querySelector('.list').setAttribute('aria-label', lang === 'zh' ? '演示文稿' : 'Presentations');
    switcher.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
    });
  }
  switcher.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => { location.hash = button.dataset.lang; });
  });
  addEventListener('hashchange', renderLanguage);
  renderLanguage();
  switcher.hidden = false;
})();
</script></body></html>
'''.replace('__LIST__',listing).replace('__REDIRECT__',redirect).replace('__EYEBROW__', localized('JIACHENG.WEBSITE / SLIDES', 'JIACHENG.WEBSITE / 演示')).replace('__HEADING__', localized('Presentation Library', '演示目录')).replace('__INTRO__', localized('Interactive 16:9 product presentations for live demonstrations and partnership conversations.', '为现场演示与合作交流制作的 16:9 互动产品演示。'))
    (root / 'index.html').write_text(html)
    return len(rows)

if __name__ == '__main__':
    print(f'Built directory with {build()} presentation(s).')
