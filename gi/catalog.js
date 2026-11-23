"use strict";
const HENRY_TABLE="https://www.nature.com/articles/s41387-020-00145-w/tables/1";
const HENRY_PAPER="https://www.nature.com/articles/s41387-020-00145-w";
const GIFSA="https://www.gifoundation.com/gifsa-endorsement/endorsed-products/";
const CQM="https://www.cqm.com.cn/cqm/zhengshuchaxun/index.html";
const BRAZIL="https://tbca.net.br/arquivosestaticos/Tabelas_Complementares-Resposta-Glicemica_JAN2025.pdf";
const intlId="intl";
const localState={loaded:[],busy:false,translating:false,message:""};
const listing={source:"all",region:"",page:0,size:120};
const normalized = value => String(value??"").normalize("NFKC").trim().toLowerCase().replace(/\s+/g," ");
// Cross-language search tags describe words in the original label, not equivalences between preparations.
const searchTerms=[
["稻米 大米 米饭 白饭 米","rice|nasi|biryani|biriyani|risotto"],["糙米","brown rice"],["白米","white rice|polished rice"],["糯米","sticky rice|glutinous rice"],["炒饭","fried rice"],["粥 稀饭","porridge|congee"],["饭团 寿司","sushi"],["籼米 巴斯马蒂","basmati"],["茉莉香米","jasmine"],["面条 粉面","noodle|vermicelli|spaghetti|pasta|macaroni"],["米粉 米线","rice noodle|rice vermicelli"],["意面 意大利面","pasta|spaghetti|macaroni"],["面包","bread|toast|baguette|loaf|chapati|roti"],["馒头","steamed bun|steamed bread|mantou"],["饺子","dumpling"],["小麦","wheat"],["全麦","whole wheat|wholemeal|whole-wheat"],["大麦","barley"],["燕麦","oat"],["小米 黍","millet"],["玉米","corn|maize"],["黑麦","rye"],["荞麦","buckwheat"],["高粱","sorghum"],["马铃薯 土豆","potato"],["芋头","taro"],["红薯 地瓜 甘薯","sweet potato"],["山药","yam"],["木薯","cassava|tapioca"],["豆类 豆","bean|lentil|pea|legume|chickpea|dhal|dal"],["扁豆","lentil"],["绿豆","mung|green gram"],["鹰嘴豆","chickpea|chick pea|bengal gram"],["大豆 黄豆","soy|soya"],["牛奶 乳","milk"],["酸奶","yogurt|yoghurt"],["冰淇淋","ice cream"],["水果","apple|banana|mango|grape|pear|orange|pineapple|papaya|guava|berry|fruit|melon|date"],["香蕉","banana|plantain"],["苹果","apple"],["葡萄","grape"],["橙子 橘子 柑橘","orange|mandarin|citrus"],["菠萝 凤梨","pineapple"],["芒果","mango"],["西瓜","watermelon"],["木瓜","papaya"],["番石榴 芭乐","guava"],["猕猴桃 奇异果","kiwi"],["椰子","coconut"],["椰枣 海枣","date|medjool"],["饼干","biscuit|cookie|cracker"],["蛋糕","cake"],["巧克力","chocolate"],["蜂蜜","honey"],["糖","sugar|glucose|maltose|sucrose"],["胡萝卜","carrot"],["南瓜","pumpkin|squash"],["花生","peanut"],["豆腐","tofu|bean curd"],["椰浆饭","nasi lemak"],["炒面","mee goreng"],["糯米鸡","loi mai kai|lo mai kai"],["印度煎饼","roti|chapati|paratha"],["发酵","fermented"],["即食","instant"],["蒸","steamed"],["煮","boiled"],["炒 炸","fried"]
];
const compiledTerms=searchTerms.map(([label,keys])=>[label,new RegExp("\\b(?:"+keys+")","i")]);
const regions={"Ghana":"加纳","Ethiopia":"埃塞俄比亚","Mexico":"墨西哥","Côte d’Ivoire":"科特迪瓦","Singapore":"新加坡","Malaysia":"马来西亚","Indonesia":"印度尼西亚","India":"印度","Sri Lanka":"斯里兰卡","Japan":"日本","Korea":"韩国","Philippines":"菲律宾","Thailand":"泰国","Taiwan":"台湾","Taiwan, China":"中国台湾","Hong Kong":"香港","Hong Kong, China":"中国香港","China":"中国","United Arab Emirates (UAE)":"阿联酋","Saudi Arabia":"沙特阿拉伯","Oman":"阿曼","Lebanon":"黎巴嫩","West India":"印度西部","Saudi Arabia/United Kingdom":"沙特阿拉伯／英国"};
const regionName=region=>english?region:(regions[region]||region);
function tagsFor(name){
  const textName=normalized(name);
  return compiledTerms.filter(([,pattern])=>pattern.test(textName)).map(([label])=>label).join(" ");
}
function additionalGI() {
  return [...window.atlasNewGIStudies,window.atlasIssuerGIStudy];
}
function giSources(){
  return [
    {id:"nhc",zh:"国家卫健委 · WS/T 601",en:"NHC · WS/T 601",url:cnGI},
    ...(window.atlasChinaSources||[]),
    {id:"yunnan",zh:"昆明医科大学学报 · 云南米制品",en:"Kunming Medical University journal · Yunnan rice foods",url:original},
    {id:"henry",zh:"Henry 等 · 非西方食物 GI 汇编",en:"Henry et al. · Non-Western food GI compendium",url:HENRY_TABLE},
    ...(window.atlasNewFoodStudies||[]).filter(s=>s.foods.some(f=>Number.isFinite(f.gi)&&!f.henryRow)).map(s=>({id:s.id,zh:s.zh,en:s.en,url:s.url})),
    ...additionalGI(),
    ...(window.atlasExtraStudies||[]).filter(s=>window.atlasMatchedCurveGI?.[s.id]),
    ...(localState.loaded.length?[{id:intlId,zh:"国际 GI 表 · 研究工作簿",en:"International GI tables · research workbook",url:window.atlasImportInfo?.articleUrl||"https://pubmed.ncbi.nlm.nih.gov/34258626/"}]:[])
  ];
}
let builtGI;
function catalogRows(){
  if(builtGI)return builtGI;
  const yunnanGI=[63.2,64.0,45.5,37.6,32.6];
  const rows=[...window.atlasGI.map(r=>({...r,source:"nhc"})),
    ...(window.atlasChinaGI||[]),
    ...window.atlasCurves.map((r,i)=>({...r,gi:yunnanGI[i],region:"China",source:"yunnan",row:i+1})),
    ...window.atlasHenry.map(r=>({...r,zh:window.atlasHenryNamesZh[r.en],source:"henry"})),
    ...(window.atlasNewFoodStudies||[]).flatMap(s=>s.foods.filter(f=>Number.isFinite(f.gi)&&!f.henryRow).map(f=>({...f,source:s.id}))),
    ...additionalGI().flatMap(s=>s.rows.map(r=>({...r,source:s.id,sourceUrl:r.sourceUrl||r.url||s.url,typeZh:s.typeZh,typeEn:s.typeEn}))),
    ...(window.atlasExtraStudies||[]).flatMap(s=>s.foods.filter(f=>Number.isFinite(window.atlasMatchedCurveGI?.[s.id]?.[f.en])).map(f=>({...f,source:s.id,gi:window.atlasMatchedCurveGI[s.id][f.en]}))),
    ...localState.loaded.map(r=>({...r,source:intlId}))];
  builtGI=rows.map((r,i)=>({...r,key:i,search:normalized([r.en,r.zh,r.region,regions[r.region],r.categoryZh,r.categoryEn,r.country,r.code,r.originalLabel,r.certificate,r.holder,tagsFor(r.en)].filter(Boolean).join(" "))}));
  return builtGI;
}
function curvesByStudy(){
  const doc=window.atlasCurveStudy;
  return [{id:"yunnan",zh:"云南 · 五种米制品",en:"Yunnan · Five rice foods",url:original,methodZh:doc.methodZh,methodEn:doc.methodEn,minutes:doc.minutes,measure:"absolute",unit:"mmol/L",foods:window.atlasCurves.map(r=>({...r,portionZh:r.grams+" 克",portionEn:r.grams+t(" 克"," g"),n:12}))},...(window.atlasExtraStudies||[]),...(window.atlasNewFoodStudies||[]),...window.atlasSimExtra,...window.atlasStapleStudies];
}
function sourceLink(row,source){
  if(row.sourceUrl)return row.sourceUrl;
  if(row.source==="henry" && /^\d+$/.test(row.ref))return HENRY_PAPER+"#ref-CR"+row.ref;
  if(row.source===intlId)return window.atlasImportInfo.articleUrl;
  return source?.url||HENRY_TABLE;
}
function sourceOptions(){
  const options=giSources().map(s=>'<option value="'+esc(s.id)+'">'+esc(titleOf(s))+'</option>').join("");
  return options+(localState.loaded.length?'<option value="T1">'+t("国际表 1 · ISO 方法","International table 1 · ISO-consistent")+'</option><option value="T2">'+t("国际表 2 · 方法限制较多","International table 2 · more limitations")+'</option>':"");
}
function rowDetails(r,src){
  const fields=[];
  function add(label,value){if(value!=null&&value!=="")fields.push('<div><b>'+label+'</b> '+esc(english?value:zhStudyText(value))+'</div>')}
  add(t("食物名称","Food name"),foodName(r));
  if(!english && r.zhKind==="device") add("译名来源","浏览器本机机器翻译");
  if(r.sourceUrl) {
    add(t("试验地区","Study location"),regionName(r.region));
    add(t("试验份量","Test portion"),english?r.portion:r.portionZh||r.portion);
    add(t("研究人群","Study population"),english?r.cohort:r.cohortZh||r.cohort);
    add(t("评价编号","Evaluation ID"),r.certificate);add(t("评价日期","Evaluation date"),r.date);add(t("持有人","Holder"),english?atlasCompanyEn[r.holder]:r.holder);
  } else if(r.source==="henry"){
    add(t("原表行号","Table row"),r.row);add(t("试验地区","Study location"),regionName(r.region));
    add(t("试验份量（克）","Experimental portion (g)"),r.portion);add(t("可利用碳水（克）","Available carbohydrate (g)"),r.carbs);
    add(t("受试者","Participants"),r.cohort);add(t("参考食物与时长","Reference food and duration"),r.protocol);
    add(t("GI 均值标准误（SEM）","GI standard error"),r.sem);
    if(r.gi===null)add(t("分组","Subgroups"),t("各组读数按原文呈现。","Subgroup readings as published."));
    if(r.row===923)add(t("原单元格","Original cell"),r.raw);
  } else if(r.source===intlId){add(t("原表编号","Workbook ID"),r.item);add(t("食物分类","Food category"),english?r.categoryEn:r.categoryZh);add(t("分级","Tier"),r.table===1?t("表 1 · 符合 ISO 方法要求","Table 1 · ISO-consistent methods"):t("表 2 · 方法限制较多","Table 2 · greater methodological limitations"));add(t("地区（原文）","Location as entered"),r.country);add(t("文献","Reference"),r.ref)}
  else {if(r.source==="cns2019"){add(t("原表序号","Source item"),r.row);add(t("方法","Method"),t("资料汇编，未逐项报告试验人数或份量。","Reference compilation; individual test populations and portions are unspecified."));}add(t("食物类别","Food group"),english?r.categoryEn:r.categoryZh);if(r.source==="yunnan")add(t("试验份量","Experimental portion"),r.grams+t(" 克"," g"));}
  return fields.join("")+'<div>'+link(sourceLink(r,src),t("核对来源","Check source"))+'</div>';
}
function importControls(){
  const panel=$("importer");
  if(!panel)return;
  const info=window.atlasImportInfo||{};
  const active=localState.loaded.length>0;
  panel.innerHTML='<div class="importTitle"><b>'+t("国际 GI 研究工作簿 · 4,017 条","International GI research workbook · 4,017 records")+'</b><button id="loadRemote" '+(active||localState.busy?'disabled':'')+'>'+t(active?"已载入":localState.busy?"读取中…":"载入研究表",active?"Loaded":localState.busy?"Loading…":"Load workbook")+'</button></div><details><summary>'+t("个人非商业研究使用 · 来源与本地载入","Personal noncommercial research · Source and local import")+'</summary><p>'+t("供个人非商业研究，在当前浏览器临时检索国际 GI 汇编的研究工作簿。加载后可与站内记录一起搜索，补充表 1 和表 2 保留各自的方法分级。关闭或刷新页面会清除此工作簿。","Load a research workbook derived from the international GI tables for personal noncommercial research in this browser session. Search it alongside the built-in records. Supplemental tables 1 and 2 retain their methodological tiers. Refreshing or closing the page clears the workbook.")+'</p><div class="controls"><label class="fileLabel">'+t("或选择本地 .xlsx","Or open local .xlsx")+' <input type="file" id="loadFile" accept=".xlsx" '+(localState.busy?'disabled':'')+'></label></div><p class="note">'+link(info.projectUrl||"https://github.com/dellacortelab/nhanes_gigl",t("研究者发布页","Research repository"))+' · '+link(info.sourceUrl||"https://github.com/dellacortelab/nhanes_gigl",t("下载指定工作簿","Download the workbook"))+' · '+link("https://pubmed.ncbi.nlm.nih.gov/34258626/",t("2021 国际表论文","2021 international tables"))+' · '+link(info.termsUrl,t("出版方使用条款","Publisher terms"))+'</p></details><span class="note" role="status">'+esc(localState.message?t(localState.message[0],localState.message[1]):"")+'</span>';
  if(active && !english && localState.loaded.some(r=>!r.zh)) {
    const button=document.createElement("button");
    button.type="button";
    button.textContent=localState.translating?"正在翻译食物名称…":"在本机翻译工作簿名称";
    button.disabled=localState.translating;
    panel.querySelector(".importTitle").append(button);
    const note=document.createElement("p");
    note.className="note";
    note.textContent="尚无中文名的外部记录显示类别和原表编号。支持本机翻译的浏览器可补充机器译名，首次使用可能需要下载语言包。";
    button.after(note);
    button.onclick=async()=>{
      localState.translating=true;
      button.disabled=true;
      try {
        const result=await window.atlasTranslateWorkbookRows(localState.loaded,({completed,total})=>{
          button.textContent="正在翻译 "+completed+" / "+total;
        });
        const changed=result.translated;
        localState.message=result.status==="done" || changed
          ? ["本次已补充 "+changed+" 个本机译名。",changed+" names translated on this device."]
          : ["当前未能使用本机翻译，仍可按原表编号核对。","On-device translation is unavailable. Use the workbook item number to check the source."];
      } catch {
        localState.message=["翻译已中断，可再次尝试。","Translation interrupted. You can try again."];
      } finally {
        localState.translating=false;
        builtGI=null;
        if(mode==="gi") {giResults();importControls();}
      }
    };
  }
  $("loadRemote").onclick=()=>loadWorkbook();
  $("loadFile").onchange=e=>{if(e.target.files[0])loadWorkbook(e.target.files[0])};
}
async function loadWorkbook(file){
  if(localState.busy)return;
  localState.busy=true;localState.message=null;importControls();
  try{
    const records=file?await window.atlasImportGI(file):await window.atlasReadGIFromSource();
    localState.loaded=records;builtGI=null;listing.source="all";listing.region="";listing.page=0;query="";
    localState.message=["已载入 "+records.length+" 条研究记录。原表第 3 项已恢复，第 4012 项是组标题。两处转录值已对照原始补充表校正。","Loaded "+records.length+" records. Source item 3 was restored, item 4012 is a heading, and two transcription errors were corrected against the original supplements."];
  }catch(err){
    localState.message=file?["未能读取这份文件。请使用研究者发布的指定工作簿。","Could not read this file. Use the linked research workbook."]:["未能在线载入。可从下方下载指定工作簿，再选择本地文件。","Online load failed. Download the linked workbook and select the local file."];
  }finally{
    localState.busy=false;if(mode==="gi"){giView();if(localState.loaded.length){const key=new URL(location.href).searchParams.get("food");if(key&&foodCatalogue().groups.has(key))openFood(key);else $("giQuery").focus({preventScroll:true})}}
  }
}
let endorsementQuery="";
function verificationView(){
  $("work").innerHTML='<h2>'+t("产品认证与机构名录","Certification and endorsement directories")+'</h2><p class="sub">'+t("按发证机构、产品全名和持证企业核验状态。实验室 GI 数值、行业机构推荐、有效产品证书分别记录。","Verify status against the issuer, exact product and certificate holder. GI measurements, industry endorsements and current product certificates are distinct evidence.")+'</p><div class="sourceGrid"><article class="source"><h3>'+t("中国 · 方圆标志认证集团","China · China Quality Mark")+'</h3><p>'+t("按证书号或企业核验自愿性低／中 GI 产品认证，确认名称、规格、有效期及状态。另有食品评价服务，需选对证书类别。","Look up voluntary low/medium-GI certification by certificate or company and check scope and status. Select the right document type: the issuer also offers a separate product evaluation.")+'</p><div class="sourceLinks">'+link(CQM,t("查询证书","Certificate lookup"))+link("https://www.cqm.com.cn/cqm/chanpinrenzheng/nongshiziyuanxingchanpinrenzhe/7097.html",t("认证方案","Scheme"))+'</div></article><article class="source"><h3>'+t("澳大利亚 · GI 标志说明","Australia · GI Symbol update")+'</h3><p>'+t("悉尼大学说明澳大利亚原 GI 基金会已停止运营。旧标志和历史记录需核对所属计划及年代。","The University of Sydney reports closure of the former Australian GI Foundation. Check the scheme and date of any historical mark.")+'</p>'+link("https://glycemicindex.com/update-on-gi-symbol/",t("悉尼大学公告","University notice"))+'</article><article class="source"><h3>'+t("南非 · 升糖指数基金会","South Africa · GI Foundation SA")+'</h3><p>'+t("下表按该机构公开名录逐行整理。名录中的一行可包含多种口味或产品规格。","The table follows the issuer’s directory. A line may cover several products or variants.")+'</p>'+link(GIFSA,t("核对最新名录","Check current listings"))+'</article></div><article class="dataPanel registry"><h3>'+t("南非机构推荐名录","South African endorsement listings")+'</h3><input type="search" id="brandSearch" placeholder="'+t("搜索品牌、产品或企业","Search brand, product or company")+'" aria-label="'+t("搜索推荐名录","Search endorsements")+'"><span class="meta" id="brandCount" role="status"></span><div class="tableWrap"><table><thead><tr><th>'+t("品牌／系列","Brand or range")+'</th><th>'+t("原名录规格","Listed variants")+'</th><th>'+t("企业","Company")+'</th></tr></thead><tbody id="brands"></tbody></table></div></article>';
  $("brandSearch").value=endorsementQuery;
  const update=()=>{const q=normalized(endorsementQuery);const list=window.atlasEndorsed.filter(r=>normalized([r.en,r.zh,r.variants,r.variantsZh,r.company,r.companyZh,tagsFor(r.en)].join(" ")).includes(q));$("brandCount").textContent=t(" "+list.length+" 条名录记录"," "+list.length+" directory rows");$("brands").innerHTML=list.map(r=>'<tr><td>'+esc(t(r.zh,r.en))+'</td><td>'+esc(t(r.variantsZh,r.variants.replace(/https?:\/\/\S+/g,"").trim()||"—"))+'</td><td>'+esc(t(r.companyZh,r.company))+'<br>'+link(GIFSA,t("核对名录","Open issuer directory"))+'</td></tr>').join("")||'<tr><td colspan="3">'+t("没有匹配项","No matches")+'</td></tr>'};
  $("brandSearch").oninput=e=>{endorsementQuery=e.target.value;update()};update();
}
function moreSources(){
  const paper=t("研究论文","Research paper"),resource=t("机构数据库","Institutional database");
  const links=[
    [paper,t("非西方食物 GI 汇编 · 940 条","Non-Western GI compendium · 940 rows"),t("Henry、Quek、Kaur、Shyam、Singh（2021）。表 1 汇总 159 项研究；本站按食物、地区、试验份量整理并添加中文检索词。","Henry, Quek, Kaur, Shyam & Singh (2021). Table 1 compiles 159 studies. We structured the food, location and trial fields and added Chinese search tags."),"CC BY 4.0",[[HENRY_TABLE,t("原表 1","Table 1")],[ccby,t("许可","License")]]],
    ...window.atlasChinaSources.map(s=>[t("专业学会","Scientific society"),titleOf(s),english?s.notesEn:s.notesZh,t("名称附本站英文翻译。与 WS/T 601 附录有 33 条中文名和 GI 均相同，均保留各自出处。","English names translated by this atlas. The NHC appendix and this compilation share 33 identical Chinese name/value pairs; each retains its attribution."),[[s.url,t("完整原表","Source table")]]]),
    [paper,t("迈索尔 · 印度餐食试验","Mysore · Indian meal trial"),t("6 道餐食，分别保留糖耐量正常组和 2 型糖尿病组数据。","Six preparations, with separate results for normal glucose tolerance and type 2 diabetes."),t("实验室血浆葡萄糖 · 组均值。","Laboratory plasma glucose · group means."),[["https://doi.org/10.1017/S0007114505000611",paper]]],
    [paper,t("奥卡达 · 尼日利亚混合餐","Okada · Nigerian mixed meals"),t("Omage 与 Omage（2018）。三组健康受试者，每组 80 人，分别测试一种当地餐食。","Omage & Omage (2018). Three local mixed meals tested in three groups of 80 healthy adults."),t("依据表 3–5 换算为 mmol/L。CC BY 4.0。","Tables 3–5 converted to mmol/L. CC BY 4.0."),[["https://doi.org/10.1002/fsn3.550",paper],[ccby,t("许可","License")]]],
    [resource,t("巴西 · 圣保罗大学 TBCA","Brazil · University of São Paulo TBCA"),t("巴西试验食物的葡萄糖参考 GI、每份碳水和 GL，见补充表 Quadro 1。","Brazilian clinical GI values, carbohydrate per serving and GL in Quadro 1."),t("葡萄牙语原版 · CC BY-NC-ND 4.0。","Portuguese source · CC BY-NC-ND 4.0."),[[BRAZIL,t("机构原始 PDF","Institutional PDF")]]],
    [t("政府指南","Government guideline"),t("中国 · 成人糖尿病食养指南","China · Adult diabetes food guidance"),t("2023 年版附录按 GI 范围列出食物。分类资料可用于查阅，未计为新的独立实验。","The 2023 appendix lists foods in GI bands. It is indexed as classification guidance."),"", [["https://www.nhc.gov.cn/sps/c100088/202301/f01895a06c5349ef999f25da833c166d/files/1732844468278_20318.pdf",t("指南原文","Official guide")]]],
    [resource,t("中国食品发酵工业研究院 · GI 营养工作室","China National Research Institute of Food & Fermentation Industries"),t("提供 GI 测试和低 GI 食品真实品质（FA）认证服务入口。科研测试、科普推广产品及认证证书分属不同类别。","Institutional GI testing and the voluntary food authenticity (FA) certification route. Testing, promotional listings and product certificates have different scopes."),t("证书状态需向对应发证机构核验。","Check each certificate with its issuer."),[["https://www.chinafoodgi.com/",t("机构网站","Institution")],["https://www.chinafoodgi.com/contents/61/139.html",t("认证服务","FA scheme")]]],
    [paper,t("美国 · NHANES GI/GL 研究","USA · NHANES GI/GL research"),t("通过匹配食品描述赋予 GI/GL，用于人群研究。作者项目提供参考工作簿，最终美国人群数据库另有申请条件。","Matches external GI data to survey descriptions for population research. The authors share a reference workbook; the resulting US database has separate access requirements."),"", [["https://doi.org/10.1016/j.ajcnut.2024.06.001",paper],["https://github.com/dellacortelab/nhanes_gigl",t("研究项目","Study repository")]]]
  ];
  return links;
}

function newEvidenceSources() {
  const studies=additionalGI().map(s=>[s.typeZh?t(s.typeZh,s.typeEn):t("人体研究","Human study"),titleOf(s),
    t("本站收录 "+s.rows.length+" 条，每条记录均列出原文食物名和定位。",s.rows.length+" records with original food names and source locators."),s.licenseUrl?s.license:"",[[s.url,t("查阅原始来源","Open source")],...(s.licenseUrl?[[s.licenseUrl,t("原文许可","Article license")]]:[])]]);
  const directories=new Map(window.atlasIssuerRecords.map(r=>[r.issuerZh,r]));
  return studies.concat([...directories.values()].map(r=>[t("发证机构","Certification body"),english?r.issuerEn:r.issuerZh,
    t("产品范围、证号和发证记录可在产品认证页逐条检索。","Find product scope, certificate IDs and dated entries in Product verification."),
    "",[[r.url.split("#")[0],t("机构原文","Issuer source")]]]));
}

function issuerRecordsView(){
  const rows=[...window.atlasIssuerRecords,{
    zh:"精力沛 · 小麦胚芽 · 广州萃取生物科技有限公司",en:"Jinglipei wheat germ · Guangzhou Cuiqu Biotechnology",
    issuerZh:"方圆标志认证集团",issuerEn:"China Quality Mark",certificate:"CQM22GI01012053",date:"2022-12-22",
    statusZh:"有效期至 2025-12-21。2026-11-22 查询时，发证机构标记为「过期失效」。",statusEn:"Valid through 2025-12-21. The issuer register showed expired status on 2026-11-22.",
    url:"https://www.cqm.com.cn/cqm/xinwenzhongxin/gongsixinwen/5130.html",locatorZh:"发证公告 · 精力沛小麦胚芽",locatorEn:"Issuance notice · Jinglipei wheat germ",
    checkUrl:CQM,statusCode:"expired",verifiedOn:"2026-11-22",validThrough:"2025-12-21"
  },{
    zh:"低 GI 黑麦荞麦面 · 陕西粮农物流集团",en:"Rye and buckwheat noodles · Shaanxi Grain and Agriculture Logistics Group",
    issuerZh:"陕西省质检院",issuerEn:"Shaanxi provincial quality inspection institute",certificate:null,date:"2025-09-15",statusCode:"unverified",
    statusZh:"发证公告未披露证书号及有效期，当前状态待核验。",statusEn:"Issuance announced. Certificate number, expiry and current status unavailable.",
    url:"https://snamr.shaanxi.gov.cn/sy/gzdt/zsdwdt/202509/t20250915_3567316.html",locatorZh:"省市场监管局颁证公告 · 黑麦荞麦面",locatorEn:"Provincial regulator notice · rye and buckwheat noodles"
  }];
  const section=document.createElement("section");
  section.className="issuerBox";
  section.innerHTML='<h3>'+t("按产品或证书号查发证记录","Look up a product or certificate")+'</h3><p>'+t("证书范围、公告日期和当前状态分别列出。部分名录只公布发证历史。","Each record distinguishes product scope, publication or issue date, and known status. Some directories report historical issuance only.")+'</p><input id="issuerSearch" type="search" placeholder="'+t("输入产品、企业或证书号","Enter product, company or certificate ID")+'" aria-label="'+t("搜索发证记录","Search certification records")+'"><label class="issuerStatus"><input id="activeIssuer" type="checkbox">'+t("仅看已核验有效","Verified active only")+'</label><p id="issuerCount" role="status"></p><div id="issuerList"></div><button id="moreIssuers"></button><p class="note">'+link("https://acclab.cn/download/3283/?tmstv=1768962533&v=3284",t("美安康关于后续监督的公告","ACC notice on follow-up supervision"))+'</p>';
  $("work").querySelector(".sub").after(section);
  const activeCount=rows.filter(r=>r.statusCode==="active").length;
  $("activeIssuer").parentElement.append(" ("+activeCount+")");
  $("activeIssuer").checked=new URL(location.href).searchParams.get("status")==="active";
  const labels={no_match:["未查到匹配证书","No matching certificate"],conflict:["来源记录有出入","Conflicting records"],invalid:["已失效","Invalid"],active:["已核验有效","Verified active"],expired:["已过期","Expired"],cancelled:["已注销","Cancelled"],withdrawn:["已撤销","Withdrawn"],suspended:["已暂停","Suspended"],unverified:["待核验","Unverified"]};
  let limit=8;
  const update=()=>{
    const words=normalized($("issuerSearch").value).split(" ").filter(Boolean);
    const selected=rows.filter(r=>(!$("activeIssuer").checked||r.statusCode==="active")&&words.every(w=>normalized([r.zh,r.en,displayFoodName(r,true),r.issuerZh,r.issuerEn,r.certificate,r.statusZh,r.statusEn].join(" ")).includes(w)));
    $("issuerCount").textContent=t("共 "+selected.length+" 条记录",selected.length+" matching records");
    $("issuerList").innerHTML=selected.slice(0,limit).map(r=>{
      const status=t(...(labels[r.statusCode]||labels.unverified));
      const liveLink=r.checkUrl?link(esc(r.checkUrl),r.checkUrl===CQM?t("状态查询（选自愿性产品认证证书）","Verify under voluntary product certificates"):t("按证号查看发证机构实时状态","Check current status with issuer")):"";
      return '<details class="issuerRow"><summary>'+esc(foodName(r))+' <small>'+esc(r.certificate||t("颁证公告","Issuance notice"))+'</small> <span class="certStatus">'+esc(status)+'</span></summary><p>'+esc(english?r.statusEn:r.statusZh)+'</p><p>'+esc(english?r.issuerEn:r.issuerZh)+' · '+esc(r.date)+'</p>'+(r.validThrough?'<p>'+t('机构列示有效期至 ','Issuer lists validity through ')+esc(r.validThrough)+'</p>':'')+(r.registryHolder?'<p>'+t('查询返回的持证方及类别 · ','Holder and category returned by registry · ')+esc(english?(atlasCompanyEn[r.registryHolder]||r.registryHolder):r.registryHolder)+' · '+esc(r.registryCategory||'—')+'</p>':'')+'<p>'+link(esc(r.url),esc(english?r.locatorEn:r.locatorZh))+'</p>'+
        (liveLink?'<p>'+liveLink+(r.verifiedOn?' · '+t("查询日期 ","Lookup date ")+esc(r.verifiedOn):"")+'</p>':"")+'</details>';
    }).join("")||'<p>'+t("没有符合条件的记录。","No matching records.")+'</p>';
    $("moreIssuers").hidden=limit>=selected.length;
    $("moreIssuers").textContent=t("再显示 20 条","Show 20 more");
  };
  $("activeIssuer").onchange=()=>{
    const url=new URL(location.href);
    if($("activeIssuer").checked)url.searchParams.set("status","active");else url.searchParams.delete("status");
    history.replaceState(null,"",url);limit=8;update();
  };
  $("issuerSearch").oninput=()=>{limit=8;update()};
  $("moreIssuers").onclick=()=>{limit+=20;update()};
  update();
}
