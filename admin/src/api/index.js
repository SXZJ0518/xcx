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
    const res = response.data
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
export default function request(config) {
  const { url, method = 'get', data, params } = config

  if (!USE_MOCK) {
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
  if (url.includes('/login'))                   return mockLogin(data.username, data.password)
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
      if ((username === 'admin' && password === 'admin123') || (username === 'test' && password === 'test123')) {
        resolve({ code: 0, message: 'success', data: { token: 'admin-token-123456', user: { id: 1, username, name: username === 'admin' ? '管理员' : '测试用户', avatar: '', role: 'admin' } } })
      } else {
        reject(new Error('用户名或密码错误'))
      }
    }, 300)
  })
}

// ==================== 商品 Mock ====================
function handleProductRequest(url, method, data, params) {
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
    { _id: 'p1', name: '西湖龙井 明前特级', cover: '', categoryId: 'cat_1', categoryName: '绿茶', price: 298, originalPrice: 398, stock: 100, sales: 198, status: 1, isNew: true, isHot: true, isRecommend: true, tags: ['明前茶'], origin: '杭州西湖', year: '2026年春', weight: '100g', unit: '罐', imageUrl: '', createTime: '2026-03-15' },
    { _id: 'p2', name: '碧螺春 一级', cover: '', categoryId: 'cat_1', categoryName: '绿茶', price: 198, originalPrice: 268, stock: 80, sales: 98, status: 1, isNew: true, isHot: true, isRecommend: false, tags: ['手工采摘'], origin: '苏州洞庭山', weight: '100g', unit: '罐', imageUrl: '', createTime: '2026-03-20' },
    { _id: 'p3', name: '正山小种', cover: '', categoryId: 'cat_2', categoryName: '红茶', price: 168, originalPrice: 228, stock: 120, sales: 234, status: 1, isNew: false, isHot: true, isRecommend: true, tags: ['传统工艺'], origin: '武夷山', weight: '100g', unit: '罐', imageUrl: '', createTime: '2025-10-01' },
    { _id: 'p4', name: '铁观音 特级', cover: '', categoryId: 'cat_3', categoryName: '乌龙茶', price: 268, originalPrice: 368, stock: 90, sales: 312, status: 1, isNew: false, isHot: true, isRecommend: true, tags: ['兰花香'], origin: '福建安溪', weight: '250g', unit: '罐', imageUrl: '', createTime: '2025-09-15' },
    { _id: 'p5', name: '云南普洱茶饼', cover: '', categoryId: 'cat_5', categoryName: '普洱茶', price: 198, originalPrice: 288, stock: 150, sales: 456, status: 1, isNew: false, isHot: true, isRecommend: false, tags: ['古树茶'], origin: '云南勐海', weight: '357g', unit: '饼', imageUrl: '', createTime: '2024-06-01' },
    { _id: 'p6', name: '金骏眉', cover: '', categoryId: 'cat_2', categoryName: '红茶', price: 588, originalPrice: 788, stock: 5, sales: 45, status: 0, isNew: true, isHot: false, isRecommend: true, tags: ['全芽头'], origin: '武夷山桐木关', weight: '50g', unit: '罐', imageUrl: '', createTime: '2026-05-01' }
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
  const idMatch = url.match(/\/categories\/([^/]+)/); const id = idMatch ? idMatch[1] : null
  if (url === '/api/admin/categories' && method === 'get') return mockSuccess(mockAdminCategoryList())
  if (url === '/api/admin/categories' && method === 'post') return mockSuccess({ _id: 'cat_' + Date.now(), ...data })
  if (id && method === 'get') return mockSuccess({ _id: id, name: '绿茶', icon: '', sort: 1, status: 1, description: '' })
  if (id && method === 'put') return mockSuccess({ id, ...data })
  if (id && method === 'delete') return mockSuccess('ok')
  return Promise.reject(new Error('未知接口'))
}

function mockAdminCategoryList() {
  return [
    { _id: 'cat_1', name: '绿茶', icon: '', sort: 1, status: true, level: 1, parentId: 0, createTime: '2026-01-01', children: [{ _id: 'cat_11', name: '龙井', sort: 1, level: 2, parentId: 'cat_1', status: true, createTime: '2026-01-02' }, { _id: 'cat_12', name: '碧螺春', sort: 2, level: 2, parentId: 'cat_1', status: true, createTime: '2026-01-02' }] },
    { _id: 'cat_2', name: '红茶', icon: '', sort: 2, status: true, level: 1, parentId: 0, createTime: '2026-01-01', children: [{ _id: 'cat_21', name: '正山小种', sort: 1, level: 2, parentId: 'cat_2', status: true, createTime: '2026-01-02' }] },
    { _id: 'cat_3', name: '乌龙茶', icon: '', sort: 3, status: true, level: 1, parentId: 0, createTime: '2026-01-01', children: [{ _id: 'cat_31', name: '铁观音', sort: 1, level: 2, parentId: 'cat_3', status: true, createTime: '2026-01-02' }] },
    { _id: 'cat_4', name: '白茶', icon: '', sort: 4, status: true, level: 1, parentId: 0, createTime: '2026-01-01' },
    { _id: 'cat_5', name: '普洱茶', icon: '', sort: 5, status: true, level: 1, parentId: 0, createTime: '2026-01-01', children: [{ _id: 'cat_51', name: '生普', sort: 1, level: 2, parentId: 'cat_5', status: true, createTime: '2026-01-02' }] }
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
      { id: 'item_1', productId: 'p1', productName: '西湖龙井 明前特级', productImage: '', specName: '100g', price: 298, quantity: 1, amount: 298 }
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

// ==================== 统计 Mock ====================
function handleStatisticsRequest(url, method, data, params) {
  if (url.includes('/dashboard')) return mockSuccess({
    todayOrders: 24, todaySales: 4280, totalUsers: 1892, totalProducts: 86,
    pendingPay: 5, pendingDeliver: 8, pendingRefund: 2,
    lowStockProducts: [{ id: '1', name: '西湖龙井 特级', spec: '50g', stock: 3 }],
    topProducts: [
      { id: '1', name: '西湖龙井 明前特级', cover: '', sales: 198 },
      { id: '2', name: '信阳毛尖 特级', cover: '', sales: 156 },
      { id: '3', name: '武夷山大红袍', cover: '', sales: 143 }
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
    list: [{ id: '1', name: '西湖龙井 明前特级', sales: 198, amount: 59004 }, { id: '2', name: '信阳毛尖 特级', sales: 156, amount: 30888 }, { id: '3', name: '武夷山大红袍', sales: 143, amount: 56914 }]
  })
  if (url.includes('/users/growth')) return mockSuccess({
    summary: { totalUsers: 1892, newToday: 12, activeToday: 86 },
    trend: [{ date: '05/14', newUsers: 8 }, { date: '05/15', newUsers: 10 }, { date: '05/16', newUsers: 15 }, { date: '05/17', newUsers: 12 }, { date: '05/18', newUsers: 18 }, { date: '05/19', newUsers: 14 }, { date: '05/20', newUsers: 12 }]
  })
  if (url.includes('/categories/sales')) return mockSuccess([
    { name: '绿茶', sales: 456, amount: 98000 }, { name: '红茶', sales: 234, amount: 56000 }, { name: '乌龙茶', sales: 312, amount: 72000 }, { name: '白茶', sales: 89, amount: 24000 }, { name: '普洱茶', sales: 128, amount: 32000 }
  ])
  return Promise.reject(new Error('未知接口'))
}

// ==================== 其他模块 Mock（简化） ====================
function handleBannerRequest(url, method, data, params) {
  if (method === 'get') return mockSuccess({ list: [{ id: 'b1', title: '春季新品', image: '', sort: 1, status: 1, position: 1, createTime: '2026-03-01' }], total: 1 })
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
  const idMatch = url.match(/\/knowledge\/([^/]+)/); const id = idMatch ? idMatch[1] : null
  if (url === '/api/admin/knowledge' && method === 'get') return mockSuccess({
    list: [
      { _id: 'k1', title: '西湖龙井的冲泡技巧', categoryName: '冲泡技巧', summary: '教你冲泡西湖龙井', views: 1280, status: 1, createTime: '2026-05-18' },
      { _id: 'k2', title: '如何辨别正宗大红袍', categoryName: '茶叶鉴别', summary: '辨别的四个方面', views: 856, status: 1, createTime: '2026-05-15' }
    ], total: 2
  })
  if (id && method === 'get') return mockSuccess({ _id: id, title: '西湖龙井的冲泡技巧', categoryId: 'c2', content: '', tags: [], status: 1 })
  if (url.includes('/categories') && method === 'get') return mockSuccess([{ _id: 'c1', name: '茶文化' }, { _id: 'c2', name: '冲泡技巧' }])
  return mockSuccess('ok')
}

function handleSettingRequest(url, method, data, params) {
  if (method === 'get') return mockSuccess({ shopName: '茶叶商城', logo: '', servicePhone: '', workTime: '', defaultFreight: 10, freeShippingThreshold: 99 })
  return mockSuccess({ ...data, updatedAt: new Date().toISOString() })
}

function handleUploadRequest(url, method, data, params) {
  return mockSuccess({ url: 'https://picsum.photos/400/400?random=' + Math.floor(Math.random() * 100) })
}
