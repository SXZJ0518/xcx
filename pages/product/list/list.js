/**
 * 茶品列表页 - 凤凰单枞
 * 支持分类切换（单枞茶/特惠茶/农产品）、包装筛选、季节筛选
 */
const api = require('../../../utils/api')
const Mock = require('../../../utils/wx.mock')

Page({
  data: {
    products: [],
    categories: [],
    currentCategory: 'cat_normal',   // cat_normal(单枞茶) / cat_special(特惠茶) / cat_farm(农产品)
    currentPackType: 'all',          // all / bag(袋装) / can(铁罐) / gift(礼盒)
    currentSeason: 'all',            // all / spring(春茶) / second_spring(二春)
    keyword: '',
    page: 1,
    hasMore: true,
    isLoading: false
  },

  onLoad(options) {
    // 从发现页跳转带 aromaName 参数
    if (options && options.aromaName) {
      // 根据 aromaName 找到对应的 categoryId
      const categories = Mock.mockCategories
      const matched = categories.find(c => c.name === options.aromaName)
      if (matched) {
        this.setData({ currentCategory: matched.id })
      }
    }
    // 兼容旧的 categoryId 参数
    if (options && options.categoryId) {
      this.setData({ currentCategory: options.categoryId })
    }
    this.loadCategories()
  },

  onShow() {
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
        pageSize: 20
      }

      const cat = this.data.currentCategory

      if (cat === 'cat_normal') {
        // 单枞茶：按香型分类
        params.type = 'tea'
      } else if (cat === 'cat_special') {
        // 特惠茶：茶叶中有原价>售价的
        params.type = 'tea'
      } else if (cat === 'cat_farm') {
        // 农产品：蜂蜜
        params.type = 'honey'
      } else {
        // 具体香型分类ID
        params.categoryId = cat
      }

      if (this.data.keyword) {
        params.keyword = this.data.keyword
      }

      const res = await api.getProductList(params)
      let list = (res && res.list) || []

      // 如果是特惠茶，只保留有折扣的
      if (cat === 'cat_special') {
        list = list.filter(p => p.originalPrice && p.originalPrice > p.price)
      }

      // 包装筛选（仅单枞茶/具体香型时生效）
      if (this.data.currentPackType !== 'all' && (cat === 'cat_normal' || cat !== 'cat_special' && cat !== 'cat_farm')) {
        const packMap = { bag: '袋装', can: '铁罐', gift: '礼盒' }
        const packKeyword = packMap[this.data.currentPackType]
        if (packKeyword) {
          list = list.filter(p => {
            const tags = p.tags || []
            const name = p.name || ''
            return tags.some(t => t.includes(packKeyword)) || name.includes(packKeyword)
          })
        }
      }

      // 季节筛选
      if (this.data.currentSeason !== 'all') {
        const seasonMap = { spring: '春茶', second_spring: '二春' }
        const seasonKeyword = seasonMap[this.data.currentSeason]
        if (seasonKeyword) {
          list = list.filter(p => {
            const tags = p.tags || []
            return tags.some(t => t.includes(seasonKeyword))
          })
        }
      }

      const newProducts = this.data.page === 1 ? list : this.data.products.concat(list)
      const hasMore = list.length >= (params.pageSize || 20)

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
   * 切换分类（单枞茶/特惠茶/农产品）
   */
  switchCategory(e) {
    const cat = e.currentTarget.dataset.cat
    if (cat === this.data.currentCategory) return

    if (cat === 'cat_farm') {
      wx.showToast({ title: '敬请期待', icon: 'none', duration: 1500 })
      return
    }

    this.setData({
      currentCategory: cat,
      currentPackType: 'all',
      currentSeason: 'all',
      products: [],
      page: 1,
      hasMore: true
    })
    this.loadProducts()
  },

  /**
   * 切换包装类型
   */
  switchPackType(e) {
    const packType = e.currentTarget.dataset.pack || 'all'
    if (packType === this.data.currentPackType) return

    this.setData({
      currentPackType: packType,
      products: [],
      page: 1,
      hasMore: true
    })
    this.loadProducts()
  },

  /**
   * 切换季节
   */
  switchSeason(e) {
    const season = e.currentTarget.dataset.season || 'all'
    if (season === this.data.currentSeason) return

    this.setData({
      currentSeason: season,
      products: [],
      page: 1,
      hasMore: true
    })
    this.loadProducts()
  },

  /**
   * 搜索栏点击（装饰性）
   */
  onSearchTap() {
    wx.showToast({ title: '搜索功能暂未开放', icon: 'none', duration: 1500 })
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
