// 登录页面
const api = require('../../utils/api')

Page({
  data: {
    phone: '',
    code: '',
    codeText: '获取验证码',
    canSendCode: false,
    canLogin: false,
    agreed: true,
    countdown: 0
  },

  onLoad(options) {
    // 保存来源页面，登录后跳回
    this.redirectUrl = options.redirect || '/pages/profile/profile'
  },

  // 手机号输入
  onPhoneInput(e) {
    const phone = e.detail.value
    const canSendCode = /^1[3-9]\d{9}$/.test(phone)
    this.setData({ phone, canSendCode })
    this.checkCanLogin()
  },

  // 验证码输入
  onCodeInput(e) {
    this.setData({ code: e.detail.value })
    this.checkCanLogin()
  },

  // 检查是否可以登录
  checkCanLogin() {
    const { phone, code } = this.data
    const canLogin = /^1[3-9]\d{9}$/.test(phone) && /^\d{4,6}$/.test(code)
    this.setData({ canLogin })
  },

  // 发送验证码
  async sendCode() {
    if (!this.data.canSendCode || this.data.countdown > 0) return

    try {
      // Mock: 实际应调用 api.sendSmsCode(this.data.phone)
      wx.showToast({ title: '验证码已发送', icon: 'success' })
      
      // 倒计时
      let countdown = 60
      this.setData({ countdown, codeText: `${countdown}s` })
      
      const timer = setInterval(() => {
        countdown--
        if (countdown <= 0) {
          clearInterval(timer)
          this.setData({ countdown: 0, codeText: '获取验证码' })
        } else {
          this.setData({ countdown, codeText: `${countdown}s` })
        }
      }, 1000)
    } catch (err) {
      wx.showToast({ title: '发送失败', icon: 'none' })
    }
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

      // 上报用户信息
      this.reportUserInfo(mockUser)

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

      this.reportUserInfo(mockUser)

      wx.showToast({ title: '登录成功', icon: 'success' })
      
      setTimeout(() => {
        wx.switchTab({ url: '/pages/profile/profile' })
      }, 1000)
    } catch (err) {
      console.error('手机号登录失败:', err)
      wx.showToast({ title: '登录失败', icon: 'none' })
    }
  },

  // 手机号验证码登录
  async onPhoneLogin() {
    if (!this.data.canLogin) return
    if (!this.data.agreed) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' })
      return
    }

    try {
      // Mock: 实际应调用 api.loginByPhone(phone, code)
      const { phone } = this.data
      
      const mockUser = {
        id: 'u_' + Date.now(),
        phone,
        nickname: '茶友' + phone.slice(-4),
        avatar: '',
        loginType: 'phone',
        createTime: new Date().toISOString()
      }

      wx.setStorageSync('userInfo', mockUser)
      wx.setStorageSync('isLoggedIn', true)

      this.reportUserInfo(mockUser)

      wx.showToast({ title: '登录成功', icon: 'success' })
      
      setTimeout(() => {
        wx.switchTab({ url: '/pages/profile/profile' })
      }, 1000)
    } catch (err) {
      console.error('手机号登录失败:', err)
      wx.showToast({ title: '登录失败', icon: 'none' })
    }
  },

  // 上报用户信息
  async reportUserInfo(user) {
    try {
      // Mock: 实际应调用 api.reportUser(user)
      console.log('上报用户信息:', user)
    } catch (err) {
      console.error('上报用户信息失败:', err)
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
