/**
 * 发现页 - 凤凰单枞十大香型 & 茶知识
 */
const api = require('../../utils/api')
const Mock = require('../../utils/wx.mock')

Page({
  data: {
    aromaTypes: [],
    knowledgeList: []
  },

  onLoad() {
    this.loadData()
  },

  /**
   * 并行加载香型列表和茶知识
   */
  async loadData() {
    try {
      // 并行请求
      const [aromaRes, knowledgeRes] = await Promise.all([
        api.getCategoryList(),
        api.getKnowledgeList()
      ])

      // 香型数据：匹配是否有对应产品
      const aromaTypes = (aromaRes || []).map(cat => {
        const hasProduct = Mock.mockProducts.some(p => p.categoryId === cat.id)
        return {
          ...cat,
          yourProduct: hasProduct ? cat.name : ''
        }
      })

      const knowledgeList = (knowledgeRes && knowledgeRes.list) || []

      this.setData({ aromaTypes, knowledgeList })
    } catch (err) {
      console.error('加载数据失败:', err)
      // 降级使用 mock
      const aromaTypes = Mock.mockCategories.map(cat => {
        const hasProduct = Mock.mockProducts.some(p => p.categoryId === cat.id)
        return {
          ...cat,
          yourProduct: hasProduct ? cat.name : ''
        }
      })
      const knowledgeList = Mock.mockKnowledge
      this.setData({ aromaTypes, knowledgeList })
    }
  },

  /**
   * 跳转茶品页，带 aromaName 参数筛选
   */
  goToProducts(e) {
    const name = e.currentTarget.dataset.name || ''
    wx.switchTab({
      url: '/pages/product/list/list',
      fail: () => {
        wx.navigateTo({ url: `/pages/product/list/list?aromaName=${encodeURIComponent(name)}` })
      }
    })
  },

  /**
   * 跳转知识详情页
   */
  goToKnowledgeDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/tea-knowledge/detail/detail?id=${id}`
    })
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '凤凰单枞 · 一丛一味 百丛百香',
      path: '/pages/discover/discover'
    }
  }
})
