/**
 * 首页 - 凤凰单枞展示型小程序
 * Hero大图 + 热销推荐 + 香型快览 + 联系入口
 */
const api = require('../../utils/api')

Page({
  data: {
    banners: [],
    hotProducts: [],
    aromaTypes: [],
    siteConfig: {},
    loading: true
  },

  onLoad() {
    this.loadHomeData()
  },

  onPullDownRefresh() {
    this.loadHomeData().then(() => {
      wx.stopPullDownRefresh()
    }).catch(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 加载首页数据
   */
  async loadHomeData() {
    this.setData({ loading: true })
    try {
      const [homeData, siteConfig] = await Promise.all([
        api.getHomeData(),
        api.getSiteConfig()
      ])

      const data = homeData || {}
      this.setData({
        banners: data.banners || [],
        hotProducts: (data.hotProducts || []).slice(0, 4),
        aromaTypes: data.aromaTypes || [],
        siteConfig: siteConfig || {},
        loading: false
      })
    } catch (err) {
      console.error('加载首页数据失败:', err)
      this.setData({ loading: false })
    }
  },

  /**
   * 跳转商品详情
   */
  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/product/detail/detail?id=' + id
    })
  },

  /**
   * 跳转茶品页
   */
  goToProducts() {
    wx.switchTab({ url: '/pages/product/list/list' })
  },

  /**
   * 跳转发现页
   */
  goToDiscover() {
    wx.switchTab({ url: '/pages/discover/discover' })
  },

  /**
   * 复制微信号
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
        wx.showToast({ title: '已复制微信号', icon: 'success' })
      }
    })
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: (this.data.siteConfig.slogan || '凤凰单枞 · 一丛一味 百丛百香'),
      path: '/pages/index/index'
    }
  }
})
