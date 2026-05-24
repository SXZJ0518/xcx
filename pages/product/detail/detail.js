/**
 * 商品详情页
 */
const api = require('../../../utils/api')
const favorites = require('../../../utils/favorites')

Page({
  data: {
    product: {},
    siteConfig: {},
    isFavorited: false
  },

  onLoad(options) {
    const id = options.id
    if (id) {
      this.loadProduct(id)
    }
    this.loadSiteConfig()
  },

  async loadProduct(id) {
    try {
      const product = await api.getProductDetail(id)
      this.setData({
        product,
        isFavorited: favorites.isFavorited(product.id)
      })
      wx.setNavigationBarTitle({
        title: product.name || '商品详情'
      })
    } catch (err) {
      console.error('加载商品失败:', err)
    }
  },

  /**
   * 加载站点配置
   */
  async loadSiteConfig() {
    try {
      const siteConfig = await api.getSiteConfig()
      this.setData({ siteConfig: siteConfig || {} })
    } catch (err) {
      console.error('加载配置失败:', err)
    }
  },

  /**
   * 切换收藏状态
   */
  toggleFavorite() {
    const { product, isFavorited } = this.data
    if (!product.id) return

    const newState = favorites.toggle({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl || product.cover,
      price: product.price,
      aromaName: product.aromaName,
      categoryId: product.categoryId
    })

    this.setData({ isFavorited: newState })
    wx.showToast({
      title: newState ? '已收藏' : '已取消收藏',
      icon: 'success',
      duration: 1500
    })
  },

  /**
   * 立即下单 - 弹出微信号
   */
  showOrder() {
    const wechat = this.data.siteConfig.wechat || ''
    if (!wechat) {
      wx.showToast({ title: '暂无微信号', icon: 'none' })
      return
    }

    wx.showModal({
      title: '联系下单',
      content: `请添加微信号下单：\n\n${wechat}\n\n点击「复制微信号」将微信号复制到剪贴板`,
      confirmText: '复制微信号',
      cancelText: '取消',
      confirmColor: '#c9a86c',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: wechat,
            success: () => {
              wx.showToast({
                title: '已复制微信号',
                icon: 'success'
              })
            }
          })
        }
      }
    })
  },

  copyWechat() {
    const wechat = this.data.siteConfig.wechat || ''
    if (!wechat) {
      wx.showToast({ title: '暂无微信号', icon: 'none' })
      return
    }
    wx.setClipboardData({
      data: wechat,
      success: () => {
        wx.showToast({
          title: '已复制微信号',
          icon: 'success'
        })
      }
    })
  },

  onShareAppMessage() {
    const { product } = this.data
    return {
      title: product.name || '凤凰单枞',
      path: `/pages/product/detail/detail?id=${product.id}`,
      imageUrl: product.imageUrl
    }
  }
})
