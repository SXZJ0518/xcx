// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

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
  const { openid, unionid } = wxContext

  switch (action) {
    case 'getProductList':
      return await getProductList(params)
    case 'getProductDetail':
      return await getProductDetail(params)
    case 'searchProducts':
      return await searchProducts(params)

    case 'getCategoryList':
      return await getCategoryList()

    case 'getBannerList':
      return await getBannerList()

    // 管理后台商品相关
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
    case 'adminBatchDeleteProducts':
      return await adminBatchDeleteProducts(params)
    case 'adminBatchUpdateProductStatus':
      return await adminBatchUpdateProductStatus(params)

    // 管理后台分类相关
    case 'adminGetCategoryList':
      return await adminGetCategoryList(params)
    case 'adminGetCategoryDetail':
      return await adminGetCategoryDetail(params)
    case 'adminCreateCategory':
      return await adminCreateCategory(params)
    case 'adminUpdateCategory':
      return await adminUpdateCategory(params)
    case 'adminDeleteCategory':
      return await adminDeleteCategory(params)

    default:
      throw new Error('未知的操作类型')
  }
}

// ==================== 商品相关 ====================

async function getProductList(params = {}) {
  const { categoryId, page = 1, pageSize = 10, sort } = params
  let query = db.collection('product').where({
    status: 1
  })

  if (categoryId) {
    query = query.where({
      categoryId
    })
  }

  if (sort === 'price_asc') {
    query = query.orderBy('price', 'asc')
  } else if (sort === 'price_desc') {
    query = query.orderBy('price', 'desc')
  } else if (sort === 'sales_desc') {
    query = query.orderBy('sales', 'desc')
  } else {
    query = query.orderBy('createTime', 'desc')
  }

  const result = await query
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get()

  // 获取总数
  const countResult = await db.collection('product').where({ status: 1 }).count()

  return {
    list: result.data,
    total: countResult.total,
    page,
    pageSize
  }
}

async function getProductDetail(params) {
  const { id } = params
  const result = await db.collection('product').doc(id).get()

  if (!result.data) {
    throw new Error('商品不存在')
  }

  // 增加浏览量
  await db.collection('product').doc(id).update({
    data: {
      views: db.command.inc(1)
    }
  })

  return result.data
}

async function searchProducts(params) {
  const { keyword, page = 1, pageSize = 10 } = params

  // 使用正则搜索
  const result = await db.collection('product').where({
    status: 1,
    name: db.RegExp({
      regexp: keyword,
      options: 'i'
    })
  })
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get()

  const countResult = await db.collection('product').where({
    status: 1,
    name: db.RegExp({
      regexp: keyword,
      options: 'i'
    })
  }).count()

  return {
    list: result.data,
    total: countResult.total,
    page,
    pageSize
  }
}

// ==================== 分类相关 ====================

async function getCategoryList() {
  const result = await db.collection('category').where({
    status: 1
  })
    .orderBy('sort', 'asc')
    .get()

  return result.data
}

// ==================== 轮播图相关 ====================

async function getBannerList() {
  const result = await db.collection('banner').where({
    status: 1
  })
    .orderBy('sort', 'asc')
    .get()

  return result.data
}

// ==================== 管理后台 - 商品管理 ====================

async function adminGetProductList(params = {}) {
  const { page = 1, pageSize = 10, keyword, categoryId, status } = params
  let query = db.collection('product')

  if (keyword) {
    query = query.where({
      name: db.RegExp({
        regexp: keyword,
        options: 'i'
      })
    })
  }

  if (categoryId) {
    query = query.where({ categoryId })
  }

  if (status !== undefined && status !== '') {
    query = query.where({ status })
  }

  const result = await query
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get()

  const countResult = await db.collection('product').count()

  return {
    list: result.data,
    total: countResult.total,
    page,
    pageSize
  }
}

async function adminGetProductDetail(params) {
  const { id } = params
  const result = await db.collection('product').doc(id).get()

  if (!result.data) {
    throw new Error('商品不存在')
  }

  return result.data
}

async function adminCreateProduct(params) {
  const productData = {
    ...params,
    sales: 0,
    views: 0,
    createTime: new Date(),
    updateTime: new Date()
  }

  const result = await db.collection('product').add({
    data: productData
  })

  return {
    _id: result._id,
    ...productData
  }
}

async function adminUpdateProduct(params) {
  const { id, ...data } = params
  
  await db.collection('product').doc(id).update({
    data: {
      ...data,
      updateTime: new Date()
    }
  })

  return { success: true }
}

async function adminDeleteProduct(params) {
  const { id } = params
  
  await db.collection('product').doc(id).remove()

  return { success: true }
}

async function adminUpdateProductStatus(params) {
  const { id, status } = params
  
  await db.collection('product').doc(id).update({
    data: {
      status,
      updateTime: new Date()
    }
  })

  return { success: true }
}

async function adminBatchDeleteProducts(params) {
  const { ids } = params
  
  for (const id of ids) {
    await db.collection('product').doc(id).remove()
  }

  return { success: true }
}

async function adminBatchUpdateProductStatus(params) {
  const { ids, status } = params
  
  for (const id of ids) {
    await db.collection('product').doc(id).update({
      data: {
        status,
        updateTime: new Date()
      }
    })
  }

  return { success: true }
}

// ==================== 管理后台 - 分类管理 ====================

async function adminGetCategoryList(params = {}) {
  const { page = 1, pageSize = 10, keyword } = params
  let query = db.collection('category')

  if (keyword) {
    query = query.where({
      name: db.RegExp({
        regexp: keyword,
        options: 'i'
      })
    })
  }

  const result = await query
    .orderBy('sort', 'asc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get()

  const countResult = await db.collection('category').count()

  return {
    list: result.data,
    total: countResult.total,
    page,
    pageSize
  }
}

async function adminGetCategoryDetail(params) {
  const { id } = params
  const result = await db.collection('category').doc(id).get()

  if (!result.data) {
    throw new Error('分类不存在')
  }

  return result.data
}

async function adminCreateCategory(params) {
  const categoryData = {
    ...params,
    status: 1,
    createTime: new Date(),
    updateTime: new Date()
  }

  const result = await db.collection('category').add({
    data: categoryData
  })

  return {
    _id: result._id,
    ...categoryData
  }
}

async function adminUpdateCategory(params) {
  const { id, ...data } = params
  
  await db.collection('category').doc(id).update({
    data: {
      ...data,
      updateTime: new Date()
    }
  })

  return { success: true }
}

async function adminDeleteCategory(params) {
  const { id } = params
  
  await db.collection('category').doc(id).remove()

  return { success: true }
}
