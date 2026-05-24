/**
 * api/index.js - 统一请求入口
 *
 * 开发/上线切换规则：
 *   .env.development: VUE_APP_USE_MOCK=true  → 所有请求返回模拟数据
 *   .env.production:  VUE_APP_USE_MOCK=false → 所有请求走真实 API
 *
 * 上线时只需更改环境变量，无需修改业务代码
 */
import axios from 'axios'

const USE_MOCK = process.env.VUE_APP_USE_MOCK === 'true'

// 云函数地址（仅在 USE_MOCK=false 时使用）
const CLOUD_FUNCTION_URL = process.env.VUE_APP_CLOUD_FUNCTION_URL || ''

const service = axios.create({
  baseURL: CLOUD_FUNCTION_URL,
  timeout: 15000
})

service.interceptors.response.use(
  response => {
    let res = response.data
    
    // 云函数 HTTP 返回格式：{ statusCode, headers, body: "json字符串" }
    // 需要解析 body 获取真正的 API 响应
    if (res.body && typeof res.body === 'string') {
      try {
        res = JSON.parse(res.body)
      } catch (e) {
        return Promise.reject(new Error('响应格式错误'))
      }
    }
    
    if (res.code !== 0) {
      if (res.code === 401) {
        localStorage.removeItem('Admin-Token')
        localStorage.removeItem('adminUserInfo')
        window.location.reload()
      }
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  error => Promise.reject(error)
)

// ==================== 云函数调用 ====================
export function callCloudFunction(action, params = {}) {
  if (USE_MOCK) return Promise.resolve({ code: 0, data: {} })
  return service({ url: '/', method: 'post', data: { action, params } })
}

// ==================== 通用请求（自动路由 Mock/Real） ====================
// URL 到云函数 action 的映射表
const URL_TO_ACTION_MAP = {
  // 分类
  '/api/admin/categories/all': { action: 'adminGetCategoryList', method: 'get' },
  '/api/admin/categories': { action_post: 'adminCreateCategory', action_put: 'adminUpdateCategory', action_delete: 'adminDeleteCategory', action_get: 'adminGetCategoryList' },
  // 香型
  '/api/admin/aromas/all': { action: 'adminGetAromaTypeList', method: 'get' },
  '/api/admin/aromas': { action_post: 'adminCreateAromaType', action_put: 'adminUpdateAromaType', action_delete: 'adminDeleteAromaType', action_get: 'adminGetAromaTypeList' },
  // 商品
  '/api/admin/products': { action_post: 'adminCreateProduct', action_put: 'adminUpdateProduct', action_delete: 'adminDeleteProduct', action_get: 'adminGetProductList' },
  // 轮播图
  '/api/admin/banners': { action_post: 'adminCreateBanner', action_put: 'adminUpdateBanner', action_delete: 'adminDeleteBanner', action_get: 'adminGetBannerList' },
  // 知识
  '/api/admin/knowledge': { action_post: 'adminCreateKnowledge', action_put: 'adminUpdateKnowledge', action_delete: 'adminDeleteKnowledge', action_get: 'adminGetKnowledgeList' },
  // 站点配置
  '/api/admin/settings': { action_get: 'getSiteConfig', action_put: 'adminUpdateSiteConfig' },
  '/api/admin/contact': { action_get: 'getSiteConfig', action_put: 'adminUpdateSiteConfig' },
  // 统计
  '/api/admin/statistics/dashboard': { action: 'getHomeData', method: 'get' },
  // 登录
  '/api/admin/login': { action: 'adminLogin', method: 'post' },
  // 文件上传
  '/api/admin/upload': { action: 'uploadFile', method: 'post' },
}

// 从 URL 中提取 ID（如 /api/admin/products/xxx → xxx）
function extractId(url, basePath) {
  const id = url.replace(basePath, '').replace(/^\//, '')
  return id || null
}

export default function request(config) {
  const { url, method = 'get', data, params } = config

  if (!USE_MOCK) {
    // 将 REST API 调用转换为云函数 action 调用
    const matched = Object.keys(URL_TO_ACTION_MAP).find(key => url === key || url.startsWith(key + '/'))
    if (matched) {
      const mapping = URL_TO_ACTION_MAP[matched]
      let action = ''
      let cloudParams = params || data || {}

      if (mapping.action) {
        action = mapping.action
      } else {
        // 根据 HTTP 方法选择 action
        const methodKey = 'action_' + method.toLowerCase()
        action = mapping[methodKey] || mapping.action_get || ''
      }

      // 如果 URL 包含 ID（如 /api/admin/products/xxx），提取并传入参数
      if (url !== matched) {
        const id = extractId(url, matched)
        if (id) {
          cloudParams = { ...cloudParams, id }
        }
        // 处理子路径（如 /status）
        if (url.includes('/status')) {
          action = matched.includes('/products') ? 'adminUpdateProductStatus' : action
        }
      }

      if (!action) {
        console.warn('未找到对应的云函数 action:', url, method)
        return service(config)
      }

      return service({ url: '/', method: 'post', data: { action, params: cloudParams } })
    }

    // 未匹配的 URL 直接转发
    return service(config)
  }

  // 以下为 USE_MOCK=true 时的处理
  if (url.startsWith('/api/admin/products'))    return handleProductRequest(url, method, data, params)
  if (url.startsWith('/api/admin/categories'))  return handleCategoryRequest(url, method, data, params)
  if (url.startsWith('/api/admin/orders'))      return handleOrderRequest(url, method, data, params)
  if (url.startsWith('/api/admin/users'))       return handleUserRequest(url, method, data, params)
  if (url.startsWith('/api/admin/banners'))     return handleBannerRequest(url, method, data, params)
  if (url.startsWith('/api/admin/coupons'))     return handleCouponRequest(url, method, data, params)
  if (url.startsWith('/api/admin/returns'))     return handleReturnRequest(url, method, data, params)
  if (url.startsWith('/api/admin/logs'))        return handleLogRequest(url, method, data, params)
  if (url.startsWith('/api/admin/messages'))    return handleMessageRequest(url, method, data, params)
  if (url.startsWith('/api/admin/export'))      return handleExportRequest(url, method, data, params)
  if (url.startsWith('/api/admin/aromas'))      return handleAromaRequest(url, method, data, params)
  if (url.includes('/login'))                   return mockLogin(data.username, data.password)
  if (url.startsWith('/api/admin/contact'))     return handleContactRequest(url, method, data, params)
  if (url.startsWith('/api/admin/statistics'))  return handleStatisticsRequest(url, method, data, params)
  if (url.startsWith('/api/admin/knowledge'))   return handleKnowledgeRequest(url, method, data, params)
  if (url.startsWith('/api/admin/settings'))    return handleSettingRequest(url, method, data, params)
  if (url.startsWith('/api/admin/upload'))      return handleUploadRequest(url, method, data, params)

  return service(config)
}

// ==================== Mock 工具函数 ====================
function mockSuccess(data) {
  return new Promise(r => setTimeout(() => r({ code: 0, data }), 200))
}

// ==================== 登录 Mock ====================
function mockLogin(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        resolve({ code: 0, message: 'success', data: { token: 'admin-token-123456', user: { id: 1, username, name: '管理员', avatar: '', role: 'admin' } } })
      } else {
        reject(new Error('用户名或密码错误'))
      }
    }, 300)
  })
}

// ==================== 香型 Mock ====================
function handleAromaRequest(url, method, data, params) {
  if (method === 'get') return mockSuccess(mockAdminAromaList())
  if (method === 'post') return mockSuccess({ _id: 'a_' + Date.now(), ...data })
  const idMatch = url.match(/\/aromas\/([^/]+)/)
  const id = idMatch ? idMatch[1] : null
  if (id && method === 'get') return mockSuccess(mockAdminAromaList().find(a => a._id === id))
  if (id && method === 'put') return mockSuccess({ id, ...data })
  if (id && method === 'delete') return mockSuccess('ok')
  return Promise.reject(new Error('未知接口'))
}

function mockAdminAromaList() {
  return [
    { _id: 'aroma_1', id: 'aroma_1', name: '黄栀香', aromaFeature: '栀子花清甜芬芳，高扬持久，尾调带熟蜜桃甜香', representative: '宋种东方红、贡香、老仙翁', qualityFeature: '汤色金黄，滋味甘醇鲜爽，回甘力强，耐冲泡' },
    { _id: 'aroma_2', id: 'aroma_2', name: '芝兰香', aromaFeature: '清雅细长，似幽谷芝兰', representative: '八仙过海、宋种芝兰香', qualityFeature: '汤色橙黄明亮，滋味鲜爽甘醇，山韵明显' },
    { _id: 'aroma_3', id: 'aroma_3', name: '蜜兰香', aromaFeature: '蜜甜+兰香，番薯般甜润', representative: '香番薯、大庵蜜兰', qualityFeature: '甜润耐泡，"蜜韵"突出，饮后满口生香' },
    { _id: 'aroma_4', id: 'aroma_4', name: '桂花香', aromaFeature: '馥郁桂花甜香，甜而不腻', representative: '桂花香单丛', qualityFeature: '条索紧卷纤细，汤色金黄明亮，山韵独特' },
    { _id: 'aroma_5', id: 'aroma_5', name: '玉兰香', aromaFeature: '高扬奔放，酷似玉兰花', representative: '金玉兰、娘仔伞', qualityFeature: '香气清幽持久，滋味醇厚' },
    { _id: 'aroma_6', id: 'aroma_6', name: '姜花香', aromaFeature: '辛辣似姜花（通天香）', representative: '通天香单丛', qualityFeature: '入口微辣，回甘迅猛，年底"返春"回香更佳' },
    { _id: 'aroma_7', id: 'aroma_7', name: '夜来香', aromaFeature: '浓郁夜来花香', representative: '夜来香单丛', qualityFeature: '香气独特，辨识度高' },
    { _id: 'aroma_8', id: 'aroma_8', name: '杏仁香', aromaFeature: '淡淡果仁香，回甘有力', representative: '杏仁香单丛', qualityFeature: '条索紧直纤细，灰褐色，韵味独特' },
    { _id: 'aroma_9', id: 'aroma_9', name: '肉桂香', aromaFeature: '桂皮香+花果香复合', representative: '肉桂香单丛', qualityFeature: '滋味醇厚，有独特"桂韵"' },
    { _id: 'aroma_10', id: 'aroma_10', name: '银花香（鸭屎香）', aromaFeature: '金银花+奶香+杏仁香，层次分明', representative: '坪坑头银花香、大乌叶银花香', qualityFeature: '香气层次丰富，回甘持久，山韵明显' }
  ]
}

// ==================== 联系我们 Mock（重定向到 settings） ====================
function handleContactRequest(url, method, data, params) {
  return handleSettingRequest(url, method, data, params)
}

// ==================== 商品 Mock ====================
function handleProductRequest(url, method, data, params) {
  if (url.includes('/count')) return mockSuccess({ count: mockAdminProductList().list.length, total: mockAdminProductList().list.length })
  const idMatch = url.match(/\/products\/([^/]+)/); const id = idMatch ? idMatch[1] : null
  if (url === '/api/admin/products' && method === 'get') return mockSuccess(mockAdminProductList(params))
  if (url === '/api/admin/products' && method === 'post') return mockSuccess({ _id: 'p_' + Date.now(), ...data })
  if (id && url.includes('/status') && method === 'put') return mockSuccess('ok')
  if (id && method === 'get') return mockSuccess(mockAdminProductDetail(id))
  if (id && method === 'put') return mockSuccess({ id, ...data })
  if (id && method === 'delete') return mockSuccess('ok')
  if (url.includes('/batch')) return mockSuccess('ok')
  return Promise.reject(new Error('未知接口'))
}

function mockAdminProductList(params = {}) {
  const all = [
    { _id: 'p1', name: '蜜兰香', cover: 'https://picsum.photos/seed/chabao10/600/600', imageUrl: 'https://picsum.photos/seed/chatou10/600/600', categoryId: 'cat_normal', categoryName: '单枞茶', aromaName: '蜜兰香', price: 298, originalPrice: 398, weight: '500g', packTypes: ['袋装', '铁罐', '礼盒'], origin: '潮州凤凰山', altitude: '800m', roast: '炭焙', season: '春茶', tags: ['中山', '炭焙', '春茶'], status: 1, isNew: false, isHot: true, sales: 324, brief: '蜜甜兰香，番薯般甜润，经典蜜韵', createTime: '2026-03-10' },
    { _id: 'p2', name: '蜜兰香·二春', cover: 'https://picsum.photos/seed/chabao2/600/600', imageUrl: 'https://picsum.photos/seed/chatou4/600/600', categoryId: 'cat_normal', categoryName: '单枞茶', aromaName: '蜜兰香', price: 228, originalPrice: 298, weight: '500g', packTypes: ['袋装', '铁罐'], origin: '潮州凤凰山', altitude: '600m', roast: '电焙', season: '二春', tags: ['中山', '电焙', '二春', '性价比'], status: 1, isNew: false, isHot: true, sales: 289, brief: '蜜兰香二春，经典风味性价比之选', createTime: '2026-03-15' },
    { _id: 'p3', name: '大乌叶', cover: 'https://picsum.photos/seed/chabao9/600/600', imageUrl: 'https://picsum.photos/seed/chatou9/600/600', categoryId: 'cat_normal', categoryName: '单枞茶', aromaName: '黄栀香', price: 258, originalPrice: 358, weight: '500g', packTypes: ['袋装', '铁罐', '礼盒'], origin: '潮州凤凰山', altitude: '800m', roast: '炭焙', season: '春茶', tags: ['中山', '炭焙', '春茶'], status: 1, isNew: false, isHot: true, sales: 298, brief: '栀子花清甜芬芳，黄栀香经典代表', createTime: '2026-03-20' },
    { _id: 'p4', name: '大乌叶·二春', cover: 'https://picsum.photos/seed/chatou3/600/600', imageUrl: 'https://picsum.photos/seed/chatou2/600/600', categoryId: 'cat_normal', categoryName: '单枞茶', aromaName: '黄栀香', price: 158, originalPrice: 218, weight: '500g', packTypes: ['袋装'], origin: '潮州凤凰山', altitude: '500m', roast: '电焙', season: '二春', tags: ['低山', '电焙', '二春', '实惠'], status: 1, isNew: false, isHot: false, sales: 178, brief: '黄栀香型二春，栀子花香入门实惠之选', createTime: '2026-03-25' },
    { _id: 'p5', name: '黄栀香·桂花香', cover: 'https://picsum.photos/seed/chabao4/600/600', imageUrl: 'https://picsum.photos/seed/chatou6/600/600', categoryId: 'cat_normal', categoryName: '单枞茶', aromaName: '桂花香', price: 188, originalPrice: 258, weight: '500g', packTypes: ['袋装', '铁罐', '礼盒'], origin: '潮州凤凰山', altitude: '800m', roast: '炭焙', season: '春茶', tags: ['中山', '炭焙', '春茶'], status: 1, isNew: false, isHot: false, sales: 98, brief: '馥郁桂花甜香，甜而不腻花果香型经典', createTime: '2026-04-01' },
    { _id: 'p6', name: '姜花香（通天香）', cover: 'https://picsum.photos/seed/chabao3/600/600', imageUrl: 'https://picsum.photos/seed/chatou5/600/600', categoryId: 'cat_normal', categoryName: '单枞茶', aromaName: '姜花香', price: 388, originalPrice: 488, weight: '500g', packTypes: ['袋装', '铁罐', '礼盒'], origin: '潮州凤凰山', altitude: '900m', roast: '炭焙', season: '春茶', tags: ['高山', '炭焙', '春茶', '稀缺'], status: 1, isNew: true, isHot: false, sales: 76, brief: '又名通天香稀缺香型入口微辣回甘迅猛', createTime: '2026-04-10' },
    { _id: 'p7', name: '桂花香单丛', cover: 'https://picsum.photos/seed/chabao5/600/600', imageUrl: 'https://picsum.photos/seed/chatou7/600/600', categoryId: 'cat_normal', categoryName: '单枞茶', aromaName: '桂花香', price: 168, originalPrice: 228, weight: '500g', packTypes: ['袋装', '铁罐'], origin: '潮州凤凰山', altitude: '600m', roast: '炭焙', season: '春茶', tags: ['中山', '炭焙', '春茶'], status: 1, isNew: false, isHot: false, sales: 78, brief: '桂花甜香馥郁持久', createTime: '2026-04-15' },
    { _id: 'p8', name: '杏仁香·锯朵仔', cover: 'https://picsum.photos/seed/chabao6/600/600', imageUrl: 'https://picsum.photos/seed/chatou8/600/600', categoryId: 'cat_normal', categoryName: '单枞茶', aromaName: '杏仁香', price: 358, originalPrice: 458, weight: '500g', packTypes: ['袋装', '铁罐', '礼盒'], origin: '潮州凤凰山', altitude: '800m', roast: '炭焙', season: '春茶', tags: ['中山', '炭焙', '春茶'], status: 1, isNew: true, isHot: true, sales: 178, brief: '果仁香韵回甘有力杏仁香经典', createTime: '2026-04-20' },
    { _id: 'p9', name: '锯朵仔·二春', cover: 'https://picsum.photos/seed/chatou1/600/600', imageUrl: 'https://picsum.photos/seed/chatou0/600/600', categoryId: 'cat_normal', categoryName: '单枞茶', aromaName: '杏仁香', price: 228, originalPrice: 318, weight: '500g', packTypes: ['袋装', '铁罐'], origin: '潮州凤凰山', altitude: '600m', roast: '电焙', season: '二春', tags: ['中山', '电焙', '二春'], status: 1, isNew: false, isHot: false, sales: 88, brief: '杏仁香型二春电焙性价比之选', createTime: '2026-04-25' },
    { _id: 'p10', name: '鸭屎香·高山', cover: 'https://picsum.photos/seed/chabao1/600/600', imageUrl: 'https://picsum.photos/seed/chatou1b/600/600', categoryId: 'cat_normal', categoryName: '单枞茶', aromaName: '银花香（鸭屎香）', price: 428, originalPrice: 528, weight: '500g', packTypes: ['袋装', '铁罐', '礼盒'], origin: '潮州凤凰山乌岽村', altitude: '1100m', roast: '炭焙', season: '春茶', tags: ['乌岽', '古树', '炭焙', '春茶', '顶级'], status: 1, isNew: true, isHot: true, sales: 98, brief: '乌岽古树高山版鸭屎香顶级之作', createTime: '2026-05-01' }
  ]
  const { keyword, categoryId, status } = params || {}
  let filtered = [...all]
  if (keyword) filtered = filtered.filter(p => p.name.includes(keyword))
  if (categoryId) filtered = filtered.filter(p => p.categoryId === categoryId)
  if (status !== '' && status !== undefined && status !== null) filtered = filtered.filter(p => p.status === status)
  return { list: filtered, total: filtered.length }
}

function mockAdminProductDetail(id) {
  const prod = mockAdminProductList().list.find(p => p._id === id) || mockAdminProductList().list[0]
  return { ...prod, brief: '精选优质茶叶，传统工艺制作', content: '这是一款精选的优质茶叶，采用传统工艺，保留最原始的茶香。', images: [] }
}

// ==================== 分类 Mock ====================
function handleCategoryRequest(url, method, data, params) {
  if (url === '/api/admin/categories/all' && method === 'get') return mockSuccess(mockAdminCategoryList())
  const idMatch = url.match(/\/categories\/([^/]+)/); const id = idMatch ? idMatch[1] : null
  if (url === '/api/admin/categories' && method === 'get') return mockSuccess(mockAdminCategoryList())
  if (url === '/api/admin/categories' && method === 'post') return mockSuccess({ _id: 'cat_' + Date.now(), ...data })
  if (id && method === 'get') return mockSuccess({ _id: id, name: '单枞茶', icon: '', sort: 1, status: true, description: '' })
  if (id && method === 'put') return mockSuccess({ id, ...data })
  if (id && method === 'delete') return mockSuccess('ok')
  return Promise.reject(new Error('未知接口'))
}

function mockAdminCategoryList() {
  return [
    { _id: 'cat_normal', id: 'cat_normal', name: '单枞茶', icon: '', sort: 1, status: true, description: '凤凰单枞精选茶品' },
    { _id: 'cat_special', id: 'cat_special', name: '特惠茶', icon: '', sort: 2, status: true, description: '茶头茶包，经济实惠' },
    { _id: 'cat_farm', id: 'cat_farm', name: '农产品', icon: '', sort: 3, status: true, description: '凤凰山农特产品' }
  ]
}

// ==================== 订单 Mock ====================
function handleOrderRequest(url, method, data, params) {
  const idMatch = url.match(/\/orders\/([^/]+)/); const id = idMatch ? idMatch[1] : null
  if (url === '/api/admin/orders' && method === 'get') return mockSuccess(mockAdminOrderList(params))
  if (id && method === 'get') return mockSuccess(mockAdminOrderDetail(id))
  if (id && url.includes('/status') && method === 'put') return mockSuccess('ok')
  if (id && url.includes('/ship') && method === 'put') return mockSuccess('ok')
  if (id && url.includes('/cancel') && method === 'put') return mockSuccess('ok')
  if (id && url.includes('/refund') && method === 'post') return mockSuccess('ok')
  return Promise.reject(new Error('未知接口'))
}

function mockAdminOrderList(params = {}) {
  const all = [
    { _id: 'o1', id: 'o1', orderNo: 'T20260520001', userName: '张先生', userPhone: '138****8888', productCount: 3, totalAmount: 258, status: 10, createTime: '2026-05-20 10:23:45' },
    { _id: 'o2', id: 'o2', orderNo: 'T20260520002', userName: '李女士', userPhone: '139****6666', productCount: 1, totalAmount: 198, status: 20, createTime: '2026-05-20 09:15:30' },
    { _id: 'o3', id: 'o3', orderNo: 'T20260519001', userName: '王先生', userPhone: '137****5555', productCount: 2, totalAmount: 356, status: 30, createTime: '2026-05-19 14:20:10' },
    { _id: 'o4', id: 'o4', orderNo: 'T20260519002', userName: '赵女士', userPhone: '136****0001', productCount: 1, totalAmount: 175, status: 40, createTime: '2026-05-19 11:05:22' },
    { _id: 'o5', id: 'o5', orderNo: 'T20260518001', userName: '孙先生', userPhone: '135****0002', productCount: 4, totalAmount: 420, status: 40, createTime: '2026-05-18 16:30:45' }
  ]
  const { status } = params || {}
  let filtered = [...all]
  if (status !== '' && status !== undefined && status !== null) filtered = filtered.filter(o => o.status === Number(status))
  return { list: filtered, total: filtered.length }
}

function mockAdminOrderDetail(id) {
  return {
    _id: id || 'o1', id: id || 'o1', orderNo: 'T20260520001', userName: '张先生', userPhone: '138****8888',
    totalAmount: 258, originalAmount: 298, discountAmount: 40, deliveryFee: 10, freight: 10, actualAmount: 258,
    status: 10, paymentMethod: '微信支付', createTime: '2026-05-20 10:23:45', payTime: null,
    address: { name: '张先生', phone: '138****8888', province: '浙江省', city: '杭州市', district: '西湖区', detail: '文三路 138 号' },
    items: [
      { id: 'item_1', productId: 'p1', productName: '蜜兰香', productImage: '', specName: '500g', price: 298, quantity: 1, amount: 298 }
    ],
    logistics: null, remarks: ''
  }
}

// ==================== 用户 Mock ====================
function handleUserRequest(url, method, data, params) {
  const idMatch = url.match(/\/users\/([^/]+)/); const id = idMatch ? idMatch[1] : null
  if (url === '/api/admin/users' && method === 'get') return mockSuccess(mockUserList(params))
  if (id && method === 'get') return mockSuccess(mockUserDetail(id))
  if (id && url.includes('/status') && method === 'put') return mockSuccess('ok')
  if (id && url.includes('/blacklist') && method === 'post') return mockSuccess('ok')
  if (id && url.includes('/blacklist') && method === 'delete') return mockSuccess('ok')
  return Promise.reject(new Error('未知接口'))
}

function mockUserList(params = {}) {
  return {
    list: [
      { id: 'u1', _id: 'u1', nickName: '张先生', avatarUrl: '', phone: '138****8888', level: 3, points: 2560, orderCount: 12, totalAmount: 3680, status: 1, createTime: '2026-04-10' },
      { id: 'u2', _id: 'u2', nickName: '李女士', avatarUrl: '', phone: '139****6666', level: 2, points: 1280, orderCount: 5, totalAmount: 1560, status: 1, createTime: '2026-04-20' },
      { id: 'u3', _id: 'u3', nickName: '茶友小王', avatarUrl: '', phone: '137****5555', level: 1, points: 320, orderCount: 2, totalAmount: 456, status: 1, createTime: '2026-05-01' },
      { id: 'u4', _id: 'u4', nickName: '品茗达人', avatarUrl: '', phone: '136****9999', level: 4, points: 8900, orderCount: 28, totalAmount: 12560, status: 1, createTime: '2026-03-15' },
      { id: 'u5', _id: 'u5', nickName: '测试账号A', avatarUrl: '', phone: '135****0000', level: 1, points: 0, orderCount: 0, totalAmount: 0, status: 0, createTime: '2026-05-18' }
    ], total: 5
  }
}

function mockUserDetail(id) {
  return {
    id: id || 'u1', _id: id || 'u1', nickName: '张先生', avatarUrl: '', phone: '138****8888', level: 3, points: 2560,
    status: 1, createTime: '2026-04-10 08:30:00',
    addresses: [
      { id: 'a1', name: '张先生', phone: '138****8888', province: '浙江省', city: '杭州市', district: '西湖区', detail: '文三路 138 号', isDefault: true }
    ],
    recentOrders: [
      { id: 'o1', orderNo: 'T20260520001', totalAmount: 258, status: 10, createTime: '2026-05-20 10:23:45' }
    ]
  }
}

// ==================== 仪表盘统计 Mock ====================
function handleDashboardCount(url, method, data, params) {
  return mockSuccess({
    products: mockAdminProductList().list.length,
    orders: mockAdminOrderList().list.length,
    users: mockUserList().list.length,
    categories: mockAdminCategoryList().length,
    aromas: mockAdminAromaList().length,
    knowledge: 2,
    banners: 1,
    coupons: 1
  })
}

// ==================== 统计 Mock ====================
function handleStatisticsRequest(url, method, data, params) {
  if (url.includes('/dashboard')) return mockSuccess({
    todayOrders: 24, todaySales: 4280, totalUsers: 1892, totalProducts: 86,
    pendingPay: 5, pendingDeliver: 8, pendingRefund: 2,
    lowStockProducts: [{ id: '1', name: '西湖龙井 特级', spec: '50g', stock: 3 }],
    topProducts: [
      { id: '1', name: '蜜兰香', cover: '', sales: 324 },
      { id: '2', name: '大乌叶', cover: '', sales: 298 },
      { id: '3', name: '蜜兰香·二春', cover: '', sales: 289 }
    ],
    recentOrders: [
      { _id: '1', orderNo: 'T20260520001', userName: '张先生', totalAmount: 258, status: 10, createTime: '2026-05-20 10:23:45' },
      { _id: '2', orderNo: 'T20260520002', userName: '李女士', totalAmount: 198, status: 20, createTime: '2026-05-20 09:15:30' }
    ]
  })
  if (url.includes('/sales')) return mockSuccess({
    summary: { totalSales: 56800, totalOrders: 356, avgOrder: 159.5, refundAmount: 1280 },
    trend: [{ date: '05/14', sales: 3200, orders: 12 }, { date: '05/15', sales: 2800, orders: 10 }, { date: '05/16', sales: 3600, orders: 15 }, { date: '05/17', sales: 4200, orders: 18 }, { date: '05/18', sales: 3800, orders: 14 }, { date: '05/19', sales: 5100, orders: 22 }, { date: '05/20', sales: 4280, orders: 24 }]
  })
  if (url.includes('/products/ranking')) return mockSuccess({
    list: [{ id: '1', name: '蜜兰香', sales: 324, amount: 96552 }, { id: '2', name: '大乌叶', sales: 298, amount: 76884 }, { id: '3', name: '蜜兰香·二春', sales: 289, amount: 65892 }]
  })
  if (url.includes('/users/growth')) return mockSuccess({
    summary: { totalUsers: 1892, newToday: 12, activeToday: 86 },
    trend: [{ date: '05/14', newUsers: 8 }, { date: '05/15', newUsers: 10 }, { date: '05/16', newUsers: 15 }, { date: '05/17', newUsers: 12 }, { date: '05/18', newUsers: 18 }, { date: '05/19', newUsers: 14 }, { date: '05/20', newUsers: 12 }]
  })
  if (url.includes('/categories/sales')) return mockSuccess([
    { name: '单枞茶', sales: 456, amount: 98000 }, { name: '特惠茶', sales: 234, amount: 56000 }, { name: '农产品', sales: 89, amount: 24000 }
  ])
  return Promise.reject(new Error('未知接口'))
}

// ==================== 其他模块 Mock（简化） ====================
function handleBannerRequest(url, method, data, params) {
  if (method === 'get') return mockSuccess({ list: [{ id: 'b1', title: '春季新茶上市', image: '', sort: 1, status: 1, position: 1, createTime: '2026-03-01' }], total: 1 })
  return mockSuccess('ok')
}

function handleCouponRequest(url, method, data, params) {
  if (method === 'get') return mockSuccess({ list: [{ id: 'c1', name: '新人专享券', type: 'no_threshold', discountAmount: 10, minAmount: 0, totalCount: 1000, usedCount: 356, status: 1, startTime: '2026-03-01', endTime: '2026-12-31' }], total: 1 })
  return mockSuccess('ok')
}

function handleReturnRequest(url, method, data, params) {
  if (method === 'get') return mockSuccess({ list: [], total: 0 })
  return mockSuccess('ok')
}

function handleLogRequest(url, method, data, params) {
  if (method === 'get') return mockSuccess({ list: [], total: 0 })
  return mockSuccess('ok')
}

function handleMessageRequest(url, method, data, params) {
  if (method === 'get') return mockSuccess({ list: [], total: 0 })
  return mockSuccess('ok')
}

function handleExportRequest(url, method, data, params) {
  return mockSuccess({ url: '/exports/data.xlsx' })
}

function handleKnowledgeRequest(url, method, data, params) {
  if (url.includes('/count')) return mockSuccess({ count: 2, total: 2 })
  const idMatch = url.match(/\/knowledge\/([^/]+)/); const id = idMatch ? idMatch[1] : null
  if (url === '/api/admin/knowledge' && method === 'get') return mockSuccess({
    list: [
      { _id: 'k1', title: '凤凰单枞怎么泡最好喝', categoryName: '冲泡技巧', summary: '教你泡出单枞茶的最佳风味', views: 1280, status: 1, createTime: '2026-05-18' },
      { _id: 'k2', title: '如何辨别正宗凤凰单枞', categoryName: '茶叶鉴别', summary: '辨别正宗单枞的四个方面', views: 856, status: 1, createTime: '2026-05-15' }
    ], total: 2
  })
  if (id && method === 'get') return mockSuccess({ _id: id, title: '凤凰单枞怎么泡最好喝', categoryId: 'c2', content: '', tags: [], status: 1 })
  if (url.includes('/categories') && method === 'get') return mockSuccess([{ _id: 'c1', name: '茶文化' }, { _id: 'c2', name: '冲泡技巧' }])
  return mockSuccess('ok')
}

function handleSettingRequest(url, method, data, params) {
  if (method === 'get') return mockSuccess({
    brand: { brandName: '凤凰单枞', slogan: '一丛一味 · 百丛百香' },
    contact: { wechatId: 'tea_fenghuang', phone: '138****8888', email: 'contact@dancong.com', workHours: '周一至周日 9:00-21:00', address: '广东·汕头', productContactTitle: '品茶咨询', productContactDesc: '添加微信，了解更多详情', productContactBtnText: '复制微信号' },
    about: { aboutUs: '凤凰单枞，源于潮汕凤凰山，专注单枞茶。一丛一味，百丛百香，每一杯都是大自然独一无二的馈赠。' }
  })
  // 处理子路径更新：brand/contact/about
  if (url.includes('/brand')) return mockSuccess({ ...data, updatedAt: new Date().toISOString() })
  if (url.includes('/contact')) return mockSuccess({ ...data, updatedAt: new Date().toISOString() })
  if (url.includes('/about')) return mockSuccess({ ...data, updatedAt: new Date().toISOString() })
  return mockSuccess({ ...data, updatedAt: new Date().toISOString() })
}

function handleUploadRequest(url, method, data, params) {
  return mockSuccess({ url: 'https://picsum.photos/400/400?random=' + Math.floor(Math.random() * 100) })
}
