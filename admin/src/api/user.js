import request from './index'

// 用户等级管理API
export default {
  /**
   * 获取用户等级列表
   * @returns {Promise}
   */
  getLevelList() {
    return request({
      url: '/api/admin/user/levels',
      method: 'get'
    })
  },

  /**
   * 创建用户等级
   * @param {Object} data - 等级数据
   * @returns {Promise}
   */
  createLevel(data) {
    return request({
      url: '/api/admin/user/levels',
      method: 'post',
      data
    })
  },

  /**
   * 更新用户等级
   * @param {Number|String} id - 等级ID
   * @param {Object} data - 等级数据
   * @returns {Promise}
   */
  updateLevel(id, data) {
    return request({
      url: `/api/admin/user/levels/${id}`,
      method: 'put',
      data
    })
  },

  /**
   * 删除用户等级
   * @param {Number|String} id - 等级ID
   * @returns {Promise}
   */
  deleteLevel(id) {
    return request({
      url: `/api/admin/user/levels/${id}`,
      method: 'delete'
    })
  },

  /**
   * 获取用户列表
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getUserList(params) {
    return request({
      url: '/api/admin/users',
      method: 'get',
      params
    })
  },

  /**
   * 获取用户详情
   * @param {Number|String} id - 用户ID
   * @returns {Promise}
   */
  getUserDetail(id) {
    return request({
      url: `/api/admin/users/${id}`,
      method: 'get'
    })
  },

  /**
   * 更新用户等级
   * @param {Number|String} id - 用户ID
   * @param {Number} levelId - 等级ID
   * @returns {Promise}
   */
  updateUserLevel(id, levelId) {
    return request({
      url: `/api/admin/users/${id}/level`,
      method: 'put',
      data: { levelId }
    })
  },

  /**
   * 更新用户状态（启用/禁用）
   * @param {Number|String} id - 用户ID
   * @param {Number} status - 状态：0禁用，1启用
   * @returns {Promise}
   */
  updateUserStatus(id, status) {
    return request({
      url: `/api/admin/users/${id}/status`,
      method: 'put',
      data: { status }
    })
  },

  /**
   * 获取用户收货地址
   * @param {Number|String} userId - 用户ID
   * @returns {Promise}
   */
  getUserAddresses(userId) {
    return request({
      url: `/api/admin/users/${userId}/addresses`,
      method: 'get'
    })
  },

  /**
   * 添加用户到黑名单
   * @param {Number|String} id - 用户ID
   * @param {Object} data - 黑名单原因
   * @returns {Promise}
   */
  addToBlacklist(id, data) {
    return request({
      url: `/api/admin/users/${id}/blacklist`,
      method: 'post',
      data
    })
  },

  /**
   * 从黑名单移除
   * @param {Number|String} id - 用户ID
   * @returns {Promise}
   */
  removeFromBlacklist(id) {
    return request({
      url: `/api/admin/users/${id}/blacklist`,
      method: 'delete'
    })
  },

  /**
   * 获取黑名单列表
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getBlacklist(params) {
    return request({
      url: '/api/admin/users/blacklist',
      method: 'get',
      params
    })
  },

  /**
   * 获取用户统计数据
   * @returns {Promise}
   */
  getStatistics() {
    return request({
      url: '/api/admin/users/statistics',
      method: 'get'
    })
  }
}
