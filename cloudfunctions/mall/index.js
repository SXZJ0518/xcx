// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { action, params } = event

  try {
    const result = await handleAction(action, params, wxContext)
    return {
      code: 0,
      message: 'success',
      data: result
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      code: -1,
      message: error.message || '操作失败',
      data: null
    }
  }
}

// 处理不同的操作
async function handleAction(action, params, wxContext) {
  switch (action) {
    // ==================== 前端接口 ====================
    case 'getHomeData':
      return await getHomeData()
    case 'getProductList':
      return await getProductList(params)
    case 'getProductDetail':
      return await getProductDetail(params)
    case 'getCategoryList':
      return await getCategoryList()
    case 'getAromaTypes':
      return await getAromaTypes()
    case 'getKnowledgeList':
      return await getKnowledgeList(params)
    case 'getKnowledgeDetail':
      return await getKnowledgeDetail(params)
    case 'getSiteConfig':
      return await getSiteConfig()
    case 'getBannerList':
      return await getBannerList()

    // ==================== 后台管理接口 ====================
    // 商品管理
    case 'adminGetProductList':
      return await adminGetProductList(params)
    case 'adminGetProductDetail':
      return await adminGetProductDetail(params)
    case 'adminCreateProduct':
      return await adminCreateProduct(params)
    case 'adminUpdateProduct':
      return await adminUpdateProduct(params)
    case 'adminDeleteProduct':
      return await adminDeleteProduct(params)
    case 'adminUpdateProductStatus':
      return await adminUpdateProductStatus(params)

    // 分类管理
    case 'adminGetCategoryList':
      return await adminGetCategoryList(params)
    case 'adminCreateCategory':
      return await adminCreateCategory(params)
    case 'adminUpdateCategory':
      return await adminUpdateCategory(params)
    case 'adminDeleteCategory':
      return await adminDeleteCategory(params)

    // 香型管理
    case 'adminGetAromaTypeList':
      return await adminGetAromaTypeList(params)
    case 'adminCreateAromaType':
      return await adminCreateAromaType(params)
    case 'adminUpdateAromaType':
      return await adminUpdateAromaType(params)
    case 'adminDeleteAromaType':
      return await adminDeleteAromaType(params)

    // 知识管理
    case 'adminGetKnowledgeList':
      return await adminGetKnowledgeList(params)
    case 'adminCreateKnowledge':
      return await adminCreateKnowledge(params)
    case 'adminUpdateKnowledge':
      return await adminUpdateKnowledge(params)
    case 'adminDeleteKnowledge':
      return await adminDeleteKnowledge(params)

    // 站点配置
    case 'adminGetSiteConfig':
      return await adminGetSiteConfig()
    case 'adminUpdateSiteConfig':
      return await adminUpdateSiteConfig(params)

    // 轮播图管理
    case 'adminGetBannerList':
      return await adminGetBannerList(params)
    case 'adminCreateBanner':
      return await adminCreateBanner(params)
    case 'adminUpdateBanner':
      return await adminUpdateBanner(params)
    case 'adminDeleteBanner':
      return await adminDeleteBanner(params)
    case 'adminUpdateBannerStatus':
      return await adminUpdateBannerStatus(params)

    // 登录
    case 'adminLogin':
      return await adminLogin(params)

    default:
      throw new Error('未知的操作类型')
  }
}

// ==================== 前端接口实现 ====================

// 1. 获取首页聚合数据
async function getHomeData() {
  const [banners, hotProducts, categories, aromaTypes, siteConfig] = await Promise.all([
    db.collection('banners').where({ status: 1 }).orderBy('sort', 'asc').limit(5).get(),
    db.collection('products').where({ status: 1, isHot: true }).orderBy('sort', 'asc').limit(6).get(),
    db.collection('categories').where({ status: 1 }).orderBy('sort', 'asc').get(),
    db.collection('aroma_types').where({ status: 1 }).orderBy('sort', 'asc').get(),
    db.collection('site_config').limit(1).get()
  ])

  return {
    banners: banners.data,
    hotProducts: hotProducts.data,
    categories: categories.data,
    aromaTypes: aromaTypes.data,
    siteConfig: siteConfig.data[0] || null
  }
}

// 2. 获取商品列表
async function getProductList(params = {}) {
  const { categoryId, type, season, packType, keyword, page = 1, pageSize = 10, sort = 'default' } = params
  
  let where = { status: 1 }
  
  if (categoryId) {
    where.categoryId = categoryId
  }
  
  if (type) {
    where.type = type
  }
  
  if (season) {
    where.season = season
  }
  
  if (packType) {
    where.packType = packType
  }
  
  if (keyword) {
    where.name = db.RegExp({
      regexp: keyword,
      options: 'i'
    })
  }
  
  let query = db.collection('products').where(where)
  
  // 排序
  if (sort === 'price_asc') {
    query = query.orderBy('price', 'asc')
  } else if (sort === 'price_desc') {
    query = query.orderBy('price', 'desc')
  } else if (sort === 'sales_desc') {
    query = query.orderBy('sales', 'desc')
  } else {
    query = query.orderBy('sort', 'asc').orderBy('createTime', 'desc')
  }
  
  const [listResult, countResult] = await Promise.all([
    query.skip((page - 1) * pageSize).limit(pageSize).get(),
    db.collection('products').where(where).count()
  ])
  
  return {
    list: listResult.data,
    total: countResult.total,
    page,
    pageSize
  }
}

// 3. 获取商品详情
async function getProductDetail(params) {
  const { id } = params
  
  if (!id) {
    throw new Error('商品ID不能为空')
  }
  
  const result = await db.collection('products').doc(id).get()
  
  if (!result.data) {
    throw new Error('商品不存在')
  }
  
  // 增加浏览量
  await db.collection('products').doc(id).update({
    data: {
      views: _.inc(1)
    }
  })
  
  return result.data
}

// 4. 获取商品分类列表
async function getCategoryList() {
  const result = await db.collection('categories')
    .where({ status: 1 })
    .orderBy('sort', 'asc')
    .get()
  
  return result.data
}

// 5. 获取十大香型列表
async function getAromaTypes() {
  const result = await db.collection('aroma_types')
    .where({ status: 1 })
    .orderBy('sort', 'asc')
    .get()
  
  return result.data
}

// 6. 获取茶知识文章列表
async function getKnowledgeList(params = {}) {
  const { page = 1, pageSize = 10, category } = params
  
  let where = { status: 1 }
  
  if (category) {
    where.category = category
  }
  
  const [listResult, countResult] = await Promise.all([
    db.collection('knowledge')
      .where(where)
      .orderBy('sort', 'asc')
      .orderBy('createTime', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get(),
    db.collection('knowledge').where(where).count()
  ])
  
  return {
    list: listResult.data,
    total: countResult.total,
    page,
    pageSize
  }
}

// 7. 获取茶知识详情
async function getKnowledgeDetail(params) {
  const { id } = params
  
  if (!id) {
    throw new Error('文章ID不能为空')
  }
  
  const result = await db.collection('knowledge').doc(id).get()
  
  if (!result.data) {
    throw new Error('文章不存在')
  }
  
  // 增加浏览量
  await db.collection('knowledge').doc(id).update({
    data: {
      views: _.inc(1)
    }
  })
  
  return result.data
}

// 8. 获取站点配置
async function getSiteConfig() {
  const result = await db.collection('site_config').limit(1).get()
  return result.data[0] || null
}

// 9. 获取轮播图列表
async function getBannerList() {
  const result = await db.collection('banners')
    .where({ status: 1 })
    .orderBy('sort', 'asc')
    .get()
  
  return result.data
}

// ==================== 后台管理接口实现 ====================

// 10. 后台获取商品列表
async function adminGetProductList(params = {}) {
  const { page = 1, pageSize = 10, keyword, categoryId, status, type } = params
  
  let where = {}
  
  if (keyword) {
    where.name = db.RegExp({
      regexp: keyword,
      options: 'i'
    })
  }
  
  if (categoryId) {
    where.categoryId = categoryId
  }
  
  if (status !== undefined && status !== '') {
    where.status = parseInt(status)
  }
  
  if (type) {
    where.type = type
  }
  
  const [listResult, countResult] = await Promise.all([
    db.collection('products')
      .where(where)
      .orderBy('createTime', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get(),
    db.collection('products').where(where).count()
  ])
  
  return {
    list: listResult.data,
    total: countResult.total,
    page,
    pageSize
  }
}

// 11. 后台获取商品详情
async function adminGetProductDetail(params) {
  const { id } = params
  
  if (!id) {
    throw new Error('商品ID不能为空')
  }
  
  const result = await db.collection('products').doc(id).get()
  
  if (!result.data) {
    throw new Error('商品不存在')
  }
  
  return result.data
}

// 12. 创建商品
async function adminCreateProduct(params) {
  const productData = {
    ...params,
    sales: 0,
    views: 0,
    status: params.status !== undefined ? params.status : 1,
    createTime: new Date(),
    updateTime: new Date()
  }
  
  const result = await db.collection('products').add({
    data: productData
  })
  
  return {
    _id: result._id,
    ...productData
  }
}

// 13. 更新商品
async function adminUpdateProduct(params) {
  const { id, ...data } = params
  
  if (!id) {
    throw new Error('商品ID不能为空')
  }
  
  await db.collection('products').doc(id).update({
    data: {
      ...data,
      updateTime: new Date()
    }
  })
  
  return { success: true }
}

// 14. 删除商品
async function adminDeleteProduct(params) {
  const { id } = params
  
  if (!id) {
    throw new Error('商品ID不能为空')
  }
  
  await db.collection('products').doc(id).remove()
  
  return { success: true }
}

// 15. 更新商品状态
async function adminUpdateProductStatus(params) {
  const { id, status } = params
  
  if (!id) {
    throw new Error('商品ID不能为空')
  }
  
  if (status === undefined) {
    throw new Error('状态不能为空')
  }
  
  await db.collection('products').doc(id).update({
    data: {
      status: parseInt(status),
      updateTime: new Date()
    }
  })
  
  return { success: true }
}

// 16. 后台获取分类列表
async function adminGetCategoryList(params = {}) {
  const { page = 1, pageSize = 10, keyword } = params
  
  let where = {}
  
  if (keyword) {
    where.name = db.RegExp({
      regexp: keyword,
      options: 'i'
    })
  }
  
  const [listResult, countResult] = await Promise.all([
    db.collection('categories')
      .where(where)
      .orderBy('sort', 'asc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get(),
    db.collection('categories').where(where).count()
  ])
  
  return {
    list: listResult.data,
    total: countResult.total,
    page,
    pageSize
  }
}

// 17. 创建分类
async function adminCreateCategory(params) {
  const categoryData = {
    ...params,
    status: params.status !== undefined ? params.status : 1,
    createTime: new Date(),
    updateTime: new Date()
  }
  
  const result = await db.collection('categories').add({
    data: categoryData
  })
  
  return {
    _id: result._id,
    ...categoryData
  }
}

// 18. 更新分类
async function adminUpdateCategory(params) {
  const { id, ...data } = params
  
  if (!id) {
    throw new Error('分类ID不能为空')
  }
  
  await db.collection('categories').doc(id).update({
    data: {
      ...data,
      updateTime: new Date()
    }
  })
  
  return { success: true }
}

// 19. 删除分类
async function adminDeleteCategory(params) {
  const { id } = params
  
  if (!id) {
    throw new Error('分类ID不能为空')
  }
  
  // 检查是否有商品使用此分类
  const productCount = await db.collection('products').where({ categoryId: id }).count()
  
  if (productCount.total > 0) {
    throw new Error('该分类下存在商品，无法删除')
  }
  
  await db.collection('categories').doc(id).remove()
  
  return { success: true }
}

// 20. 后台获取香型列表
async function adminGetAromaTypeList(params = {}) {
  const { page = 1, pageSize = 10, keyword } = params
  
  let where = {}
  
  if (keyword) {
    where.name = db.RegExp({
      regexp: keyword,
      options: 'i'
    })
  }
  
  const [listResult, countResult] = await Promise.all([
    db.collection('aroma_types')
      .where(where)
      .orderBy('sort', 'asc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get(),
    db.collection('aroma_types').where(where).count()
  ])
  
  return {
    list: listResult.data,
    total: countResult.total,
    page,
    pageSize
  }
}

// 21. 创建香型
async function adminCreateAromaType(params) {
  const aromaData = {
    ...params,
    status: params.status !== undefined ? params.status : 1,
    createTime: new Date(),
    updateTime: new Date()
  }
  
  const result = await db.collection('aroma_types').add({
    data: aromaData
  })
  
  return {
    _id: result._id,
    ...aromaData
  }
}

// 22. 更新香型
async function adminUpdateAromaType(params) {
  const { id, ...data } = params
  
  if (!id) {
    throw new Error('香型ID不能为空')
  }
  
  await db.collection('aroma_types').doc(id).update({
    data: {
      ...data,
      updateTime: new Date()
    }
  })
  
  return { success: true }
}

// 23. 删除香型
async function adminDeleteAromaType(params) {
  const { id } = params
  
  if (!id) {
    throw new Error('香型ID不能为空')
  }
  
  await db.collection('aroma_types').doc(id).remove()
  
  return { success: true }
}

// 24. 后台获取知识列表
async function adminGetKnowledgeList(params = {}) {
  const { page = 1, pageSize = 10, keyword, category } = params
  
  let where = {}
  
  if (keyword) {
    where.title = db.RegExp({
      regexp: keyword,
      options: 'i'
    })
  }
  
  if (category) {
    where.category = category
  }
  
  const [listResult, countResult] = await Promise.all([
    db.collection('knowledge')
      .where(where)
      .orderBy('createTime', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get(),
    db.collection('knowledge').where(where).count()
  ])
  
  return {
    list: listResult.data,
    total: countResult.total,
    page,
    pageSize
  }
}

// 25. 创建知识文章
async function adminCreateKnowledge(params) {
  const knowledgeData = {
    ...params,
    views: 0,
    status: params.status !== undefined ? params.status : 1,
    createTime: new Date(),
    updateTime: new Date()
  }
  
  const result = await db.collection('knowledge').add({
    data: knowledgeData
  })
  
  return {
    _id: result._id,
    ...knowledgeData
  }
}

// 26. 更新知识文章
async function adminUpdateKnowledge(params) {
  const { id, ...data } = params
  
  if (!id) {
    throw new Error('文章ID不能为空')
  }
  
  await db.collection('knowledge').doc(id).update({
    data: {
      ...data,
      updateTime: new Date()
    }
  })
  
  return { success: true }
}

// 27. 删除知识文章
async function adminDeleteKnowledge(params) {
  const { id } = params
  
  if (!id) {
    throw new Error('文章ID不能为空')
  }
  
  await db.collection('knowledge').doc(id).remove()
  
  return { success: true }
}

// 28. 后台获取站点配置
async function adminGetSiteConfig() {
  const result = await db.collection('site_config').limit(1).get()
  return result.data[0] || null
}

// 29. 更新站点配置
async function adminUpdateSiteConfig(params) {
  const result = await db.collection('site_config').limit(1).get()
  
  if (result.data.length > 0) {
    // 更新
    await db.collection('site_config').doc(result.data[0]._id).update({
      data: {
        ...params,
        updateTime: new Date()
      }
    })
  } else {
    // 创建
    await db.collection('site_config').add({
      data: {
        ...params,
        createTime: new Date(),
        updateTime: new Date()
      }
    })
  }
  
  return { success: true }
}

// 30. 后台获取轮播图列表
async function adminGetBannerList(params = {}) {
  const { page = 1, pageSize = 10, position } = params
  
  let where = {}
  
  if (position !== undefined && position !== '') {
    where.position = parseInt(position)
  }
  
  const [listResult, countResult] = await Promise.all([
    db.collection('banners')
      .where(where)
      .orderBy('sort', 'asc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get(),
    db.collection('banners').where(where).count()
  ])
  
  return {
    list: listResult.data,
    total: countResult.total,
    page,
    pageSize
  }
}

// 31. 创建轮播图
async function adminCreateBanner(params) {
  const bannerData = {
    ...params,
    status: params.status !== undefined ? params.status : 1,
    createTime: new Date(),
    updateTime: new Date()
  }
  
  const result = await db.collection('banners').add({
    data: bannerData
  })
  
  return {
    _id: result._id,
    ...bannerData
  }
}

// 32. 更新轮播图
async function adminUpdateBanner(params) {
  const { id, ...data } = params
  
  if (!id) {
    throw new Error('轮播图ID不能为空')
  }
  
  await db.collection('banners').doc(id).update({
    data: {
      ...data,
      updateTime: new Date()
    }
  })
  
  return { success: true }
}

// 33. 删除轮播图
async function adminDeleteBanner(params) {
  const { id } = params
  
  if (!id) {
    throw new Error('轮播图ID不能为空')
  }
  
  await db.collection('banners').doc(id).remove()
  
  return { success: true }
}

// 34. 更新轮播图状态
async function adminUpdateBannerStatus(params) {
  const { id, status } = params
  
  if (!id) {
    throw new Error('轮播图ID不能为空')
  }
  
  if (status === undefined) {
    throw new Error('状态不能为空')
  }
  
  await db.collection('banners').doc(id).update({
    data: {
      status: parseInt(status),
      updateTime: new Date()
    }
  })
  
  return { success: true }
}

// 35. 后台登录
async function adminLogin(params) {
  const { username, password } = params
  
  if (!username || !password) {
    throw new Error('用户名和密码不能为空')
  }
  
  const result = await db.collection('admins').where({
    username: username,
    password: password
  }).get()
  
  if (result.data.length === 0) {
    throw new Error('用户名或密码错误')
  }
  
  const admin = result.data[0]
  
  // 更新最后登录时间
  await db.collection('admins').doc(admin._id).update({
    data: {
      lastLoginTime: new Date()
    }
  })
  
  return {
    id: admin._id,
    username: admin.username,
    nickname: admin.nickname || admin.username,
    role: admin.role || 'admin'
  }
}
