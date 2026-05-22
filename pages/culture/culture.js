/**
 * 茶文化页
 */
const api = require('../../utils/api')

Page({
  data: {
    categories: [],
    knowledgeList: [],
    siteConfig: {}
  },

  onLoad() {
    this.loadData()
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  async loadData() {
    try {
      const [categoriesRes, knowledgeRes, siteConfigRes] = await Promise.all([
        api.getCategoryList(),
        api.getKnowledgeList(),
        api.getSiteConfig()
      ])

      const categories = categoriesRes || []
      const knowledgeList = (knowledgeRes && knowledgeRes.list) || knowledgeRes || []
      const siteConfig = siteConfigRes || {}

      this.setData({ categories, knowledgeList, siteConfig })
    } catch (err) {
      console.error('加载茶文化数据失败:', err)
    }
  },

  // 跳转到产品列表页（带categoryId）
  goToCategoryProducts(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/product/list/list?categoryId=${id}`
    })
  },

  // 跳转到茶知识详情页
  goToKnowledgeDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/tea-knowledge/detail/detail?id=${id}`
    })
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '凤凰单枞 · 茶文化 - 一丛一味 百丛百香',
      path: '/pages/culture/culture'
    }
  }
})
