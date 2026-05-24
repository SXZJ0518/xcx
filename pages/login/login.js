// 登录页面
const api = require('../../utils/api')

Page({
  data: {
    agreed: true
  },

  onLoad(options) {
    // 保存来源页面，登录后跳回
    this.redirectUrl = options.redirect || '/pages/profile/profile'
  },

  // 微信授权登录
  async onWechatAuth() {
    if (!this.data.agreed) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' })
      return
    }

    try {
      // 获取用户信息
      const { userInfo } = await wx.getUserProfile({ desc: '用于完善用户资料' }).catch(() => ({}))
      
      if (!userInfo) {
        wx.showToast({ title: '授权失败', icon: 'none' })
        return
      }

      // Mock 登录
      const mockUser = {
        id: 'u_' + Date.now(),
        openid: 'mock_openid_' + Date.now(),
        nickname: userInfo.nickName,
        avatar: userInfo.avatarUrl,
        loginType: 'wechat',
        createTime: new Date().toISOString()
      }

      // 保存登录状态
      wx.setStorageSync('userInfo', mockUser)
      wx.setStorageSync('isLoggedIn', true)

      wx.showToast({ title: '登录成功', icon: 'success' })
      
      setTimeout(() => {
        wx.switchTab({ url: '/pages/profile/profile' })
      }, 1000)
    } catch (err) {
      console.error('微信授权登录失败:', err)
      wx.showToast({ title: '登录失败', icon: 'none' })
    }
  },

  // 微信手机号快捷登录
  async onGetPhoneNumber(e) {
    if (!this.data.agreed) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' })
      return
    }

    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      wx.showToast({ title: '授权失败', icon: 'none' })
      return
    }

    try {
      // Mock: 实际应将 e.detail.code 发送到后端换取手机号
      const mockPhone = '138****8888'
      
      const mockUser = {
        id: 'u_' + Date.now(),
        openid: 'mock_openid_' + Date.now(),
        phone: mockPhone,
        nickname: '茶友' + mockPhone.slice(-4),
        avatar: '',
        loginType: 'phone',
        createTime: new Date().toISOString()
      }

      wx.setStorageSync('userInfo', mockUser)
      wx.setStorageSync('isLoggedIn', true)

      wx.showToast({ title: '登录成功', icon: 'success' })
      
      setTimeout(() => {
        wx.switchTab({ url: '/pages/profile/profile' })
      }, 1000)
    } catch (err) {
      console.error('手机号登录失败:', err)
      wx.showToast({ title: '登录失败', icon: 'none' })
    }
  },

  // 切换协议同意
  toggleAgreement() {
    this.setData({ agreed: !this.data.agreed })
  },

  // 用户协议
  goToUserAgreement() {
    wx.navigateTo({ url: '/pages/about/about?type=agreement' })
  },

  // 隐私政策
  goToPrivacyPolicy() {
    wx.navigateTo({ url: '/pages/about/about?type=privacy' })
  }
})
