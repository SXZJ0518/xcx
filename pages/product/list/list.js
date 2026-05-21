/**
 * 商品列表页
 */
const api = require('../../../utils/api')

Page({
  data: {
    categories: [],
    products: [],
    currentCategory: '',
    loading: false
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
    this.setData({ loading: true })
    try {
      const [categories, productRes] = await Promise.all([
        api.getCategoryList(),
        api.getProductList()
      ])
      this.setData({
        categories,
        products: productRes.list || [],
        loading: false
      })
    } catch (err) {
      console.error('加载数据失败:', err)
      this.setData({ loading: false })
    }
  },

  async filterCategory(e) {
    const id = e.currentTarget.dataset.id
    this.setData({ currentCategory: id, loading: true })
    try {
      const res = await api.getProductList({ categoryId: id })
      this.setData({ products: res.list || [], loading: false })
    } catch (err) {
      console.error('筛选失败:', err)
      this.setData({ loading: false })
    }
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/product/detail/detail?id=${id}`
    })
  },

  onShareAppMessage() {
    return {
      title: '凤凰单枞 · 茶品',
      path: '/pages/product/list/list'
    }
  }
})
