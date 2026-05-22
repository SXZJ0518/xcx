/**
 * 首页 - 凤凰单枞展示型小程序
 * 东方禅意风格
 */
const api = require('../../utils/api')

Page({
  data: {
    banners: [],
    hotProducts: [],
    aromaTypes: [],
    siteConfig: {}
  },

  onLoad() {
    this.loadHomeData()
  },

  onPullDownRefresh() {
    this.loadHomeData().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 加载首页所有数据（并行请求）
   */
  async loadHomeData() {
    try {
      const [homeRes, hotRes, categoryRes, configRes] = await Promise.all([
        api.getHomeData(),
        api.getHotProducts(),
        api.getCategoryList(),
        api.getSiteConfig()
      ])

      // 站点配置
      const siteConfig = configRes || homeRes?.siteConfig || {}

      // 热销商品最多4个
      const hotProducts = (hotRes || homeRes?.hotProducts || []).slice(0, 4)

      // 香型列表
      const aromaTypes = categoryRes || homeRes?.categories || []

      // 轮播图
      const banners = homeRes?.banners || []

      this.setData({
        banners,
        hotProducts,
        aromaTypes,
        siteConfig
      })
    } catch (err) {
      console.error('加载首页数据失败:', err)
      // 降级处理：使用默认配置
      this.setData({
        siteConfig: {
          brandName: '凤凰单枞',
          slogan: '一丛一味 · 百丛百香',
          about: '凤凰单枞，产于广东省潮州市凤凰山，是乌龙茶中的极品。'
        }
      })
    }
  },

  /**
   * 跳转商品详情
   */
  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/product/detail/detail?id=${id}`
    })
  },

  /**
   * 跳转茶品页（TabBar）
   */
  goToProducts() {
    wx.switchTab({
      url: '/pages/product/list/list'
    })
  },

  /**
   * 跳转发现页（TabBar）
   */
  goToDiscover() {
    wx.switchTab({
      url: '/pages/category/category'
    })
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
        wx.showToast({
          title: '已复制微信号',
          icon: 'success'
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
      path: '/pages/index/index',
      imageUrl: ''
    }
  }
})
