/**
 * 茶品列表页 - 左侧垂直导航 + 右侧商品列表
 * 纯展示，无支付
 */
const api = require('../../../utils/api')

Page({
  data: {
    products: [],
    categories: [],
    currentCategory: 'cat_normal',
    keyword: '',
    page: 1,
    hasMore: true,
    isLoading: false,
    isRefreshing: false
  },

  onLoad(options) {
    // 从发现页跳转带 aromaName 参数
    if (options && options.aromaName) {
      this.filterByAromaName(options.aromaName)
    }
    this.loadCategories()
  },

  onShow() {
    this.refreshList()
  },

  /**
   * 根据香型名称筛选
   */
  filterByAromaName(aromaName) {
    // 映射香型到分类
    const aromaToCategory = {
      '蜜兰香': 'cat_normal',
      '鸭屎香': 'cat_normal',
      '银花香': 'cat_normal',
      '大乌叶': 'cat_normal',
      '黄栀香': 'cat_normal',
      '锯朵仔': 'cat_normal',
      '杏仁香': 'cat_normal'
    }
    const cat = aromaToCategory[aromaName] || 'cat_normal'
    this.setData({ currentCategory: cat })
  },

  /**
   * 刷新列表
   */
  refreshList() {
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
    if (this.data.isLoading || !this.data.hasMore) return

    this.setData({ isLoading: true })

    try {
      const params = {
        categoryId: this.data.currentCategory,
        page: this.data.page,
        pageSize: 20
      }

      if (this.data.keyword) {
        params.keyword = this.data.keyword
      }

      const res = await api.getProductList(params)
      const list = (res && res.list) || []

      const newProducts = this.data.page === 1 ? list : this.data.products.concat(list)
      const hasMore = list.length >= 20

      this.setData({
        products: newProducts,
        page: this.data.page + 1,
        hasMore,
        isLoading: false,
        isRefreshing: false
      })
    } catch (err) {
      console.error('加载商品失败:', err)
      this.setData({
        isLoading: false,
        isRefreshing: false
      })
    }
  },

  /**
   * 切换分类
   */
  switchCategory(e) {
    const cat = e.currentTarget.dataset.cat
    if (cat === this.data.currentCategory) return

    if (cat === 'cat_farm') {
      wx.showToast({ title: '敬请期待', icon: 'none' })
      return
    }

    this.setData({
      currentCategory: cat,
      products: [],
      page: 1,
      hasMore: true
    })
    this.loadProducts()
  },

  /**
   * 搜索栏点击
   */
  onSearchTap() {
    wx.showToast({ title: '搜索功能暂未开放', icon: 'none' })
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
    this.setData({ isRefreshing: true })
    this.refreshList()
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
