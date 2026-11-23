"use strict";
const $ = id => document.getElementById(id);
let english = new URLSearchParams(location.search).get("lang") === "en";
let mode = ["simulate","curves","meals","verify"].includes(new URLSearchParams(location.search).get("view")) ? new URLSearchParams(location.search).get("view") : "gi";
let studyIndex = 0;
let foodIndex = 0;
let query = "";
let sortBy = "source";
const t = (zh, en) => english ? en : zh;
const titleOf = row => english ? row.en : row.zh;
const esc = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const original = "https://kyxuebao.kmmu.edu.cn/article/doi/10.12259/j.issn.2095-610X.S20231207";
const cnGI = "https://www.nhc.gov.cn/fzs/c100048/201805/e821444378d64bafa7283779631096ce/files/1733125377688_81470.pdf#page=7";
const shPaper = "https://www.nature.com/articles/s41597-023-01940-7";
const shData = "https://doi.org/10.6084/m9.figshare.20444397.v3";
const ccby = "https://creativecommons.org/licenses/by/4.0/";
const link = (url,label) => '<a href="'+url+'" target="_blank" rel="noopener noreferrer">'+label+'</a>';
function sources(){
  const paper=t("研究原文","Study"), database=t("数据库","Database"), standard=t("卫生行业标准","Health standard"), dataset=t("研究数据集","Research dataset");
  return [
    [paper,t("云南五种米制品","Five Yunnan rice foods"),t("蒋慕蓉等，昆明医科大学学报，2023。表 1–5 报告餐前与餐后六个时点的均值和标准差。","Jiang et al., Journal of Kunming Medical University, 2023. Tables 1–5 report baseline and six post-meal group means and standard deviations."),t("本站按数值自行绘图，期刊原表与配图的再发布授权待核实。","Charts are drawn from published numeric findings. Republication rights for the original tables and figures are unverified."),[[original,paper]]],
    [standard,t("国家卫健委 · 常见食物 GI","China NHC · Common food GI"),t("WS/T 601—2018《妊娠期糖尿病患者膳食指导》资料性附录 A。葡萄糖为 100，收录 71 项。","Informative Appendix A of WS/T 601—2018 lists 71 foods on the glucose = 100 scale."),t("本站摘录数值并翻译名称。附录未列逐项人群、份量或测定方法。","Names translated for this atlas. The appendix gives no item-specific cohort, portion or protocol."),[[cnGI,t("原表 · PDF 第 7 页","Table · PDF p. 7")]]],
    [paper,t("斯坦福大学 · 七种碳水食物","Stanford · Seven carbohydrate foods"),t("55 名参与者接受标准化食物测试，比较米饭、面包、土豆、意面、黑豆、葡萄和混合莓果的个体反应。","Standardized tests in 55 participants examined responses to rice, bread, potatoes, pasta, black beans, grapes and mixed berries."),t("本站仅展示由公开传感器数据计算的组均值，保留每种食物的实际样本数。","Atlas summaries are calculated from released sensor data with food-specific participant counts."),[["https://pmc.ncbi.nlm.nih.gov/articles/PMC12283382/",paper],["https://cgmdb.stanford.edu/",database]]],
    [database,t("悉尼大学 · GI Search","University of Sydney · GI Search"),t("按食物名称查 GI、食品描述与原研究。可对照品种、加工和烹调方式。","Search food-specific GI entries and study references. Check variety, processing and preparation when comparing records."),t("网站所有者对收费、广告和产品内使用列有许可要求。","The site lists permission requirements for paid access, advertising and use in products for sale."),[["https://glycemicindex.com/gi-search/",t("查询 GI","Search GI")],["https://glycemicindex.com/copyright-and-permission/",t("使用条款","Permissions")]]],
    [paper,t("国际 GI 与 GL 表","International GI and GL tables"),t("Atkinson 等，2021。汇总超过 4,000 个食品条目，较严格方法组有 2,091 条。","Atkinson et al., 2021. More than 4,000 entries, including 2,091 in the higher-quality group."),t("可在 GI 查询中临时载入研究者整理的工作簿。","The GI lookup can load a researcher-prepared workbook for this session."),[["https://pubmed.ncbi.nlm.nih.gov/34258626/",paper]]],
    [dataset,t("上海糖尿病饮食与连续血糖","Shanghai diabetes and CGM"),t("上海 1 型和 2 型糖尿病研究，记录饮食、用药及每 15 分钟一次的传感器读数。","Shanghai cohorts with type 1 or type 2 diabetes. Logs include food, medication and 15-minute sensor glucose."),t("Figshare 第 3 版 · CC BY 4.0。","Figshare v3 · CC BY 4.0."),[[shData,t("数据与署名","Data & attribution")],[shPaper,paper],[ccby,t("许可","License")]]],
    [dataset,"CGMacros · PhysioNet",t("45 人、约 10 天，记录整餐营养素、进餐时间及连续血糖，可研究混合餐。","Approximately ten days of meal timing, macronutrients and continuous glucose for 45 participants."),t("PhysioNet 第 1 版 · CC BY-NC-SA 4.0，含非商业使用限制。","PhysioNet v1.0.0 · CC BY-NC-SA 4.0, including a noncommercial restriction."),[["https://physionet.org/content/cgmacros/1.0.0/",t("数据与许可","Data & license")]]],
    [database,t("公共卫生科学数据中心","China Public Health Science Data Center"),t("中文资源目录描述了涵盖 11 类、200 余种常见食物的 GI 资料。","The Chinese catalog describes a GI collection of over 200 foods across 11 categories."),t("仅资源目录，未确认批量下载及商用许可。","Catalog entry. Bulk download and commercial rights unverified."),[["https://www.phsciencedata.cn/Share/ky_sjml.jsp?id=2ec166ba-85a5-460a-87ff-792827b7370a",t("资源目录","Catalog record")]]],
    [standard,t("食物血糖生成指数测定方法","Chinese GI measurement method"),t("国家卫健委发布的 WS/T 652—2019，说明参考食物、血糖测量及曲线下面积的计算方法。","WS/T 652—2019 describes reference foods, glucose measurements and incremental area under the curve."),t("适合核对指标定义与测定方法。","Method and terminology reference."),[["https://www.nhc.gov.cn/fzs/c100048/201906/ae057c7a93744972bd7722077c91ca34.shtml",t("标准原文","Official standard")]]]
  ];
}
const signed = n => (n > 0 ? "+" : "") + n.toFixed(2);
function curveNumber(value,study,minute) {
  return value==null?t("未报告","Unreported"):value.toFixed(study.evidenceKind==="digitized"&&!(minute===0&&study.baselineFromText)?1:2);
}
function curveMetric(study) {
  return study.measure==="absolute"?t("组平均葡萄糖","Group mean glucose"):t("较餐前平均变化","Mean change from baseline");
}
function chart(row,study){
  const times=study.minutes,w=700,h=210,left=46,right=25,top=15,bottom=32;
  const min=Math.floor(Math.min(...row.mean)),max=Math.max(min+1, Math.ceil(Math.max(...row.mean)));
  const x=m=>left+(m-times[0])/(times.at(-1)-times[0])*(w-left-right);
  const y=v=>top+(max-v)/(max-min)*(h-top-bottom);
  const points=times.map((m,i)=>[x(m),y(row.mean[i])]);
  const path=points.map(([a,b],i)=>(i?"L":"M")+a+","+b).join(" ");
  let ticks="";
  for(let v=min;v<=max;v+=Math.ceil((max-min)/4))ticks+='<line x1="'+left+'" x2="'+(w-right)+'" y1="'+y(v)+'" y2="'+y(v)+'" stroke="#dce5dc" stroke-dasharray="3 5"/><text x="30" text-anchor="end" y="'+(y(v)+4)+'">'+v+'</text>';
  const labels=times.map((m,i)=>'<text x="'+x(m)+'" y="'+(h-7)+'" text-anchor="middle">'+m+'</text><circle cx="'+x(m)+'" cy="'+points[i][1]+'" r="4.6" fill="#f3f8e8" stroke="#16715b" stroke-width="2.5"><title>'+m+' min · '+curveNumber(row.mean[i],study,times[i])+' '+esc(study.unit)+'</title></circle>').join("");
  return '<svg class="plot" viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+esc(titleOf(row)+" · "+curveMetric(study)+t("，各时间点见下表。",". Time-point values follow in the table."))+'">'+(times.length>2?'<path d="'+path+' L'+x(times.at(-1))+','+y(min)+' L'+x(times[0])+','+y(min)+' Z" fill="#e4efdf"/>':"")+ticks+(times.length>2?'<path d="'+path+'" fill="none" stroke="#16674e" stroke-width="3.3" stroke-linejoin="round"/>':"")+labels+'</svg>';
}
function curveView(){
  const studies=curvesByStudy(), study=studies[studyIndex], times=study.minutes;
  const row=study.foods[foodIndex],name=titleOf(row),unit=study.unit;
  const dispersion=row.sd||row.sem;
  const labels=[study.measure==="absolute"?t("餐前均值","Mean baseline"):t("起点变化量","Starting change"),t("1 小时变化","1-hour change"),t("2 小时变化","2-hour change")];
  const deltas=row.mean.map(value=>(value>row.mean[0]?"+":"")+curveNumber(value-row.mean[0],study));
  const stats=[0,times.indexOf(60),times.indexOf(120)].map((i,j)=>'<div class="stat"><span>'+labels[j]+'</span><strong>'+(i<0?t("未报告","Unreported"):i===0?curveNumber(row.mean[0],study,0):deltas[i])+'</strong></div>').join("");
  const table=times.map((m,i)=>'<tr><td>'+m+'</td><td>'+curveNumber(row.mean[i],study,times[i])+'</td><td>'+(dispersion?dispersion[i].toFixed(2):"—")+'</td><td>'+deltas[i]+'</td></tr>').join("");
  $("work").innerHTML='<h2>'+t("餐后实测曲线","Measured post-meal curves")+'</h2><p class="sub">'+t("选择研究人群和食物，查看原文报告的餐后时间点。","Choose a study population and food to explore the reported time points.")+'</p><div class="controls"><label for="study">'+t("研究与人群","Study and population")+'</label><select id="study">'+studies.map((s,i)=>'<option value="'+i+'">'+esc(titleOf(s))+'</option>').join("")+'</select></div><div class="analysis"><article class="panel"><div class="chartTop"><h3>'+esc(name)+'</h3><span class="meta">'+curveMetric(study)+' · '+unit+'</span></div><div class="foodTabs">'+study.foods.map((f,i)=>'<button data-food="'+i+'" aria-pressed="'+(i===foodIndex)+'">'+esc(titleOf(f))+'</button>').join("")+'</div>'+chart(row,study)+'<p class="note">'+t("相对于进餐的时间（分钟）","Minutes relative to the meal")+'</p><details><summary>'+t("各时间点的数值","Time-point values")+'</summary><div class="tableWrap"><table><thead><tr>'+[t("分钟","Minutes"),t("均值","Mean"),row.sem?t("均值标准误","SEM"):t("标准差","SD"),t("较起始值变化","Change")].map(x=>'<th>'+x+'</th>').join("")+'</tr></thead><tbody>'+table+'</tbody></table></div></details></article><aside class="side"><h3>'+t("这份食物的餐后变化","Response to this portion")+'</h3><small>'+esc(english?row.portionEn:row.portionZh)+' · n = '+row.n+' · '+unit+'</small>'+stats+'<p class="note">'+esc(english?study.methodEn:study.methodZh)+'</p>'+link(study.url,t("核对原研究","Open original study"))+'</aside></div>';
  $("work").querySelector(".side").insertAdjacentHTML("beforeend",simFoodLink(study,row)+evidenceBlock(evidenceForCurve(row,study)));
  $("study").value=studyIndex;$("study").onchange=e=>{studyIndex=Number(e.target.value);foodIndex=0;curveView();$("study").focus({preventScroll:true})};
}
function mealsView(){
  const s=window.atlasShanghai;
  const value=n=>n==null?t("样本少","Small sample"):signed(n);
  const rows=s.groups.map(g=>'<tr><td>'+esc(titleOf(g.cohort))+'</td><td>'+g.participants+'</td><td>'+g.meals+'</td><td>'+value(g.delta60)+'</td><td>'+value(g.delta120)+'</td></tr>').join("");
  $("work").innerHTML='<h2>'+titleOf(s.title)+'</h2><p class="sub">'+t("从公开饮食日志提取 526 次米饭配餐，比较进餐前后的传感器葡萄糖。","Sensor glucose around 526 rice-containing mixed meals selected from public dietary logs.")+'</p><article class="dataPanel"><h3>'+t("餐后变化中位数","Median post-meal change")+'</h3><p class="note">'+t("单位 mmol/L。先对每人多餐取中位数，再对组内参与者取中位数。","Values in mmol/L. Medians across meals for each person, then across participants.")+'</p><div class="tableWrap"><table><thead><tr>'+[t("研究人群","Cohort"),t("入选人数","People"),t("餐次","Meals"),t("60 分钟升幅","60-min change"),t("120 分钟升幅","120-min change")].map(v=>'<th>'+v+'</th>').join("")+'</tr></thead><tbody>'+rows+'</tbody></table></div><p>'+esc(titleOf(s.caution))+'</p><details><summary>'+t("筛选与统计方法","Selection and analysis")+'</summary><p>'+esc(titleOf(s.method))+'</p></details><p class="note">'+esc(titleOf(s.attribution))+' '+link(s.datasetUrl,t("源数据","Source data"))+' · '+link(s.licenseUrl,"CC BY 4.0")+'</p></article>';
}
function renderWork(){
  document.body.dataset.view=mode;
  const modes=[["gi",t("食物图鉴","Food atlas")],["simulate",t("血糖模拟","Simulator")],["curves",t("实测曲线","Measured curves")],["meals",t("整餐研究","Mixed meals")],["verify",t("产品认证与名录","Product verification")]];
  $("modes").innerHTML=modes.map(([key,label])=>'<button data-mode="'+key+'" aria-pressed="'+(key===mode)+'">'+label+'</button>').join("");
  if(mode==="simulate") simulatorView(); else if(mode==="curves") curveView(); else if(mode==="gi") giView(); else if(mode==="meals") mealsView(); else {verificationView();issuerRecordsView()}
}
function render(){
  document.documentElement.lang=t("zh-CN","en");document.title=t("食物血糖图谱","Food Glucose Atlas")+" · NourishDay";
  $("siteTitle").textContent=t("食物血糖图谱","Food Glucose Atlas");
  $("intro").textContent=t("查血糖生成指数（GI）和餐后 1、2 小时的血糖，点开食物查看原始数据。","Explore glycemic index (GI) and blood glucose one and two hours after eating. Open a food to check the evidence.");
  $("searchLabel").textContent=t("查找食物或做法","Find a food or preparation");
  $("giQuery").placeholder=t("输入食物、品种或做法","Enter a food, variety or preparation");
  $("giQuery").value=query;$("searchSubmit").textContent=t("搜索","Search");
  const searchNow=(scroll=false)=>{
    query=$("giQuery").value;listing.page=0;
    if(mode!=="gi"){mode="gi";const u=new URL(location.href);u.searchParams.delete("view");history.replaceState(null,"",u);renderWork()}else giResults();
    if(scroll)$("explore").scrollIntoView({behavior:"instant"});
  };
  $("foodSearch").onsubmit=e=>{e.preventDefault();searchNow(true)};
  $("giQuery").oninput=()=>searchNow();
  $("suggestions").innerHTML=[t("大米","Rice"),t("苹果","Apple"),t("燕麦","Oats")].map(s=>'<button type="button">'+s+'</button>').join("");
  $("suggestions").onclick=e=>{const b=e.target.closest("button");if(!b)return; $("giQuery").value=b.textContent;selectedCategory="all";listing.source="all";listing.region="";curveOnly=false;searchNow(true);giView()};

  $("navData").textContent=t("查数据","Explore");$("navSources").textContent=t("来源","Sources");$("language").textContent=t("EN","中文");$("language").setAttribute("aria-label",t("Switch to English","切换为中文"));
  renderWork();
  const extra=(window.atlasNewFoodStudies||[]).map(study=>[t("人体研究","Human study"),titleOf(study),english?study.methodEn:study.methodZh,"",[[study.url,t("原研究","Original study")],[study.dataUrl||study.url,t("数据来源","Data source")]]]);
  const bananaStudy=window.atlasSimExtra[0];
  extra.push([t("人体研究","Human study"),t("埃基蒂 · 四种成熟香蕉","Ekiti · Four ripe banana preparations"),
    t("Adediran 等（2019）。32 名非糖尿病对照、27 名 2 型糖尿病参与者，试餐均含 50 克碳水化合物。","Adediran et al. (2019). The study compared 32 controls and 27 participants with type 2 diabetes using portions containing 50 g of carbohydrate."),
    t("餐前及餐后 30、60、90、120 分钟静脉血浆葡萄糖均值，见原刊表 3。","Mean venous plasma glucose at baseline, 30, 60, 90 and 120 minutes, Table 3."),
    [[bananaStudy.dataUrl,t("原刊表 3","Original Table 3")],[bananaStudy.url,"DOI"]]]);
  for(const study of window.atlasStapleStudies.filter(s=>s.cohort==="normal")){
    extra.push([t("人体研究","Human study"),titleOf(study),study.foods.map(foodName).join(t("、",", ")),"",[[study.url,t("原始研究","Original study")],...(study.journalUrl?[[study.journalUrl,t("期刊版本","Journal article")]]:[])]]);
  }
  const items=[...sources(),...moreSources(),...extra,...newEvidenceSources()];
  $("sourcesTitle").textContent=t("研究与数据来源","Studies & data sources");
  $("sourceCount").textContent=t(items.length+" 个来源",items.length+" sources");
  $("sourcesList").innerHTML=items.map(([type,name,desc,rights,links])=>'<details class="sourceEntry"><summary>'+esc(name)+' · '+esc(type)+'</summary><p>'+esc(desc)+'</p>'+(rights?'<p class="rights">'+esc(rights)+'</p>':'')+'<div class="sourceLinks">'+links.map(([url,label])=>link(url,label)).join("")+'</div></details>').join("");
  $("navSources").onclick=()=>{$("sourceRail").open=true};
  if(location.hash==="#sources") $("sourceRail").open=true;
  $("footNote").textContent=t("公开研究数据 · 2026-11-22","Public research data · 2026-11-22");

}
$("language").onclick=()=>{english=!english;const url=new URL(location.href);if(english)url.searchParams.set("lang","en");else url.searchParams.delete("lang");history.replaceState(null,"",url);render()};
$("modes").onclick=e=>{const b=e.target.closest("[data-mode]");if(b){mode=b.dataset.mode;const url=new URL(location.href);url.searchParams.set("view",mode);history.replaceState(null,"",url);renderWork();$("modes").querySelector('[data-mode="'+mode+'"]').focus({preventScroll:true})}};
$("work").onclick=e=>{const b=e.target.closest("[data-food]");if(b){foodIndex=Number(b.dataset.food);curveView();$("work").querySelector('[data-food="'+foodIndex+'"]').focus({preventScroll:true})}};
const requestedFilters=new URLSearchParams(location.search);
const initialCategory=requestedFilters.get("category");
if(Object.hasOwn(foodCategories,initialCategory))selectedCategory=initialCategory;
const initialSource=requestedFilters.get("source");
if(giSources().some(s=>s.id===initialSource))listing.source=initialSource;
query=requestedFilters.get("q")||"";
curveOnly=requestedFilters.get("curves")==="1";
if(requestedFilters.get("layout")==="list")displayStyle="list";

if(mode==="simulate"){
  const dish=simFoods().find(f=>f.key===requestedFilters.get("dish"));
  if(dish){simState.key=dish.key;simState.cohort=dish.normal&&dish.t2d?"both":dish.normal?"normal":"t2d"}
}
render();

const requestedFood=new URL(location.href).searchParams.get("food");
if (requestedFood && mode==="gi") openFood(requestedFood);
