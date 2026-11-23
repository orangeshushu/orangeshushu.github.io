"use strict";

let foodCache;
let curveOnly = false;

const foodKey = row => normalized(row.en || row.zh);
const foodName = row => (english ? row.en : row.zh) || row.en || row.zh;
const numberText = n => n.toLocaleString(english ? "en-US" : "zh-CN");

function foodCatalogue() {
  const records = catalogRows();
  if (foodCache?.records === records) return foodCache;
  const groups = new Map();
  function ensure(key, row) {
    if (!groups.has(key)) groups.set(key, {key, en:row.en, zh:row.zh, rows:[], series:[], terms:[]});
    const group = groups.get(key);
    if (!group.zh && row.zh) group.zh = row.zh;
    return group;
  }
  const studies = curvesByStudy();
  const verifiedWorkbookKeys = new Map(studies.flatMap(study=>study.foods.filter(f=>f.internationalItem).map(f=>[f.internationalItem,foodKey(f)])));
  const henryKeys = new Map();
  for (const row of records) {
    const key = (row.source===intlId && verifiedWorkbookKeys.get(row.item)) || foodKey(row);
    const group = ensure(key, row);
    group.rows.push(row);
    group.terms.push(row.search);
    if (row.source === "henry") henryKeys.set(row.row, key);
  }
  for (const study of studies) {
    for (const row of study.foods) {
      const key = henryKeys.get(row.henryRow) || foodKey(row);
      const group = ensure(key, row);
      group.series.push({row, study});
      group.terms.push(row.en, row.zh, study.en, study.zh, tagsFor(row.en));
    }
  }
  const photos = window.atlasFoodPhotos || {};
  for (const group of groups.values()) {
    const labels = [...group.series.flatMap(({row})=>[row.en,row.zh]),group.en,group.zh];
    group.photo = labels.map(label=>photos[label]).find(Boolean) || window.atlasPhotoForFood?.(group);
    group.search = normalized(group.terms.filter(Boolean).join(" "));
    delete group.terms;
  }
  foodCache = {records, groups};
  return foodCache;
}

function giRange(rows) {
  const values = rows.map(row=>row.gi).filter(Number.isFinite);
  if (!values.length) return "";
  const min = Math.min(...values), max = Math.max(...values);
  return min === max ? String(min) : min + "–" + max;
}

function sparkline({row, study}) {
  const lo = Math.min(...row.mean), hi = Math.max(...row.mean);
  const times = study.minutes;
  const coords = times.map((m,i)=>{
    const x = 2 + 110 * (m-times[0])/(times.at(-1)-times[0]);
    const y = hi === lo ? 11 : 20 - 18 * (row.mean[i]-lo)/(hi-lo);
    return x.toFixed(1)+","+y.toFixed(1);
  });
  return '<svg class="tileSpark" viewBox="0 0 114 22" aria-hidden="true"><polyline points="'+coords.join(" ")+'" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
}

function foodCard(group, rows) {
  const range = giRange(rows);
  const metric = [range ? "GI "+range : rows.length ? t("GI 分组值","GI by group") : "",
    group.series.length ? t("实测曲线","Measured curve") : ""].filter(Boolean).join(" · ");
  const photo = group.photo ? '<img class="tilePhoto" loading="lazy" decoding="async" alt="" title="'+esc((group.photo.kind==="ingredient"?t("食材示意 · ","Ingredient illustration · "):t("食物示意 · ","Food illustration · "))+(english?group.photo.foodEn:group.photo.foodZh))+'" src="'+esc(group.photo.src)+'">' : "";
  return '<button type="button" class="foodTile" data-open-food="'+esc(group.key)+'">'+photo+
    '<span class="tileText"><span class="tileName">'+esc(foodName(group))+'</span><span class="tileMetric">'+esc(metric)+'</span></span>'+
    (group.series.length?sparkline(group.series[0]):"")+'</button>';
}

function giView() {
  const requestedKey=new URL(location.href).searchParams.get("food");
  const missingRequest=requestedKey && !foodCatalogue().groups.has(requestedKey);
  const regionsUsed = new Set(catalogRows().flatMap(r=>[r.region,r.country]).filter(Boolean));
  const regionOptions = [...regionsUsed].sort().map(k=>'<option value="'+esc(k)+'">'+esc(regionName(k))+'</option>').join("");
  $("work").innerHTML = '<div class="foodToolbar"><h2>'+t("食物目录","Food catalogue")+'</h2>'+
    '<input type="search" id="giQuery" aria-label="'+t("搜索食物","Search foods")+'" placeholder="'+t("搜索食物或做法，如米饭、苹果、燕麦","Search foods or preparations, e.g. rice, apple, oats")+'"></div>'+
    (missingRequest?'<p class="foodSource">'+t("此名称未收录在当前目录。如来自国际研究工作簿，请先载入下方的扩展检索。","This name is unavailable in the current catalogue. For international workbook entries, open Extended search and load the workbook.")+'</p>':"")+
    '<div class="foodTools"><button id="allFoods"></button><button id="curveFoods"></button><details class="foodFilterPanel"><summary>'+t("更多筛选","More filters")+'</summary><div class="foodTools">'+
    '<select id="giSource" aria-label="'+t("GI 来源","GI source")+'"><option value="all">'+t("所有 GI 来源","All GI sources")+'</option>'+sourceOptions()+'</select>'+
    '<select id="giRegion" aria-label="'+t("地区","Region")+'"><option value="">'+t("全部 GI 地区","All GI regions")+'</option>'+regionOptions+'</select>'+
    '<select id="sort" aria-label="'+t("排序","Sort")+'"><option value="source">'+t("实测曲线优先","Measured curves first")+'</option><option value="asc">'+t("最低 GI 升序","Lowest GI first")+'</option><option value="desc">'+t("最高 GI 降序","Highest GI first")+'</option></select>'+
    '<button id="clearFilters">'+t("重置","Reset")+'</button></div></details></div>'+
    '<div class="foodBar"><span id="giCount" role="status"></span><div class="foodPager"><label>'+t("每页 ","Per page ")+'<select id="pageSize">'+[60,120,240].map(n=>'<option>'+n+'</option>').join("")+'</select></label><span id="topPager"></span></div></div>'+
    '<div id="foodGrid" class="foodGrid"></div><div class="foodBar"><span class="foodLegend">'+t("同名食物按名称归组，打开可核对每项研究的做法、份量与人群。","Matching names are grouped. Open a food to check preparation, portion and population in each study.")+'</span><div id="bottomPager" class="foodPager"></div></div>'+
    '<details id="workbookRail" class="sourceRail"><summary>'+t("扩展检索 · 国际 GI 工作簿","Extended search · International GI workbook")+'</summary><div id="importer" class="importBar"></div></details>';
  $("giQuery").value=query;
  $("giQuery").oninput=e=>{query=e.target.value; listing.page=0; giResults()};
  const setOnly = flag => {curveOnly=flag; listing.page=0; giResults()};
  $("allFoods").onclick=()=>setOnly(false);
  $("curveFoods").onclick=()=>setOnly(true);
  for (const [id, prop] of [["giSource","source"],["giRegion","region"],["pageSize","size"]]) {
    $(id).value=listing[prop];
    $(id).onchange=e=>{listing[prop]=prop==="size"?Number(e.target.value):e.target.value; listing.page=0; giResults()};
  }
  $("sort").value=sortBy;
  $("sort").onchange=e=>{sortBy=e.target.value; listing.page=0; giResults()};
  $("clearFilters").onclick=()=>{query=""; listing.page=0; listing.source="all"; listing.region=""; sortBy="source"; curveOnly=false; giView()};
  $("foodGrid").onclick=e=>{const card=e.target.closest("[data-open-food]"); if(card) openFood(card.dataset.openFood)};
  for (const id of ["topPager","bottomPager"]) $(id).onclick=e=>{
    const control=e.target.closest("[data-page-step]");
    if (!control) return;
    listing.page+=Number(control.dataset.pageStep); giResults();
    $("giQuery").focus({preventScroll:true}); $("work").scrollIntoView({behavior:"instant"});
  };
  importControls(); giResults();
  if(localState.message || localState.busy || missingRequest) $("workbookRail").open=true;
}

function giResults() {
  const {groups} = foodCatalogue();
  const tokens = normalized(query).split(" ").filter(Boolean);
  const restrictRows = listing.source!=="all" || Boolean(listing.region);
  const matches=[];
  for (const group of groups.values()) {
    if ((curveOnly&&!group.series.length) || !tokens.every(k=>group.search.includes(k))) continue;
    const rows = restrictRows ? group.rows.filter(r=>
      (listing.source==="all"||listing.source===r.source||(r.source===intlId&&listing.source==="T"+r.table)) &&
      (!listing.region || [r.region,r.country].includes(listing.region))) : group.rows;
    if (restrictRows&&!rows.length) continue;
    const numbers=rows.map(r=>r.gi).filter(Number.isFinite);
    const rank=sortBy==="asc"?Math.min(...numbers):sortBy==="desc"?-Math.max(...numbers):
      (group.series.length?0:2)+(group.photo?0:1);
    matches.push({group,rows,rank});
  }
  matches.sort((a,b)=>a.rank-b.rank);
  const total=matches.length, pages=Math.max(1,Math.ceil(total/listing.size));
  listing.page=Math.max(0,Math.min(listing.page,pages-1));
  const start=listing.page*listing.size;
  const curveCount=[...groups.values()].filter(g=>g.series.length).length;
  $("allFoods").textContent=t("全部食物","All foods")+" "+numberText(groups.size);
  $("curveFoods").textContent=t("有实测曲线","Measured curves")+" "+numberText(curveCount);
  $("allFoods").setAttribute("aria-pressed",String(!curveOnly));
  $("curveFoods").setAttribute("aria-pressed",String(curveOnly));
  $("giCount").textContent=total?t("显示 ","Showing ")+numberText(start+1)+"–"+numberText(Math.min(start+listing.size,total))+t("，共 "," of ")+numberText(total)+t(" 项"," foods & preparations"):t("没有匹配的食物。请调整关键词或筛选。","No matching foods. Try another term or filter.");
  $("foodGrid").innerHTML=matches.slice(start,start+listing.size).map(m=>foodCard(m.group,m.rows)).join("");
  const pager='<button data-page-step="-1" '+(listing.page===0?"disabled":"")+' aria-label="'+t("上一页","Previous page")+'">‹</button> '+(listing.page+1)+" / "+pages+' <button data-page-step="1" '+(listing.page+1>=pages?"disabled":"")+' aria-label="'+t("下一页","Next page")+'">›</button>';
  $("topPager").innerHTML=pager; $("bottomPager").innerHTML=pager;
}

function renderSeries({row,study}) {
  const times=study.minutes, unit=esc(study.unit);
  const label=study.measure==="absolute"?t("平均葡萄糖","Mean glucose"):t("平均葡萄糖变化","Mean glucose change");
  const stats=[0,60,120].map(m=>{
    const i=times.indexOf(m);
    return '<div><small>'+[t("起始","Baseline"),t("餐后 1 小时","1 hour"),t("餐后 2 小时","2 hours")][m/60]+'</small><br><b>'+(i<0?"—":row.mean[i].toFixed(2))+'</b> '+unit+'</div>';
  }).join("");
  const dispersion=row.sd||row.sem;
  const table=times.map((m,i)=>'<tr><td>'+m+'</td><td>'+row.mean[i].toFixed(2)+'</td><td>'+(dispersion?.[i]!=null?dispersion[i].toFixed(2):"—")+'</td></tr>').join("");
  return '<p><b>'+esc(foodName(row))+'</b> · '+esc(titleOf(study))+'</p><p class="foodSource">'+esc(english?row.portionEn:row.portionZh)+' · n = '+esc(row.n)+(Number.isFinite(row.gi)?' · GI '+esc(row.gi):'')+'</p>'+
    '<p>'+label+' ('+unit+')</p>'+chart(row,study)+'<p class="foodSource">'+t("横轴 · 进餐后分钟数","Horizontal axis · minutes after eating")+'</p><div class="seriesStats">'+stats+'</div>'+
    '<details><summary>'+t("数值与研究方法","Values and study methods")+'</summary><table><thead><tr><th>min</th><th>'+label+' ('+unit+')</th><th>'+(row.sem?"SEM":"SD")+' ('+unit+')</th></tr></thead><tbody>'+table+'</tbody></table><p>'+esc(english?study.methodEn:study.methodZh)+'</p></details>'+
    '<p class="foodSource">'+link(study.url,t("查看原研究","Original study"))+'</p>';
}

// Related experiments are offered separately from this preparation's evidence.
const relatedIngredients = /\b(?:rice|apple|pear|banana|carrot|mango|grape|watermelon|potato|plantain|guava|papaya|bean|peach|persimmon|tangerine|bread|noodle|macaroni|jackfruit|rambutan|longan)s?\b/gi;
function relatedCurves(group) {
  if (group.series.length) return "";
  const family = name => (name||"").match(relatedIngredients)?.map(word=>word.toLowerCase().replace(/s$/,"").replace(/^potatoe$/,"potato"))||[];
  const words = new Set(family(group.en));
  if (!words.size) return "";
  const related = [...foodCatalogue().groups.values()].filter(g=>g.series.length && family(g.en).some(word=>words.has(word))).slice(0,5);
  if (!related.length) return "";
  return '<div class="relatedFoods"><p>'+t("相关食材的其他试验（品种或做法不同）","Other tests of related ingredients (varieties or preparations differ)")+'</p>'+
    related.map(g=>'<button type="button" data-related="'+esc(g.key)+'">'+esc(foodName(g))+'</button>').join("")+'</div>';
}

function openFood(key) {
  const group=foodCatalogue().groups.get(key);
  if (!group) return;
  const url=new URL(location.href);
  url.searchParams.set("food",key);
  history.replaceState(null,"",url);
  const dialog=$("foodDialog");
  const sourcesMap=new Map(giSources().map(s=>[s.id,s]));
  const gis=group.rows.map(r=>{
    const src=sourcesMap.get(r.source);
    return '<div class="foodDataRow"><div><b>GI '+esc(r.gi??r.raw??"—")+'</b>'+
      (Number.isFinite(r.gi)?'<meter class="giScale" aria-label="GI" min="'+Math.min(0,r.gi)+'" max="'+Math.max(100,r.gi)+'" value="'+r.gi+'"></meter>':'')+
      '</div><details><summary>'+esc(src?titleOf(src):r.source)+'</summary><div class="facts">'+rowDetails(r,src)+'</div></details></div>';
  }).join("");
  const select=group.series.length>1?'<label>'+t("选择研究人群 ","Study population ")+'<select id="seriesSelect">'+group.series.map(({study},i)=>'<option value="'+i+'">'+esc(titleOf(study))+'</option>').join("")+'</select></label>':"";
  const img=group.photo;
  const changesText=img?.changes?.includes("Cropped")?t("经裁切、缩小并转为 WebP","Cropped, resized and converted to WebP"):t("经缩小并转为 WebP","Resized and converted to WebP");
  const photo=img?'<figure class="drawerPhoto"><img src="'+esc(img.src)+'" alt="'+esc(english?img.foodEn:img.foodZh)+'"><figcaption>'+
    (img.kind==="ingredient"?t("食材示意","Ingredient illustration"):t("食物示意","Food illustration"))+' · '+esc(english?img.foodEn:img.foodZh)+' · '+link(esc(img.url),esc(img.title))+' · '+esc(img.author)+' · '+link(esc(img.licenseUrl),esc(img.license))+(img.changes?' · '+esc(changesText):"")+'</figcaption></figure>':"";
  dialog.innerHTML='<div class="drawerTop"><div class="drawerHeading"><h2 id="drawerTitle">'+esc(foodName(group))+'</h2></div><button id="closeFood" autofocus>'+t("关闭","Close")+'</button></div>'+
    '<section class="drawerSection"><h3>'+t("餐后血糖曲线","Post-meal glucose curve")+'</h3>'+select+'<div id="seriesBody">'+(group.series.length?renderSeries(group.series[0]):'<p>'+t("本站尚未收录此做法的分时血糖读数。GI 衡量一段时间内的相对血糖反应，单个 GI 值无法推算餐后 1 小时或 2 小时的血糖。","Time-point readings for this preparation are unavailable here. GI summarizes a relative glucose response over time. A GI value alone cannot yield a 1- or 2-hour glucose level.")+'</p>'+relatedCurves(group))+'</div></section>'+
    (gis?'<section class="drawerSection"><h3>'+t("血糖生成指数（GI）","Glycemic index (GI)")+'</h3><p class="foodSource">'+t("葡萄糖参考值为 100。各行保留原来源。","Glucose reference = 100. Each row retains its source.")+'</p>'+gis+'</section>':"")+photo;
  if(select) $("seriesSelect").onchange=e=>$("seriesBody").innerHTML=renderSeries(group.series[Number(e.target.value)]);
  $("closeFood").onclick=()=>dialog.close();
  dialog.onclick=e=>{const related=e.target.closest("[data-related]");if(related){openFood(related.dataset.related);$("closeFood").focus();return}if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close()}};
  dialog.onclose=()=>{const url=new URL(location.href);url.searchParams.delete("food");history.replaceState(null,"",url)};
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop=0;
}
