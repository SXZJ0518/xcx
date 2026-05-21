
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
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
  
  // 1. 初始化分类
  results.categories = await initCategories()
  
  // 2. 初始化商品
  results.products = await initProducts(results.categories)
  
  // 3. 初始化轮播图
  results.banners = await initBanners()
  
  // 4. 初始化用户（管理员）
  results.adminUser = await initAdminUser()
  
  return {
    code: 0,
    message: '数据库初始化成功',
    data: results
  }
}

// 清空数据库
async function clearDatabase() {
  const collections = ['product', 'category', 'banner', 'user', 'order', 'address']
  
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
  const categories = [
    { name: '绿茶', icon: '', sort: 1, status: 1, description: '绿茶，不发酵茶', createTime: new Date(), updateTime: new Date() },
    { name: '红茶', icon: '', sort: 2, status: 1, description: '红茶，全发酵茶', createTime: new Date(), updateTime: new Date() },
    { name: '乌龙茶', icon: '', sort: 3, status: 1, description: '乌龙茶，半发酵茶', createTime: new Date(), updateTime: new Date() },
    { name: '白茶', icon: '', sort: 4, status: 1, description: '白茶，轻微发酵茶', createTime: new Date(), updateTime: new Date() },
    { name: '普洱茶', icon: '', sort: 5, status: 1, description: '普洱茶，后发酵茶', createTime: new Date(), updateTime: new Date() }
  ]
  
  const created = []
  for (const category of categories) {
    const result = await db.collection('category').add({ data: category })
    created.push({ _id: result._id, ...category })
  }
  
  return created
}

// 初始化商品
async function initProducts(categories) {
  const categoryMap = {}
  categories.forEach(cat => {
    categoryMap[cat.name] = cat._id
  })
  
  const products = [
    {
      name: '西湖龙井 特级',
      brief: '明前采摘，鲜嫩清香',
      description: '精选杭州西湖龙井核心产区鲜叶，采用传统工艺精制而成。色泽翠绿，香气清高，滋味鲜爽回甘。',
      cover: 'https://cloud1-d2gzj9p633865ea93.tcb.qcloud.la/products/longjing.jpg',
      images: [],
      categoryId: categoryMap['绿茶'],
      price: 298,
      originalPrice: 398,
      stock: 100,
      sales: 156,
      views: 2345,
      status: 1,
      isNew: true,
      isRecommend: true,
      isHot: true,
      sort: 1,
      weight: '100g',
      unit: '罐',
      origin: '杭州西湖',
      specifications: [
        { name: '规格', options: ['50g', '100g', '250g'] },
        { name: '等级', options: ['特级', '一级', '二级'] }
      ],
      tags: ['明前茶', '核心产区', '传统工艺'],
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '碧螺春 一级',
      brief: '卷曲如螺，香气馥郁',
      description: '苏州洞庭山碧螺春，形似螺，色如银，香如花，味如蜜。',
      cover: 'https://cloud1-d2gzj9p633865ea93.tcb.qcloud.la/products/biluochun.jpg',
      images: [],
      categoryId: categoryMap['绿茶'],
      price: 198,
      originalPrice: 268,
      stock: 80,
      sales: 98,
      views: 1567,
      status: 1,
      isNew: true,
      isRecommend: false,
      isHot: true,
      sort: 2,
      weight: '100g',
      unit: '罐',
      origin: '苏州洞庭山',
      specifications: [
        { name: '规格', options: ['50g', '100g'] },
        { name: '等级', options: ['一级', '二级'] }
      ],
      tags: ['明前茶', '手工采摘'],
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '正山小种',
      brief: '世界红茶鼻祖',
      description: '福建武夷山桐木关正山小种，带有独特的松烟香和桂圆香。',
      cover: 'https://cloud1-d2gzj9p633865ea93.tcb.qcloud.la/products/zhengshanxiaozhong.jpg',
      images: [],
      categoryId: categoryMap['红茶'],
      price: 168,
      originalPrice: 228,
      stock: 120,
      sales: 234,
      views: 3456,
      status: 1,
      isNew: false,
      isRecommend: true,
      isHot: true,
      sort: 1,
      weight: '100g',
      unit: '罐',
      origin: '武夷山桐木关',
      specifications: [
        { name: '规格', options: ['100g', '250g'] }
      ],
      tags: ['传统工艺', '桂圆香'],
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '金骏眉',
      brief: '高端红茶代表',
      description: '全芽头制作，蜜香花香，回甘持久。',
      cover: 'https://cloud1-d2gzj9p633865ea93.tcb.qcloud.la/products/jinjunmei.jpg',
      images: [],
      categoryId: categoryMap['红茶'],
      price: 588,
      originalPrice: 788,
      stock: 50,
      sales: 45,
      views: 876,
      status: 1,
      isNew: true,
      isRecommend: true,
      isHot: false,
      sort: 2,
      weight: '50g',
      unit: '罐',
      origin: '武夷山桐木关',
      specifications: [
        { name: '规格', options: ['50g', '100g'] }
      ],
      tags: ['全芽头', '蜜花香'],
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '铁观音 特级',
      brief: '七泡有余香',
      description: '福建安溪铁观音，清香型，兰花香，回甘持久。',
      cover: 'https://cloud1-d2gzj9p633865ea93.tcb.qcloud.la/products/tieguanyin.jpg',
      images: [],
      categoryId: categoryMap['乌龙茶'],
      price: 268,
      originalPrice: 368,
      stock: 90,
      sales: 312,
      views: 4567,
      status: 1,
      isNew: true,
      isRecommend: true,
      isHot: true,
      sort: 1,
      weight: '250g',
      unit: '罐',
      origin: '福建安溪',
      specifications: [
        { name: '香型', options: ['清香型', '浓香型', '炭焙型'] },
        { name: '规格', options: ['100g', '250g', '500g'] }
      ],
      tags: ['兰花香', '七泡有余香'],
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '武夷山大红袍',
      brief: '岩骨花香',
      description: '武夷岩茶之王，具有独特的岩韵。',
      cover: 'https://cloud1-d2gzj9p633865ea93.tcb.qcloud.la/products/dahongpao.jpg',
      images: [],
      categoryId: categoryMap['乌龙茶'],
      price: 398,
      originalPrice: 528,
      stock: 70,
      sales: 189,
      views: 2890,
      status: 1,
      isNew: false,
      isRecommend: true,
      isHot: true,
      sort: 2,
      weight: '100g',
      unit: '罐',
      origin: '武夷山',
      specifications: [
        { name: '规格', options: ['100g', '250g'] }
      ],
      tags: ['岩骨花香', '正岩茶'],
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '福鼎白毫银针',
      brief: '茶中美女',
      description: '福建福鼎白毫银针，全芽头制作，满披白毫。',
      cover: 'https://cloud1-d2gzj9p633865ea93.tcb.qcloud.la/products/baihaoyinzhen.jpg',
      images: [],
      categoryId: categoryMap['白茶'],
      price: 388,
      originalPrice: 498,
      stock: 60,
      sales: 78,
      views: 1234,
      status: 1,
      isNew: true,
      isRecommend: true,
      isHot: false,
      sort: 1,
      weight: '50g',
      unit: '罐',
      origin: '福建福鼎',
      specifications: [
        { name: '规格', options: ['50g', '100g'] }
      ],
      tags: ['全芽头', '三年陈'],
      createTime: new Date(),
      updateTime: new Date()
    },
    {
      name: '云南普洱茶饼',
      brief: '越陈越香',
      description: '云南勐海古树普洱熟茶，357g标准饼。',
      cover: 'https://cloud1-d2gzj9p633865ea93.tcb.qcloud.la/products/puer.jpg',
      images: [],
      categoryId: categoryMap['普洱茶'],
      price: 198,
      originalPrice: 288,
      stock: 150,
      sales: 456,
      views: 6789,
      status: 1,
      isNew: false,
      isRecommend: true,
      isHot: true,
      sort: 1,
      weight: '357g',
      unit: '饼',
      origin: '云南勐海',
      specifications: [
        { name: '类型', options: ['生茶', '熟茶'] },
        { name: '年份', options: ['2021年', '2020年', '2019年'] }
      ],
      tags: ['古树茶', '越陈越香'],
      createTime: new Date(),
      updateTime: new Date()
    }
  ]
  
  const created = []
  for (const product of products) {
    const result = await db.collection('product').add({ data: product })
    created.push({ _id: result._id, ...product })
  }
  
  return created
}

// 初始化轮播图
async function initBanners() {
  const banners = [
    { title: '春茶上市', image: 'https://cloud1-d2gzj9p633865ea93.tcb.qcloud.la/banners/banner1.jpg', link: '', sort: 1, status: 1, position: 1, description: '2024年春茶新上市', createTime: new Date(), updateTime: new Date() },
    { title: '限时特惠', image: 'https://cloud1-d2gzj9p633865ea93.tcb.qcloud.la/banners/banner2.jpg', link: '', sort: 2, status: 1, position: 1, description: '全场满减活动', createTime: new Date(), updateTime: new Date() },
    { title: '会员专享', image: 'https://cloud1-d2gzj9p633865ea93.tcb.qcloud.la/banners/banner3.jpg', link: '', sort: 3, status: 1, position: 1, description: 'VIP会员专属优惠', createTime: new Date(), updateTime: new Date() }
  ]
  
  const created = []
  for (const banner of banners) {
    const result = await db.collection('banner').add({ data: banner })
    created.push({ _id: result._id, ...banner })
  }
  
  return created
}

// 初始化管理员用户（用于小程序端）
async function initAdminUser() {
  // 检查是否已存在管理员用户
  const result = await db.collection('user').where({
    role: 'admin'
  }).get()
  
  if (result.data.length &gt; 0) {
    return { message: '管理员用户已存在', user: result.data[0] }
  }
  
  const adminUser = {
    nickName: '管理员',
    avatarUrl: '',
    phone: '',
    role: 'admin',
    level: 5,
    points: 99999,
    status: 1,
    createTime: new Date(),
    updateTime: new Date(),
    lastLoginTime: new Date()
  }
  
  const addResult = await db.collection('user').add({ data: adminUser })
  return { _id: addResult._id, ...adminUser }
}
