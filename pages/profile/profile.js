/**
 * 我的页面 - 凤凰单枞展示型小程序
 * 东方禅意 × 现代质感
 */
const api = require('../../utils/api')
const favorites = require('../../utils/favorites')

Page({
  data: {
    siteConfig: {},
    favoriteCount: 0,
    isLoggedIn: false,
    userInfo: null
  },

  onLoad() {
    this.loadSiteConfig()
    this.checkLoginStatus()
  },

  onShow() {
    // 每次显示时刷新收藏数和登录状态
    this.setData({ favoriteCount: favorites.getCount() })
    this.checkLoginStatus()
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const isLoggedIn = wx.getStorageSync('isLoggedIn') || false
    const userInfo = wx.getStorageSync('userInfo') || null
    this.setData({ isLoggedIn, userInfo })
  },

  /**
   * 加载站点配置
   */
  async loadSiteConfig() {
    try {
      const siteConfig = await api.getSiteConfig()
      this.setData({ siteConfig: siteConfig || {} })
    } catch (err) {
      console.error('加载配置失败:', err)
    }
  },

  /**
   * 跳转到登录页
   */
  goToLogin() {
    wx.navigateTo({ url: '/pages/login/login' })
  },

  /**
   * 退出登录
   */
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('isLoggedIn')
          wx.removeStorageSync('userInfo')
          this.setData({ isLoggedIn: false, userInfo: null })
          wx.showToast({ title: '已退出登录', icon: 'success' })
        }
      }
    })
  },

  /**
   * 跳转到我的收藏
   */
  goToFavorites() {
    wx.navigateTo({ url: '/pages/profile/favorites/favorites' })
  },

  /**
   * 复制微信号到剪贴板
   */
  copyWechat() {
    const wechat = this.data.siteConfig.wechat || ''
    if (!wechat) {
      wx.showToast({ title: '暂无微信号', icon: 'none' })
      return
    }
    wx.setClipboardData({
      data: wechat,
      success: () => {
        wx.showToast({
          title: '已复制微信号',
          icon: 'success'
        })
      }
    })
  },

  /**
   * 拨打电话
   */
  callPhone() {
    const phone = this.data.siteConfig.phone || ''
    if (!phone) {
      wx.showToast({ title: '暂无电话号码', icon: 'none' })
      return
    }
    wx.makePhoneCall({
      phoneNumber: phone,
      fail: () => {
        wx.showToast({
          title: '拨打电话失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 跳转到关于我们（弹出半屏弹窗）
   */
  goToAbout() {
    const about = this.data.siteConfig.about || ''
    if (!about) {
      wx.showToast({ title: '暂无品牌介绍', icon: 'none' })
      return
    }
    wx.showModal({
      title: this.data.siteConfig.brandName || '凤凰单枞',
      content: about,
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#c9a86c'
    })
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: this.data.siteConfig.slogan || '凤凰单枞 · 一丛一味 百丛百香',
      path: '/pages/index/index'
    }
  }
})
