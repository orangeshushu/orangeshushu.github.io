"use strict";

// Locators identify the specific numeric table, cohort or released-file selection.
// Source spellings are retained even where the atlas displays an editorial translation.
const atlasEvidenceUrls = {
  nhc: "https://www.nhc.gov.cn/fzs/c100048/201805/e821444378d64bafa7283779631096ce/files/1733125377688_81470.pdf#page=7",
  cns: "https://piyao.kepuchina.cn/h5/rumordetail?id=zjdV",
  henry: "https://www.nature.com/articles/s41387-020-00145-w/tables/1",
  international: "https://doi.org/10.1093/ajcn/nqab233",
  yunnan: "https://kyxuebao.kmmu.edu.cn/article/doi/10.12259/j.issn.2095-610X.S20231207",
  bangladesh: "https://maljnutr.org.my/publication/17-3/l.pdf#page=5",
  mysore: "https://www.cambridge.org/core/services/aop-cambridge-core/content/view/D2463C77BBE955322ED8A46D1DA34870/S0007114500000611a.pdf#page=4",
  okada: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5778211/#fsn3550-tbl-",
  stanford: "https://cgmdb.stanford.edu/data/"
};
const atlasTrialLabels = {
  stanford: {
    "Jasmine rice, precooked and frozen":"Rice","Sliced white buttermilk bread":"Bread",
    "Shredded potatoes, precooked and frozen":"Potatoes","Macaroni, cooked and frozen":"Pasta",
    "Canned whole black beans":"Beans","Red grapes":"Grapes","Mixed berries":"Berries"
  },
  mysore: {
    "Chapatti with green gram dhal":"Chapatti","Dosai with coconut chutney":"Dosai",
    "Idli with coconut chutney":"Idli","Rice and green gram pongal":"Pongal",
    "Poori with potato palya":"Poori","Semolina and onion upittu":"Upittu"
  },
  okada: {"Rice and beans":1,"Rice and plantain":2,"Beans and plantain":3},
  bangladesh: {3594:"Carrot",2902:"Banana (Chapa kola)",3019:"Plum (Bau kul)"},
  korea:["Apple","Tangerine","Pear","Watermelon","Persimmon","Grapes","Oriental melon","Peach"],
  malaysia: {
    "Mango (Malaysian trial)":"Mango","Rambutan (Malaysian trial)":"Rambutan",
    "Longan (Thailand)":"Longan","Sapodilla (Malaysian trial)":"Sapodilla","Jackfruit (Malaysian trial)":"Jackfruit",
    "Papaya (Malaysian trial)":"Papaya","Watermelon (Malaysian trial)":"Watermelon",
    "Banana (Brangan)":"Brangan","Banana (Rastali)":"Rastali","Banana (Mas)":"Mas",
    "Grapes (California)":"Grapes","Navel orange (Australia)":"Orange",
    "Fuji apple (Shandong)":"Red apple","Green pear (Pyrus communis)":"Green pear"
  },
  yunnan: {"饵丝":1,"饵块":2,"卷粉":3,"酸浆米线":4,"干浆米线":5}
};
function atlasCitation(url, locatorZh, locatorEn, typeZh="人体试验", typeEn="Human trial") {
  return {url,locatorZh,locatorEn,typeZh,typeEn};
}

function atlasTrialCitation(row, studyId, metric) {
  const urls=atlasEvidenceUrls, names=atlasTrialLabels;
  if (studyId==="yunnan") {
    const table=metric==="gi"?6:names.yunnan[row.zh];
    if (!table) return null;
    return atlasCitation(urls.yunnan+"#Fig-Table"+table,
      "蒋慕蓉等（2023）· 表 "+table+" · "+row.zh,
      "Jiang et al. (2023) · Table "+table+" · "+row.zh);
  }
  if (studyId==="bangladesh-produce-2011") {
    const name=names.bangladesh[row.internationalItem];
    if (!name) return null;
    return atlasCitation(urls.bangladesh,
      "Fatema 等（2011）· 第 397 页表 2 · "+name,
      "Fatema et al. (2011) · p. 397, Table 2 · "+name);
  }
  if (studyId==="mysore-2000-t2d" || studyId==="mysore-2000-healthy") {
    const diabetic=studyId.endsWith("-t2d");
    const name=names.mysore[row.en], table=diabetic?4:5;
    if (!name) return null;
    return atlasCitation(urls.mysore,
      "Urooj 与 Puttaraj（2000）· 表 "+table+" · "+(diabetic?"2 型糖尿病组":"糖耐量正常组")+" · "+name,
      "Urooj & Puttaraj (2000) · Table "+table+" · "+(diabetic?"Type 2 diabetes":"Normal glucose tolerance")+" · "+name);
  }
  if (studyId==="okada-2018") {
    const test=names.okada[row.en];
    if (!test) return null;
    const table=metric==="gi"?6:test+2;
    return atlasCitation(urls.okada+String(table).padStart(4,"0"),
      "Omage 与 Omage（2018）· 表 "+table+" · 试餐 "+test+" · "+row.en,
      "Omage & Omage (2018) · Table "+table+" · Test food "+test+" · "+row.en);
  }
  return null;
}

function evidenceForGI(row) {
  const urls=atlasEvidenceUrls;
  if (row.sourceUrl && row.locator && row.originalLabel) {
    const locator=typeof row.locator==="string"?row.locator:row.locator.en;
    const zh=row.locatorZh||row.locator.zh||locator;
    const en=row.locatorEn||locator;
    const withLabel=text=>text.includes(row.originalLabel)?text:text+" · "+row.originalLabel;
    return atlasCitation(row.sourceUrl,withLabel(zh),withLabel(en),row.typeZh||(row.certificate?"机构产品评价":"人体试验"),row.typeEn||(row.certificate?"Issuer product evaluation":"Human trial"));
  }
  switch(row.source) {
    case "nhc":
      return atlasCitation(urls.nhc,"WS/T 601—2018 · 附录 A，表 A.1 · "+row.zh,
        "WS/T 601—2018 · Appendix A, Table A.1 · "+row.zh,"卫生行业标准附录","Health industry standard appendix");
    case "cns2019": {
      const label=row.sourceSpelling||row.zh;
      return atlasCitation(urls.cns,"中国营养学会（2019）· 第 "+row.row+" 项 · "+label,
        "Chinese Nutrition Society (2019) · Item "+row.row+" · "+label,"学会参考表","Society reference table");
    }
    case "henry":
      return atlasCitation(urls.henry,"Henry 等（2021）· 表 1，第 "+row.row+" 项 · 来源 "+row.ref+" · "+row.en,
        "Henry et al. (2021) · Table 1, item "+row.row+" · Reference "+row.ref+" · "+row.en,
        "研究汇编","Research compilation");
    case "intl": {
      // Two printed IDs recur in Supplemental Table 2: use the disambiguating page.
      const exception={2211:[11,2111],3536:[102,2536]}[row.item];
      const zh=exception?"第 "+exception[0]+" 页，原编号 "+exception[1]:"第 "+row.item+" 项";
      const en=exception?"p. "+exception[0]+", printed item "+exception[1]:"item "+row.item;
      return atlasCitation(urls.international,"Atkinson 等（2021）· 补充表 "+row.table+" · "+zh,
        "Atkinson et al. (2021) · Supplemental Table "+row.table+" · "+en,"系统综述补充表","Systematic review supplement");
    }
    default:
      return atlasTrialCitation(row,row.source,"gi");
  }
}

function evidenceForCurve(row,study) {
  const nameMap=atlasTrialLabels;
  if (study.id==="stanford-2025") {
    const food=nameMap.stanford[row.en];
    if (!food) return null;
    return atlasCitation(atlasEvidenceUrls.stanford,
      "Wu 等（2025）· data_cgm.csv · foods = "+food+"；mitigator 为空；先平均同一人的重复试餐，再按人等权平均",
      "Wu et al. (2025) · data_cgm.csv · foods = "+food+", empty mitigator. Repeats averaged per person, then across people",
      "公开传感器数据汇总","Public sensor data aggregate");
  }
  if (study.id==="korea-fruits-2012") {
    const food=nameMap.korea[row.henryRow-379];
    if (!food) return null;
    return atlasCitation(study.dataUrl,"Ryu 等（2012）· 第 196 页表 3 · "+food+"；GI 见第 197 页表 5",
      "Ryu et al. (2012) · p. 196, Table 3 · "+food+"; GI in Table 5, p. 197");
  }
  if (study.id==="malaysia-fruits-2005") {
    const food=nameMap.malaysia[row.en];
    if (!food) return null;
    return atlasCitation(study.dataUrl,"Mohd Yusof 等（2005）· 第 52 页表 3 · "+food+"（均值及标准误）",
      "Mohd Yusof et al. (2005) · p. 52, Table 3 · "+food+" (mean and SEM)");
  }
  return atlasTrialCitation(row,study.id,"curve");
}
