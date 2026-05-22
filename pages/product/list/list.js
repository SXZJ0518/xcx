/**
 * 茶品列表页 - 整页连续滚动，左侧导航自动高亮
 * 用 IntersectionObserver 监听区块可见性
 * 用 scroll-into-view 实现点击导航跳转
 */
const api = require('../../../utils/api')

Page({
  data: {
    categories: [],
    allProducts: [],
    groupedProducts: {},
    currentCategory: 'cat_normal',
    scrollIntoView: '',
    isLoading: false,
    isRefreshing: false
  },

  _observers: [],

  onLoad(options) {
    if (options && options.aromaName) {
      this.filterByAromaName(options.aromaName)
    }
    this.loadAllData()
  },

  onUnload() {
    // 清理所有观察器
    this._observers.forEach(obs => obs.disconnect())
    this._observers = []
  },

  /**
   * 加载所有数据并按分类分组
   */
  async loadAllData() {
    this.setData({ isLoading: true })
    try {
      const [categories, res] = await Promise.all([
        api.getCategoryList(),
        api.getProductList({ page: 1, pageSize: 100 })
      ])

      const allProducts = (res && res.list) || []
      const cats = categories || []

      const grouped = {}
      cats.forEach(cat => {
        grouped[cat.id] = allProducts.filter(p => p.categoryId === cat.id)
      })

      this.setData({
        categories: cats,
        allProducts,
        groupedProducts: grouped,
        isLoading: false,
        isRefreshing: false
      })

      // 数据渲染后，设置 IntersectionObserver
      setTimeout(() => this.setupObservers(), 500)
    } catch (err) {
      console.error('加载数据失败:', err)
      this.setData({ isLoading: false, isRefreshing: false })
    }
  },

  /**
   * 用 IntersectionObserver 监听每个分类区块的可见性
   * 当区块进入视口时，自动高亮左侧导航
   */
  setupObservers() {
    // 先清理旧的
    this._observers.forEach(obs => obs.disconnect())
    this._observers = []

    this.data.categories.forEach(cat => {
      const observer = wx.createIntersectionObserver(this, {
        thresholds: [0.1, 0.5],
        observeAll: false
      })

      observer.relativeToViewport({ top: -60 }) // 减去搜索栏高度
      observer.observe('#section-' + cat.id, (res) => {
        // 当区块可见面积超过10%时，高亮对应导航
        if (res.intersectionRatio > 0.1) {
          if (this.data.currentCategory !== cat.id) {
            this.setData({ currentCategory: cat.id })
          }
        }
      })

      this._observers.push(observer)
    })
  },

  /**
   * 点击左侧导航 - 用 scroll-into-view 滚动到对应区块
   */
  switchCategory(e) {
    const cat = e.currentTarget.dataset.cat

    this.setData({
      currentCategory: cat,
      scrollIntoView: 'section-' + cat
    })

    // 滚动完成后清除 scrollIntoView，避免影响后续滚动
    setTimeout(() => {
      this.setData({ scrollIntoView: '' })
    }, 500)
  },

  /**
   * 根据香型名称筛选
   */
  filterByAromaName(aromaName) {
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

  onSearchTap() {
    wx.showToast({ title: '搜索功能暂未开放', icon: 'none' })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/product/detail/detail?id=' + id })
  },

  onPullDownRefresh() {
    this.setData({ isRefreshing: true })
    this.loadAllData()
  },

  loadMore() {},

  onShareAppMessage() {
    return {
      title: '凤凰单枞 · 茶品',
      path: '/pages/product/list/list'
    }
  }
})
