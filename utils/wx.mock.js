/**
 * 凤凰单枞 - 展示型小程序数据
 * 品牌定位：潮汕凤凰单枞专业品牌
 */

// ========== 十大香型分类 ==========
const mockCategories = [
  { id: 'cat_1', name: '黄栀香', icon: '', sort: 1, status: 1, desc: '最经典香型，花香清雅' },
  { id: 'cat_2', name: '芝兰香', icon: '', sort: 2, status: 1, desc: '幽兰香气，清高持久' },
  { id: 'cat_3', name: '蜜兰香', icon: '', sort: 3, status: 1, desc: '蜜香浓郁，受众最广' },
  { id: 'cat_4', name: '桂花香', icon: '', sort: 4, status: 1, desc: '桂花香气，清甜高雅' },
  { id: 'cat_5', name: '玉兰香', icon: '', sort: 5, status: 1, desc: '白兰花香，山韵明显' },
  { id: 'cat_6', name: '姜花香', icon: '', sort: 6, status: 1, desc: '生姜辛辣感，独特辨识' },
  { id: 'cat_7', name: '夜来香', icon: '', sort: 7, status: 1, desc: '夜间尤显馥郁' },
  { id: 'cat_8', name: '杏仁香', icon: '', sort: 8, status: 1, desc: '杏仁果香，喉韵深远' },
  { id: 'cat_9', name: '肉桂香', icon: '', sort: 9, status: 1, desc: '肉桂辛香，霸气浓烈' },
  { id: 'cat_10', name: '鸭屎香', icon: '', sort: 10, status: 1, desc: '银花香，近年爆火' }
]

// ========== 产品数据 ==========
const mockProducts = [
  // 黄栀香系
  {
    id: 'prod_1',
    name: '凤凰单枞·黄栀香 高山',
    brief: '海拔800米以上，花香清雅持久',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_1',
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
    description: '黄栀香是凤凰单枞最经典的香型，因花香似栀子花而得名。本品采自凤凰山海拔800米以上高山茶园，传统炭焙工艺，茶汤金黄透亮，入口花香馥郁，回甘持久，喉韵深远。'
  },
  {
    id: 'prod_2',
    name: '凤凰单枞·黄栀香 中山',
    brief: '海拔500-800米，性价比之选',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_1',
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
    description: '中山茶园出品，性价比极高。茶汤橙黄明亮，花香清雅，滋味醇厚，适合日常品饮。'
  },
  // 蜜兰香系
  {
    id: 'prod_3',
    name: '凤凰单枞·蜜兰香 特级',
    brief: '蜜香浓郁带兰花韵，受众最广',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_3',
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
    description: '蜜兰香是凤凰单枞最受欢迎的香型，蜜香浓郁中带有兰花幽韵。特级品采自乌岽村古树茶园，传统炭焙慢火细烘，茶汤蜜黄油润，入口蜜香炸裂，回甘生津，韵味悠长。'
  },
  {
    id: 'prod_4',
    name: '凤凰单枞·蜜兰香 一级',
    brief: '蜜香明显，日常品饮首选',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_3',
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
    description: '一级蜜兰香，蜜香明显，滋味醇厚甜润，是日常品饮和入门首选。'
  },
  // 鸭屎香
  {
    id: 'prod_5',
    name: '凤凰单枞·鸭屎香 银花香',
    brief: '名字土但香气高雅，近年爆火',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_10',
    price: 328,
    originalPrice: 428,
    stock: 40,
    sales: 567,
    status: 1,
    isNew: true,
    isHot: true,
    tags: ['网红爆款', '高山', '炭焙', '500g铁罐'],
    origin: '潮州凤凰山',
    altitude: '850m',
    roast: '炭焙',
    weight: '500g',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡8-12次',
    description: '鸭屎香又名银花香，因茶树生长在名为"鸭屎土"的黄土壤中而得名。香气高雅清幽，带有独特的金银花香韵，茶汤清亮，入口顺滑，回甘清甜，近年成为网红爆款。'
  },
  // 芝兰香
  {
    id: 'prod_6',
    name: '凤凰单枞·芝兰香',
    brief: '幽兰香气，清高持久',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_2',
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
    description: '芝兰香因香气似兰花而得名，清高幽雅，持久不散。茶汤金黄明亮，入口兰花香馥郁，滋味鲜爽，回甘生津。'
  },
  // 桂花香
  {
    id: 'prod_7',
    name: '凤凰单枞·桂花香',
    brief: '桂花香气明显，清甜高雅',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_4',
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
    description: '桂花香型带有天然桂花香气，清甜高雅，入口顺滑，回甘持久，适合喜欢花香的茶友。'
  },
  // 肉桂香
  {
    id: 'prod_8',
    name: '凤凰单枞·肉桂香',
    brief: '肉桂辛香，霸气浓烈',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_9',
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
    description: '肉桂香是凤凰单枞浓香型代表，带有肉桂辛香，霸气浓烈，茶汤橙红油润，入口冲击力强，回甘迅猛，适合喜欢浓茶的茶友。'
  },
  // 杏仁香
  {
    id: 'prod_9',
    name: '凤凰单枞·杏仁香',
    brief: '杏仁果香，喉韵深远',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_8',
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
    description: '杏仁香带有天然杏仁果香，滋味醇厚，喉韵深远，回甘持久，是凤凰单枞中辨识度极高的香型。'
  },
  // 姜花香
  {
    id: 'prod_10',
    name: '凤凰单枞·姜花香',
    brief: '生姜辛辣感，独特辨识',
    cover: '',
    imageUrl: '',
    images: [],
    categoryId: 'cat_6',
    price: 348,
    originalPrice: 438,
    stock: 20,
    sales: 67,
    status: 1,
    tags: ['高山', '炭焙', '500g袋装'],
    origin: '潮州凤凰山',
    altitude: '850m',
    roast: '炭焙',
    weight: '500g',
    brewTemp: '95-100℃',
    brewTime: '10-15秒/泡',
    brewCount: '可冲泡8-12次',
    description: '姜花香是凤凰单枞中最独特的香型之一，带有生姜的辛辣感，但并不刺激，反而增添了层次感，回味悠长。'
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
    title: '凤凰单枞十大香型详解',
    category: '香型介绍',
    summary: '一丛一味，百丛百香，详解凤凰单枞十大主流香型特点',
    content: '凤凰单枞是乌龙茶中的极品，以"一丛一味、百丛百香"著称...',
    views: 1280,
    createTime: '2024-01-15'
  },
  {
    id: 'k2',
    title: '如何冲泡凤凰单枞',
    category: '冲泡技巧',
    summary: '高冲低斟，工夫茶法，详解凤凰单枞冲泡要领',
    content: '凤凰单枞讲究"高冲低斟"，使用盖碗或紫砂壶...',
    views: 2356,
    createTime: '2024-01-20'
  },
  {
    id: 'k3',
    title: '高山茶与低山茶的区别',
    category: '茶叶鉴别',
    summary: '海拔越高品质越好？详解高山茶与低山茶差异',
    content: '凤凰山海拔差异显著，高山茶园（800m以上）...',
    views: 890,
    createTime: '2024-02-01'
  }
]

// ========== 数据获取函数 ==========
function getMockData(action, params) {
  switch (action) {
    case 'getCategoryList':
      return mockCategories

    case 'getBannerList':
      return mockBanners

    case 'getProductList': {
      let products = [...mockProducts].filter(p => p.status === 1)
      if (params && params.categoryId) {
        products = products.filter(p => p.categoryId === params.categoryId)
      }
      if (params && params.keyword) {
        const kw = params.keyword.toLowerCase()
        products = products.filter(p => p.name.toLowerCase().includes(kw) || (p.tags && p.tags.some(t => t.includes(kw))))
      }
      return { list: products, total: products.length }
    }

    case 'getProductDetail':
      return mockProducts.find(p => p.id === (params && params.id)) || mockProducts[0]

    case 'searchProducts': {
      const keyword = (params && params.keyword) || ''
      const results = mockProducts.filter(p => p.status === 1 && (p.name.includes(keyword) || (p.tags && p.tags.some(t => t.includes(keyword)))))
      return { list: results, total: results.length }
    }

    case 'getHotProducts':
      return mockProducts.filter(p => p.isHot && p.status === 1).slice(0, 6)

    case 'getNewProducts':
      return mockProducts.filter(p => p.isNew && p.status === 1).slice(0, 6)

    case 'getKnowledgeList':
      return { list: mockKnowledge, total: mockKnowledge.length }

    case 'getKnowledgeDetail':
      return mockKnowledge.find(k => k.id === (params && params.id)) || mockKnowledge[0]

    default:
      return null
  }
}

module.exports = {
  mockCategories,
  mockProducts,
  mockBanners,
  mockKnowledge,
  getMockData
}
