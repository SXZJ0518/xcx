/**
 * 发现页 - 凤凰单枞十大香型 & 茶知识
 */
const api = require('../../utils/api')
const Mock = require('../../utils/wx.mock')

Page({
  data: {
    aromaTypes: [],
    knowledgeList: [],
    listedCount: 0,
    scrollToKnowledge: false
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    const app = getApp()
    if (app.globalData._scrollToKnowledge) {
      app.globalData._scrollToKnowledge = false
      this.setData({ scrollToKnowledge: true })
      // 滚动到茶知识区域
      setTimeout(() => {
        wx.pageScrollTo({ selector: '.knowledge-section', duration: 400 })
        this.setData({ scrollToKnowledge: false })
      }, 500)
    }
  },

  /**
   * 并行加载香型列表、商品列表和茶知识
   */
  async loadData() {
    try {
      // 并行请求：香型、商品、茶知识
      const [aromaRes, productRes, knowledgeRes] = await Promise.all([
        api.getAromaTypes(),
        api.getProductList({ page: 1, pageSize: 100 }),
        api.getKnowledgeList()
      ])

      const aromaTypes = this.matchAromaWithProducts(aromaRes, productRes?.list || productRes)
      const knowledgeList = (knowledgeRes && knowledgeRes.list) || []
      const listedCount = aromaTypes.filter(item => item.yourProduct).length

      this.setData({ aromaTypes, knowledgeList, listedCount })
    } catch (err) {
      console.error('加载数据失败:', err)
      // 降级使用 mock
      const aromaTypes = this.matchAromaWithProducts(
        Mock.mockAromaTypes,
        Mock.mockProducts
      )
      const knowledgeList = Mock.mockKnowledge
      const listedCount = aromaTypes.filter(item => item.yourProduct).length
      this.setData({ aromaTypes, knowledgeList, listedCount })
    }
  },

  /**
   * 将香型与商品匹配，计算每个香型已上架的商品数
   * 排序规则：已上架的在前，同状态按商品数量从多到少排
   */
  matchAromaWithProducts(aromas, products) {
    const aromaList = (aromas || []).map(aroma => {
      // 匹配该香型的商品
      const matchedProducts = products.filter(p => {
        if (!p.aromaName) return false
        // 处理香型名称匹配（兼容"银花香(鸭屎香)"和"银花香（鸭屎香）"等格式差异）
        return p.aromaName.includes(aroma.name) ||
               aroma.name.includes(p.aromaName) ||
               (aroma.name.replace(/[\(\)（）\s]/g, '') === (p.aromaName || '').replace(/[\(\)（）\s]/g, ''))
      })
      return {
        ...aroma,
        productCount: matchedProducts.length,
        yourProduct: matchedProducts.length > 0
      }
    })
    // 已上架排前面，同状态按商品数量降序
    aromaList.sort((a, b) => {
      if (a.yourProduct !== b.yourProduct) return b.yourProduct - a.yourProduct
      return b.productCount - a.productCount
    })
    return aromaList
  },

  /**
   * 点击香型卡片，跳转茶品页
   * tabBar 页面无法通过 URL 传参，使用 globalData 中转
   */
  goToProducts(e) {
    const name = e.currentTarget.dataset.name || ''
    const app = getApp()
    app.globalData._pendingAromaName = name
    wx.switchTab({
      url: '/pages/product/list/list'
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
