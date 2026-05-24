/**
 * 凤凰单枞 - 展示型小程序模拟数据
 * 品牌定位：潮汕凤凰单枞专业品牌
 */

// ========== 商品分类（三大分类） ==========
const mockCategories = [
  { id: 'cat_normal', name: '单枞茶', desc: '凤凰单枞经典香型', sort: 1, status: 1 },
  { id: 'cat_special', name: '特惠茶', desc: '茶头·茶包 经济实惠', sort: 2, status: 1 },
  { id: 'cat_farm', name: '农产品', desc: '山间好物 敬请期待', sort: 3, status: 1 }
]

// ========== 十大香型数据（用于发现页展示） ==========
const mockAromaTypes = [
  {
    id: 'aroma_1',
    name: '黄栀香',
    aromaFeature: '栀子花清甜芬芳，高扬持久，尾调带熟蜜桃甜香',
    representative: '宋种东方红、贡香、老仙翁',
    qualityFeature: '汤色金黄，滋味甘醇鲜爽，回甘力强，耐冲泡',
    yourProduct: '大乌叶'
  },
  {
    id: 'aroma_2',
    name: '芝兰香',
    aromaFeature: '清雅细长，似幽谷芝兰',
    representative: '八仙过海、宋种芝兰香',
    qualityFeature: '汤色橙黄明亮，滋味鲜爽甘醇，山韵明显',
    yourProduct: null
  },
  {
    id: 'aroma_3',
    name: '蜜兰香',
    aromaFeature: '蜜甜+兰香，番薯般甜润',
    representative: '香番薯、大庵蜜兰',
    qualityFeature: '甜润耐泡，"蜜韵"突出，饮后满口生香',
    yourProduct: '蜜兰香'
  },
  {
    id: 'aroma_4',
    name: '桂花香',
    aromaFeature: '馥郁桂花甜香，甜而不腻',
    representative: '桂花香单丛',
    qualityFeature: '条索紧卷纤细，汤色金黄明亮，山韵独特',
    yourProduct: null
  },
  {
    id: 'aroma_5',
    name: '玉兰香',
    aromaFeature: '高扬奔放，酷似玉兰花',
    representative: '金玉兰、娘仔伞',
    qualityFeature: '香气清幽持久，滋味醇厚',
    yourProduct: null
  },
  {
    id: 'aroma_6',
    name: '姜花香',
    aromaFeature: '辛辣似姜花（通天香）',
    representative: '通天香单丛',
    qualityFeature: '入口微辣，回甘迅猛，年底"返春"回香更佳',
    yourProduct: null
  },
  {
    id: 'aroma_7',
    name: '夜来香',
    aromaFeature: '浓郁夜来花香',
    representative: '夜来香单丛',
    qualityFeature: '香气独特，辨识度高',
    yourProduct: null
  },
  {
    id: 'aroma_8',
    name: '杏仁香',
    aromaFeature: '淡淡果仁香，回甘有力',
    representative: '杏仁香单丛',
    qualityFeature: '条索紧直纤细，灰褐色，韵味独特',
    yourProduct: '锯朵仔'
  },
  {
    id: 'aroma_9',
    name: '肉桂香',
    aromaFeature: '桂皮香+花果香复合',
    representative: '肉桂香单丛',
    qualityFeature: '滋味醇厚，有独特"桂韵"',
    yourProduct: null
  },
  {
    id: 'aroma_10',
    name: '银花香(鸭屎香)',
    aromaFeature: '金银花+奶香+杏仁香，层次分明',
    representative: '坪坑头银花香、大乌叶银花香',
    qualityFeature: '香气层次丰富，回甘持久，山韵明显',
    yourProduct: '鸭屎香'
  }
]

// ========== 商品数据（30款：单枞茶10 + 特惠茶10 + 农产品10） ==========
const mockProducts = [
  // ===== 单枞茶（cat_normal）10个 =====
  {
    id: 'prod_1',
    name: '蜜兰香',
    categoryId: 'cat_normal',
    categoryName: '单枞茶',
    aromaName: '蜜兰香',
    aromaFeature: '蜜甜+兰香，番薯般甜润，最受大众喜爱',
    price: 298,
    originalPrice: 368,
    weight: '500g',
    packTypes: ['袋装', '铁罐', '礼盒'],
    origin: '潮州凤凰山',
    altitude: '800m+',
    roast: '炭焙',
    season: '春茶',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡8-12次',
    description: '蜜兰香是凤凰单枞最受欢迎的香型，蜜香浓郁中带有兰花幽韵。采自凤凰山海拔800米以上高山茶园，传统炭焙工艺，茶汤蜜黄油润，入口蜜香馥郁，回甘生津，韵味悠长。',
    tags: ['高山', '炭焙', '春茶'],
    status: 1,
    isNew: true,
    isHot: true,
    sales: 342,
    brief: '凤凰单枞最受欢迎的香型，蜜香馥郁，回甘悠长',
    cover: 'https://picsum.photos/seed/nongchan8/600/600',
    imageUrl: 'https://picsum.photos/seed/nongchan7/600/600',
    imageTag: { text: '蜜兰香', bg: '#d4a017', textColor: '#ffffff' }
  },
  {
    id: 'prod_2',
    name: '鸭屎香（银花香）',
    categoryId: 'cat_normal',
    categoryName: '单枞茶',
    aromaName: '银花香（鸭屎香）',
    aromaFeature: '金银花+奶香+杏仁香，层次分明',
    price: 328,
    originalPrice: 428,
    weight: '500g',
    packTypes: ['袋装', '铁罐', '礼盒'],
    origin: '潮州凤凰山',
    altitude: '900m',
    roast: '炭焙',
    season: '春茶',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡8-12次',
    description: '鸭屎香，学名银花香，是凤凰单枞中最具话题性的香型。虽名字接地气，实则香气高雅，带有金银花的清甜、奶香的柔顺和杏仁香的回甘，层次丰富，令人回味无穷。',
    tags: ['高山', '炭焙', '春茶', '网红'],
    status: 1,
    isNew: true,
    isHot: true,
    sales: 528,
    brief: '名字接地气，香气高雅，金银花奶香杏仁香层次丰富',
    cover: 'https://picsum.photos/seed/nongchan6/600/600',
    imageUrl: 'https://picsum.photos/seed/nongchan5/600/600',
    imageTag: { text: '银花香', bg: '#9b8b6e', textColor: '#ffffff' }
  },
  {
    id: 'prod_3',
    name: '大乌叶',
    categoryId: 'cat_normal',
    categoryName: '单枞茶',
    aromaName: '黄栀香',
    aromaFeature: '栀子花清甜芬芳，高扬持久，尾调带熟蜜桃甜香',
    price: 198,
    originalPrice: 268,
    weight: '500g',
    packTypes: ['袋装', '铁罐', '礼盒'],
    origin: '潮州凤凰山',
    altitude: '600m',
    roast: '炭焙',
    season: '春茶',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡6-10次',
    description: '大乌叶因叶色深绿而得名，属黄栀香型。中山茶园出品，花香清雅，栀子花香气明显，滋味醇厚，性价比极高，是日常品饮的上佳之选。',
    tags: ['中山', '炭焙', '春茶', '性价比'],
    status: 1,
    isNew: false,
    isHot: true,
    sales: 456,
    brief: '黄栀香型代表，栀子花香清雅，性价比之选',
    cover: 'https://picsum.photos/seed/nongchan4/600/600',
    imageUrl: 'https://picsum.photos/seed/nongchan3/600/600',
    imageTag: { text: '黄栀香', bg: '#e6b422', textColor: '#ffffff' }
  },
  {
    id: 'prod_4',
    name: '锯朵仔',
    categoryId: 'cat_normal',
    categoryName: '单枞茶',
    aromaName: '杏仁香',
    aromaFeature: '淡淡果仁香，类似杏仁，回甘有力',
    price: 258,
    originalPrice: 328,
    weight: '500g',
    packTypes: ['袋装', '铁罐'],
    origin: '潮州凤凰山',
    altitude: '750m',
    roast: '炭焙',
    season: '春茶',
    brewTemp: '95-100℃',
    brewTime: '12-18秒/泡',
    brewCount: '可冲泡8-12次',
    description: '锯朵仔因叶缘锯齿明显而得名，属杏仁香型。带有天然杏仁果香，滋味醇厚，喉韵深远，回甘持久，是凤凰单枞中辨识度极高的品种。',
    tags: ['高山', '炭焙', '春茶'],
    status: 1,
    isNew: true,
    isHot: false,
    sales: 189,
    brief: '杏仁香型代表，天然果仁香，辨识度极高',
    cover: 'https://picsum.photos/seed/nongchan2/600/600',
    imageUrl: 'https://picsum.photos/seed/nongchan1/600/600',
    imageTag: { text: '杏仁香', bg: '#c9a86c', textColor: '#2d2520' }
  },
  {
    id: 'prod_5',
    name: '芝兰香',
    categoryId: 'cat_normal',
    categoryName: '单枞茶',
    aromaName: '芝兰香',
    aromaFeature: '清雅细长，似幽谷芝兰',
    price: 358,
    originalPrice: 458,
    weight: '500g',
    packTypes: ['袋装', '铁罐', '礼盒'],
    origin: '潮州凤凰山',
    altitude: '850m',
    roast: '炭焙',
    season: '春茶',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡8-12次',
    description: '芝兰香是凤凰单枞十大香型之一，香气清雅细长，似幽谷中盛开的芝兰花。采自海拔850米高山茶园，传统炭焙工艺，汤色橙黄明亮，滋味鲜爽甘醇，山韵明显。',
    tags: ['高山', '炭焙', '春茶'],
    status: 1,
    isNew: true,
    isHot: false,
    sales: 145,
    brief: '十大香型之一，清雅细长似幽谷芝兰',
    cover: 'https://picsum.photos/seed/fengmi2/600/600',
    imageUrl: 'https://picsum.photos/seed/fengmi1/600/600',
    imageTag: { text: '芝兰香', bg: '#8b7355', textColor: '#ffffff' }
  },
  {
    id: 'prod_6',
    name: '桂花香',
    categoryId: 'cat_normal',
    categoryName: '单枞茶',
    aromaName: '桂花香',
    aromaFeature: '馥郁桂花甜香，甜而不腻',
    price: 338,
    originalPrice: 418,
    weight: '500g',
    packTypes: ['袋装', '铁罐'],
    origin: '潮州凤凰山',
    altitude: '700m',
    roast: '炭焙',
    season: '春茶',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡8-12次',
    description: '桂花香单枞，馥郁桂花甜香，甜而不腻。条索紧卷纤细，汤色金黄明亮，山韵独特，是凤凰单枞中花果香型的经典代表。',
    tags: ['中山', '炭焙', '春茶'],
    status: 1,
    isNew: false,
    isHot: false,
    sales: 98,
    brief: '馥郁桂花甜香，甜而不腻，花果香型经典',
    cover: 'https://picsum.photos/seed/chabao4/600/600',
    imageUrl: 'https://picsum.photos/seed/chatou6/600/600',
    imageTag: { text: '桂花香', bg: '#d4883c', textColor: '#ffffff' }
  },
  {
    id: 'prod_7',
    name: '姜花香（通天香）',
    categoryId: 'cat_normal',
    categoryName: '单枞茶',
    aromaName: '姜花香',
    aromaFeature: '辛辣似姜花（通天香）',
    price: 388,
    originalPrice: 488,
    weight: '500g',
    packTypes: ['袋装', '铁罐', '礼盒'],
    origin: '潮州凤凰山',
    altitude: '900m',
    roast: '炭焙',
    season: '春茶',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡8-12次',
    description: '姜花香，又名通天香，是凤凰单枞中极为稀缺的香型。入口微辣似姜花，回甘迅猛，年底"返春"回香更佳。产量稀少，可遇不可求。',
    tags: ['高山', '炭焙', '春茶', '稀缺'],
    status: 1,
    isNew: true,
    isHot: false,
    sales: 76,
    brief: '又名通天香，稀缺香型，入口微辣回甘迅猛',
    cover: 'https://picsum.photos/seed/chabao3/600/600',
    imageUrl: 'https://picsum.photos/seed/chatou5/600/600',
    imageTag: { text: '姜花香', bg: '#a0452e', textColor: '#ffffff' }
  },
  {
    id: 'prod_8',
    name: '蜜兰香·二春',
    categoryId: 'cat_normal',
    categoryName: '单枞茶',
    aromaName: '蜜兰香',
    aromaFeature: '蜜甜+兰香，番薯般甜润',
    price: 228,
    originalPrice: 298,
    weight: '500g',
    packTypes: ['袋装', '铁罐'],
    origin: '潮州凤凰山',
    altitude: '600m',
    roast: '电焙',
    season: '二春',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡6-10次',
    description: '蜜兰香二春茶，中山茶园出品，电焙工艺。虽为二春采摘，仍保留蜜兰香的经典风味，蜜甜兰香，番薯般甜润，性价比极高，适合日常大量饮用。',
    tags: ['中山', '电焙', '二春', '性价比'],
    status: 1,
    isNew: false,
    isHot: true,
    sales: 289,
    brief: '蜜兰香二春，经典风味性价比之选',
    cover: 'https://picsum.photos/seed/chabao2/600/600',
    imageUrl: 'https://picsum.photos/seed/chatou4/600/600',
    imageTag: { text: '蜜兰香', bg: '#d4a017', textColor: '#ffffff' }
  },
  {
    id: 'prod_9',
    name: '大乌叶·二春',
    categoryId: 'cat_normal',
    categoryName: '单枞茶',
    aromaName: '黄栀香',
    aromaFeature: '栀子花清甜芬芳',
    price: 158,
    originalPrice: 218,
    weight: '500g',
    packTypes: ['袋装'],
    origin: '潮州凤凰山',
    altitude: '500m',
    roast: '电焙',
    season: '二春',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡6-8次',
    description: '大乌叶二春茶，低山茶园出品，电焙工艺。栀子花清甜芬芳，滋味醇和，价格实惠，是入门单枞茶的理想选择。',
    tags: ['低山', '电焙', '二春', '实惠'],
    status: 1,
    isNew: false,
    isHot: false,
    sales: 178,
    brief: '黄栀香型二春，栀子花香，入门实惠之选',
    cover: 'https://picsum.photos/seed/chatou3/600/600',
    imageUrl: 'https://picsum.photos/seed/chatou2/600/600',
    imageTag: { text: '黄栀香', bg: '#e6b422', textColor: '#ffffff' }
  },
  {
    id: 'prod_10',
    name: '鸭屎香·高山',
    categoryId: 'cat_normal',
    categoryName: '单枞茶',
    aromaName: '银花香（鸭屎香）',
    aromaFeature: '金银花+奶香+杏仁香，层次分明',
    price: 428,
    originalPrice: 528,
    weight: '500g',
    packTypes: ['袋装', '铁罐', '礼盒'],
    origin: '潮州凤凰山乌岽村',
    altitude: '1100m',
    roast: '炭焙',
    season: '春茶',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡10-15次',
    description: '鸭屎香高山版，采自凤凰山乌岽村海拔1100米古树茶园。金银花、奶香、杏仁香层次分明，山韵极强，耐冲泡，是鸭屎香中的顶级之作。',
    tags: ['乌岽', '古树', '炭焙', '春茶', '顶级'],
    status: 1,
    isNew: true,
    isHot: true,
    sales: 98,
    brief: '乌岽古树高山版，鸭屎香顶级之作',
    cover: 'https://picsum.photos/seed/chabao1/600/600',
    imageUrl: 'https://picsum.photos/seed/chatou1/600/600',
    imageTag: { text: '银花香', bg: '#9b8b6e', textColor: '#ffffff' }
  },

  // ===== 特惠茶（cat_special）10个 =====
  // 茶头1-5
  {
    id: 'prod_11',
    name: '茶头1',
    categoryId: 'cat_special',
    categoryName: '特惠茶',
    aromaName: '',
    aromaFeature: '',
    price: 68,
    originalPrice: 98,
    weight: '500g',
    packTypes: ['袋装'],
    origin: '潮州凤凰山',
    altitude: '800m',
    roast: '炭焙',
    season: '春茶',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡6-8次',
    description: '精挑细选中拣出的茶叶，品质优良，价格实惠。',
    tags: ['精拣', '实惠', '袋装'],
    status: 1,
    isNew: false,
    isHot: false,
    sales: 234,
    brief: '精拣茶叶，品质优良，价格实惠',
    cover: 'https://picsum.photos/seed/yashixiang2/600/600',
    imageUrl: 'https://picsum.photos/seed/dawuye2/600/600',
    imageTag: { text: '特惠', bg: '#e74c3c', textColor: '#ffffff' }
  },
  {
    id: 'prod_12',
    name: '茶头2',
    categoryId: 'cat_special',
    categoryName: '特惠茶',
    aromaName: '',
    aromaFeature: '',
    price: 88,
    originalPrice: 128,
    weight: '500g',
    packTypes: ['袋装'],
    origin: '潮州凤凰山',
    altitude: '800m',
    roast: '炭焙',
    season: '春茶',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡6-8次',
    description: '春茶精拣茶头，精选春茶茶青中拣出的大叶茶，品质优良，春韵十足，价格实惠。',
    tags: ['精拣', '春茶', '实惠'],
    status: 1,
    isNew: false,
    isHot: false,
    sales: 156,
    brief: '春茶精拣茶头，春韵十足，实惠之选',
    cover: 'https://picsum.photos/seed/guihuaxiang1/600/600',
    imageUrl: 'https://picsum.photos/seed/zhilanxiang1/600/600',
    imageTag: { text: '特惠', bg: '#e74c3c', textColor: '#ffffff' }
  },
  {
    id: 'prod_13',
    name: '茶头3',
    categoryId: 'cat_special',
    categoryName: '特惠茶',
    aromaName: '',
    aromaFeature: '',
    price: 58,
    originalPrice: 88,
    weight: '500g',
    packTypes: ['袋装'],
    origin: '潮州凤凰山',
    altitude: '600m',
    roast: '电焙',
    season: '二春',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡5-7次',
    description: '二春茶头，电焙工艺，精拣出品。价格更加实惠，滋味醇和，适合日常大量饮用。',
    tags: ['精拣', '二春', '实惠'],
    status: 1,
    isNew: false,
    isHot: false,
    sales: 89,
    brief: '二春精拣茶头，电焙工艺，超值实惠',
    cover: 'https://picsum.photos/seed/nongchan6/600/600',
    imageUrl: 'https://picsum.photos/seed/nongchan5/600/600',
    imageTag: { text: '特惠', bg: '#e74c3c', textColor: '#ffffff' }
  },
  {
    id: 'prod_14',
    name: '茶头4',
    categoryId: 'cat_special',
    categoryName: '特惠茶',
    aromaName: '',
    aromaFeature: '',
    price: 128,
    originalPrice: 188,
    weight: '1000g',
    packTypes: ['袋装'],
    origin: '潮州凤凰山',
    altitude: '800m',
    roast: '炭焙',
    season: '春茶',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡6-8次',
    description: '春茶精拣茶头大份装，1000g加量装，品质优良，单价更低，适合茶叶消耗量大的茶友。',
    tags: ['精拣', '大份', '实惠'],
    status: 1,
    isNew: false,
    isHot: false,
    sales: 67,
    brief: '1000g大份装茶头，单价更低更实惠',
    cover: 'https://picsum.photos/seed/nongchan2/600/600',
    imageUrl: 'https://picsum.photos/seed/nongchan1/600/600',
    imageTag: { text: '特惠', bg: '#e74c3c', textColor: '#ffffff' }
  },
  {
    id: 'prod_15',
    name: '茶头5',
    categoryId: 'cat_special',
    categoryName: '特惠茶',
    aromaName: '',
    aromaFeature: '',
    price: 38,
    originalPrice: 58,
    weight: '250g',
    packTypes: ['袋装'],
    origin: '潮州凤凰山',
    altitude: '600m',
    roast: '电焙',
    season: '二春',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡5-7次',
    description: '小份装茶头，250g尝鲜装，价格实惠，适合初次尝试的茶友。',
    tags: ['精拣', '小份', '尝鲜'],
    status: 1,
    isNew: false,
    isHot: false,
    sales: 45,
    brief: '250g小份装茶头，尝鲜首选',
    cover: 'https://picsum.photos/seed/fengmi2/600/600',
    imageUrl: 'https://picsum.photos/seed/fengmi1/600/600',
    imageTag: { text: '特惠', bg: '#e74c3c', textColor: '#ffffff' }
  },
  // 茶包6-10
  {
    id: 'prod_16',
    name: '茶包6',
    categoryId: 'cat_special',
    categoryName: '特惠茶',
    aromaName: '',
    aromaFeature: '',
    price: 38,
    originalPrice: 58,
    weight: '500g',
    packTypes: ['袋装'],
    origin: '潮州凤凰山',
    altitude: '800m',
    roast: '炭焙',
    season: '春茶',
    brewTemp: '95-100℃',
    brewTime: '15-20秒/泡',
    brewCount: '可冲泡5-7次',
    description: '茶叶运输中自然碎裂的小颗粒，装袋饮用，经济实惠。',
    tags: ['碎茶', '实惠', '袋装', '日常'],
    status: 1,
    isNew: false,
    isHot: false,
    sales: 367,
    brief: '碎茶装袋，经济实惠，日常饮用好选择',
    cover: 'https://picsum.photos/seed/milanxiang2/600/600',
    imageUrl: 'https://picsum.photos/seed/jianghuaxiang1/600/600',
    imageTag: { text: '特惠', bg: '#e74c3c', textColor: '#ffffff' }
  },
  {
    id: 'prod_17',
    name: '茶包7',
    categoryId: 'cat_special',
    categoryName: '特惠茶',
    aromaName: '',
    aromaFeature: '',
    price: 48,
    originalPrice: 68,
    weight: '500g',
    packTypes: ['袋装'],
    origin: '潮州凤凰山',
    altitude: '800m',
    roast: '炭焙',
    season: '春茶',
    brewTemp: '95-100℃',
    brewTime: '15-20秒/泡',
    brewCount: '可冲泡5-7次',
    description: '春茶碎茶茶包，精选春茶中自然碎裂的茶叶，春韵不减，经济实惠，适合日常大量饮用。',
    tags: ['碎茶', '春茶', '实惠'],
    status: 1,
    isNew: false,
    isHot: false,
    sales: 201,
    brief: '春茶碎茶茶包，春韵不减经济实惠',
    cover: 'https://picsum.photos/seed/yashixiang1/600/600',
    imageUrl: 'https://picsum.photos/seed/milanxiang1/600/600',
    imageTag: { text: '特惠', bg: '#e74c3c', textColor: '#ffffff' }
  },
  {
    id: 'prod_18',
    name: '茶包8',
    categoryId: 'cat_special',
    categoryName: '特惠茶',
    aromaName: '',
    aromaFeature: '',
    price: 28,
    originalPrice: 48,
    weight: '500g',
    packTypes: ['袋装'],
    origin: '潮州凤凰山',
    altitude: '600m',
    roast: '电焙',
    season: '二春',
    brewTemp: '95-100℃',
    brewTime: '15-20秒/泡',
    brewCount: '可冲泡4-6次',
    description: '二春碎茶茶包，电焙工艺，价格最实惠。适合日常大量饮用，经济型口粮茶首选。',
    tags: ['碎茶', '二春', '实惠'],
    status: 1,
    isNew: false,
    isHot: false,
    sales: 134,
    brief: '二春碎茶茶包，价格最实惠的口粮茶',
    cover: 'https://picsum.photos/seed/nongchan4/600/600',
    imageUrl: 'https://picsum.photos/seed/nongchan3/600/600',
    imageTag: { text: '特惠', bg: '#e74c3c', textColor: '#ffffff' }
  },
  {
    id: 'prod_19',
    name: '茶包9',
    categoryId: 'cat_special',
    categoryName: '特惠茶',
    aromaName: '',
    aromaFeature: '',
    price: 68,
    originalPrice: 108,
    weight: '1000g',
    packTypes: ['袋装'],
    origin: '潮州凤凰山',
    altitude: '800m',
    roast: '炭焙',
    season: '春茶',
    brewTemp: '95-100℃',
    brewTime: '15-20秒/泡',
    brewCount: '可冲泡5-7次',
    description: '春茶碎茶茶包大份装，1000g加量装，经济实惠，日常饮用不心疼，口粮茶首选。',
    tags: ['碎茶', '大份', '实惠'],
    status: 1,
    isNew: false,
    isHot: false,
    sales: 92,
    brief: '1000g大份装茶包，口粮茶首选',
    cover: 'https://picsum.photos/seed/juduozai1/600/600',
    imageUrl: 'https://picsum.photos/seed/dawuye1/600/600',
    imageTag: { text: '特惠', bg: '#e74c3c', textColor: '#ffffff' }
  },
  {
    id: 'prod_20',
    name: '茶包10',
    categoryId: 'cat_special',
    categoryName: '特惠茶',
    aromaName: '',
    aromaFeature: '',
    price: 18,
    originalPrice: 28,
    weight: '250g',
    packTypes: ['袋装'],
    origin: '潮州凤凰山',
    altitude: '600m',
    roast: '电焙',
    season: '二春',
    brewTemp: '95-100℃',
    brewTime: '15-20秒/泡',
    brewCount: '可冲泡4-6次',
    description: '小份装茶包，250g尝鲜装，价格最实惠，适合初次尝试的茶友。',
    tags: ['碎茶', '小份', '尝鲜'],
    status: 1,
    isNew: false,
    isHot: false,
    sales: 56,
    brief: '250g小份装茶包，尝鲜首选',
    cover: 'https://picsum.photos/seed/nongchan8/600/600',
    imageUrl: 'https://picsum.photos/seed/nongchan7/600/600',
    imageTag: { text: '特惠', bg: '#e74c3c', textColor: '#ffffff' }
  },

  // ===== 农产品（cat_farm）10个（预留，显示敬请期待） =====
  {
    id: 'prod_21',
    name: '凤凰山荔枝蜜',
    categoryId: 'cat_farm',
    categoryName: '农产品',
    aromaName: '',
    aromaFeature: '',
    price: 128,
    originalPrice: 168,
    weight: '500g',
    packTypes: ['罐装'],
    origin: '潮州凤凰山',
    altitude: '',
    roast: '',
    season: '',
    brewTemp: '',
    brewTime: '',
    brewCount: '',
    description: '凤凰山荔枝蜜，采自凤凰山荔枝花蜜，清甜馥郁，天然纯正。',
    tags: ['蜂蜜', '天然'],
    status: 1,
    isNew: true,
    isHot: false,
    sales: 0,
    brief: '凤凰山荔枝花蜜，清甜馥郁天然纯正',
    cover: 'https://picsum.photos/seed/chabao4/600/600',
    imageUrl: 'https://picsum.photos/seed/chatou6/600/600'
  },
  {
    id: 'prod_22',
    name: '凤凰山龙眼蜜',
    categoryId: 'cat_farm',
    categoryName: '农产品',
    aromaName: '',
    aromaFeature: '',
    price: 118,
    originalPrice: 158,
    weight: '500g',
    packTypes: ['罐装'],
    origin: '潮州凤凰山',
    altitude: '',
    roast: '',
    season: '',
    brewTemp: '',
    brewTime: '',
    brewCount: '',
    description: '凤凰山龙眼蜜，采自凤凰山龙眼花蜜，浓稠甘甜，回味悠长。',
    tags: ['蜂蜜', '天然'],
    status: 1,
    isNew: true,
    isHot: false,
    sales: 0,
    brief: '凤凰山龙眼花蜜，浓稠甘甜回味悠长',
    cover: 'https://picsum.photos/seed/chabao3/600/600',
    imageUrl: 'https://picsum.photos/seed/chatou5/600/600'
  },
  {
    id: 'prod_23',
    name: '凤凰山百花蜜',
    categoryId: 'cat_farm',
    categoryName: '农产品',
    aromaName: '',
    aromaFeature: '',
    price: 98,
    originalPrice: 138,
    weight: '500g',
    packTypes: ['罐装'],
    origin: '潮州凤凰山',
    altitude: '',
    roast: '',
    season: '',
    brewTemp: '',
    brewTime: '',
    brewCount: '',
    description: '凤凰山百花蜜，采集凤凰山多种山花蜜酿造，花香丰富，营养全面。',
    tags: ['蜂蜜', '天然'],
    status: 1,
    isNew: true,
    isHot: false,
    sales: 0,
    brief: '凤凰山百花蜜，多种山花酿造营养全面',
    cover: 'https://picsum.photos/seed/chabao2/600/600',
    imageUrl: 'https://picsum.photos/seed/chatou4/600/600'
  },
  {
    id: 'prod_24',
    name: '凤凰山冬蜜',
    categoryId: 'cat_farm',
    categoryName: '农产品',
    aromaName: '',
    aromaFeature: '',
    price: 168,
    originalPrice: 218,
    weight: '500g',
    packTypes: ['罐装'],
    origin: '潮州凤凰山',
    altitude: '',
    roast: '',
    season: '',
    brewTemp: '',
    brewTime: '',
    brewCount: '',
    description: '凤凰山冬蜜，冬季鸭脚木花蜜，产量稀少，品质上乘，滋补佳品。',
    tags: ['蜂蜜', '冬蜜', '稀有'],
    status: 1,
    isNew: true,
    isHot: false,
    sales: 0,
    brief: '冬季鸭脚木花蜜，产量稀少滋补佳品',
    cover: 'https://picsum.photos/seed/chatou3/600/600',
    imageUrl: 'https://picsum.photos/seed/chatou2/600/600'
  },
  {
    id: 'prod_25',
    name: '凤凰山荔枝蜜·大份',
    categoryId: 'cat_farm',
    categoryName: '农产品',
    aromaName: '',
    aromaFeature: '',
    price: 228,
    originalPrice: 298,
    weight: '1000g',
    packTypes: ['罐装'],
    origin: '潮州凤凰山',
    altitude: '',
    roast: '',
    season: '',
    brewTemp: '',
    brewTime: '',
    brewCount: '',
    description: '凤凰山荔枝蜜大份装，1000g家庭装，清甜馥郁，天然纯正，性价比更高。',
    tags: ['蜂蜜', '大份'],
    status: 1,
    isNew: true,
    isHot: false,
    sales: 0,
    brief: '1000g大份装荔枝蜜，家庭装性价比更高',
    cover: 'https://picsum.photos/seed/chabao1/600/600',
    imageUrl: 'https://picsum.photos/seed/chatou1/600/600'
  },
  {
    id: 'prod_26',
    name: '凤凰山龙眼蜜·大份',
    categoryId: 'cat_farm',
    categoryName: '农产品',
    aromaName: '',
    aromaFeature: '',
    price: 218,
    originalPrice: 288,
    weight: '1000g',
    packTypes: ['罐装'],
    origin: '潮州凤凰山',
    altitude: '',
    roast: '',
    season: '',
    brewTemp: '',
    brewTime: '',
    brewCount: '',
    description: '凤凰山龙眼蜜大份装，1000g家庭装，浓稠甘甜，回味悠长，性价比更高。',
    tags: ['蜂蜜', '大份'],
    status: 1,
    isNew: true,
    isHot: false,
    sales: 0,
    brief: '1000g大份装龙眼蜜，家庭装性价比更高',
    cover: 'https://picsum.photos/seed/yashixiang2/600/600',
    imageUrl: 'https://picsum.photos/seed/dawuye2/600/600'
  },
  {
    id: 'prod_27',
    name: '凤凰山百花蜜·大份',
    categoryId: 'cat_farm',
    categoryName: '农产品',
    aromaName: '',
    aromaFeature: '',
    price: 178,
    originalPrice: 238,
    weight: '1000g',
    packTypes: ['罐装'],
    origin: '潮州凤凰山',
    altitude: '',
    roast: '',
    season: '',
    brewTemp: '',
    brewTime: '',
    brewCount: '',
    description: '凤凰山百花蜜大份装，1000g家庭装，花香丰富，营养全面，性价比更高。',
    tags: ['蜂蜜', '大份'],
    status: 1,
    isNew: true,
    isHot: false,
    sales: 0,
    brief: '1000g大份装百花蜜，家庭装性价比更高',
    cover: 'https://picsum.photos/seed/milanxiang2/600/600',
    imageUrl: 'https://picsum.photos/seed/jianghuaxiang1/600/600'
  },
  {
    id: 'prod_28',
    name: '凤凰山冬蜜·大份',
    categoryId: 'cat_farm',
    categoryName: '农产品',
    aromaName: '',
    aromaFeature: '',
    price: 318,
    originalPrice: 398,
    weight: '1000g',
    packTypes: ['罐装'],
    origin: '潮州凤凰山',
    altitude: '',
    roast: '',
    season: '',
    brewTemp: '',
    brewTime: '',
    brewCount: '',
    description: '凤凰山冬蜜大份装，1000g家庭装，冬季鸭脚木花蜜，产量稀少，滋补佳品。',
    tags: ['蜂蜜', '大份', '稀有'],
    status: 1,
    isNew: true,
    isHot: false,
    sales: 0,
    brief: '1000g大份装冬蜜，稀有滋补佳品',
    cover: 'https://picsum.photos/seed/guihuaxiang1/600/600',
    imageUrl: 'https://picsum.photos/seed/zhilanxiang1/600/600'
  },
  {
    id: 'prod_29',
    name: '凤凰山土蜂蜜',
    categoryId: 'cat_farm',
    categoryName: '农产品',
    aromaName: '',
    aromaFeature: '',
    price: 198,
    originalPrice: 258,
    weight: '500g',
    packTypes: ['罐装'],
    origin: '潮州凤凰山',
    altitude: '',
    roast: '',
    season: '',
    brewTemp: '',
    brewTime: '',
    brewCount: '',
    description: '凤凰山土蜂蜜，中华蜜蜂采集山野百花酿造，野生放养，蜜香浓郁，营养珍贵。',
    tags: ['蜂蜜', '土蜂蜜', '野生'],
    status: 1,
    isNew: true,
    isHot: false,
    sales: 0,
    brief: '中华蜜蜂山野百花酿造，野生放养营养珍贵',
    cover: 'https://picsum.photos/seed/juduozai1/600/600',
    imageUrl: 'https://picsum.photos/seed/dawuye1/600/600'
  },
  {
    id: 'prod_30',
    name: '凤凰山蜂巢蜜',
    categoryId: 'cat_farm',
    categoryName: '农产品',
    aromaName: '',
    aromaFeature: '',
    price: 258,
    originalPrice: 328,
    weight: '500g',
    packTypes: ['罐装'],
    origin: '潮州凤凰山',
    altitude: '',
    roast: '',
    season: '',
    brewTemp: '',
    brewTime: '',
    brewCount: '',
    description: '凤凰山蜂巢蜜，天然蜂巢原块切割，含蜂蜡和蜂蜜，口感独特，嚼着吃更有趣。',
    tags: ['蜂蜜', '蜂巢', '天然'],
    status: 1,
    isNew: true,
    isHot: false,
    sales: 0,
    brief: '天然蜂巢原块切割，含蜂蜡口感独特',
    cover: 'https://picsum.photos/seed/yashixiang1/600/600',
    imageUrl: 'https://picsum.photos/seed/milanxiang1/600/600'
  }
]

// ========== 轮播图 ==========
const mockBanners = [
  { id: 'b1', imageUrl: 'https://picsum.photos/seed/teaban3/750/480', link: '/pages/product/list', title: '凤凰单枞·十大香型', description: '一丛一味，百丛百香' },
  { id: 'b2', imageUrl: 'https://picsum.photos/seed/teaban2/750/480', link: '/pages/product/list', title: '高山炭焙·匠心之作', description: '传统工艺，自然馈赠' },
  { id: 'b3', imageUrl: 'https://picsum.photos/seed/teaban1/750/480', link: '/pages/product/list', title: '春茶上新·鲜韵初绽', description: '高山春茶，限量发售' }
]

// ========== 茶知识 ==========
const mockKnowledge = [
  {
    id: 'k1',
    title: '凤凰单枞十大香型全解',
    category: '香型介绍',
    summary: '一丛一味，百丛百香——详解凤凰单枞十大主流香型的香气特征、代表品种与品质特点',
    content: '<h3>凤凰单枞十大主流香型全解</h3><p>凤凰单枞，产于广东省潮州市凤凰山，是乌龙茶中的极品，以"一丛一味、百丛百香"著称于世。每一株茶树因品种、树龄、海拔、土壤、工艺的不同，都能孕育出独一无二的香气。以下为十大主流香型详解：</p><h4>一、黄栀香</h4><p><b>香气特征：</b>栀子花清甜芬芳，高扬持久，尾调带熟蜜桃甜香。</p><p><b>代表品种：</b>宋种东方红、贡香、老仙翁。</p><p><b>品质特点：</b>汤色金黄，滋味甘醇鲜爽，回甘力强，耐冲泡。</p><h4>二、芝兰香</h4><p><b>香气特征：</b>清雅细长，似幽谷芝兰。</p><p><b>代表品种：</b>八仙过海、宋种芝兰香。</p><p><b>品质特点：</b>汤色橙黄明亮，滋味鲜爽甘醇，山韵明显。</p><h4>三、蜜兰香</h4><p><b>香气特征：</b>蜜甜+兰香，番薯般甜润。</p><p><b>代表品种：</b>香番薯、大庵蜜兰。</p><p><b>品质特点：</b>甜润耐泡，"蜜韵"突出，饮后满口生香。</p><h4>四、桂花香</h4><p><b>香气特征：</b>馥郁桂花甜香，甜而不腻。</p><p><b>代表品种：</b>桂花香单丛。</p><p><b>品质特点：</b>条索紧卷纤细，汤色金黄明亮，山韵独特。</p><h4>五、玉兰香</h4><p><b>香气特征：</b>高扬奔放，酷似玉兰花。</p><p><b>代表品种：</b>金玉兰、娘仔伞。</p><p><b>品质特点：</b>香气清幽持久，滋味醇厚。</p><h4>六、姜花香</h4><p><b>香气特征：</b>辛辣似姜花（通天香）。</p><p><b>代表品种：</b>通天香单丛。</p><p><b>品质特点：</b>入口微辣，回甘迅猛，年底"返春"回香更佳。</p><h4>七、夜来香</h4><p><b>香气特征：</b>浓郁夜来花香。</p><p><b>代表品种：</b>夜来香单丛。</p><p><b>品质特点：</b>香气独特，辨识度高。</p><h4>八、杏仁香</h4><p><b>香气特征：</b>淡淡果仁香，回甘有力。</p><p><b>代表品种：</b>杏仁香单丛。</p><p><b>品质特点：</b>条索紧直纤细，灰褐色，韵味独特。</p><h4>九、肉桂香</h4><p><b>香气特征：</b>桂皮香+花果香复合。</p><p><b>代表品种：</b>肉桂香单丛。</p><p><b>品质特点：</b>滋味醇厚，有独特"桂韵"。</p><h4>十、银花香（鸭屎香）</h4><p><b>香气特征：</b>金银花+奶香+杏仁香，层次分明。</p><p><b>代表品种：</b>坪坑头银花香、大乌叶银花香。</p><p><b>品质特点：</b>香气层次丰富，回甘持久，山韵明显。</p>',
    views: 3280,
    createTime: '2024-01-15'
  },
  {
    id: 'k2',
    title: '如何冲泡凤凰单枞',
    category: '冲泡技巧',
    summary: '高冲低斟，工夫茶法，详解凤凰单枞冲泡要领',
    content: '<h3>工夫茶冲泡法</h3><p>凤凰单枞讲究"高冲低斟"，使用盖碗或紫砂壶冲泡，方能充分激发其花果香韵。</p><h4>一、器具准备</h4><p>推荐使用白瓷盖碗（120ml）或朱泥紫砂壶，搭配公道杯和品茗杯。</p><h4>二、投茶量</h4><p>盖碗约7-8g（约盖碗容量的1/2至2/3），根据个人口味可适当增减。</p><h4>三、水温控制</h4><p>沸水冲泡，水温95-100℃。高山老丛可用100℃沸水激发香气。</p><h4>四、冲泡步骤</h4><p>1. <b>温杯烫壶：</b>用沸水将茶具预热<br/>2. <b>洗茶醒茶：</b>第一泡快速出汤（3-5秒），不饮用<br/>3. <b>正式冲泡：</b>第二泡开始，每泡浸泡10-15秒<br/>4. <b>逐泡递增：</b>从第三泡起每泡增加3-5秒<br/>5. <b>高冲低斟：</b>注水时壶提高，出汤时壶放低</p><h4>五、品饮要点</h4><p>先闻杯盖香，再观汤色，小口啜饮，感受香气在口腔中的层次变化。好的单枞茶"七泡有余香"，耐冲泡是其重要品质指标。</p>',
    views: 2356,
    createTime: '2024-01-20'
  },
  {
    id: 'k3',
    title: '高山茶与中山茶的区别',
    category: '茶叶鉴别',
    summary: '海拔越高品质越好？详解高山茶与中山茶差异',
    content: '<h3>高山茶 vs 中山茶</h3><p>凤凰山海拔差异显著，不同海拔的茶园所产茶叶品质差异明显。了解这些差异，有助于您选择适合自己的茶叶。</p><h4>高山茶（800m以上）</h4><p>• 香气更高扬持久<br/>• 滋味更醇厚甘甜<br/>• 山韵更明显<br/>• 耐冲泡程度更高<br/>• 代表产区：乌岽山、大庵村</p><h4>中山茶（500-800m）</h4><p>• 香气清雅适中<br/>• 滋味醇和平衡<br/>• 性价比高<br/>• 适合日常品饮</p><h4>如何选择？</h4><p><b>送礼/品鉴：</b>推荐高山茶，香气和口感更出色，适合细细品味。<br/><b>日常饮用：</b>中山茶性价比更高，品质也不差，适合每天喝。<br/><b>入门体验：</b>可从中山茶开始，逐步感受不同海拔带来的风味差异。</p><h4>总结</h4><p>海拔并非唯一标准，工艺水平和树龄同样重要。一棵中山老丛的品质可能远超高山新树。选茶的关键在于"适口为珍"，找到自己喜欢的味道才是最好的。</p>',
    views: 890,
    createTime: '2024-02-01'
  }
]

// ========== 站点配置 ==========
const mockSiteConfig = {
  brandName: '凤凰单枞',
  slogan: '一丛一味 百丛百香',
  wechat: '',
  phone: '',
  about: '源自潮州凤凰山，专注单枞茶。我们精选高山茶园优质茶青，传统炭焙工艺，为您呈现最纯正的凤凰单枞韵味。',
  address: '广东省潮州市凤凰镇',
  // 商品详情页联系区域配置
  productContactTitle: '品茶咨询',
  productContactDesc: '添加微信，了解更多详情',
  productContactBtnText: '复制微信号'
}

// ========== 数据获取函数 ==========
function getMockData(action, params) {
  switch (action) {
    // 首页聚合数据
    case 'getHomeData':
      return {
        banners: mockBanners,
        hotProducts: mockProducts.filter(p => p.isHot && p.status === 1).slice(0, 6),
        categories: mockCategories.filter(c => c.status === 1),
        siteConfig: mockSiteConfig
      }

    // 商品列表（支持 categoryId/type/season/packType/keyword/分页）
    case 'getProductList': {
      let list = mockProducts.filter(p => p.status === 1)

      // 按分类筛选
      if (params && params.categoryId) {
        list = list.filter(p => p.categoryId === params.categoryId)
      }

      // 按类型筛选（normal/special/farm）
      if (params && params.type) {
        const typeMap = {
          normal: 'cat_normal',
          special: 'cat_special',
          farm: 'cat_farm'
        }
        const catId = typeMap[params.type]
        if (catId) {
          list = list.filter(p => p.categoryId === catId)
        }
      }

      // 按采摘季节筛选
      if (params && params.season) {
        const seasonMap = {
          spring: '春茶',
          second_spring: '二春'
        }
        const seasonName = seasonMap[params.season]
        if (seasonName) {
          list = list.filter(p => p.season === seasonName)
        }
      }

      // 按包装类型筛选
      if (params && params.packType) {
        const packMap = {
          bag: '袋装',
          can: '铁罐',
          gift: '礼盒'
        }
        const packName = packMap[params.packType]
        if (packName) {
          list = list.filter(p => p.packTypes && p.packTypes.includes(packName))
        }
      }

      // 按关键词搜索
      if (params && params.keyword) {
        const kw = params.keyword.toLowerCase()
        list = list.filter(p =>
          p.name.toLowerCase().includes(kw) ||
          (p.aromaName && p.aromaName.toLowerCase().includes(kw)) ||
          (p.tags && p.tags.some(t => t.includes(kw))) ||
          (p.description && p.description.toLowerCase().includes(kw))
        )
      }

      // 分页处理
      const page = (params && params.page) || 1
      const pageSize = (params && params.pageSize) || 20
      const total = list.length
      const start = (page - 1) * pageSize
      const pagedList = list.slice(start, start + pageSize)

      return { list: pagedList, total, page, pageSize }
    }

    // 商品详情
    case 'getProductDetail': {
      const id = params && params.id
      const product = mockProducts.find(p => p.id === id)
      return product || mockProducts[0]
    }

    // 分类列表
    case 'getCategoryList':
      return mockCategories.filter(c => c.status === 1)

    // 香型列表（发现页用）
    case 'getAromaTypes':
      return mockAromaTypes

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

    // 轮播图列表
    case 'getBannerList':
      return mockBanners

    // 热门商品
    case 'getHotProducts':
      return mockProducts.filter(p => p.isHot && p.status === 1).slice(0, 6)

    default:
      return null
  }
}

module.exports = {
  mockCategories,
  mockAromaTypes,
  mockProducts,
  mockBanners,
  mockKnowledge,
  mockSiteConfig,
  getMockData
}
