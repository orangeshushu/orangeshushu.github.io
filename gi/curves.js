// Values are group means and between-participant SDs from tables 1–5.
// First observation is the study's fasting baseline (mean of the two fasting draws).
window.atlasCurveStudy = {
  title: "云南部分米制品对血糖影响的研究",
  authors: "蒋慕蓉、雷源钦、张可、刘秋梅、杨文丽、刘弘毅、颜洁、张清文",
  citation: "昆明医科大学学报, 2023, 44(12), 41–45",
  doi: "10.12259/j.issn.2095-610X.S20231207",
  url: "https://kyxuebao.kmmu.edu.cn/article/doi/10.12259/j.issn.2095-610X.S20231207",
  pdf: "https://kyxuebao.kmmu.edu.cn/article/exportPdf?id=afc729b1-6628-43fe-8db3-657c8fa484ab",
  rightsUrl: "https://kyxuebao.kmmu.edu.cn/news/zngg/fafbafdb-03bb-46fa-807d-f2a292b59f0d.htm",
  minutes: [0, 15, 30, 45, 60, 90, 120],
  unit: "mmol/L",
  enrolled: 16,
  nPerFood: 12,
  ageYears: [24, 29],
  availableCarbGrams: 25,
  methodZh: "从 16 名 24–29 岁健康志愿者中，每种食品随机选取 12 人试食。每份含 25 克可利用碳水化合物。基线取两次空腹测量的平均值，从第一口开始计时，抽取静脉血以己糖激酶法检测。",
  methodEn: "Twelve of 16 healthy volunteers aged 24–29 were randomly selected for each food. Each test portion provided 25 g of available carbohydrate. Baseline averages two fasting draws. Time is measured from the first bite, with venous glucose assayed by the hexokinase method."
};

window.atlasCurves = [
  {
    zh: "饵丝", en: "Ersi · Yunnan rice cake strips", grams: 55,
    mean: [4.61, 5.30, 6.29, 6.56, 5.75, 4.95, 4.71],
    sd:   [0.30, 0.49, 0.58, 0.90, 1.19, 0.60, 0.47]
  },
  {
    zh: "饵块", en: "Erkuai · Yunnan rice cake", grams: 53,
    mean: [4.43, 4.98, 6.23, 6.21, 5.41, 4.81, 4.66],
    sd:   [0.38, 0.39, 0.37, 0.72, 0.94, 0.63, 0.49]
  },
  {
    zh: "卷粉", en: "Juanfen · rolled rice noodles", grams: 105,
    mean: [4.56, 5.04, 5.97, 5.53, 5.07, 4.96, 5.00],
    sd:   [0.36, 0.43, 0.75, 0.78, 0.70, 0.66, 0.39]
  },
  {
    zh: "酸浆米线", en: "Suanjiang mixian · fermented rice noodles", grams: 97,
    mean: [4.63, 5.12, 5.96, 5.58, 5.00, 4.71, 4.84],
    sd:   [0.33, 0.52, 0.52, 0.57, 0.53, 0.43, 0.50]
  },
  {
    zh: "干浆米线", en: "Ganjiang mixian · non-fermented rice noodles", grams: 84,
    mean: [4.63, 5.20, 5.70, 5.34, 5.11, 4.94, 5.02],
    sd:   [0.39, 0.46, 0.58, 0.71, 0.49, 0.46, 0.47]
  }
];
