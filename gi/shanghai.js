// Original aggregate analysis of Jinhao Zhu's Shanghai diabetes datasets, Figshare v3.
// No individual health records are included in this site.
window.atlasShanghai = {
  title: {
    zh: "上海饮食记录中的米饭配餐",
    en: "Meals with rice in the Shanghai dietary records"
  },
  groups: [
    {cohort: {zh: "1 型糖尿病", en: "Type 1 diabetes"}, studyParticipants: 12, participants: 4, meals: 29, delta60: null, delta120: null},
    {cohort: {zh: "2 型糖尿病", en: "Type 2 diabetes"}, studyParticipants: 100, participants: 51, meals: 497, delta60: 1.40, delta120: 1.90}
  ],
  method: {
    zh: "从 125 份随访工作簿中，筛选英文饮食记录中有独立一行写明 Rice 和克数、同一时间还记录了其他食物的进食事件。前后各 120 分钟内若有其他已记录进食，则排除。基线取进餐时或此前 15 分钟内最近一次传感器读数，60 和 120 分钟各取目标时间前后 7.5 分钟内最近的读数；三点都需有数值，且原列标注 mg/dL。将相对基线的变化除以 18 换算为 mmol/L，先对每个人的各餐取中位数，再对每组参与者取中位数。每人权重相同。少于 5 人的组仅列样本量。",
    en: "Across 125 visit workbooks, we selected eating occasions whose English log contained a line with plain “Rice” and a weight in grams plus at least one other item at the same time. We excluded occasions with another logged intake within 120 minutes before or after. Baseline was the last sensor reading at or within 15 minutes before the meal. For 60 and 120 minutes we took the nearest reading within 7.5 minutes of each target. All three readings were required from columns labeled mg/dL. We divided changes from baseline by 18 to obtain mmol/L, took the median across meals within each participant, then the median across participants within each group. Groups with fewer than five contributors show counts only."
  },
  caution: {
    zh: "这些数值描述特定患者在日常饮食和治疗条件下吃整餐后的变化。米饭份量、配菜、用药和活动均可能不同，漏记加餐也可能影响结果。不能据此推断米饭单独的效果或预测个人血糖。",
    en: "These results describe whole meals under real-life treatment conditions. Rice portions, accompanying foods, medication and activity varied, and snacks may have gone unlogged. The changes cannot be attributed to rice alone or used to predict an individual's glucose."
  },
  attribution: {
    zh: "原始数据由 Jinhao Zhu 发布于 Figshare（第 3 版，CC BY 4.0）。研究说明为 Qinpei Zhao 等，Scientific Data（2023）。本站筛选、换算及汇总了原始记录。",
    en: "Original data deposited by Jinhao Zhu on Figshare (version 3, CC BY 4.0). Study by Qinpei Zhao et al., Scientific Data (2023). This site filtered, converted and summarized the original records."
  },
  datasetUrl: "https://doi.org/10.6084/m9.figshare.20444397.v3",
  studyUrl: "https://doi.org/10.1038/s41597-023-01940-7",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/"
};
