/**
 * 产品列表页 - 凤凰单枞
 * 支持茶叶/蜂蜜切换、香型分类筛选、搜索、分页
 */
const api = require('../../../utils/api')

Page({
  data: {
    products: [],
    categories: [],
    currentType: 'tea',       // tea | honey
    currentCategory: 'all',   // all 或具体 categoryId
    keyword: '',
    page: 1,
    hasMore: true,
    isLoading: false,
    siteConfig: {}
  },

  onLoad(options) {
    // 如果有 categoryId 参数，设置当前分类
    if (options && options.categoryId) {
      this.setData({ currentCategory: options.categoryId })
    }
    this.loadCategories()
  },

  onShow() {
    // 每次显示时刷新数据
    this.setData({
      products: [],
      page: 1,
      hasMore: true
    })
    this.loadProducts()
  },

  /**
   * 加载分类列表
   */
  async loadCategories() {
    try {
      const categories = await api.getCategoryList()
      this.setData({ categories: categories || [] })
    } catch (err) {
      console.error('加载分类失败:', err)
    }
  },

  /**
   * 加载商品列表
   */
  async loadProducts() {
    if (this.data.isLoading) return
    if (!this.data.hasMore) return

    this.setData({ isLoading: true })

    try {
      const params = {
        page: this.data.page,
        pageSize: 10
      }

      // 按分类筛选
      if (this.data.currentCategory !== 'all') {
        params.categoryId = this.data.currentCategory
      }

      // 按关键词搜索
      if (this.data.keyword) {
        params.keyword = this.data.keyword
      }

      const res = await api.getProductList(params)
      const list = (res && res.list) || []

      const newProducts = this.data.page === 1 ? list : this.data.products.concat(list)
      const hasMore = list.length >= (params.pageSize || 10)

      this.setData({
        products: newProducts,
        page: this.data.page + 1,
        hasMore,
        isLoading: false
      })
    } catch (err) {
      console.error('加载商品失败:', err)
      this.setData({ isLoading: false })
    }
  },

  /**
   * 切换商品类型（茶叶/蜂蜜）
   */
  switchType(e) {
    const type = e.currentTarget.dataset.type
    if (type === this.data.currentType) return

    this.setData({
      currentType: type,
      currentCategory: 'all',
      products: [],
      page: 1,
      hasMore: true
    })
    this.loadProducts()
  },

  /**
   * 切换香型分类
   */
  switchCategory(e) {
    const id = e.currentTarget.dataset.id || 'all'
    if (id === this.data.currentCategory) return

    this.setData({
      currentCategory: id,
      products: [],
      page: 1,
      hasMore: true
    })
    this.loadProducts()
  },

  /**
   * 跳转搜索页
   */
  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
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
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.setData({
      products: [],
      page: 1,
      hasMore: true
    })
    this.loadProducts().then(() => {
      wx.stopPullDownRefresh()
    }).catch(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 上拉加载更多
   */
  onReachBottom() {
    this.loadProducts()
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '凤凰单枞 · 茶品',
      path: '/pages/product/list/list'
    }
  }
})
