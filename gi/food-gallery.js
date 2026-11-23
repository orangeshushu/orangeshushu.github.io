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
    group.category = browseCategory(group);
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

function foodCard(group, rows) {
  const range = giRange(rows);
  const giLabel = range ? (range.includes("–")?t("GI 范围","GI range"):"GI") : "GI";
  const giValue = range || (rows.length ? t("见分组","By group") : t("未收录","Unavailable"));
  const photo = group.photo ? '<img class="tilePhoto" loading="lazy" decoding="async" alt="" src="'+esc(group.photo.src)+'">' : "";
  const first=group.series[0];
  let reading;
  if(first) {
    const value=m=>first.row.mean[first.study.minutes.indexOf(m)]?.toFixed(2)??"—";
    reading='<span class="tileReadings"><span>'+t("1 小时","1 h")+' <b>'+value(60)+'</b></span><span>'+t("2 小时","2 h")+' <b>'+value(120)+'</b></span></span>';
  }
  const dataLabel=first?(group.series.length>1?t("首组实测 · ","First cohort · "):t("血糖均值 · ","Mean glucose · "))+first.study.unit:t("仅收录 GI","GI records only");
  return '<button type="button" class="foodTile" data-open-food="'+esc(group.key)+'"><span class="tileHead">'+photo+
    '<span class="tileText"><span class="tileKind">'+esc(categoryName(group.category))+'</span><span class="tileName">'+esc(foodName(group))+'</span></span></span>'+
    '<span class="tileGi"><small>'+giLabel+'</small><b>'+esc(giValue)+'</b></span>'+
    '<span class="tileEvidence">'+esc(dataLabel)+'</span>'+(reading||"")+'</button>';
}

let selectedCategory = "all";
let displayStyle = "cards";
function giView() {
  const requestedKey=new URL(location.href).searchParams.get("food");
  const missingRequest=requestedKey && !foodCatalogue().groups.has(requestedKey);
  const regionsUsed = new Set(catalogRows().flatMap(r=>[r.region,r.country]).filter(Boolean));
  const regionOptions = [...regionsUsed].sort().map(k=>'<option value="'+esc(k)+'">'+esc(regionName(k))+'</option>').join("");
  const groups=[...foodCatalogue().groups.values()];
  const options=[["all",t("全部类别","All categories"),groups.length],...Object.keys(foodCategories).map(id=>[id,categoryName(id),groups.filter(g=>g.category===id).length]).filter(x=>x[2])];
  $("work").innerHTML='<div class="atlasLayout"><aside class="categoryRail"><h2>'+t("食物分类","Food categories")+'</h2><div class="catMenu">'+options.map(([id,label,count])=>'<button type="button" data-category="'+id+'" aria-pressed="'+(id===selectedCategory)+'"><span>'+label+'</span><small>'+numberText(count)+'</small></button>').join("")+'</div>'+
    '<label class="catMobile">'+t("分类浏览","Browse by category")+' <select id="categorySelect">'+options.map(([id,label,count])=>'<option value="'+id+'">'+label+' ('+count+')</option>').join("")+'</select></label></aside>'+
    '<section class="catalogPanel"><div class="resultHeading"><h2 id="groupHeading"></h2><div class="viewSwitch"><button id="cardMode">'+t("卡片","Cards")+'</button><button id="listMode">'+t("列表","List")+'</button></div></div>'+
    (missingRequest?'<p class="foodSource">'+t("此名称未收录在当前目录。如来自国际研究工作簿，请先载入下方的扩展检索。","This name is unavailable in the current catalogue. For international entries, load the workbook below.")+'</p>':"")+
    '<div class="foodTools"><button id="allFoods"></button><button id="curveFoods"></button><button id="evaluatedFoods"></button><details class="foodFilterPanel"><summary>'+t("来源与排序","Sources & sorting")+'</summary><div class="foodTools">'+
    '<select id="giSource" aria-label="'+t("GI 来源","GI source")+'"><option value="all">'+t("所有 GI 来源","All GI sources")+'</option>'+sourceOptions()+'</select>'+
    '<select id="giRegion" aria-label="'+t("地区","Region")+'"><option value="">'+t("全部 GI 地区","All GI regions")+'</option>'+regionOptions+'</select>'+
    '<select id="sort" aria-label="'+t("排序","Sort")+'"><option value="source">'+t("实测曲线优先","Measured curves first")+'</option><option value="asc">'+t("最低 GI 升序","Lowest GI first")+'</option><option value="desc">'+t("最高 GI 降序","Highest GI first")+'</option></select></div></details><button id="clearFilters">'+t("清除筛选","Clear filters")+'</button></div>'+
    '<div class="foodBar"><span id="giCount" role="status"></span><div class="foodPager"><label>'+t("每页 ","Per page ")+'<select id="pageSize">'+[60,120,240].map(n=>'<option>'+n+'</option>').join("")+'</select></label><span id="topPager"></span></div></div>'+
    '<div id="foodGrid" class="foodGrid"></div><div class="foodBar"><span class="foodLegend">'+t("GI 以葡萄糖为 100。餐后读数是所示试验的人群均值。","GI uses glucose = 100. Post-meal readings are group means from the displayed trial.")+'</span><div id="bottomPager" class="foodPager"></div></div></section></div>'+
    '<details id="workbookRail" class="sourceRail"><summary>'+t("扩展检索 · 国际 GI 工作簿","Extended search · International GI workbook")+'</summary><div id="importer" class="importBar"></div></details>';
  const categoryChange=id=>{selectedCategory=id; listing.page=0;giResults()};
  $("categorySelect").onchange=e=>categoryChange(e.target.value);
  document.querySelector(".catMenu").onclick=e=>{const b=e.target.closest("[data-category]");if(b)categoryChange(b.dataset.category)};
  $("cardMode").onclick=()=>{displayStyle="cards";giResults()};
  $("listMode").onclick=()=>{displayStyle="list";giResults()};
  const setOnly = flag => {curveOnly=flag; if(listing.source==="chtc-product-gi")listing.source="all";$("giSource").value=listing.source;listing.page=0;giResults()};
  $("evaluatedFoods").onclick=()=>{curveOnly=false;listing.source="chtc-product-gi";listing.page=0;$("giSource").value=listing.source;giResults()};
  $("allFoods").onclick=()=>setOnly(false);
  $("curveFoods").onclick=()=>setOnly(true);
  for (const [id, prop] of [["giSource","source"],["giRegion","region"],["pageSize","size"]]) {
    $(id).value=listing[prop];
    $(id).onchange=e=>{listing[prop]=prop==="size"?Number(e.target.value):e.target.value; listing.page=0; giResults()};
  }
  $("sort").value=sortBy;
  $("sort").onchange=e=>{sortBy=e.target.value; listing.page=0; giResults()};
  $("clearFilters").onclick=()=>{query=""; $("giQuery").value=""; listing.page=0; listing.source="all"; listing.region=""; selectedCategory="all"; sortBy="source"; curveOnly=false; giView()};
  $("foodGrid").onclick=e=>{const card=e.target.closest("[data-open-food]"); if(card) openFood(card.dataset.openFood)};
  for (const id of ["topPager","bottomPager"]) $(id).onclick=e=>{
    const control=e.target.closest("[data-page-step]");
    if (!control) return;
    listing.page+=Number(control.dataset.pageStep); giResults();
    $("groupHeading").scrollIntoView({behavior:"instant"});
    $("groupHeading").setAttribute("tabindex","-1");$("groupHeading").focus({preventScroll:true});
  };
  $("giQuery").value=query;
  importControls(); giResults();
  if(localState.message || localState.busy || missingRequest) $("workbookRail").open=true;
}
function giResults() {
  const {groups} = foodCatalogue();
  const tokens = normalized(query).split(" ").filter(Boolean);
  const restrictRows = listing.source!=="all" || Boolean(listing.region);
  const matches=[];
  for (const group of groups.values()) {
    if (selectedCategory!=="all" && group.category!==selectedCategory) continue;
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
  const url=new URL(location.href);
  const active={category:selectedCategory==="all"?"":selectedCategory,source:listing.source==="all"?"":listing.source,q:query,curves:curveOnly?"1":"",layout:displayStyle==="list"?"list":""};
  for(const [name,value] of Object.entries(active)) {if(value)url.searchParams.set(name,value);else url.searchParams.delete(name)}
  if(url.href!==location.href)history.replaceState(null,"",url);
  $("groupHeading").textContent=selectedCategory==="all"?t("全部食物","All foods"):categoryName(selectedCategory);
  $("categorySelect").value=selectedCategory;
  document.querySelectorAll("[data-category]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.category===selectedCategory)));
  $("allFoods").textContent=t("全部记录","All records");
  $("curveFoods").textContent=t("有餐后实测","Measured after eating");
  $("clearFilters").hidden=!(query||curveOnly||selectedCategory!=="all"||restrictRows||sortBy!=="source");
  $("cardMode").setAttribute("aria-pressed",String(displayStyle==="cards"));
  $("listMode").setAttribute("aria-pressed",String(displayStyle==="list"));
  $("foodGrid").classList.toggle("listStyle",displayStyle==="list");
  $("evaluatedFoods").textContent=t("机构评价产品","Evaluated products");
  $("evaluatedFoods").setAttribute("aria-pressed",String(listing.source==="chtc-product-gi"));
  $("allFoods").setAttribute("aria-pressed",String(!curveOnly && listing.source!=="chtc-product-gi"));
  $("curveFoods").setAttribute("aria-pressed",String(curveOnly));
  $("giCount").textContent=total?t("显示 ","Showing ")+numberText(start+1)+"–"+numberText(Math.min(start+listing.size,total))+t("，共 "," of ")+numberText(total)+t(" 项"," foods & preparations"):t("没有匹配的食物。可清除筛选或换一个关键词。","No matching foods. Clear filters or try another term.");
  $("foodGrid").innerHTML=matches.slice(start,start+listing.size).map(m=>foodCard(m.group,m.rows)).join("");
  const pager='<button data-page-step="-1" '+(listing.page===0?"disabled":"")+' aria-label="'+t("上一页","Previous page")+'">‹</button> '+(listing.page+1)+" / "+pages+' <button data-page-step="1" '+(listing.page+1>=pages?"disabled":"")+' aria-label="'+t("下一页","Next page")+'">›</button>';
  $("topPager").innerHTML=pager; $("bottomPager").innerHTML=pager;
}

function evidenceBlock(evidence) {
  if (!evidence) return "";
  return '<div class="sourceProof"><span>'+esc(english?evidence.typeEn:evidence.typeZh)+'</span><a target="_blank" rel="noopener noreferrer" href="'+esc(evidence.url)+'">'+esc(english?evidence.locatorEn:evidence.locatorZh)+'</a></div>';
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
    '<div class="seriesStats">'+stats+'</div><p class="axisLabel">'+label+' ('+unit+')</p>'+chart(row,study)+'<p class="foodSource">'+t("横轴 · 进餐后分钟数","Horizontal axis · minutes after eating")+'</p>'+evidenceBlock(evidenceForCurve(row,study))+
    '<details><summary>'+t("数值与研究方法","Values and study methods")+'</summary><table><thead><tr><th>min</th><th>'+label+' ('+unit+')</th><th>'+(row.sem?"SEM":"SD")+' ('+unit+')</th></tr></thead><tbody>'+table+'</tbody></table><p>'+esc(english?study.methodEn:study.methodZh)+'</p></details>';
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
      '</div><div class="recordProof"><b>'+esc(src?titleOf(src):r.source)+'</b>'+evidenceBlock(evidenceForGI(r))+'<details><summary>'+t("试验及条目详情","Record details")+'</summary><div class="facts">'+rowDetails(r,src)+'</div></details></div></div>';
  }).join("");
  const select=group.series.length>1?'<label>'+t("选择研究人群 ","Study population ")+'<select id="seriesSelect">'+group.series.map(({study},i)=>'<option value="'+i+'">'+esc(titleOf(study))+'</option>').join("")+'</select></label>':"";
  const img=group.photo;
  const changesText=img?.changes?.includes("Cropped")?t("经裁切、缩小并转为 WebP","Cropped, resized and converted to WebP"):t("经缩小并转为 WebP","Resized and converted to WebP");
  const photo=img?'<figure class="drawerPhoto"><img src="'+esc(img.src)+'" alt="'+esc(english?img.foodEn:img.foodZh)+'"><figcaption>'+
    (img.kind==="ingredient"?t("食材示意","Ingredient illustration"):t("食物示意","Food illustration"))+' · '+esc(english?img.foodEn:img.foodZh)+' · '+link(esc(img.url),esc(img.title))+' · '+esc(img.author)+' · '+link(esc(img.licenseUrl),esc(img.license))+(img.changes?' · '+esc(changesText):"")+'</figcaption></figure>':"";
  const curveSection='<section class="drawerSection"><h3>'+t("餐后血糖曲线","Post-meal glucose curve")+'</h3>'+select+'<div id="seriesBody">'+(group.series.length?renderSeries(group.series[0]):'<p>'+t("本站尚未收录此做法的分时血糖读数。GI 衡量一段时间内的相对血糖反应，单个 GI 值无法推算餐后 1 小时或 2 小时的血糖。","Time-point readings for this preparation are unavailable here. GI summarizes a relative glucose response over time. A GI value alone cannot yield a 1- or 2-hour glucose level.")+'</p>'+relatedCurves(group))+'</div></section>';
  const giSection=(gis?'<section class="drawerSection"><h3>'+t("血糖生成指数（GI）","Glycemic index (GI)")+'</h3><p class="foodSource">'+t("葡萄糖参考值为 100。范围取各条记录的最低值和最高值；不同做法、人群和研究可能得到不同结果。","Glucose reference = 100. A range shows the lowest and highest reported values. Preparations, study groups and results may differ.")+'</p>'+gis+'</section>':"");
  dialog.innerHTML='<div class="drawerTop"><div class="drawerHeading"><small>'+esc(categoryName(group.category))+'</small><h2 id="drawerTitle">'+esc(foodName(group))+'</h2></div><button id="closeFood" autofocus>'+t("关闭","Close")+'</button></div>'+
    (group.series.length?curveSection+giSection:giSection+curveSection)+photo;
  if(select) $("seriesSelect").onchange=e=>$("seriesBody").innerHTML=renderSeries(group.series[Number(e.target.value)]);
  $("closeFood").onclick=()=>dialog.close();
  dialog.onclick=e=>{const related=e.target.closest("[data-related]");if(related){openFood(related.dataset.related);$("closeFood").focus();return}if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close()}};
  dialog.onclose=()=>{const url=new URL(location.href);url.searchParams.delete("food");history.replaceState(null,"",url)};
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop=0;
}
