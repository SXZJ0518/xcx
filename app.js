// app.js
const API = require('./utils/api');

App({
  globalData: {
    userInfo: null,
    serverUrl: 'https://api.example.com',
    windowHeight: 0,
    windowWidth: 0,
    statusBarHeight: 0,
    systemInfo: null,
    navBarHeight: 44,
    headerHeight: 64,
    safeBottomHeight: 0,
    useCloud: true,
    cloudEnv: 'cloud1-d2gzj9p633865ea93'
  },
  
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 初始化云开发
    this.initCloudDevelopment()
    
    // 获取系统信息
    this.getSystemInfo()
  },
  
  // 初始化云开发
  initCloudDevelopment() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: this.globalData.cloudEnv,
        traceUser: true
      })
      console.log('云开发初始化成功')
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
    // 获取手机状态栏高度
    const statusBarHeight = systemInfo.statusBarHeight
    
    // 导航栏高度
    let navBarHeight = 44
    if (systemInfo.platform === 'android') {
      navBarHeight = 48
    }
    
    // 计算安全区域
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
  
  // 防重复点击函数
  preventDoubleClick: function(fn, gapTime = 1000) {
    let lastTime = null;
    
    return function() {
      const now = +new Date();
      if (!lastTime || now - lastTime > gapTime) {
        fn.apply(this, arguments);
        lastTime = now;
      } else {
        wx.showToast({
          title: '操作太频繁',
          icon: 'none'
        });
      }
    };
  }
})
