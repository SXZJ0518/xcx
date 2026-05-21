import request from './index'

// 积分规则管理API
export default {
  /**
   * 获取积分规则列表
   * @returns {Promise}
   */
  getList() {
    return request({
      url: '/api/admin/integral/rules',
      method: 'get'
    })
  },

  /**
   * 获取积分规则详情
   * @param {Number|String} id - 规则ID
   * @returns {Promise}
   */
  getDetail(id) {
    return request({
      url: `/api/admin/integral/rules/${id}`,
      method: 'get'
    })
  },

  /**
   * 创建积分规则
   * @param {Object} data - 规则数据
   * @returns {Promise}
   */
  create(data) {
    return request({
      url: '/api/admin/integral/rules',
      method: 'post',
      data
    })
  },

  /**
   * 更新积分规则
   * @param {Number|String} id - 规则ID
   * @param {Object} data - 规则数据
   * @returns {Promise}
   */
  update(id, data) {
    return request({
      url: `/api/admin/integral/rules/${id}`,
      method: 'put',
      data
    })
  },

  /**
   * 删除积分规则
   * @param {Number|String} id - 规则ID
   * @returns {Promise}
   */
  delete(id) {
    return request({
      url: `/api/admin/integral/rules/${id}`,
      method: 'delete'
    })
  },

  /**
   * 获取积分记录
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getRecords(params) {
    return request({
      url: '/api/admin/integral/records',
      method: 'get',
      params
    })
  },

  /**
   * 调整用户积分
   * @param {Object} data - 调整数据 { userId, amount, reason }
   * @returns {Promise}
   */
  adjustIntegral(data) {
    return request({
      url: '/api/admin/integral/adjust',
      method: 'post',
      data
    })
  },

  /**
   * 获取积分统计
   * @returns {Promise}
   */
  getStatistics() {
    return request({
      url: '/api/admin/integral/statistics',
      method: 'get'
    })
  }
}
