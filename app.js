// app.js
const analytics = require('./utils/analytics')

App({
  globalData: {
    userInfo: null,
    windowHeight: 0,
    windowWidth: 0,
    statusBarHeight: 0,
    systemInfo: null,
    navBarHeight: 44,
    headerHeight: 64,
    safeBottomHeight: 0,
    cloudEnv: 'cloud1-d2gzj9p633865ea93'
  },
  
  onLaunch() {
    // 初始化云开发
    this.initCloud()
    // 获取系统信息
    this.getSystemInfo()
    // 初始化埋点
    this.initAnalytics()
  },
  
  onShow() {
    // 小程序切前台时上报
    analytics.track('app_show', { page: 'app', title: '小程序启动' })
  },
  
  onHide() {
    // 小程序切后台时批量上报
    analytics.flush()
  },
  
  // 初始化云开发
  initCloud() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: this.globalData.cloudEnv,
        traceUser: true
      })
      console.log('云开发初始化成功，环境ID:', this.globalData.cloudEnv)
    }
  },
  
  // 获取系统信息
  getSystemInfo: function() {
    try {
      const systemInfo = wx.getSystemInfoSync()
      this.globalData.systemInfo = systemInfo
      
      // 计算安全区域
      this.calculateSafeArea(systemInfo)
    } catch (e) {
      console.error('获取系统信息失败:', e)
    }
  },
  
  // 计算安全区域
  calculateSafeArea: function(systemInfo) {
    const statusBarHeight = systemInfo.statusBarHeight
    
    let navBarHeight = 44
    if (systemInfo.platform === 'android') {
      navBarHeight = 48
    }
    
    this.globalData.navBarHeight = navBarHeight
    this.globalData.statusBarHeight = statusBarHeight
    this.globalData.headerHeight = navBarHeight + statusBarHeight
    
    // 计算底部安全区域
    if (systemInfo.model.indexOf('iPhone X') >= 0 || 
        systemInfo.model.indexOf('iPhone 11') >= 0 ||
        systemInfo.model.indexOf('iPhone 12') >= 0 ||
        systemInfo.model.indexOf('iPhone 13') >= 0 ||
        systemInfo.model.indexOf('iPhone 14') >= 0 ||
        systemInfo.model.indexOf('iPhone 15') >= 0) {
      this.globalData.safeBottomHeight = 34
    } else {
      this.globalData.safeBottomHeight = 0
    }
  },
  
  // 初始化埋点
  initAnalytics() {
    // 页面生命周期监听
    const originalPage = Page
    Page = function(config) {
      const originalOnShow = config.onShow
      const originalOnHide = config.onHide
      
      config.onShow = function() {
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]
        const route = currentPage.route || ''
        const options = currentPage.options || {}
        
        // 上报页面访问
        analytics.trackPageEnter(route)
        analytics.trackPageView(route, route.split('/').pop(), options)
        
        if (originalOnShow) {
          originalOnShow.call(this)
        }
      }
      
      config.onHide = function() {
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]
        const route = currentPage.route || ''
        
        // 上报页面离开
        analytics.trackPageLeave(route)
        
        if (originalOnHide) {
          originalOnHide.call(this)
        }
      }
      
      return originalPage(config)
    }
  }
})
