// app.js
App({
  globalData: {
    userInfo: null,
    windowHeight: 0,
    windowWidth: 0,
    statusBarHeight: 0,
    systemInfo: null,
    navBarHeight: 44,
    headerHeight: 64,
    safeBottomHeight: 0
  },
  
  onLaunch() {
    // 获取系统信息
    this.getSystemInfo()
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
  }
})
