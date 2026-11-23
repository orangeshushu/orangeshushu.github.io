"use strict";

const simState = {cohort:"both", key:"", unit:"mmol/L", baseline:5.5, input:"5.5"};
const studyCohorts = {
  "yunnan":"normal", "okada-2018":"normal", "mysore-2000-healthy":"normal",
  "mysore-2000-t2d":"t2d", "korea-fruits-2012":"normal",
  "malaysia-fruits-2005":"normal", "bangladesh-produce-2011":"normal"
};

function simFoods() {
  const foods=new Map();
  for(const study of curvesByStudy()) {
    const cohort=studyCohorts[study.id] || study.cohort;
    if(!["normal","t2d"].includes(cohort) || !["absolute","increment"].includes(study.measure) || study.unit!=="mmol/L") continue;
    const family=study.id.startsWith("mysore-2000-")?"mysore-2000":study.pairId||study.id;
    for(const row of study.foods) {
      const key=family+"/"+row.en;
      if(!foods.has(key)) foods.set(key,{key,en:row.en,zh:row.zh});
      foods.get(key)[cohort]={row,study,cohort};
    }
  }
  return [...foods.values()];
}
function simCohortLabel(cohort) {
  return cohort==="normal"?t("无糖尿病组","Without diabetes"):t("2 型糖尿病组","Type 2 diabetes");
}
function simEligible(food,cohort) {
  return cohort==="both"?Boolean(food.normal&&food.t2d):Boolean(food[cohort]);
}
function simOptions(eligible) {
  const option=f=>'<option value="'+esc(f.key)+'">'+esc(foodName(f))+'</option>';
  if(simState.cohort!=="both") return eligible.map(option).join("");
  const sections=[
    [t("米饭","Rice"), f=>/rice/i.test(f.en)&&!/noodle/i.test(f.en)&&window.atlasStapleStudies.includes(f.normal.study)],
    [t("馒头、面条、米粉与面包","Mantou, noodles and breads"), f=>window.atlasStapleStudies.includes(f.normal.study)],
    [t("水果","Fruit"), f=>/banana/i.test(f.en)],
    [t("其他试餐","Other test meals"), ()=>true]
  ];
  let remaining=eligible;
  return sections.map(([label,matches])=>{
    const group=remaining.filter(matches);
    remaining=remaining.filter(f=>!matches(f));
    return group.length?'<optgroup label="'+label+'">'+group.map(option).join("")+'</optgroup>':"";
  }).join("");
}
function simReadings(entry,baseline) {
  const i=entry.study.minutes.indexOf(0);
  const start=entry.row.mean[i];
  return entry.row.mean.map(v=>baseline+(v-start));
}
function simFormat(mmol,delta=false) {
  const display=simState.unit==="mg/dL"?mmol*18:mmol;
  const value=display.toFixed(simState.unit==="mg/dL"?0:1);
  if(delta && Number(value)>0) return "+"+value;
  return Number(value)===0?Math.abs(Number(value)).toFixed(simState.unit==="mg/dL"?0:1):value;
}
function simRef({study,row}) {
  return evidenceBlock(evidenceForCurve(row,study));
}
function simFoodLink(study,row) {
  const food=simFoods().find(f=>[f.normal,f.t2d].some(e=>e?.study.id===study.id&&e.row.en===row.en));
  if(!food)return "";
  const url=new URL(location.pathname,location.origin);
  url.searchParams.set("view","simulate");url.searchParams.set("dish",food.key);
  if(english)url.searchParams.set("lang","en");
  return '<a class="simAction" href="'+esc(url.pathname+url.search)+'">'+t("用这份食物模拟餐后血糖","Simulate this food")+'</a>';
}

function simChart(series) {
  const width=660,height=206,left=50,right=18,top=15,bottom=34;
  const all=series.flatMap(s=>s.values);
  const low=Math.floor(Math.min(...all)), high=Math.max(low+1,Math.ceil(Math.max(...all)));
  const x=m=>left+(width-left-right)*m/120;
  const y=v=>top+(height-top-bottom)*(high-v)/(high-low);
  let marks="";
  for(let i=0;i<=4;i++) {
    const v=low+(high-low)*i/4;
    marks+='<line class="simGridLine" x1="'+left+'" x2="'+(width-right)+'" y1="'+y(v)+'" y2="'+y(v)+'"/><text x="'+(left-7)+'" y="'+(y(v)+4)+'" text-anchor="end">'+simFormat(v)+'</text>';
  }
  for(const m of [0,30,60,90,120])marks+='<text x="'+x(m)+'" y="'+(height-10)+'" text-anchor="middle">'+m+'</text>';
  for(const {entry,values} of series){
    const pts=entry.study.minutes.map((m,i)=>[x(m),y(values[i])]);
    marks+='<g class="simLine '+entry.cohort+'">'+(pts.length>2?'<polyline points="'+pts.map(p=>p.join(",")).join(" ")+'"/>':"")+
      pts.map(([cx,cy],i)=>'<circle cx="'+cx+'" cy="'+cy+'" r="3.6"><title>'+entry.study.minutes[i]+' min · '+simFormat(values[i])+' '+simState.unit+'</title></circle>').join("")+'</g>';
  }
  return '<svg class="simPlot" viewBox="0 0 '+width+' '+height+'" role="img" aria-label="'+t("从同一餐前值开始的模拟血糖曲线，各点数值见下表","Simulated glucose from a shared baseline. All values are available in the table below.")+'">'+marks+'</svg>';
}

function simResults(food) {
  const panel=$("simOutput"), unit=simState.unit;
  const low=unit==="mg/dL"?54:3, high=unit==="mg/dL"?360:20;
  if(simState.baseline===null || simState.baseline<3 || simState.baseline>20) {
    $("simBaseline").setAttribute("aria-invalid","true");
    $("simError").textContent=t("请输入 "+low+"–"+high+" "+unit+" 范围内的数值，并确认单位。","Enter a value from "+low+" to "+high+" "+unit+" and check the unit.");
    panel.innerHTML="";return;
  }
  $("simError").textContent="";$("simBaseline").removeAttribute("aria-invalid");
  const cohorts=simState.cohort==="both"?["normal","t2d"]:[simState.cohort];
  const series=cohorts.map(c=>({entry:food[c],values:simReadings(food[c],simState.baseline)}));
  const formatValue=(entry,values,m)=>{
    const i=entry.study.minutes.indexOf(m);
    if(i<0) return t("未报告","Unreported");
    return '<strong>'+simFormat(values[i])+'</strong><small>'+t("较餐前 ","Change ")+simFormat(entry.row.mean[i]-entry.row.mean[0],true)+'</small>';
  };
  const score=series.map(({entry,values})=>{
    const max=Math.max(...values.slice(1));
    const peakMinute=entry.study.minutes.filter((m,i)=>i>0&&values[i]===max).join(t("、",", "));
    return '<tr><th scope="row"><span class="simKey '+entry.cohort+'">'+simCohortLabel(entry.cohort)+'</span></th>'+
      [60,120].map(m=>'<td>'+formatValue(entry,values,m)+'</td>').join("")+
      '<td>'+(values.length>2?'<strong>'+simFormat(max)+'</strong><small>'+peakMinute+t(" 分钟"," min")+'</small>':t("仅一个餐后读数","One post-meal reading"))+'</td></tr>';
  }).join("");
  const minutes=[...new Set(series.flatMap(s=>s.entry.study.minutes))].sort((a,b)=>a-b);
  const table=minutes.map(m=>'<tr><th scope="row">'+m+'</th>'+series.map(({entry,values})=>{
    const i=entry.study.minutes.indexOf(m);
    return '<td>'+(i<0?"—":simFormat(values[i]))+'</td>';
  }).join("")+'</tr>').join("");
  panel.innerHTML='<h3>'+t("餐后模拟值","Simulated post-meal glucose")+' <small>'+unit+'</small></h3>'+
    '<p class="simStarting">'+t("输入的餐前值 ","Starting glucose ")+simFormat(simState.baseline)+' '+unit+'</p>'+
    '<table class="simScores"><thead><tr><th>'+t("研究人群","Study group")+'</th><th>'+t("餐后 1 小时","1 hour")+'</th><th>'+t("餐后 2 小时","2 hours")+'</th><th>'+t("采样点最高值","Highest sampled value")+'</th></tr></thead><tbody>'+score+'</tbody></table>'+
    simChart(series)+'<p class="simAxis">'+t("进餐后时间（分钟）","Time after eating (minutes)")+'</p>'+
    '<details><summary>'+t("查看各时间点及原研究","Time points and original evidence")+'</summary><table><thead><tr><th>min</th>'+cohorts.map(c=>'<th>'+simCohortLabel(c)+' ('+unit+')</th>').join("")+'</tr></thead><tbody>'+table+'</tbody></table>'+
    series.map(({entry})=>'<section class="simEvidence"><b>'+simCohortLabel(entry.cohort)+'</b> · n = '+entry.row.n+
      '<p>'+(entry.study.measure==="absolute"?t("研究实测餐前均值 ","Observed mean baseline ")+simFormat(entry.row.mean[0])+' '+unit:t("原文报告较餐前的平均变化","Study reports mean change from baseline"))+' · '+esc(english?entry.row.portionEn:entry.row.portionZh)+'</p>'+
      simRef(entry)+'<p>'+esc(english?entry.study.methodEn:entry.study.methodZh)+'</p></section>').join("")+'</details>';
}

function simulatorView() {
  const foods=simFoods();
  const eligible=foods.filter(f=>simEligible(f,simState.cohort));
  const food=eligible.find(f=>f.key===simState.key)||eligible.find(f=>f.normal?.study.pairId==="mumbai-staples-2017" && f.en.includes("rice"))||eligible[0];
  simState.key=food.key;
  const url=new URL(location.href);
  if(url.searchParams.get("dish")!==food.key) {
    url.searchParams.set("dish",food.key);history.replaceState(null,"",url);
  }
  const ref=food[simState.cohort]||food.normal||food.t2d;
  const active=simState.cohort==="both"?[food.normal,food.t2d]:[ref];
  const sourceNote=[
    active.some(e=>e.study.evidenceKind==="digitized")?t("原图读数为近似值。","Values read from the original graph are approximate."):"",
    ...active.filter(e=>!e.study.minutes.includes(60)).map(e=>simCohortLabel(e.cohort)+t("仅报告餐后 2 小时变化。"," reported only the 2-hour change.")),
    ...active.filter(e=>!e.study.minutes.includes(120)).map(e=>simCohortLabel(e.cohort)+t("末次采样为餐后 "+e.study.minutes.at(-1)+" 分钟。"," was sampled through "+e.study.minutes.at(-1)+" minutes.")),
    ...active.filter(e=>e.study.noteZh).map(e=>english?e.study.noteEn:e.study.noteZh)
  ].filter(Boolean).join(" ");
  $("work").innerHTML='<h2>'+t("餐后血糖模拟器","Post-meal glucose simulator")+'</h2><p class="sub">'+t("用同一个餐前值，看看不同研究人群吃同一份食物后的血糖变化。","Start from one pre-meal glucose value and explore how study groups responded to the same test portion.")+'</p>'+
    '<div class="simLayout"><section class="simInputs"><label for="simGroup">'+t("研究人群","Study population")+'</label><select id="simGroup"><option value="both">'+t("两组对比","Compare both groups")+'</option><option value="normal">'+simCohortLabel("normal")+'</option><option value="t2d">'+simCohortLabel("t2d")+'</option></select>'+
    '<label for="simFood">'+t("食物与做法（"+eligible.length+" 种）","Food and preparation ("+eligible.length+")")+'</label><select id="simFood">'+simOptions(eligible)+'</select>'+
    '<p class="simPortion">'+t("研究份量 · ","Test portion · ")+esc(english?ref.row.portionEn:ref.row.portionZh)+'</p>'+
    '<p class="simPortion">'+active.map(e=>simCohortLabel(e.cohort)+" n="+e.row.n).join(" · ")+'</p>'+
    '<p class="simSource">'+link(ref.study.url,t("查看原始研究","Open original study"))+'</p>'+
    (sourceNote?'<p class="simPortion">'+esc(sourceNote)+'</p>':"")+
    '<label for="simBaseline">'+t("餐前血糖","Pre-meal glucose")+'</label><div class="simInputRow"><input type="number" id="simBaseline" inputmode="decimal" step="any" autocomplete="off" aria-describedby="simError" value="'+esc(simState.input)+'"><select id="simUnit" aria-label="'+t("血糖单位","Glucose unit")+'"><option>mmol/L</option><option>mg/dL</option></select></div><p id="simError" role="status"></p>'+
    '<p class="simCaution">'+t("教学估算，实际反应因人而异。请勿据此调整用药。","Educational estimates. Individual responses vary. Do not adjust medication using these values.")+'</p><details class="simMethod"><summary>'+t("这些数值怎么算？","How is this calculated?")+'</summary><p>'+t("把研究中每个时点相对餐前的平均变化，加到你输入的餐前值上。份量固定为试验份量。","Each time point adds the study group’s mean change from baseline to your starting value. The portion is fixed to the study serving.")+'</p><p>'+t("这种平移计算尚未验证为个人预测。用药、活动和进食份量会影响实际结果，请以实测血糖为准。","This shift has not been validated as an individual prediction. Medication, activity and serving size affect the result. Use measured readings for care.")+'</p></details></section>'+
    '<section class="simOutput" id="simOutput" aria-live="polite"></section></div>';
  $("simGroup").value=simState.cohort;$("simFood").value=food.key;$("simUnit").value=simState.unit;
  $("simBaseline").oninput=e=>{
    simState.input=e.target.value;
    const value=e.target.valueAsNumber;
    simState.baseline=Number.isFinite(value)?value/(simState.unit==="mg/dL"?18:1):null;
    simResults(food);
  };
  $("simUnit").onchange=e=>{
    simState.unit=e.target.value;
    simState.input=simState.baseline===null?"":String(Number((simState.baseline*(simState.unit==="mg/dL"?18:1)).toFixed(4)));
    $("simBaseline").value=simState.input;simResults(food);
  };
  $("simGroup").onchange=e=>{simState.cohort=e.target.value;simulatorView();$("simGroup").focus({preventScroll:true})};
  $("simFood").onchange=e=>{simState.key=e.target.value;simulatorView();$("simFood").focus({preventScroll:true})};
  simResults(food);
}
