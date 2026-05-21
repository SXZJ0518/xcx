/**
 * 分类页 - 十大香型
 */
const api = require('../../utils/api')

Page({
  data: {
    categories: []
  },

  onLoad() {
    this.loadCategories()
  },

  async loadCategories() {
    try {
      const categories = await api.getCategoryList()
      this.setData({ categories })
    } catch (err) {
      console.error('加载分类失败:', err)
    }
  },

  goProductList(e) {
    const id = e.currentTarget.dataset.id
    wx.switchTab({
      url: '/pages/product/list/list'
    })
  },

  onShareAppMessage() {
    return {
      title: '凤凰单枞十大香型',
      path: '/pages/category/category'
    }
  }
})
