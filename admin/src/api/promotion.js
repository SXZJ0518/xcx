import request from './index'

// 促销活动管理API
export default {
  /**
   * 获取促销活动列表
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getList(params) {
    return request({
      url: '/api/admin/promotions',
      method: 'get',
      params
    })
  },

  /**
   * 获取促销活动详情
   * @param {Number|String} id - 活动ID
   * @returns {Promise}
   */
  getDetail(id) {
    return request({
      url: `/api/admin/promotions/${id}`,
      method: 'get'
    })
  },

  /**
   * 创建促销活动
   * @param {Object} data - 活动数据
   * @returns {Promise}
   */
  create(data) {
    return request({
      url: '/api/admin/promotions',
      method: 'post',
      data
    })
  },

  /**
   * 更新促销活动
   * @param {Number|String} id - 活动ID
   * @param {Object} data - 活动数据
   * @returns {Promise}
   */
  update(id, data) {
    return request({
      url: `/api/admin/promotions/${id}`,
      method: 'put',
      data
    })
  },

  /**
   * 删除促销活动
   * @param {Number|String} id - 活动ID
   * @returns {Promise}
   */
  delete(id) {
    return request({
      url: `/api/admin/promotions/${id}`,
      method: 'delete'
    })
  },

  /**
   * 更新活动状态
   * @param {Number|String} id - 活动ID
   * @param {Number} status - 状态：0禁用，1启用
   * @returns {Promise}
   */
  updateStatus(id, status) {
    return request({
      url: `/api/admin/promotions/${id}/status`,
      method: 'put',
      data: { status }
    })
  },

  /**
   * 批量删除活动
   * @param {Array} ids - 活动ID数组
   * @returns {Promise}
   */
  batchDelete(ids) {
    return request({
      url: '/api/admin/promotions/batch',
      method: 'delete',
      data: { ids }
    })
  },

  /**
   * 获取促销活动统计
   * @returns {Promise}
   */
  getStatistics() {
    return request({
      url: '/api/admin/promotions/statistics',
      method: 'get'
    })
  }
}
