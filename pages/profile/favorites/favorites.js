/**
 * 我的收藏列表页
 */
const favorites = require('../../../utils/favorites')

Page({
  data: {
    list: [],
    isEmpty: true
  },

  onShow() {
    this.loadFavorites()
  },

  /**
   * 加载收藏列表
   */
  loadFavorites() {
    const list = favorites.getAll()
    this.setData({
      list,
      isEmpty: list.length === 0
    })
  },

  /**
   * 点击商品，跳转到茶品列表页并滚动到对应商品
   * 通过 globalData 传递目标商品ID
   */
  goToProduct(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return

    const app = getApp()
    app.globalData._pendingProductId = id
    wx.switchTab({ url: '/pages/product/list/list' })
  },

  /**
   * 删除收藏
   */
  removeFavorite(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return

    wx.showModal({
      title: '取消收藏',
      content: '确定要取消收藏该商品吗？',
      confirmText: '确定',
      cancelText: '取消',
      confirmColor: '#c9a86c',
      success: (res) => {
        if (res.confirm) {
          favorites.remove(id)
          this.loadFavorites()
          wx.showToast({ title: '已取消收藏', icon: 'success' })
        }
      }
    })
  }
})
