/**
 * 商品详情页
 */
const api = require('../../../utils/api')

Page({
  data: {
    product: {},
    wechatId: 'your_wechat_id'
  },

  onLoad(options) {
    const id = options.id
    if (id) {
      this.loadProduct(id)
    }
  },

  async loadProduct(id) {
    try {
      const product = await api.getProductDetail(id)
      this.setData({ product })
      wx.setNavigationBarTitle({
        title: product.name || '商品详情'
      })
    } catch (err) {
      console.error('加载商品失败:', err)
    }
  },

  copyWechat() {
    wx.setClipboardData({
      data: this.data.wechatId,
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
