"use strict";

// Browse categories describe a food's use in this catalogue. Published study
// classifications, when present, remain visible in the source record.
const foodCategories = {
  staple:["谷物与主食","Grains & staples"],
  legume:["豆类与坚果","Legumes & nuts"],
  fruit:["水果","Fruit"],
  vegetable:["蔬菜与薯类","Vegetables & tubers"],
  dairy:["奶与乳制品","Milk & dairy"],
  drink:["饮品","Drinks"],
  snack:["点心与甜食","Snacks & sweets"],
  meal:["菜肴与组合餐","Dishes & meals"],
  other:["其他食物","Other foods"]
};
const sourceCategory = {
  "Grains and grain products":"staple","Breads":"staple","Breakfast cereals":"staple","Cereal grains":"staple","Pasta and noodles":"staple",
  "Pulses and soy foods":"legume","Legumes":"legume","Seeds and nuts":"legume","Nuts":"legume",
  "Tubers and starches":"vegetable","Vegetables":"vegetable",
  "Fruits and fruit products":"fruit","Fruit and fruit products":"fruit",
  "Milk and dairy products":"dairy","Dairy products and alternatives":"dairy",
  "Beverages":"drink","Fruit and vegetable juices":"drink",
  "Cookies":"snack","Crackers":"snack","Sugars and syrups":"snack","Sugars and confectionery":"snack","Snacks and confectionery":"snack",
  "Soups":"meal"
};
const browsePatterns = [
  ["drink",/\b(juice|nectar|drink|soda|cola|coffee|tea|beverage|lemonade|beer|smoothie)\b/],
  ["snack",/\b(biscuit|cookie|cracker|doughnut|donut|waffle|castella|croissant|pastry|egg tart|fritter|rusk|cake|wafer|muffin|sweet roll|candy|chocolate|crisp|chips|syrup|honey|sugar|glucose|maltose|popcorn|pudding|ice cream)s?\b/],
  ["meal",/\b(meal|sandwich|hamburger|dumpling|spring roll|mee goreng|mee siam|lo mai gai|loi mai kai|harees|machbous|thareed|siyadieh|soup|biryani|biriyani|burger|pizza|curry|stew|casserole|nasi lemak|fried rice|rice and beans|rice and plantain|beans and plantain|pongal|upittu)\b| with (chicken|fish|beef|curry|dhal|chutney|potato palya|vegetables)\b/],
  ["staple",/\b(rice|youtiao|basmati|beehoon|flatbread|plainbread|crispbread|baguette|soft roll|cornmeal|cornflakes|adlay|barleymax|porotta|chapathi|thepla|idiyappam|puttu|pittu|appam|upma|poori|string hoppers|noodle|bread|pasta|macaroni|spaghetti|flour|oat|oats|cereal|wheat|millet|maize|grain|barley|tortilla|sorghum|buckwheat|porridge|congee|vermicelli|chapatti|chapati|roti|injera|idli|dosai|dosa|bun|corn|quinoa|bran|semolina|couscous|bagel|mantou|toast)s?\b/],
  ["legume",/\b(bean|soybean|cowpea|chestnut|lotus seed|pea|nut|lentil|legume|chickpea|cashew|peanut|almond|walnut|soy|soya|tofu|gram|hummus|dhal)s?\b/],
  ["dairy",/\b(milk|cheese|yoghurt|yogurt|kefir|dairy)\b/],
  ["vegetable",/\b(vegetable|konjac|yacon|arrowroot|dioscorea|tapioca|dasheen|lily bulb|potato|potatoes|yam|cassava|taro|carrot|beet|pumpkin|squash|tomato|cucumber|onion|parsnip|broccoli|spinach)s?\b/],
  ["fruit",/\b(fruit|avocado|breadfruit|medjool|apple|pear|peach|mandarin|tangerine|orange|banana|grape|mango|melon|watermelon|persimmon|plum|berry|berries|cherries|cherry|strawberry|papaya|jackfruit|kiwi|kiwifruit|jujube|grapefruit|apricot|raisin|pineapple|guava|rambutan|longan|sapodilla|date|lychee|pomelo|durian|plantain)s?\b/]
];
function browseCategory(group) {
  if (group.rows.some(r=>r.source==="yunnan")) return "staple";
  for(const row of group.rows) {
    if (Object.hasOwn(foodCategories,row.category)) return row.category;
    if (sourceCategory[row.categoryEn]) return sourceCategory[row.categoryEn];
  }
  if (group.en && /^(maktoomi|khudri|nabtat-ali|um-kabar|ajwah|sabaka|ruthana|rashodia|wannanah|shishi|sukkary|shaqra)$/i.test(group.en) && group.rows.some(r=>r.source==="henry"&&r.region==="Saudi Arabia")) return "fruit";
  return browsePatterns.find(([,pattern])=>pattern.test(normalized(group.en)))?.[0]||"other";
}
function categoryName(id) {return t(...foodCategories[id]);}
