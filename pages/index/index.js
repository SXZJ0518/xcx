/**
 * 首页 - 凤凰单枞展示型小程序
 * 东方禅意风格
 */
const api = require('../../utils/api')

Page({
  data: {
    banners: [],
    hotProducts: [],
    categories: [],
    honeyProducts: [],
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
   * 加载首页所有数据
   */
  async loadHomeData() {
    try {
      const [banners, hotProducts, categories] = await Promise.all([
        api.getBannerList(),
        api.getHotProducts(),
        api.getCategoryList()
      ])

      // 热销最多取4个
      const topHot = (hotProducts || []).slice(0, 4)

      // 蜂蜜产品（模拟数据中暂无蜂蜜，预留接口）
      const honeyProducts = []

      // 站点配置
      const siteConfig = {
        brandName: '凤凰单枞',
        slogan: '一丛一味 · 百丛百香',
        desc: '潮州凤凰山 · 高山炭焙 · 传统工艺',
        brandStory: '凤凰单枞，产于广东省潮州市凤凰山，是乌龙茶中的极品。因"一丛一味、百丛百香"而得名，每株茶树皆有独特香气。',
        wechatId: 'fenghuang_dancong'
      }

      this.setData({
        banners: banners || [],
        hotProducts: topHot,
        categories: categories || [],
        honeyProducts,
        siteConfig
      })
    } catch (err) {
      console.error('加载首页数据失败:', err)
      // 降级处理：使用默认配置
      this.setData({
        siteConfig: {
          brandName: '凤凰单枞',
          slogan: '一丛一味 · 百丛百香',
          desc: '潮州凤凰山 · 高山炭焙 · 传统工艺',
          brandStory: '凤凰单枞，产于广东省潮州市凤凰山，是乌龙茶中的极品。',
          wechatId: 'fenghuang_dancong'
        }
      })
    }
  },

  /**
   * 跳转商品详情
   */
  goToProductDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/product/detail/detail?id=${id}`
    })
  },

  /**
   * 跳转产品列表页（带分类ID）
   */
  goToCategory(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/product/list/list?categoryId=${id}`
    })
  },

  /**
   * 跳转产品页（TabBar）
   */
  goToProducts() {
    wx.switchTab({
      url: '/pages/product/list/list'
    })
  },

  /**
   * 跳转茶文化页（TabBar）
   */
  goToCulture() {
    wx.switchTab({
      url: '/pages/category/category'
    })
  },

  /**
   * 复制微信号
   */
  copyWechat() {
    const wechatId = this.data.siteConfig.wechatId || ''
    if (!wechatId) {
      wx.showToast({ title: '暂无微信号', icon: 'none' })
      return
    }
    wx.setClipboardData({
      data: wechatId,
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
