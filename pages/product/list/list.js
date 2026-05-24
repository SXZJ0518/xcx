/**
 * 茶品列表页 - 整页连续滚动，左侧导航自动高亮
 * 用 IntersectionObserver 监听区块可见性
 * 用 scroll-into-view 实现点击导航跳转
 */
const app = getApp()
const api = require('../../../utils/api')

Page({
  data: {
    categories: [],
    allProducts: [],
    groupedProducts: {},
    currentCategory: 'cat_normal',
    scrollIntoView: '',
    isLoading: false,
    isRefreshing: false,
    highlightAroma: '', // 需要高亮的香型名称
    searchKeyword: '', // 搜索关键词
    filteredCount: null // 搜索结果数量
  },

  _observers: [],

  onLoad(options) {
    this._pendingAromaName = ''
  },

  onShow() {
    // tabBar 页面每次显示时检查是否有待跳转的香型或商品
    const pendingAroma = app.globalData._pendingAromaName || ''
    const pendingProductId = app.globalData._pendingProductId || ''
    app.globalData._pendingAromaName = ''
    app.globalData._pendingProductId = ''

    if (pendingAroma) {
      this._pendingAromaName = pendingAroma
    }
    if (pendingProductId) {
      this._pendingProductId = pendingProductId
    }

    // 如果有待跳转请求且数据已加载，直接执行
    if (this._pendingProductId && this.data.allProducts.length > 0) {
      this.scrollToProduct(this._pendingProductId)
      this._pendingProductId = ''
    } else if (this._pendingAromaName && this.data.allProducts.length > 0) {
      this.scrollToAroma(this._pendingAromaName)
      this._pendingAromaName = ''
    } else if (!this.data.allProducts.length) {
      // 数据未加载，先加载数据，加载完后会在 loadAllData 中处理跳转
      this.loadAllData()
    }
  },

  onUnload() {
    // 清理所有观察器
    this._observers.forEach(obs => obs.disconnect())
    this._observers = []
  },

  /**
   * 加载所有数据并按分类分组，同分类内按香型排序
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

      this.setData({
        categories: cats,
        allProducts,
        isLoading: false,
        isRefreshing: false
      })

      // 分组
      this.groupProducts(cats, allProducts)

      // 数据渲染后，设置 IntersectionObserver
      setTimeout(() => {
        this.setupObservers()
        // 处理待跳转请求（商品ID优先于香型）
        if (this._pendingProductId) {
          this.scrollToProduct(this._pendingProductId)
          this._pendingProductId = ''
        } else if (this._pendingAromaName) {
          this.scrollToAroma(this._pendingAromaName)
          this._pendingAromaName = ''
        }
      }, 500)
    } catch (err) {
      console.error('加载数据失败:', err)
      this.setData({ isLoading: false, isRefreshing: false })
    }
  },

  /**
   * 商品分组（按分类分组，同分类内按香型排序）
   */
  groupProducts(categories, products) {
    const grouped = {}
    categories.forEach(cat => {
      // 筛选该分类下的商品
      const catProducts = products.filter(p => p.categoryId === cat.id)

      // 统计每个香型的商品数量
      const aromaCountMap = {}
      catProducts.forEach(p => {
        const key = p.aromaName || ''
        aromaCountMap[key] = (aromaCountMap[key] || 0) + 1
      })

      // 排序：同香型的排在一起，按商品数量降序，同数量按名称排序
      catProducts.sort((a, b) => {
        const aromaA = a.aromaName || ''
        const aromaB = b.aromaName || ''
        // 不同香型：按该香型的商品总数降序
        const countA = aromaCountMap[aromaA] || 0
        const countB = aromaCountMap[aromaB] || 0
        if (aromaA !== aromaB) {
          if (countA !== countB) return countB - countA
          return aromaA.localeCompare(aromaB, 'zh')
        }
        // 同香型：按 sort 字段
        return (a.sort || 0) - (b.sort || 0)
      })
      grouped[cat.id] = catProducts
    })

    this.setData({ groupedProducts: grouped })
  },

  /**
   * 滚动到指定香型的商品位置
   */
  scrollToAroma(aromaName) {
    if (!aromaName) return

    // 找到该香型对应的第一个商品，确定它在哪个分类下
    const product = this.data.allProducts.find(p => {
      if (!p.aromaName) return false
      return p.aromaName.includes(aromaName) ||
             aromaName.includes(p.aromaName) ||
             (aromaName.replace(/[\(\)（）\s]/g, '') === (p.aromaName || '').replace(/[\(\)（）\s]/g, ''))
    })

    if (!product) {
      wx.showToast({ title: '暂无该香型商品', icon: 'none' })
      return
    }

    // 1. 先切换到对应分类
    this.setData({
      currentCategory: product.categoryId,
      scrollIntoView: 'section-' + product.categoryId,
      highlightAroma: aromaName
    })

    // 2. 等滚动到分类后，再滚动到具体商品
    setTimeout(() => {
      this.setData({
        scrollIntoView: 'product-' + product.id
      })
      // 3. 清除高亮
      setTimeout(() => {
        this.setData({ scrollIntoView: '', highlightAroma: '' })
      }, 2000)
    }, 600)
  },

  /**
   * 滚动到指定商品（从收藏页跳转时使用）
   */
  scrollToProduct(productId) {
    if (!productId) return

    const product = this.data.allProducts.find(p => p.id === productId)
    if (!product) {
      wx.showToast({ title: '商品已下架', icon: 'none' })
      return
    }

    // 1. 切换到对应分类并滚动到分类区
    this.setData({
      currentCategory: product.categoryId,
      scrollIntoView: 'section-' + product.categoryId,
      highlightAroma: product.aromaName || ''
    })

    // 2. 等滚动到分类后，再精准滚动到商品
    setTimeout(() => {
      this.setData({
        scrollIntoView: 'product-' + product.id
      })
      // 3. 清除高亮
      setTimeout(() => {
        this.setData({ scrollIntoView: '', highlightAroma: '' })
      }, 2000)
    }, 600)
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

  onSearchTap() {
    // 已改为真实搜索框，此方法废弃
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    const keyword = e.detail.value.trim()
    this.setData({ searchKeyword: keyword })
  },

  /**
   * 确认搜索（定位跳转，不过滤）
   */
  onSearchConfirm() {
    const keyword = this.data.searchKeyword
    if (!keyword) return

    // 找到第一个匹配的商品
    const product = this.data.allProducts.find(p => {
      const name = (p.name || '').toLowerCase()
      const aroma = (p.aromaName || '').toLowerCase()
      const kw = keyword.toLowerCase()
      return name.includes(kw) || aroma.includes(kw)
    })

    if (!product) {
      wx.showToast({ title: '未找到相关茶品', icon: 'none' })
      return
    }

    // 滚动到该商品位置
    this.scrollToProduct(product.id)
  },

  /**
   * 清空搜索
   */
  clearSearch() {
    this.setData({ searchKeyword: '' })
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
