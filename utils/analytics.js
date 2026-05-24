/**
 * 访问统计埋点工具
 * 用于上报页面访问、用户行为等数据
 */

// 是否启用埋点
const ENABLED = true

// 埋点队列（批量上报）
let queue = []
let timer = null

/**
 * 获取设备信息
 */
function getDeviceInfo() {
  try {
    const systemInfo = wx.getSystemInfoSync()
    return {
      brand: systemInfo.brand || '',
      model: systemInfo.model || '',
      platform: systemInfo.platform || '',
      system: systemInfo.system || '',
      SDKVersion: systemInfo.SDKVersion || '',
      screenWidth: systemInfo.screenWidth || 0,
      screenHeight: systemInfo.screenHeight || 0,
      pixelRatio: systemInfo.pixelRatio || 1
    }
  } catch (e) {
    return {}
  }
}

/**
 * 获取网络信息
 */
function getNetworkInfo() {
  return new Promise((resolve) => {
    wx.getNetworkType({
      success: (res) => resolve({ networkType: res.networkType || '' }),
      fail: () => resolve({})
    })
  })
}

/**
 * 获取位置信息（需授权）
 */
function getLocationInfo() {
  return new Promise((resolve) => {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => resolve({
        latitude: res.latitude,
        longitude: res.longitude,
        speed: res.speed,
        accuracy: res.accuracy
      }),
      fail: () => resolve({})
    })
  })
}

/**
 * 获取用户信息
 */
function getUserInfo() {
  const userInfo = wx.getStorageSync('userInfo') || null
  const isLoggedIn = wx.getStorageSync('isLoggedIn') || false
  return {
    userId: userInfo ? userInfo.id : null,
    openid: userInfo ? userInfo.openid : null,
    isLoggedIn
  }
}

/**
 * 生成唯一会话ID
 */
function generateSessionId() {
  let sessionId = wx.getStorageSync('sessionId')
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    wx.setStorageSync('sessionId', sessionId)
  }
  return sessionId
}

/**
 * 上报埋点数据
 */
async function track(eventType, data = {}) {
  if (!ENABLED) return

  const user = getUserInfo()
  const device = getDeviceInfo()
  const network = await getNetworkInfo()
  
  const event = {
    id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    type: eventType,
    sessionId: generateSessionId(),
    userId: user.userId,
    openid: user.openid,
    isLoggedIn: user.isLoggedIn,
    page: data.page || '',
    title: data.title || '',
    params: data.params || {},
    referrer: data.referrer || '',
    productId: data.productId || null,
    categoryId: data.categoryId || null,
    aromaId: data.aromaId || null,
    action: data.action || '',
    value: data.value || '',
    device,
    network,
    timestamp: new Date().toISOString(),
    localTime: Date.now()
  }

  // 加入队列
  queue.push(event)

  // 延迟批量上报（每5条或3秒上报一次）
  if (queue.length >= 5) {
    flush()
  } else if (!timer) {
    timer = setTimeout(flush, 3000)
  }
}

/**
 * 批量上报
 */
async function flush() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }

  if (queue.length === 0) return

  const events = [...queue]
  queue = []

  try {
    // Mock: 实际应调用 api.reportEvents(events)
    console.log('[Analytics] 上报事件:', events.length, '条')
    
    // 存储到本地（用于开发调试）
    const stored = wx.getStorageSync('analytics_events') || []
    wx.setStorageSync('analytics_events', [...stored, ...events].slice(-100))
  } catch (err) {
    console.error('[Analytics] 上报失败:', err)
    // 失败时重新加入队列
    queue = [...events, ...queue]
  }
}

/**
 * 页面访问埋点
 */
function trackPageView(page, title, params = {}) {
  const pages = getCurrentPages()
  const referrer = pages.length > 1 ? pages[pages.length - 2].route : ''
  
  track('pageview', {
    page,
    title,
    params,
    referrer
  })
}

/**
 * 商品查看埋点
 */
function trackProductView(productId, productName) {
  track('product_view', {
    page: 'pages/product/detail/detail',
    title: productName,
    productId
  })
}

/**
 * 分类查看埋点
 */
function trackCategoryView(categoryId, categoryName) {
  track('category_view', {
    page: 'pages/product/list/list',
    title: categoryName,
    categoryId
  })
}

/**
 * 香型查看埋点
 */
function trackAromaView(aromaId, aromaName) {
  track('aroma_view', {
    page: 'pages/discover/discover',
    title: aromaName,
    aromaId
  })
}

/**
 * 搜索埋点
 */
function trackSearch(keyword, resultCount) {
  track('search', {
    page: 'pages/product/list/list',
    title: '搜索: ' + keyword,
    action: 'search',
    value: keyword,
    params: { keyword, resultCount }
  })
}

/**
 * 收藏埋点
 */
function trackFavorite(productId, action) {
  track('favorite', {
    page: 'pages/product/detail/detail',
    productId,
    action: action ? 'add' : 'remove'
  })
}

/**
 * 分享埋点
 */
function trackShare(page, title) {
  track('share', {
    page,
    title,
    action: 'share'
  })
}

/**
 * 登录埋点
 */
function trackLogin(loginType) {
  track('login', {
    page: 'pages/login/login',
    title: '用户登录',
    action: loginType
  })
}

/**
 * 页面停留时长埋点
 */
const pageEnterTime = {}

function trackPageEnter(page) {
  pageEnterTime[page] = Date.now()
}

function trackPageLeave(page) {
  const enterTime = pageEnterTime[page]
  if (!enterTime) return
  
  const duration = Date.now() - enterTime
  delete pageEnterTime[page]
  
  track('page_leave', {
    page,
    action: 'leave',
    value: duration,
    params: { duration }
  })
}

module.exports = {
  track,
  flush,
  trackPageView,
  trackProductView,
  trackCategoryView,
  trackAromaView,
  trackSearch,
  trackFavorite,
  trackShare,
  trackLogin,
  trackPageEnter,
  trackPageLeave
}
