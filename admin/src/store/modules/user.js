import Cookies from 'js-cookie'
import { mockLogin } from '@/utils/mock'
import request from '@/api'

const state = {
  token: Cookies.get('Admin-Token') || localStorage.getItem('Admin-Token') || sessionStorage.getItem('Admin-Token'),
  userInfo: JSON.parse(localStorage.getItem('adminUserInfo') || '{}'),
  isLoggedIn: !!(Cookies.get('Admin-Token') || localStorage.getItem('Admin-Token') || sessionStorage.getItem('Admin-Token'))
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    state.isLoggedIn = !!token
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
  },
  CLEAR_USER(state) {
    state.token = ''
    state.userInfo = {}
    state.isLoggedIn = false
  }
}

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // 请求登录接口
      request({
        url: '/api/admin/login',
        method: 'post',
        data: { username, password }
      })
        .then(response => {
          if (response.code === 0 && response.data) {
            const token = response.data.token
            const userInfo = response.data.userInfo
            
            // 保存token
            Cookies.set('Admin-Token', token, { expires: 7 }) // Cookie 7天过期
            localStorage.setItem('Admin-Token', token) // localStorage 持久化
            
            // 保存用户信息到localStorage
            localStorage.setItem('adminUserInfo', JSON.stringify(userInfo))
            
            // 更新状态
            commit('SET_TOKEN', token)
            commit('SET_USER_INFO', userInfo)
          }
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  
  // 获取用户信息
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 如果没有token，直接返回
      if (!state.token) {
        reject('用户未登录')
        return
      }
      
      request({
        url: '/api/admin/user/info',
        method: 'get'
      })
        .then(response => {
          if (response.code === 0 && response.data) {
            commit('SET_USER_INFO', response.data)
            localStorage.setItem('adminUserInfo', JSON.stringify(response.data))
          }
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  
  // 退出登录
  logout({ commit }) {
    return new Promise((resolve) => {
      // 清除token
      Cookies.remove('Admin-Token')
      localStorage.removeItem('Admin-Token')
      sessionStorage.removeItem('Admin-Token')
      
      // 清除用户信息
      localStorage.removeItem('adminUserInfo')
      
      // 重置状态
      commit('CLEAR_USER')
      
      // 可选：调用登出API
      request({
        url: '/api/admin/logout',
        method: 'post'
      })
        .then(() => {
          resolve()
        })
        .catch(() => {
          // 即使API调用失败，也认为已登出
          resolve()
        })
    })
  }
}

const getters = {
  isLoggedIn: state => state.isLoggedIn,
  token: state => state.token,
  userInfo: state => state.userInfo
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 