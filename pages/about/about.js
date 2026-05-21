/**
 * 关于页面
 */
Page({
  data: {
    wechatId: 'your_wechat_id',
    phone: '13800138000' // 替换为实际电话
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

  makeCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
      fail: () => {
        wx.showToast({
          title: '拨打电话失败',
          icon: 'none'
        })
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '凤凰单枞 · 关于我们',
      path: '/pages/about/about'
    }
  }
})
