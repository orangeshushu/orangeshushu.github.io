"use strict";
// Editorial display names. Source records and identifiers stay in their original form.
const atlasCompanyEn = {
  "上海佳果源食品科技有限公司": "Shanghai Jiaguoyuan Food Technology",
  "上海旺旺食品集团有限公司": "Shanghai Want Want Foods Group",
  "东方先导（上海）糖酒有限公司": "Dongfang Xiandao Sugar and Wine (Shanghai)",
  "东莞徐记食品有限公司": "Dongguan Hsu Fu Chi Foods",
  "中亚乳业(新疆)有限公司": "Zhongya Dairy (Xinjiang)",
  "丰厨（廊坊）食品科技有限公司": "Fengchu Food Technology (Langfang)",
  "丰益（上海）生物技术研发中心有限公司": "Wilmar Biotechnology Research Centre (Shanghai)",
  "乐百氏（广东）饮用水有限公司": "Robust Drinking Water (Guangdong)",
  "五常市金稻子米业有限公司": "Wuchang Jindaozi Rice",
  "亳州敬道堂食品有限公司": "Bozhou Jingdaotang Foods",
  "今健源健康产业（西安)集团有限公司": "Jinjianyuan Health Industry Group (Xi'an)",
  "伊犁丰草牧场乳业有限公司": "Yili Fengcao Ranch Dairy",
  "伊犁古丝通生物科技有限责任公司": "Yili Gusitong Biotechnology",
  "光明乳业股份有限公司": "Bright Dairy",
  "北京秦臻娇羊企业管理有限公司": "Beijing Qinzhen Jiaoyang Enterprise Management",
  "北大荒中垦（广东）食品科技有限公司": "Beidahuang Zhongken Food Technology (Guangdong)",
  "南京浩明乳业有限责任公司": "Nanjing Haoming Dairy",
  "南京粮食集团有限公司": "Nanjing Grain Group",
  "吉林省合十农业科技发展有限公司": "Jilin Heshi Agricultural Technology Development",
  "周口市翔耀食品有限公司": "Zhoukou Xiangyao Foods",
  "夏津县君享食品厂": "Xiajin Junxiang Food Factory",
  "天津创源生物技术有限公司": "Tianjin Chuangyuan Biotechnology",
  "好想你健康食品股份有限公司": "Haoxiangni Health Foods",
  "如新（中国）日用保健品有限公司": "Nu Skin Personal Care (China)",
  "宁波御坊堂生物科技有限公司": "Ningbo Yufangtang Biotechnology",
  "宁波恩莱健生物技术有限公司": "Ningbo Enlaijian Biotechnology",
  "安利（中国）电子商务有限公司": "Amway E-Commerce (China)",
  "安徽侬安康食品有限公司": "Anhui Nongankang Foods",
  "安徽华晓供应链有限公司": "Anhui Huaxiao Supply Chain",
  "安徽小岗蒸降堂生物科技有限公司": "Anhui Xiaogang Zhengjiangtang Biotechnology",
  "安徽巢湖旺农业科技股份有限公司": "Anhui Chaohuwang Agricultural Technology",
  "安徽省米蒸康健康科技有限公司": "Anhui Mizhengkang Health Technology",
  "安徽省蒸谷米食品科技有限公司": "Anhui Parboiled Rice Food Technology",
  "山东大旺食品有限公司": "Shandong Dawang Foods",
  "山东旺旺食品有限公司": "Shandong Want Want Foods",
  "山东稼禾兴农业有限公司": "Shandong Jiahexing Agriculture",
  "山东鲜氧多生物科技有限公司": "Shandong Xianyangduo Biotechnology",
  "山西天池农业发展有限公司": "Shanxi Tianchi Agricultural Development",
  "康宝莱（上海）管理有限公司": "Herbalife Management (Shanghai)",
  "康宝莱（中国）保健品有限公司": "Herbalife Health Products (China)",
  "恒天然商贸（上海）有限公司": "Fonterra Trading (Shanghai)",
  "成都天健君农业科技有限公司": "Chengdu Tianjianjun Agricultural Technology",
  "扬州完美日用品有限公司": "Yangzhou Perfect Daily Products",
  "控糖小屋（无锡）健康管理有限公司": "Kongtang Xiaowu Health Management (Wuxi)",
  "新乡市和丝露饮品有限公司": "Xinxiang Hesilu Beverages",
  "新疆丰驼源乳业科技有限公司": "Xinjiang Fengtuoyuan Dairy Technology",
  "新疆伊犁佳和乳业有限公司": "Xinjiang Yili Jiahe Dairy",
  "新疆长眉驼乳业有限公司": "Xinjiang Changmei Camel Dairy",
  "新疆驼能乳业有限公司": "Xinjiang Tuoneng Dairy",
  "无限极（中国）有限公司": "Infinitus (China)",
  "昆明龙腾生物乳业有限公司": "Kunming Longteng Bio-Dairy",
  "杭州万店仓供应链管理有限公司": "Hangzhou Wandiancang Supply Chain Management",
  "杭州与众健康科技有限公司": "Hangzhou Yuzhong Health Technology",
  "杭州光合植造食品科技有限公司": "Hangzhou Guanghe Zhizao Food Technology",
  "杭州足力健科技有限公司": "Hangzhou Zulijian Technology",
  "江中食疗科技有限公司": "Jiangzhong Dietary Therapy Technology",
  "江苏省农垦米业集团有限公司": "Jiangsu Agricultural Reclamation Rice Group",
  "江苏锦润农业科技有限公司": "Jiangsu Jinrun Agricultural Technology",
  "河北今旭面业有限公司": "Hebei Jinxu Noodle Products",
  "济南圣泉唐和唐生物科技有限公司": "Jinan Shengquan Tanghetang Biotechnology",
  "浙江巨香食品有限公司": "Zhejiang Juxiang Foods",
  "深圳动态均衡健康科技有限公司": "Shenzhen Dongtai Junheng Health Technology",
  "滁州金弘安米业有限公司": "Chuzhou Jinhongan Rice",
  "玛士撒拉（上海）医疗科技有限公司": "Methuselah Medical Technology (Shanghai)",
  "玫琳凯(中国)有限公司": "Mary Kay (China)",
  "甘南云端羚城食品科技有限公司": "Gannan Yunduan Lingcheng Food Technology",
  "益海嘉里食品营销有限公司": "Yihai Kerry Food Marketing",
  "福建盼盼食品有限公司": "Fujian Panpan Foods",
  "福建绿硕果品有限公司": "Fujian Lüshuo Fruit Products",
  "穆棱市北纯农业科技有限公司": "Muling Beichun Agricultural Technology",
  "自然阳光（上海）日用品有限公司": "Nature's Sunshine Daily Products (Shanghai)",
  "芳维特（上海）健康科技有限公司": "Fangweite Health Technology (Shanghai)",
  "苏州忆江南食品有限公司": "Suzhou Yijiangnan Foods",
  "西安御恭羊乳有限公司": "Xi'an Yugong Goat Dairy",
  "西藏地博士健康科技有限公司": "Tibet Diboshi Health Technology",
  "西藏奇正青稞健康科技有限公司": "Tibet Cheezheng Highland Barley Health Technology",
  "辽宁辉山乳业集团有限公司": "Liaoning Huishan Dairy Group",
  "连云港天谷米业有限公司": "Lianyungang Tiangu Rice",
  "醴陵糖飧食品科技有限公司": "Liling Tangsun Food Technology",
  "阿勒泰哈纳斯乳业有限公司": "Altay Hanasi Dairy",
  "陕西圣唐乳业有限公司": "Shaanxi Shengtang Dairy",
  "陕西心特软食品有限责任公司": "Shaanxi Xinteruan Foods",
  "陕西皇家生物科技有限公司": "Shaanxi Huangjia Biotechnology",
  "陕西金牛乳业有限公司": "Shaanxi Jinniu Dairy",
  "青海金谷力藏血麦生物科技有限公司": "Qinghai Jinguli Highland Wheat Biotechnology",
  "青海青藏部落农牧开发有限公司": "Qinghai Qingzang Buluo Agricultural and Pastoral Development",
  "（株）韩国人参公社": "Korea Ginseng Corporation"
};

const foodTermsZh = {
  "Chapa kola":"查帕品种","Bau kul":"包库尔品种","Kponan":"克波南","Banku":"班库","Ga kenkey":"加式肯基","Tuo zaafi":"图奥扎菲","Pounded fufu":"富富","Processed fufu":"富富",
  "alache":"阿拉切菜","Veggie V9":"蔬果九号","Khalas":"哈拉斯","Barhi":"巴尔希","Brangan":"贝兰甘","Rastali":"拉斯塔利","Mas":"马斯",
  "Musa sapientum":"原研究所称食用蕉","原文 Banana 3":"研究编号 3","Red Dacca":"红达卡品种","Surti Kolam":"苏尔蒂科兰品种","Britannia Daily Fresh":"不列颠尼亚每日鲜系列",
  "Jizi439":"冀紫439","Daawat":"达瓦特","Uncle Ben’s":"本叔叔牌","Prowash":"普罗沃什","尼日利亚 pap":"尼日利亚式","MM巧克力":"玛氏彩色糖衣巧克力"
};
const foodTermsPattern = new RegExp(Object.keys(foodTermsZh).join("|"),"g");
function chineseFoodLabel(label) {
  return label.replace(/（(?:mudde|roti|idli|dosa|upma|chivda|methi paratha|sundal|adai|placali|foutou|cabatôh|attiéké|tamal)）/g,"")
    .replace(/（chapatti，/g,"（").replace(/，(?:Khalal|Rutab|Tamer)）/g,"）")
    .replace(foodTermsPattern,word=>foodTermsZh[word]);
}
function displayFoodName(row,inEnglish) {
  if(inEnglish) {
    const label=row.en || "";
    const [product,holder]=label.split(" · ");
    if(atlasCompanyEn[holder]) return product+" · "+atlasCompanyEn[holder];
    return label.replace("Banana, listed as sheng (生)","Banana, listed as raw");
  }
  const label=row.zh || window.atlasHenryNamesZh?.[row.en];
  if(label) return zhStudyText(chineseFoodLabel(label));
  const record=row.item?row:row.rows?.find(r=>r.item);
  if(record) return (record.categoryZh||"国际研究食物")+"（研究表第 "+record.item+" 项）";
  return "";
}
