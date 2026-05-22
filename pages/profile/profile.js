/**
 * 我的页面 - 凤凰单枞展示型小程序
 * 东方禅意风格
 */
const api = require('../../utils/api')

Page({
  data: {
    siteConfig: {}
  },

  onLoad() {
    this.loadSiteConfig()
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
   * 分享
   */
  onShareAppMessage() {
    return {
      title: this.data.siteConfig.slogan || '凤凰单枞 · 一丛一味 百丛百香',
      path: '/pages/index/index'
    }
  }
})
