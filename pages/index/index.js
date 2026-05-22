
const app = getApp()
const API = require('../../utils/api')
const cache = require('../../utils/cache')

Page({
  data: {
    loading: false,
    activeCat: 0,
    showBackToTop: false,
    searchKeyword: '',
    searchFocus: false,
    searchResults: [],
    categories: [],
    newProducts: [],
    featuredProducts: [],
    hotProducts: [],
    banners: [],
    recommendProducts: []
  },

  onLoad: function() {
    console.log('首页加载')
    this.getSystemInfo()
    this.loadData()
    wx.onPageScroll(this.onPageScroll)
  },

  onShow: function() {
    console.log('首页显示')
    this.checkCartStatus()
    if (this.data.searchKeyword) {
      this.setData({
        searchKeyword: '',
        searchResults: [],
        searchFocus: false
      })
    }
  },

  onUnload: function() {
    wx.offPageScroll(this.onPageScroll)
  },

  onPageScroll: function(e) {
    if (e.scrollTop &gt; 300 &amp;&amp; !this.data.showBackToTop) {
      this.setData({ showBackToTop: true })
    } else if (e.scrollTop &lt;= 300 &amp;&amp; this.data.showBackToTop) {
      this.setData({ showBackToTop: false })
    }
  },

  getSystemInfo: function() {
    try {
      const systemInfo = wx.getSystemInfoSync()
      console.log('屏幕宽度:', systemInfo.screenWidth)
      
      if (systemInfo.platform === 'android' || systemInfo.platform === 'ios') {
        this.setData({ isMobile: true })
      }
      
      const windowHeight = systemInfo.windowHeight
      this.setData({ windowHeight })
    } catch (e) {
      console.error('获取系统信息失败', e)
    }
  },

  loadData: function() {
    this.setData({ loading: true })
    
    Promise.all([
      this.getBanners(),
      this.getCategories(),
      this.getNewProducts(),
      this.getHotProducts()
    ]).then(() =&gt; {
      this.setData({ loading: false })
    }).catch(err =&gt; {
      console.error('加载数据失败', err)
      this.setData({ loading: false })
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    })
  },

  getBanners: function() {
    return API.banner.list().then(data =&gt; {
      const banners = (data || []).map(item =&gt; ({
        id: item._id,
        imageUrl: item.image,
        link: item.link || ''
      }))
      this.setData({ banners })
      cache.set('banners', banners, 30 * 60)
    }).catch(err =&gt; {
      console.error('获取轮播图失败', err)
      const cachedData = cache.get('banners')
      if (cachedData) {
        this.setData({ banners: cachedData })
      }
    })
  },

  getCategories: function() {
    return API.category.list().then(data =&gt; {
      const categories = [
        { id: '', name: '全部', icon: '/images/category/all.png' },
        ...(data || []).map(item =&gt; ({
          id: item._id,
          name: item.name,
          icon: item.icon || '/images/category/default.png'
        }))
      ]
      this.setData({ categories })
      cache.set('categories', categories, 30 * 60)
    }).catch(err =&gt; {
      console.error('获取分类失败', err)
      const cachedData = cache.get('categories')
      if (cachedData) {
        this.setData({ categories: cachedData })
      } else {
        this.setData({
          categories: [
            { id: '', name: '全部', icon: '/images/category/all.png' },
            { id: '1', name: '绿茶', icon: '/images/category/green.png' },
            { id: '2', name: '红茶', icon: '/images/category/black.png' },
            { id: '3', name: '乌龙茶', icon: '/images/category/oolong.png' },
            { id: '4', name: '白茶', icon: '/images/category/white.png' },
            { id: '5', name: '普洱茶', icon: '/images/category/puer.png' }
          ]
        })
      }
    })
  },

  getNewProducts: function() {
    return API.product.list({ page: 1, pageSize: 4, sort: 'new' }).then(data =&gt; {
      const products = (data.list || []).map(item =&gt; ({
        id: item._id,
        name: item.name,
        brief: item.brief || item.description,
        imageUrl: item.cover || item.imageUrl,
        price: item.price,
        originalPrice: item.originalPrice,
        isNew: item.isNew !== undefined ? item.isNew : true,
        stock: item.stock,
        sales: item.sales
      }))
      this.setData({ newProducts: products })
      cache.set('newProducts', products, 10 * 60)
    }).catch(err =&gt; {
      console.error('获取新品推荐失败', err)
      const cachedData = cache.get('newProducts')
      if (cachedData) {
        this.setData({ newProducts: cachedData })
      }
    })
  },

  getHotProducts: function() {
    return API.product.list({ page: 1, pageSize: 6, sort: 'sales_desc' }).then(data =&gt; {
      const products = (data.list || []).map(item =&gt; ({
        id: item._id,
        name: item.name,
        imageUrl: item.cover || item.imageUrl,
        price: item.price,
        sales: item.sales
      }))
      this.setData({ 
        hotProducts: products.slice(0, 2),
        recommendProducts: products
      })
      cache.set('hotProducts', products, 10 * 60)
    }).catch(err =&gt; {
      console.error('获取热卖商品失败', err)
      const cachedData = cache.get('hotProducts')
      if (cachedData) {
        this.setData({ 
          hotProducts: cachedData.slice(0, 2),
          recommendProducts: cachedData
        })
      }
    })
  },

  checkDesignConsistency: function() {
    const query = wx.createSelectorQuery()
    query.select('.category-item').boundingClientRect(rect =&gt; {
      if (rect &amp;&amp; rect.width !== 120) {
        console.warn('导航项尺寸异常', rect.width)
      }
    }).exec()
  },

  onSearch: function(e) {
    const value = e.detail.value
    console.log('搜索关键词:', value)
    wx.navigateTo({
      url: `/pages/search/index?keyword=${encodeURIComponent(value)}`
    })
  },

  onCategoryTap: function(e) {
    const id = e.currentTarget.dataset.id
    const name = e.currentTarget.dataset.name
    this.setData({ activeCat: id })
    
    wx.navigateTo({
      url: `/pages/product/list/list?categoryId=${id}&amp;categoryName=${encodeURIComponent(name)}`
    })
  },

  viewProductDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/product/detail/detail?id=${id}`
    })
  },

  viewFeaturedDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/product/detail/detail?id=${id}`
    })
  },

  viewMoreNewProducts: function() {
    wx.switchTab({
      url: '/pages/product/list/list'
    })
  },

  viewMoreFeatured: function() {
    wx.switchTab({
      url: '/pages/product/list/list'
    })
  },

  viewMoreHotProducts: function() {
    wx.switchTab({
      url: '/pages/product/list/list'
    })
  },

  addToCart: function(e) {
    const id = e.currentTarget.dataset.id
    console.log('添加到购物车:', id)
    
    this.showAddCartAnimation(e)
    
    const product = this.findProduct(id)
    
    if (product) {
      API.cart.add({
        productId: id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1
      }).then(() =&gt; {
        wx.showToast({
          title: '已添加到购物车',
          icon: 'success'
        })
        this.checkCartStatus()
      }).catch(err =&gt; {
        console.error('添加购物车失败', err)
        wx.showToast({
          title: '添加失败',
          icon: 'none'
        })
      })
    } else {
      wx.showToast({
        title: '添加失败，商品不存在',
        icon: 'none'
      })
    }
  },

  findProduct: function(id) {
    const allProducts = [
      ...this.data.newProducts,
      ...this.data.hotProducts,
      ...this.data.recommendProducts
    ]
    return allProducts.find(item =&gt; item.id === id)
  },

  showAddCartAnimation: function(e) {
    const query = wx.createSelectorQuery()
    query.select('.add-cart').boundingClientRect(rect =&gt; {
      if (!rect) return
    }).exec()
  },

  checkCartStatus: function() {
    API.cart.list().then(data =&gt; {
      if (data.list &amp;&amp; data.list.length &gt; 0) {
        wx.showTabBarRedDot({
          index: 2
        })
      } else {
        wx.hideTabBarRedDot({
          index: 2
        })
      }
    }).catch(() =&gt; {
      const cartData = wx.getStorageSync('cart') || []
      if (cartData.length &gt; 0) {
        wx.showTabBarRedDot({
          index: 2
        })
      } else {
        wx.hideTabBarRedDot({
          index: 2
        })
      }
    })
  },

  navigateToAR: function() {
    wx.navigateTo({
      url: '/important/pages/ar-preview/index'
    })
  },

  navigateToKnowledge: function() {
    wx.navigateTo({
      url: '/important/pages/tea-knowledge/index'
    })
  },

  navigateToAbout: function() {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },

  navigateToPolicy: function() {
    wx.navigateTo({
      url: '/pages/policy/policy'
    })
  },

  navigateToContact: function() {
    wx.makePhoneCall({
      phoneNumber: '400-123-4567',
      success: () =&gt; {
        console.log('拨打客服电话')
      },
      fail: (err) =&gt; {
        console.log('拨打客服电话失败', err)
      }
    })
  },

  onAnimationReady: function() {
    console.log('茶叶动画加载完成')
  },

  scrollToTop: function() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },

  onPullDownRefresh: function() {
    this.loadData()
    wx.stopPullDownRefresh()
  },

  navigateToDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/product/detail/detail?id=${id}`
    })
  },

  navigateToCategory: function(e) {
    const id = e.currentTarget.dataset.id
    wx.switchTab({
      url: '/pages/product/list/list'
    })
  },

  navigateToMore: function(e) {
    const type = e.currentTarget.dataset.type
    wx.switchTab({
      url: '/pages/product/list/list'
    })
  },

  navigateToBanner: function(e) {
    const index = e.currentTarget.dataset.index
    const banner = this.data.banners[index]
    if (banner &amp;&amp; banner.link) {
      wx.navigateTo({
        url: banner.link
      })
    }
  },

  navigateToSearch: function() {
    wx.navigateTo({
      url: '/pages/search/index'
    })
  },

  onShareAppMessage: function() {
    return {
      title: '清雅茶馆 - 品味好茶',
      path: '/pages/index/index'
    }
  },

  onSearchInput: function(e) {
    const keyword = e.detail.value
    this.setData({ searchKeyword: keyword })
    
    if (keyword) {
      this.searchProducts(keyword)
    } else {
      this.setData({ searchResults: [] })
    }
  },

  clearSearch: function() {
    this.setData({
      searchKeyword: '',
      searchResults: []
    })
  },

  searchProducts: function(keyword) {
    this.setData({ loading: true })
    
    API.product.search({ keyword, page: 1, pageSize: 10 }).then(data =&gt; {
      const results = (data.list || []).map(item =&gt; ({
        id: item._id,
        name: item.name,
        imageUrl: item.cover || item.imageUrl,
        price: item.price
      }))
      this.setData({
        searchResults: results,
        loading: false
      })
    }).catch(err =&gt; {
      console.error('搜索失败', err)
      this.setData({ loading: false })
      wx.showToast({
        title: '搜索失败',
        icon: 'none'
      })
    })
  }
})
