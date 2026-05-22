/**
 * 茶品列表页 - 整页连续滚动，左侧导航自动高亮
 * 纯展示，无支付
 */
const api = require('../../../utils/api')

Page({
  data: {
    categories: [],
    allProducts: [],
    groupedProducts: {},
    currentCategory: 'cat_normal',
    sectionOffsets: [],
    isLoading: false,
    isRefreshing: false,
    _scrollTop: 0
  },

  onLoad(options) {
    if (options && options.aromaName) {
      this.filterByAromaName(options.aromaName)
    }
    this.loadAllData()
  },

  onShow() {},

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

      // 延迟计算每个区块在滚动容器内的偏移量
      setTimeout(() => this.calcSectionOffsets(), 500)
    } catch (err) {
      console.error('加载数据失败:', err)
      this.setData({ isLoading: false, isRefreshing: false })
    }
  },

  /**
   * 计算每个分类区块在滚动容器内的绝对偏移量
   * 关键：用 scrollOffset 获取当前滚动位置，加上 boundingClientRect 得到绝对位置
   */
  calcSectionOffsets() {
    const query = wx.createSelectorQuery()
    // 获取滚动容器的当前滚动位置
    query.select('.product-scroll').scrollOffset()
    // 获取每个分类区块的视口位置
    this.data.categories.forEach(cat => {
      query.select('#section-' + cat.id).boundingClientRect()
    })
    query.exec(res => {
      if (!res || res.length < 2) return

      const scrollOffset = res[0] ? res[0].scrollTop : 0
      const offsets = []

      for (let i = 0; i < this.data.categories.length; i++) {
        const rect = res[i + 1]
        if (rect) {
          // 绝对偏移 = 当前滚动位置 + 区块视口top
          offsets.push({
            id: this.data.categories[i].id,
            offset: scrollOffset + rect.top
          })
        }
      }

      this.setData({ sectionOffsets: offsets })
      console.log('分类区块偏移量:', offsets)
    })
  },

  /**
   * 滚动事件 - 自动高亮当前分类
   */
  onScroll(e) {
    const scrollTop = e.detail.scrollTop
    const offsets = this.data.sectionOffsets

    if (!offsets || offsets.length === 0) return

    // 滚动到哪个区块的范围内就高亮哪个
    let current = offsets[0].id

    for (let i = offsets.length - 1; i >= 0; i--) {
      if (scrollTop >= offsets[i].offset - 10) {
        current = offsets[i].id
        break
      }
    }

    if (current !== this.data.currentCategory) {
      this.setData({ currentCategory: current })
    }
  },

  /**
   * 点击左侧导航 - 滚动到对应分类
   */
  switchCategory(e) {
    const cat = e.currentTarget.dataset.cat
    this.setData({ currentCategory: cat })

    const query = wx.createSelectorQuery()
    query.select('#section-' + cat).boundingClientRect()
    query.select('.product-scroll').scrollOffset()
    query.exec(res => {
      if (res[0] && res[1]) {
        const targetTop = res[0].top + res[1].scrollTop - 10
        this.setData({ _scrollTop: targetTop })
      }
    })
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
