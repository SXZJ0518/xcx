/**
 * 首页 - 凤凰单枞展示型小程序
 */
const api = require('../../utils/api')

Page({
  data: {
    categories: [],
    hotProducts: [],
    wechatId: 'your_wechat_id' // 替换为实际微信号
  },

  onLoad() {
    this.loadData()
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  async loadData() {
    try {
      const [categories, hotProducts] = await Promise.all([
        api.getCategoryList(),
        api.getHotProducts()
      ])
      this.setData({ categories, hotProducts })
    } catch (err) {
      console.error('加载数据失败:', err)
    }
  },

  // 跳转分类页
  goCategory(e) {
    const id = e.currentTarget.dataset.id
    wx.switchTab({
      url: '/pages/category/category'
    })
  },

  // 跳转商品列表
  goProductList() {
    wx.switchTab({
      url: '/pages/product/list/list'
    })
  },

  // 跳转商品详情
  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/product/detail/detail?id=${id}`
    })
  },

  // 复制微信号
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

  // 分享
  onShareAppMessage() {
    return {
      title: '凤凰单枞 · 一丛一味 百丛百香',
      path: '/pages/index/index',
      imageUrl: ''
    }
  }
})
