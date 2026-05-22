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
    sectionTopList: [],
    isLoading: false,
    isRefreshing: false
  },

  onLoad(options) {
    if (options && options.aromaName) {
      this.filterByAromaName(options.aromaName)
    }
    this.loadAllData()
  },

  onShow() {
    // 不重复加载
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

      // 按分类分组
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

      // 计算每个分类区块的位置（延迟确保DOM渲染完成）
      setTimeout(() => this.calcSectionTops(), 300)
    } catch (err) {
      console.error('加载数据失败:', err)
      this.setData({ isLoading: false, isRefreshing: false })
    }
  },

  /**
   * 计算每个分类区块的top位置
   */
  calcSectionTops() {
    const query = wx.createSelectorQuery()
    this.data.categories.forEach(cat => {
      query.select('#section-' + cat.id).boundingClientRect()
    })
    query.exec(res => {
      const tops = []
      res.forEach((rect, i) => {
        if (rect) {
          tops.push({ id: this.data.categories[i].id, top: rect.top })
        }
      })
      this.setData({ sectionTopList: tops })
    })
  },

  /**
   * 滚动事件 - 自动高亮当前分类
   */
  onScroll(e) {
    const scrollTop = e.detail.scrollTop
    const tops = this.data.sectionTopList

    if (!tops || tops.length === 0) return

    // 搜索栏高度约112rpx ≈ 56px
    const offset = 56
    let current = tops[0].id

    for (let i = tops.length - 1; i >= 0; i--) {
      if (scrollTop + offset >= tops[i].top) {
        current = tops[i].id
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
    if (cat === 'cat_farm') {
      // 农产品也可以滚动过去
    }

    this.setData({ currentCategory: cat })

    // 滚动到对应区块
    const query = wx.createSelectorQuery()
    query.select('#section-' + cat).boundingClientRect()
    query.select('.product-scroll').scrollOffset()
    query.exec(res => {
      if (res[0] && res[1]) {
        const targetTop = res[0].top + res[1].scrollTop - 56 // 减去搜索栏高度
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
    this.loadAllData()
  },

  /**
   * 上拉加载更多（暂不需要，因为一次性加载了全部）
   */
  loadMore() {
    // 当前一次性加载所有商品，无需分页
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
