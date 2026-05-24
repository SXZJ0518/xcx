/**
 * 首页 - 凤凰单枞展示型小程序
 */
const api = require('../../utils/api')

// 香型视觉映射表
const AROMA_VISUALS = {
  '黄栀香': { emoji: '🌼', bg: '#f5edd6', fg: '#8b6914' },
  '芝兰香': { emoji: '🌸', bg: '#f0eef5', fg: '#6b4e8a' },
  '蜜兰香': { emoji: '🍯', bg: '#fdf2e0', fg: '#b8751e' },
  '桂花香': { emoji: '🌺', bg: '#fdf0e8', fg: '#c47a3b' },
  '玉兰香': { emoji: '🌿', bg: '#eef5ec', fg: '#4a6741' },
  '姜花香': { emoji: '🌶️', bg: '#fdeee8', fg: '#a0452e' },
  '夜来香': { emoji: '🌙', bg: '#ecebf5', fg: '#4a4578' },
  '杏仁香': { emoji: '🥜', bg: '#f5f0e6', fg: '#8b6e4a' },
  '肉桂香': { emoji: '🪵', bg: '#f0ebe3', fg: '#6b4a2e' },
  '银花香': { emoji: '✨', bg: '#f2f0eb', fg: '#9b8b6e' },
  '鸭屎香': { emoji: '✨', bg: '#f2f0eb', fg: '#9b8b6e' }
}

Page({
  data: {
    banners: [],
    hotProducts: [],
    aromaTypes: [],
    siteConfig: {},
    loading: true,
    wechatNumber: 'tea_fenghuang', // 写死微信号，可在此处修改
    wechatQrcode: '', // 微信二维码图片路径，留空则不显示
    showModal: false
  },

  onLoad() {
    this.loadHomeData()
  },

  onShow() {
    // 每次回到首页刷新热销数据
  },

  onPullDownRefresh() {
    this.loadHomeData().finally(() => wx.stopPullDownRefresh())
  },

  async loadHomeData() {
    this.setData({ loading: true })
    try {
      const [homeData, siteConfig] = await Promise.all([
        api.getHomeData().catch(() => null),
        api.getSiteConfig().catch(() => null)
      ])

      const data = homeData || {}
      const aromaTypes = (data.aromaTypes || []).map(item => {
        const visual = AROMA_VISUALS[item.name] || AROMA_VISUALS[item.name?.replace(/[\(\)（）]/g, '').trim()]
          || { emoji: '🍂', bg: '#e8e0d5', fg: '#5a5045' }
        return {
          ...item,
          _emoji: visual.emoji,
          _bg: visual.bg,
          _fg: visual.fg
        }
      })

      this.setData({
        banners: data.banners || [],
        hotProducts: (data.hotProducts || []).slice(0, 4),
        aromaTypes,
        siteConfig: siteConfig || {},
        loading: false
      })
    } catch (err) {
      console.error('首页数据加载失败:', err)
      this.setData({ loading: false })
    }
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/product/detail/detail?id=' + id })
  },

  goToProducts() {
    wx.switchTab({ url: '/pages/product/list/list' })
  },

  goToDiscover() {
    wx.switchTab({ url: '/pages/discover/discover' })
  },

  /**
   * 跳转到发现页的茶知识区域
   */
  goToKnowledge() {
    const app = getApp()
    app.globalData._scrollToKnowledge = true
    wx.switchTab({ url: '/pages/discover/discover' })
  },

  /**
   * 轮播图点击
   */
  onBannerTap(e) {
    const link = e.currentTarget.dataset.link
    if (!link) return

    // 处理不同类型的链接
    if (link.startsWith('/pages/product/detail')) {
      // 商品详情页
      const url = link.replace('/pages/product/detail', '/pages/product/detail/detail')
      wx.navigateTo({ url })
    } else if (link.startsWith('/pages/product/list')) {
      // 商品列表页 - 跳转到茶品tab
      wx.switchTab({ url: '/pages/product/list/list' })
    } else if (link.startsWith('/pages/discover')) {
      // 发现页
      wx.switchTab({ url: '/pages/discover/discover' })
    } else if (link.startsWith('/pages/')) {
      // 其他内部页面
      if (link.includes('index')) {
        // 首页不处理
        return
      }
      wx.navigateTo({ url: link })
    }
  },

  /**
   * 显示联系弹窗
   */
  showContactModal() {
    this.setData({ showModal: true })
  },

  /**
   * 隐藏联系弹窗
   */
  hideContactModal() {
    this.setData({ showModal: false })
  },

  copyWechat() {
    const wechat = this.data.wechatNumber
    wx.setClipboardData({
      data: wechat,
      success: () => wx.showToast({ title: '已复制微信号', icon: 'success' })
    })
  },

  onShareAppMessage() {
    return {
      title: this.data.siteConfig.slogan || '凤凰单枞 · 一丛一味 百丛百香',
      path: '/pages/index/index'
    }
  }
})
