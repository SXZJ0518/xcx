/**
 * 凤凰单枞 - 展示型小程序数据
 * 品牌定位：潮汕凤凰单枞专业品牌
 */

// ========== 十大香型分类 ==========
const mockCategories = [
  {
    id: 'cat_1', name: '黄栀香', icon: '', sort: 1, status: 1,
    desc: '最经典香型，花香清雅',
    aromaFeature: '栀子花清甜芬芳，高扬持久，尾调带熟蜜桃甜香',
    representative: '宋种东方红、贡香、老仙翁、海底捞针、棕蓑挟、向东种',
    qualityFeature: '汤色金黄，滋味甘醇鲜爽，回甘力强，耐冲泡'
  },
  {
    id: 'cat_2', name: '芝兰香', icon: '', sort: 2, status: 1,
    desc: '幽兰香气，清高持久',
    aromaFeature: '清雅细长，似幽谷芝兰，略带木质香或乳香',
    representative: '八仙过海、宋种芝兰香、兄弟茶、乌叶芝兰',
    qualityFeature: '汤色橙黄明亮，滋味鲜爽甘醇，山韵明显'
  },
  {
    id: 'cat_3', name: '蜜兰香', icon: '', sort: 3, status: 1,
    desc: '蜜香浓郁，受众最广',
    aromaFeature: '蜜甜 + 兰香，带番薯般甜润，最受大众喜爱',
    representative: '香番薯、大庵蜜兰、宋种蜜香单丛（又名红薯香）',
    qualityFeature: '甜润耐泡，"蜜韵"突出，饮后满口生香'
  },
  {
    id: 'cat_4', name: '桂花香', icon: '', sort: 4, status: 1,
    desc: '桂花香气，清甜高雅',
    aromaFeature: '馥郁桂花甜香，甜而不腻，持久不散',
    representative: '桂花香单丛、群体种',
    qualityFeature: '条索紧卷纤细，汤色金黄明亮，山韵独特'
  },
  {
    id: 'cat_5', name: '玉兰香', icon: '', sort: 5, status: 1,
    desc: '白兰花香，山韵明显',
    aromaFeature: '高扬奔放，酷似玉兰花，冲泡多次仍有明显花香',
    representative: '金玉兰、娘仔伞、赤竹香、玉兰单丛',
    qualityFeature: '香气清幽持久，滋味醇厚'
  },
  {
    id: 'cat_6', name: '姜花香', icon: '', sort: 6, status: 1,
    desc: '生姜辛辣感，独特辨识',
    aromaFeature: '辛辣似姜花，香气冲天（又名"通天香"）',
    representative: '通天香单丛、姜花香单丛',
    qualityFeature: '入口微辣，回甘迅猛，年底"返春"回香更佳'
  },
  {
    id: 'cat_7', name: '夜来香', icon: '', sort: 7, status: 1,
    desc: '夜间尤显馥郁',
    aromaFeature: '浓郁夜来花香，香气持久',
    representative: '夜来香单丛',
    qualityFeature: '香气独特，辨识度高'
  },
  {
    id: 'cat_8', name: '杏仁香', icon: '', sort: 8, status: 1,
    desc: '杏仁果香，喉韵深远',
    aromaFeature: '淡淡的果仁香，类似杏仁，回甘有力',
    representative: '杏仁香单丛、大乌叶（叶色深绿）',
    qualityFeature: '条索紧直纤细，灰褐色，韵味独特'
  },
  {
    id: 'cat_9', name: '肉桂香', icon: '', sort: 9, status: 1,
    desc: '肉桂辛香，霸气浓烈',
    aromaFeature: '类似岩茶肉桂，但更柔和，有桂皮香 + 花果香复合',
    representative: '肉桂香单丛',
    qualityFeature: '滋味醇厚，有独特"桂韵"'
  },
  {
    id: 'cat_10', name: '茉莉香', icon: '', sort: 10, status: 1,
    desc: '清新茉莉花味，持久芬芳',
    aromaFeature: '清新茉莉花味，持久芬芳',
    representative: '茉莉香单丛',
    qualityFeature: '香气清新，适合喜欢淡雅花香的茶友'
  }
]

// ========== 产品数据（茶叶） ==========
const mockProducts = [
  // 黄栀香系
  {
    id: 'prod_1',
    type: 'tea',
    name: '凤凰单枞·黄栀香 高山',
    brief: '海拔800米以上，花香清雅持久',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_1',
    categoryName: '黄栀香',
    price: 380,
    originalPrice: 480,
    stock: 50,
    sales: 128,
    status: 1,
    isNew: true,
    isHot: true,
    tags: ['高山', '传统炭焙', '500g袋装'],
    origin: '潮州凤凰山',
    altitude: '800m+',
    roast: '炭焙',
    weight: '500g',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡8-12次',
    aromaFeature: '栀子花清甜芬芳，高扬持久，尾调带熟蜜桃甜香',
    representative: '宋种东方红、贡香、老仙翁、海底捞针、棕蓑挟、向东种',
    qualityFeature: '汤色金黄，滋味甘醇鲜爽，回甘力强，耐冲泡',
    description: '黄栀香是凤凰单枞最经典的香型，因花香似栀子花而得名。本品采自凤凰山海拔800米以上高山茶园，传统炭焙工艺，茶汤金黄透亮，入口花香馥郁，回甘持久，喉韵深远。'
  },
  {
    id: 'prod_2',
    type: 'tea',
    name: '凤凰单枞·黄栀香 中山',
    brief: '海拔500-800米，性价比之选',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_1',
    categoryName: '黄栀香',
    price: 268,
    originalPrice: 328,
    stock: 80,
    sales: 256,
    status: 1,
    isHot: true,
    tags: ['中山', '电焙', '500g袋装'],
    origin: '潮州凤凰山',
    altitude: '500-800m',
    roast: '电焙',
    weight: '500g',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡6-10次',
    aromaFeature: '栀子花清甜芬芳，高扬持久，尾调带熟蜜桃甜香',
    representative: '宋种东方红、贡香、老仙翁、海底捞针、棕蓑挟、向东种',
    qualityFeature: '汤色金黄，滋味甘醇鲜爽，回甘力强，耐冲泡',
    description: '中山茶园出品，性价比极高。茶汤橙黄明亮，花香清雅，滋味醇厚，适合日常品饮。'
  },
  // 蜜兰香系
  {
    id: 'prod_3',
    type: 'tea',
    name: '凤凰单枞·蜜兰香 特级',
    brief: '蜜香浓郁带兰花韵，受众最广',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_3',
    categoryName: '蜜兰香',
    price: 458,
    originalPrice: 568,
    stock: 30,
    sales: 89,
    status: 1,
    isNew: true,
    isHot: true,
    tags: ['特级', '高山', '炭焙', '500g铁罐'],
    origin: '潮州凤凰山乌岽村',
    altitude: '900m+',
    roast: '炭焙',
    weight: '500g',
    brewTemp: '95-100℃',
    brewTime: '12-18秒/泡',
    brewCount: '可冲泡10-15次',
    aromaFeature: '蜜甜 + 兰香，带番薯般甜润，最受大众喜爱',
    representative: '香番薯、大庵蜜兰、宋种蜜香单丛（又名红薯香）',
    qualityFeature: '甜润耐泡，"蜜韵"突出，饮后满口生香',
    description: '蜜兰香是凤凰单枞最受欢迎的香型，蜜香浓郁中带有兰花幽韵。特级品采自乌岽村古树茶园，传统炭焙慢火细烘，茶汤蜜黄油润，入口蜜香炸裂，回甘生津，韵味悠长。'
  },
  {
    id: 'prod_4',
    type: 'tea',
    name: '凤凰单枞·蜜兰香 一级',
    brief: '蜜香明显，日常品饮首选',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_3',
    categoryName: '蜜兰香',
    price: 298,
    originalPrice: 368,
    stock: 60,
    sales: 342,
    status: 1,
    isHot: true,
    tags: ['一级', '中山', '电焙', '500g袋装'],
    origin: '潮州凤凰山',
    altitude: '600m',
    roast: '电焙',
    weight: '500g',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡8-12次',
    aromaFeature: '蜜甜 + 兰香，带番薯般甜润，最受大众喜爱',
    representative: '香番薯、大庵蜜兰、宋种蜜香单丛（又名红薯香）',
    qualityFeature: '甜润耐泡，"蜜韵"突出，饮后满口生香',
    description: '一级蜜兰香，蜜香明显，滋味醇厚甜润，是日常品饮和入门首选。'
  },
  // 芝兰香
  {
    id: 'prod_5',
    type: 'tea',
    name: '凤凰单枞·芝兰香',
    brief: '幽兰香气，清高持久',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_2',
    categoryName: '芝兰香',
    price: 388,
    originalPrice: 488,
    stock: 35,
    sales: 156,
    status: 1,
    isNew: true,
    tags: ['高山', '炭焙', '500g袋装'],
    origin: '潮州凤凰山',
    altitude: '800m',
    roast: '炭焙',
    weight: '500g',
    brewTemp: '95-100℃',
    brewTime: '12-18秒/泡',
    brewCount: '可冲泡10-15次',
    aromaFeature: '清雅细长，似幽谷芝兰，略带木质香或乳香',
    representative: '八仙过海、宋种芝兰香、兄弟茶、乌叶芝兰',
    qualityFeature: '汤色橙黄明亮，滋味鲜爽甘醇，山韵明显',
    description: '芝兰香因香气似兰花而得名，清高幽雅，持久不散。茶汤金黄明亮，入口兰花香馥郁，滋味鲜爽，回甘生津。'
  },
  // 桂花香
  {
    id: 'prod_6',
    type: 'tea',
    name: '凤凰单枞·桂花香',
    brief: '桂花香气明显，清甜高雅',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_4',
    categoryName: '桂花香',
    price: 358,
    originalPrice: 448,
    stock: 45,
    sales: 198,
    status: 1,
    isHot: true,
    tags: ['高山', '炭焙', '500g袋装'],
    origin: '潮州凤凰山',
    altitude: '750m',
    roast: '炭焙',
    weight: '500g',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡8-12次',
    aromaFeature: '馥郁桂花甜香，甜而不腻，持久不散',
    representative: '桂花香单丛、群体种',
    qualityFeature: '条索紧卷纤细，汤色金黄明亮，山韵独特',
    description: '桂花香型带有天然桂花香气，清甜高雅，入口顺滑，回甘持久，适合喜欢花香的茶友。'
  },
  // 玉兰香
  {
    id: 'prod_7',
    type: 'tea',
    name: '凤凰单枞·玉兰香',
    brief: '高扬奔放，酷似玉兰花',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_5',
    categoryName: '玉兰香',
    price: 398,
    originalPrice: 498,
    stock: 28,
    sales: 112,
    status: 1,
    isNew: true,
    tags: ['高山', '炭焙', '500g袋装'],
    origin: '潮州凤凰山',
    altitude: '820m',
    roast: '炭焙',
    weight: '500g',
    brewTemp: '95-100℃',
    brewTime: '12-18秒/泡',
    brewCount: '可冲泡10-15次',
    aromaFeature: '高扬奔放，酷似玉兰花，冲泡多次仍有明显花香',
    representative: '金玉兰、娘仔伞、赤竹香、玉兰单丛',
    qualityFeature: '香气清幽持久，滋味醇厚',
    description: '玉兰香型高扬奔放，酷似白玉兰花的香气，冲泡多次后花香依然明显。茶汤金黄，滋味醇厚，山韵悠长。'
  },
  // 肉桂香
  {
    id: 'prod_8',
    type: 'tea',
    name: '凤凰单枞·肉桂香',
    brief: '肉桂辛香，霸气浓烈',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_9',
    categoryName: '肉桂香',
    price: 428,
    originalPrice: 528,
    stock: 25,
    sales: 89,
    status: 1,
    tags: ['高山', '炭焙', '浓香型', '500g铁罐'],
    origin: '潮州凤凰山',
    altitude: '900m',
    roast: '炭焙',
    weight: '500g',
    brewTemp: '100℃',
    brewTime: '15-20秒/泡',
    brewCount: '可冲泡10-15次',
    aromaFeature: '类似岩茶肉桂，但更柔和，有桂皮香 + 花果香复合',
    representative: '肉桂香单丛',
    qualityFeature: '滋味醇厚，有独特"桂韵"',
    description: '肉桂香是凤凰单枞浓香型代表，带有肉桂辛香，霸气浓烈，茶汤橙红油润，入口冲击力强，回甘迅猛，适合喜欢浓茶的茶友。'
  },
  // 杏仁香
  {
    id: 'prod_9',
    type: 'tea',
    name: '凤凰单枞·杏仁香',
    brief: '杏仁果香，喉韵深远',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_8',
    categoryName: '杏仁香',
    price: 368,
    originalPrice: 458,
    stock: 30,
    sales: 134,
    status: 1,
    tags: ['高山', '炭焙', '500g袋装'],
    origin: '潮州凤凰山',
    altitude: '800m',
    roast: '炭焙',
    weight: '500g',
    brewTemp: '95-100℃',
    brewTime: '12-18秒/泡',
    brewCount: '可冲泡8-12次',
    aromaFeature: '淡淡的果仁香，类似杏仁，回甘有力',
    representative: '杏仁香单丛、大乌叶（叶色深绿）',
    qualityFeature: '条索紧直纤细，灰褐色，韵味独特',
    description: '杏仁香带有天然杏仁果香，滋味醇厚，喉韵深远，回甘持久，是凤凰单枞中辨识度极高的香型。'
  },
  // 姜花香
  {
    id: 'prod_10',
    type: 'tea',
    name: '凤凰单枞·姜花香（通天香）',
    brief: '辛辣似姜花，香气冲天',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_6',
    categoryName: '姜花香',
    price: 348,
    originalPrice: 438,
    stock: 20,
    sales: 67,
    status: 1,
    isNew: true,
    tags: ['高山', '炭焙', '500g袋装'],
    origin: '潮州凤凰山',
    altitude: '850m',
    roast: '炭焙',
    weight: '500g',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡8-12次',
    aromaFeature: '辛辣似姜花，香气冲天（又名"通天香"）',
    representative: '通天香单丛、姜花香单丛',
    qualityFeature: '入口微辣，回甘迅猛，年底"返春"回香更佳',
    description: '姜花香是凤凰单枞中最独特的香型之一，又名"通天香"。带有生姜的辛辣感，但并不刺激，反而增添了层次感，入口微辣，回甘迅猛，年底"返春"回香更佳。'
  }
]

// ========== 蜂蜜商品数据 ==========
const mockHoneyProducts = [
  {
    id: 'honey_1',
    type: 'honey',
    name: '凤凰山荔枝蜜',
    brief: '岭南荔枝花开，蜜中上品',
    cover: '',
    imageUrl: '',
    images: [],
    price: 128,
    originalPrice: 168,
    weight: '500g',
    origin: '广东潮州凤凰山',
    flowerSource: '荔枝花',
    harvestTime: '每年4-5月',
    status: 1,
    tags: ['纯天然', '零添加', '岭南特产'],
    description: '采自凤凰山周边荔枝花海，花期短暂，产量稀少。蜜色琥珀，入口清甜带荔枝果香，回味悠长，是岭南地区最具代表性的蜂蜜品种。适合冲水饮用，也可搭配单枞茶调饮。'
  },
  {
    id: 'honey_2',
    type: 'honey',
    name: '凤凰山龙眼蜜',
    brief: '龙眼花蜜，甘润滋补',
    cover: '',
    imageUrl: '',
    images: [],
    price: 118,
    originalPrice: 158,
    weight: '500g',
    origin: '广东潮州凤凰山',
    flowerSource: '龙眼花',
    harvestTime: '每年3-4月',
    status: 1,
    tags: ['纯天然', '零添加', '滋补佳品'],
    description: '凤凰山龙眼蜜，蜜色深琥珀，质地浓稠，带有龙眼花特有的甘甜香气。口感醇厚，回味悠长，具有滋补养颜之效，尤其适合秋冬季节食用。'
  },
  {
    id: 'honey_3',
    type: 'honey',
    name: '凤凰山百花蜜',
    brief: '百花开尽，一蜜浓缩',
    cover: '',
    imageUrl: '',
    images: [],
    price: 98,
    originalPrice: 138,
    weight: '500g',
    origin: '广东潮州凤凰山',
    flowerSource: '百花（混合花蜜）',
    harvestTime: '每年春夏季',
    status: 1,
    tags: ['纯天然', '零添加', '日常首选'],
    description: '凤凰山百花蜜，采集于春夏季百花盛开之时，融合多种花蜜精华。蜜色金黄，香气馥郁，口感层次丰富，是日常养生的首选蜜品。可冲饮、佐餐、搭配茶饮。'
  },
  {
    id: 'honey_4',
    type: 'honey',
    name: '凤凰山冬蜜',
    brief: '冬日结晶，珍贵稀有',
    cover: '',
    imageUrl: '',
    images: [],
    price: 158,
    originalPrice: 198,
    weight: '500g',
    origin: '广东潮州凤凰山',
    flowerSource: '鸭脚木（鹅掌柴）',
    harvestTime: '每年11-12月',
    status: 1,
    tags: ['纯天然', '零添加', '珍贵稀有', '结晶蜜'],
    description: '冬蜜是凤凰山最珍贵的蜜种，采自冬季鸭脚木花（鹅掌柴）。蜜色浅黄，低温下易结晶，口感细腻绵柔，带有独特的清凉甘甜。冬蜜产量极低，具有清热润燥之效，是送礼佳品。'
  }
]

// ========== 轮播图 ==========
const mockBanners = [
  { id: 'b1', imageUrl: '', link: '', title: '凤凰单枞·十大香型', subtitle: '一丛一味，百丛百香' },
  { id: 'b2', imageUrl: '', link: '', title: '高山炭焙', subtitle: '传统工艺，匠心之作' },
  { id: 'b3', imageUrl: '', link: '', title: '蜜兰香·受众最广', subtitle: '蜜香浓郁，兰花幽韵' }
]

// ========== 茶知识 ==========
const mockKnowledge = [
  {
    id: 'k1',
    title: '凤凰单枞十大主流香型全解',
    category: '香型介绍',
    summary: '一丛一味，百丛百香——详解凤凰单枞十大主流香型的香气特征、代表品种与品质特点',
    content: '<h3>凤凰单枞十大主流香型全解</h3><p>凤凰单枞，产于广东省潮州市凤凰山，是乌龙茶中的极品，以"一丛一味、百丛百香"著称于世。每一株茶树因品种、树龄、海拔、土壤、工艺的不同，都能孕育出独一无二的香气。以下为十大主流香型详解：</p><h4>一、黄栀香（黄栀香）</h4><p><b>香气特征：</b>栀子花清甜芬芳，高扬持久，尾调带熟蜜桃甜香。</p><p><b>代表品种：</b>宋种东方红、贡香、老仙翁、海底捞针、棕蓑挟、向东种。</p><p><b>品质特点：</b>汤色金黄，滋味甘醇鲜爽，回甘力强，耐冲泡。</p><h4>二、芝兰香</h4><p><b>香气特征：</b>清雅细长，似幽谷芝兰，略带木质香或乳香。</p><p><b>代表品种：</b>八仙过海、宋种芝兰香、兄弟茶、乌叶芝兰。</p><p><b>品质特点：</b>汤色橙黄明亮，滋味鲜爽甘醇，山韵明显。</p><h4>三、蜜兰香</h4><p><b>香气特征：</b>蜜甜 + 兰香，带番薯般甜润，最受大众喜爱。</p><p><b>代表品种：</b>香番薯、大庵蜜兰、宋种蜜香单丛（又名红薯香）。</p><p><b>品质特点：</b>甜润耐泡，"蜜韵"突出，饮后满口生香。</p><h4>四、桂花香</h4><p><b>香气特征：</b>馥郁桂花甜香，甜而不腻，持久不散。</p><p><b>代表品种：</b>桂花香单丛、群体种。</p><p><b>品质特点：</b>条索紧卷纤细，汤色金黄明亮，山韵独特。</p><h4>五、玉兰香</h4><p><b>香气特征：</b>高扬奔放，酷似玉兰花，冲泡多次仍有明显花香。</p><p><b>代表品种：</b>金玉兰、娘仔伞、赤竹香、玉兰单丛。</p><p><b>品质特点：</b>香气清幽持久，滋味醇厚。</p><h4>六、姜花香</h4><p><b>香气特征：</b>辛辣似姜花，香气冲天（又名"通天香"）。</p><p><b>代表品种：</b>通天香单丛、姜花香单丛。</p><p><b>品质特点：</b>入口微辣，回甘迅猛，年底"返春"回香更佳。</p><h4>七、夜来香</h4><p><b>香气特征：</b>浓郁夜来花香，香气持久。</p><p><b>代表品种：</b>夜来香单丛。</p><p><b>品质特点：</b>香气独特，辨识度高。</p><h4>八、杏仁香</h4><p><b>香气特征：</b>淡淡的果仁香，类似杏仁，回甘有力。</p><p><b>代表品种：</b>杏仁香单丛、大乌叶（叶色深绿）。</p><p><b>品质特点：</b>条索紧直纤细，灰褐色，韵味独特。</p><h4>九、肉桂香</h4><p><b>香气特征：</b>类似岩茶肉桂，但更柔和，有桂皮香 + 花果香复合。</p><p><b>代表品种：</b>肉桂香单丛。</p><p><b>品质特点：</b>滋味醇厚，有独特"桂韵"。</p><h4>十、茉莉香</h4><p><b>香气特征：</b>清新茉莉花味，持久芬芳。</p><p><b>代表品种：</b>茉莉香单丛。</p><p><b>品质特点：</b>香气清新，适合喜欢淡雅花香的茶友。</p>',
    views: 3280,
    createTime: '2024-01-15'
  },
  {
    id: 'k2',
    title: '如何冲泡凤凰单枞',
    category: '冲泡技巧',
    summary: '高冲低斟，工夫茶法，详解凤凰单枞冲泡要领',
    content: '<h3>工夫茶冲泡法</h3><p>凤凰单枞讲究"高冲低斟"，使用盖碗或紫砂壶冲泡，方能充分激发其花果香韵。</p><h4>一、器具准备</h4><p>推荐使用白瓷盖碗（120ml）或朱泥紫砂壶，搭配公道杯和品茗杯。</p><h4>二、投茶量</h4><p>盖碗约7-8g（约盖碗容量的1/2至2/3），根据个人口味可适当增减。</p><h4>三、水温控制</h4><p>沸水冲泡，水温95-100℃。高山老丛可用100℃沸水激发香气。</p><h4>四、冲泡步骤</h4><p>1. 温杯烫壶：用沸水将茶具预热<br/>2. 洗茶醒茶：第一泡快速出汤（3-5秒），不饮用<br/>3. 正式冲泡：第二泡开始，每泡浸泡10-15秒<br/>4. 逐泡递增：从第三泡起每泡增加3-5秒<br/>5. 高冲低斟：注水时壶提高，出汤时壶放低</p><h4>五、品饮要点</h4><p>先闻杯盖香，再观汤色，小口啜饮，感受香气在口腔中的层次变化。</p>',
    views: 2356,
    createTime: '2024-01-20'
  },
  {
    id: 'k3',
    title: '高山茶与低山茶的区别',
    category: '茶叶鉴别',
    summary: '海拔越高品质越好？详解高山茶与低山茶差异',
    content: '<h3>高山茶 vs 低山茶</h3><p>凤凰山海拔差异显著，不同海拔的茶园所产茶叶品质差异明显。</p><h4>高山茶（800m以上）</h4><p>• 香气更高扬持久<br/>• 滋味更醇厚甘甜<br/>• 山韵更明显<br/>• 耐冲泡程度更高<br/>• 代表产区：乌岽山、大庵村</p><h4>中山茶（500-800m）</h4><p>• 香气清雅适中<br/>• 滋味醇和平衡<br/>• 性价比高<br/>• 适合日常品饮</p><h4>低山茶（500m以下）</h4><p>• 香气相对平淡<br/>• 滋味较薄<br/>• 价格亲民<br/>• 适合入门体验</p><h4>总结</h4><p>海拔并非唯一标准，工艺水平和树龄同样重要。一棵低山老丛的品质可能远超高山新树。</p>',
    views: 890,
    createTime: '2024-02-01'
  }
]

// ========== 站点配置 ==========
const mockSiteConfig = {
  brandName: '凤凰单枞',
  slogan: '一丛一味 百丛百香',
  wechat: 'fenghuang_dancong',
  phone: '13800138000',
  about: '凤凰单枞，产于广东省潮州市凤凰山脉，是中国乌龙茶中的极品。凤凰山海拔千米以上，终年云雾缭绕，土壤肥沃，是茶树生长的绝佳之地。我们世代居住于凤凰山，传承百年制茶技艺，坚持手工采摘、传统炭焙，只为呈现每一丛茶树最本真的花果香韵。"一丛一味，百丛百香"——每一株茶树都有自己独特的香气密码，这正是凤凰单枞最迷人的地方。我们用心做好每一泡茶，让更多人品味到来自凤凰山的自然馈赠。',
  address: '广东省潮州市凤凰镇'
}

// ========== 数据获取函数 ==========
function getMockData(action, params) {
  switch (action) {
    // 首页数据
    case 'getHomeData':
      return {
        banners: mockBanners,
        hotProducts: mockProducts.filter(p => p.isHot && p.status === 1).slice(0, 6),
        categories: mockCategories.filter(c => c.status === 1),
        honeyProducts: mockHoneyProducts.filter(h => h.status === 1),
        siteConfig: mockSiteConfig
      }

    // 分类列表
    case 'getCategoryList':
      return mockCategories.filter(c => c.status === 1)

    // 轮播图
    case 'getBannerList':
      return mockBanners

    // 商品列表（支持 type/categoryId/keyword/分页）
    case 'getProductList': {
      let allProducts = [
        ...mockProducts.map(p => ({ ...p, type: p.type || 'tea' })),
        ...mockHoneyProducts
      ].filter(p => p.status === 1)

      // 按类型筛选
      if (params && params.type) {
        allProducts = allProducts.filter(p => p.type === params.type)
      }

      // 按分类筛选
      if (params && params.categoryId) {
        allProducts = allProducts.filter(p => p.categoryId === params.categoryId)
      }

      // 按关键词搜索
      if (params && params.keyword) {
        const kw = params.keyword.toLowerCase()
        allProducts = allProducts.filter(p =>
          p.name.toLowerCase().includes(kw) ||
          (p.tags && p.tags.some(t => t.includes(kw))) ||
          (p.brief && p.brief.toLowerCase().includes(kw))
        )
      }

      // 分页处理
      const page = (params && params.page) || 1
      const pageSize = (params && params.pageSize) || 20
      const start = (page - 1) * pageSize
      const list = allProducts.slice(start, start + pageSize)

      return { list, total: allProducts.length, page, pageSize }
    }

    // 商品详情（同时支持茶叶和蜂蜜）
    case 'getProductDetail': {
      const id = params && params.id
      const teaProduct = mockProducts.find(p => p.id === id)
      if (teaProduct) return { ...teaProduct, type: teaProduct.type || 'tea' }
      const honeyProduct = mockHoneyProducts.find(h => h.id === id)
      if (honeyProduct) return honeyProduct
      return mockProducts[0]
    }

    // 搜索商品
    case 'searchProducts': {
      const keyword = (params && params.keyword) || ''
      const allSearchable = [
        ...mockProducts.map(p => ({ ...p, type: p.type || 'tea' })),
        ...mockHoneyProducts
      ].filter(p => p.status === 1)
      const results = allSearchable.filter(p =>
        p.name.includes(keyword) ||
        (p.tags && p.tags.some(t => t.includes(keyword))) ||
        (p.brief && p.brief.includes(keyword))
      )
      return { list: results, total: results.length }
    }

    // 热门商品
    case 'getHotProducts':
      return mockProducts.filter(p => p.isHot && p.status === 1).slice(0, 6)

    // 新品
    case 'getNewProducts':
      return mockProducts.filter(p => p.isNew && p.status === 1).slice(0, 6)

    // 茶知识列表
    case 'getKnowledgeList': {
      const kPage = (params && params.page) || 1
      const kPageSize = (params && params.pageSize) || 20
      const kStart = (kPage - 1) * kPageSize
      const kList = mockKnowledge.slice(kStart, kStart + kPageSize)
      return { list: kList, total: mockKnowledge.length, page: kPage, pageSize: kPageSize }
    }

    // 茶知识详情
    case 'getKnowledgeDetail':
      return mockKnowledge.find(k => k.id === (params && params.id)) || mockKnowledge[0]

    // 站点配置
    case 'getSiteConfig':
      return mockSiteConfig

    default:
      return null
  }
}

module.exports = {
  mockCategories,
  mockProducts,
  mockHoneyProducts,
  mockBanners,
  mockKnowledge,
  mockSiteConfig,
  getMockData
}
