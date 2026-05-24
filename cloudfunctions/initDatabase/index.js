// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { action = 'init' } = event
  
  try {
    if (action === 'init') {
      return await initDatabase()
    } else if (action === 'clear') {
      return await clearDatabase()
    } else if (action === 'reset') {
      await clearDatabase()
      return await initDatabase()
    }
    return {
      code: 0,
      message: 'success'
    }
  } catch (error) {
    console.error('操作失败:', error)
    return {
      code: -1,
      message: error.message
    }
  }
}

// 初始化数据库
async function initDatabase() {
  const results = {}
  
  // 1. 创建所有集合
  results.collections = await createCollections()
  
  // 2. 初始化分类
  results.categories = await initCategories()
  
  // 3. 初始化香型
  results.aromaTypes = await initAromaTypes()
  
  // 4. 初始化站点配置
  results.siteConfig = await initSiteConfig()
  
  // 5. 初始化轮播图
  results.banners = await initBanners()
  
  // 6. 初始化管理员
  results.admins = await initAdmins()
  
  // 7. 初始化商品
  results.products = await initProducts(results.categories)
  
  // 8. 初始化茶知识
  results.knowledge = await initKnowledge()
  
  return {
    code: 0,
    message: '数据库初始化成功',
    data: results
  }
}

// 创建所有集合
async function createCollections() {
  const collections = ['products', 'categories', 'aroma_types', 'knowledge', 'site_config', 'banners', 'admins']
  const results = []
  
  for (const collectionName of collections) {
    try {
      // 尝试获取集合信息，如果不存在会报错
      await db.collection(collectionName).limit(1).get()
      results.push({ name: collectionName, status: 'exists' })
    } catch (error) {
      // 集合不存在，尝试创建（通过添加一个临时文档再删除）
      try {
        const tempResult = await db.collection(collectionName).add({
          data: { _temp: true, createTime: new Date() }
        })
        await db.collection(collectionName).doc(tempResult._id).remove()
        results.push({ name: collectionName, status: 'created' })
      } catch (createError) {
        results.push({ name: collectionName, status: 'error', error: createError.message })
      }
    }
  }
  
  return results
}

// 清空数据库
async function clearDatabase() {
  const collections = ['products', 'categories', 'aroma_types', 'knowledge', 'site_config', 'banners', 'admins']
  
  for (const collection of collections) {
    try {
      // 获取所有记录并删除
      const result = await db.collection(collection).get()
      for (const doc of result.data) {
        await db.collection(collection).doc(doc._id).remove()
      }
    } catch (error) {
      console.error(`清空 ${collection} 失败:`, error)
    }
  }
  
  return { code: 0, message: '数据库已清空' }
}

// 初始化分类
async function initCategories() {
  // 检查是否已有数据
  const existing = await db.collection('categories').count()
  if (existing.total > 0) {
    return { message: '分类数据已存在，跳过初始化' }
  }
  
  const categories = [
    {
      name: '单枞茶',
      icon: '/images/category/danzong.png',
      sort: 1,
      status: 1,
      description: '凤凰单枞，乌龙茶中的极品',
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '特惠茶',
      icon: '/images/category/tehui.png',
      sort: 2,
      status: 1,
      description: '限时特惠，性价比之选',
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '农产品',
      icon: '/images/category/nongchanpin.png',
      sort: 3,
      status: 1,
      description: '优质农产品，原生态种植',
      createTime: new Date(),
      updateTime: new Date()
    }
  ]
  
  const created = []
  for (const category of categories) {
    const result = await db.collection('categories').add({ data: category })
    created.push({ _id: result._id, ...category })
  }
  
  return created
}

// 初始化香型
async function initAromaTypes() {
  // 检查是否已有数据
  const existing = await db.collection('aroma_types').count()
  if (existing.total > 0) {
    return { message: '香型数据已存在，跳过初始化' }
  }
  
  const aromaTypes = [
    {
      name: '蜜兰香',
      sort: 1,
      status: 1,
      aromaFeature: '蜜味浓郁，兰香幽雅',
      representative: '蜜兰香单枞',
      qualityFeatures: '汤色橙黄明亮，滋味醇厚回甘，具有独特的蜜兰花香',
      yourProduct: '我们的蜜兰香选自凤凰山核心产区，采用传统工艺精制而成',
      image: '/images/aroma/milanxiang.png',
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '鸭屎香',
      sort: 2,
      status: 1,
      aromaFeature: '银花香浓郁，香气高扬',
      representative: '鸭屎香单枞',
      qualityFeatures: '汤色金黄清澈，滋味鲜爽甘醇，香气持久',
      yourProduct: '我们的鸭屎香选用高山老枞，香气独特，回甘持久',
      image: '/images/aroma/yashixiang.png',
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '黄枝香',
      sort: 3,
      status: 1,
      aromaFeature: '栀子花香明显',
      representative: '黄枝香单枞',
      qualityFeatures: '汤色橙黄，香气清高，滋味浓醇',
      yourProduct: '黄枝香单枞，花香浓郁，品质上乘',
      image: '/images/aroma/huangzhixiang.png',
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '芝兰香',
      sort: 4,
      status: 1,
      aromaFeature: '芝兰花香幽雅',
      representative: '芝兰香单枞',
      qualityFeatures: '汤色清澈，香气幽雅，滋味醇厚',
      yourProduct: '芝兰香单枞，幽雅兰香，品味高雅',
      image: '/images/aroma/zhilanxiang.png',
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '桂花香',
      sort: 5,
      status: 1,
      aromaFeature: '桂花香气浓郁',
      representative: '桂花香单枞',
      qualityFeatures: '汤色金黄，桂花香明显，滋味甘醇',
      yourProduct: '桂花香单枞，金秋桂花般的香气',
      image: '/images/aroma/guihuaxiang.png',
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '玉兰香',
      sort: 6,
      status: 1,
      aromaFeature: '玉兰花香清幽',
      representative: '玉兰香单枞',
      qualityFeatures: '汤色清亮，香气清幽，滋味鲜爽',
      yourProduct: '玉兰香单枞，清幽雅致',
      image: '/images/aroma/yulanxiang.png',
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '姜花香',
      sort: 7,
      status: 1,
      aromaFeature: '姜花香气独特',
      representative: '姜花香单枞',
      qualityFeatures: '汤色橙黄，姜花香气独特，滋味浓醇',
      yourProduct: '姜花香单枞，独特姜花香气',
      image: '/images/aroma/jianghuaxiang.png',
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '肉桂香',
      sort: 8,
      status: 1,
      aromaFeature: '肉桂香气辛锐',
      representative: '肉桂香单枞',
      qualityFeatures: '汤色深黄，肉桂香辛锐，滋味浓厚',
      yourProduct: '肉桂香单枞，辛锐独特的肉桂香气',
      image: '/images/aroma/rouguixiang.png',
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '杏仁香',
      sort: 9,
      status: 1,
      aromaFeature: '杏仁香气明显',
      representative: '杏仁香单枞（锯朵仔）',
      qualityFeatures: '汤色金黄，杏仁香明显，滋味甘醇',
      yourProduct: '锯朵仔单枞，独特的杏仁香气',
      image: '/images/aroma/xingrenxiang.png',
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '茉莉香',
      sort: 10,
      status: 1,
      aromaFeature: '茉莉花香清新',
      representative: '茉莉香单枞',
      qualityFeatures: '汤色清亮，茉莉花香清新，滋味鲜爽',
      yourProduct: '茉莉香单枞，清新怡人的茉莉花香',
      image: '/images/aroma/molixiang.png',
      createTime: new Date(),
      updateTime: new Date()
    }
  ]
  
  const created = []
  for (const aroma of aromaTypes) {
    const result = await db.collection('aroma_types').add({ data: aroma })
    created.push({ _id: result._id, ...aroma })
  }
  
  return created
}

// 初始化站点配置
async function initSiteConfig() {
  // 检查是否已有数据
  const existing = await db.collection('site_config').count()
  if (existing.total > 0) {
    return { message: '站点配置已存在，跳过初始化' }
  }
  
  const siteConfig = {
    brandName: '凤凰茶庄',
    logo: '/images/logo.png',
    wechatId: 'fenghuangchazhuang',
    phone: '13800138000',
    address: '广东省潮州市凤凰镇',
    aboutUs: '凤凰茶庄位于中国乌龙茶之乡——潮州凤凰山，专注凤凰单枞茶种植、加工与销售数十年。我们坚持传统工艺，用心做好每一片茶叶，只为给您带来最纯正的单枞茶香。',
    businessHours: '周一至周日 9:00-21:00',
    deliveryInfo: '全国包邮，48小时内发货',
    returnPolicy: '7天无理由退换货',
    // 商品详情页联系区域配置
    productContactTitle: '品茶咨询',
    productContactDesc: '添加微信，了解更多详情',
    productContactBtnText: '复制微信号',
    createTime: new Date(),
    updateTime: new Date()
  }
  
  const result = await db.collection('site_config').add({ data: siteConfig })
  return { _id: result._id, ...siteConfig }
}

// 初始化轮播图
async function initBanners() {
  // 检查是否已有数据
  const existing = await db.collection('banners').count()
  if (existing.total > 0) {
    return { message: '轮播图数据已存在，跳过初始化' }
  }
  
  const banners = [
    {
      title: '凤凰单枞 茶中极品',
      image: '/images/banners/banner1.jpg',
      link: '/pages/products/products',
      sort: 1,
      status: 1,
      position: 1,
      description: '正宗凤凰山单枞茶',
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      title: '十大香型 各具特色',
      image: '/images/banners/banner2.jpg',
      link: '/pages/aroma/aroma',
      sort: 2,
      status: 1,
      position: 1,
      description: '探索单枞十大香型',
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      title: '限时特惠 好茶不贵',
      image: '/images/banners/banner3.jpg',
      link: '/pages/products/products?category=特惠茶',
      sort: 3,
      status: 1,
      position: 1,
      description: '精选特惠好茶',
      createTime: new Date(),
      updateTime: new Date()
    }
  ]
  
  const created = []
  for (const banner of banners) {
    const result = await db.collection('banners').add({ data: banner })
    created.push({ _id: result._id, ...banner })
  }
  
  return created
}

// 初始化管理员
async function initAdmins() {
  // 检查是否已有数据
  const existing = await db.collection('admins').count()
  if (existing.total > 0) {
    return { message: '管理员数据已存在，跳过初始化' }
  }
  
  const admins = [
    {
      username: 'admin',
      password: 'admin123',
      nickname: '管理员',
      role: 'admin',
      status: 1,
      createTime: new Date(),
      updateTime: new Date(),
      lastLoginTime: null
    }
  ]
  
  const created = []
  for (const admin of admins) {
    const result = await db.collection('admins').add({ data: admin })
    created.push({ _id: result._id, ...admin })
  }
  
  return created
}

// 初始化商品
async function initProducts(categories) {
  // 检查是否已有数据
  const existing = await db.collection('products').count()
  if (existing.total > 0) {
    return { message: '商品数据已存在，跳过初始化' }
  }
  
  // 获取分类ID映射
  const categoryResult = await db.collection('categories').get()
  const categoryMap = {}
  categoryResult.data.forEach(cat => {
    categoryMap[cat.name] = cat._id
  })
  
  const products = [
    {
      name: '蜜兰香单枞',
      brief: '蜜味浓郁，兰香幽雅',
      description: '蜜兰香是凤凰单枞十大香型之一，因成品茶具有浓郁的蜜兰花香而得名。我们的蜜兰香选自凤凰山海拔800米以上的核心产区，采用传统工艺精制而成。茶叶条索紧结，色泽乌润，汤色橙黄明亮，滋味醇厚回甘，具有独特的蜜兰花香。',
      cover: '/images/products/milanxiang.jpg',
      images: ['/images/products/milanxiang_1.jpg', '/images/products/milanxiang_2.jpg'],
      categoryId: categoryMap['单枞茶'],
      type: '蜜兰香',
      season: '春茶',
      packType: '罐装',
      price: 268,
      originalPrice: 328,
      stock: 100,
      sales: 356,
      views: 2345,
      status: 1,
      isNew: true,
      isRecommend: true,
      isHot: true,
      sort: 1,
      weight: '250g',
      unit: '罐',
      origin: '潮州凤凰山',
      specifications: [
        { name: '规格', options: ['125g', '250g', '500g'] },
        { name: '等级', options: ['特级', '一级'] }
      ],
      tags: ['蜜兰香', '春茶', '核心产区'],
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '鸭屎香单枞',
      brief: '银花香浓郁，香气高扬',
      description: '鸭屎香，又名银花香，是凤凰单枞中最受欢迎的香型之一。虽然名字听起来不太雅致，但茶叶品质极佳，香气独特。我们的鸭屎香选用高山老枞茶树，香气高扬持久，汤色金黄清澈，滋味鲜爽甘醇，回甘持久。',
      cover: '/images/products/yashixiang.jpg',
      images: ['/images/products/yashixiang_1.jpg', '/images/products/yashixiang_2.jpg'],
      categoryId: categoryMap['单枞茶'],
      type: '鸭屎香',
      season: '春茶',
      packType: '罐装',
      price: 298,
      originalPrice: 368,
      stock: 80,
      sales: 423,
      views: 3456,
      status: 1,
      isNew: true,
      isRecommend: true,
      isHot: true,
      sort: 2,
      weight: '250g',
      unit: '罐',
      origin: '潮州凤凰山',
      specifications: [
        { name: '规格', options: ['125g', '250g', '500g'] },
        { name: '等级', options: ['特级', '一级'] }
      ],
      tags: ['鸭屎香', '银花香', '高山茶'],
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '大乌叶单枞',
      brief: '香气浓郁，滋味醇厚',
      description: '大乌叶是凤凰单枞中的传统名品，因茶叶叶片较大、色泽深绿而得名。其香气浓郁，滋味醇厚，是单枞茶中的经典之选。',
      cover: '/images/products/dawuye.jpg',
      images: ['/images/products/dawuye_1.jpg'],
      categoryId: categoryMap['单枞茶'],
      type: '大乌叶',
      season: '春茶',
      packType: '罐装',
      price: 198,
      originalPrice: 258,
      stock: 120,
      sales: 289,
      views: 1890,
      status: 1,
      isNew: false,
      isRecommend: true,
      isHot: true,
      sort: 3,
      weight: '250g',
      unit: '罐',
      origin: '潮州凤凰山',
      specifications: [
        { name: '规格', options: ['250g', '500g'] }
      ],
      tags: ['大乌叶', '传统名品'],
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '锯朵仔单枞',
      brief: '杏仁香明显，回甘持久',
      description: '锯朵仔，又名杏仁香，是凤凰单枞十大香型之一。因茶叶边缘呈锯齿状而得名，具有独特的杏仁香气，回甘持久。',
      cover: '/images/products/juduozai.jpg',
      images: ['/images/products/juduozai_1.jpg'],
      categoryId: categoryMap['单枞茶'],
      type: '杏仁香',
      season: '春茶',
      packType: '罐装',
      price: 328,
      originalPrice: 398,
      stock: 60,
      sales: 156,
      views: 1234,
      status: 1,
      isNew: true,
      isRecommend: true,
      isHot: false,
      sort: 4,
      weight: '250g',
      unit: '罐',
      origin: '潮州凤凰山',
      specifications: [
        { name: '规格', options: ['125g', '250g'] }
      ],
      tags: ['锯朵仔', '杏仁香', '珍稀品种'],
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '单枞茶头',
      brief: '性价比之选，茶味浓郁',
      description: '茶头是茶叶加工过程中产生的碎茶，虽然外形不如整茶美观，但茶味浓郁，性价比高，是日常饮用的好选择。',
      cover: '/images/products/chatou.jpg',
      images: ['/images/products/chatou_1.jpg'],
      categoryId: categoryMap['特惠茶'],
      type: '混合',
      season: '春茶',
      packType: '袋装',
      price: 68,
      originalPrice: 98,
      stock: 200,
      sales: 567,
      views: 4567,
      status: 1,
      isNew: false,
      isRecommend: true,
      isHot: true,
      sort: 1,
      weight: '500g',
      unit: '袋',
      origin: '潮州凤凰山',
      specifications: [
        { name: '规格', options: ['250g', '500g', '1000g'] }
      ],
      tags: ['茶头', '特惠', '高性价比'],
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '单枞茶包',
      brief: '便携茶包，随时享用',
      description: '精选优质单枞茶制作而成的便携茶包，方便携带，随时随地都能享用正宗的单枞茶香。适合办公室、旅行使用。',
      cover: '/images/products/chabao.jpg',
      images: ['/images/products/chabao_1.jpg'],
      categoryId: categoryMap['特惠茶'],
      type: '混合',
      season: '春茶',
      packType: '盒装',
      price: 38,
      originalPrice: 58,
      stock: 150,
      sales: 345,
      views: 2345,
      status: 1,
      isNew: true,
      isRecommend: false,
      isHot: true,
      sort: 2,
      weight: '30包',
      unit: '盒',
      origin: '潮州凤凰山',
      specifications: [
        { name: '规格', options: ['15包', '30包'] }
      ],
      tags: ['茶包', '便携', '办公室必备'],
      createTime: new Date(),
      updateTime: new Date()
    }
  ]
  
  const created = []
  for (const product of products) {
    const result = await db.collection('products').add({ data: product })
    created.push({ _id: result._id, ...product })
  }
  
  return created
}

// 初始化茶知识
async function initKnowledge() {
  // 检查是否已有数据
  const existing = await db.collection('knowledge').count()
  if (existing.total > 0) {
    return { message: '茶知识数据已存在，跳过初始化' }
  }
  
  const knowledge = [
    {
      title: '凤凰单枞茶的历史与文化',
      brief: '了解凤凰单枞茶的起源、发展历史和文化内涵',
      content: `凤凰单枞茶，产于广东省潮州市凤凰山，是中国乌龙茶中的极品，享有"茶中香水"的美誉。

## 起源与历史

凤凰单枞茶的种植历史可以追溯到宋代，距今已有900多年的历史。相传南宋末年，宋帝赵昺南逃至凤凰山，口渴难耐，山民献茶解渴，宋帝饮后赞不绝口，从此凤凰茶名声大噪。

## 生长环境

凤凰山位于广东省潮州市北部，海拔350-1498米，属亚热带海洋性气候。这里山高雾重，雨量充沛，土壤肥沃，为茶树的生长提供了得天独厚的条件。

## 制作工艺

凤凰单枞茶的制作工艺复杂精细，包括采摘、晒青、晾青、做青、杀青、揉捻、烘焙等多个环节。其中"做青"是关键工序，决定了茶叶的香气和滋味。

## 十大香型

凤凰单枞茶按香气可分为十大香型：蜜兰香、鸭屎香、黄枝香、芝兰香、桂花香、玉兰香、姜花香、肉桂香、杏仁香、茉莉香。每种香型都有其独特的风味特征。`,
      cover: '/images/knowledge/history.jpg',
      category: '茶文化',
      author: '凤凰茶庄',
      views: 0,
      sort: 1,
      status: 1,
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      title: '如何冲泡凤凰单枞茶',
      brief: '掌握正确的冲泡方法，品味单枞茶的真谛',
      content: `正确的冲泡方法能够充分发挥凤凰单枞茶的香气和滋味。以下是详细的冲泡指南：

## 茶具选择

推荐使用紫砂壶或白瓷盖碗冲泡单枞茶。紫砂壶能更好地保持茶香，白瓷盖碗则便于观察茶汤颜色。

## 水温控制

单枞茶属于乌龙茶，需要用沸水冲泡。水温应在95-100℃之间，这样才能充分激发茶叶的香气。

## 投茶量

一般按照1:20的茶水比例投茶，即100ml水投茶5g左右。可根据个人口味适当调整。

## 冲泡步骤

1. **温具**：用沸水烫洗茶具，提高茶具温度
2. **投茶**：将茶叶投入茶壶或盖碗中
3. **洗茶**：注入沸水，快速倒出，唤醒茶叶
4. **冲泡**：再次注入沸水，第一泡15-20秒出汤
5. **品饮**：将茶汤倒入品茗杯，细细品味

## 出汤时间

- 第1-3泡：15-20秒
- 第4-6泡：25-30秒
- 第7泡以后：适当延长

单枞茶耐冲泡，一般可冲泡10-15泡，且越泡越有韵味。`,
      cover: '/images/knowledge/brewing.jpg',
      category: '冲泡技巧',
      author: '凤凰茶庄',
      views: 0,
      sort: 2,
      status: 1,
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      title: '单枞茶的储存方法',
      brief: '正确储存单枞茶，保持茶叶新鲜和香气',
      content: `正确的储存方法能够保持单枞茶的品质，延长茶叶的保质期。以下是储存单枞茶的要点：

## 储存环境

1. **避光**：茶叶应存放在避光处，阳光直射会加速茶叶氧化，影响品质
2. **防潮**：茶叶容易吸潮，应存放在干燥环境中，相对湿度控制在60%以下
3. **防异味**：茶叶具有很强的吸附性，应远离有异味的物品
4. **常温**：避免高温，室温储存即可

## 储存容器

- **锡罐**：最佳储存容器，密封性好，能很好保持茶香
- **铁罐**：密封性较好，经济实惠
- **陶瓷罐**：透气性好，适合短期储存
- **密封袋**：配合铁罐使用，增强密封效果

## 储存期限

单枞茶属于乌龙茶，建议在购买后1-2年内饮用完毕。虽然茶叶不会变质，但香气会随时间逐渐减弱。

## 注意事项

1. 开封后的茶叶应尽快饮用
2. 每次取茶后要及时密封
3. 不要将茶叶存放在冰箱中（除非长期不饮用）
4. 定期检查茶叶状态，如有受潮应及时处理`,
      cover: '/images/knowledge/storage.jpg',
      category: '茶叶知识',
      author: '凤凰茶庄',
      views: 0,
      sort: 3,
      status: 1,
      createTime: new Date(),
      updateTime: new Date()
    }
  ]
  
  const created = []
  for (const article of knowledge) {
    const result = await db.collection('knowledge').add({ data: article })
    created.push({ _id: result._id, ...article })
  }
  
  return created
}
