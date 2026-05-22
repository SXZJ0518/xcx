import request from './index'

// 香型管理 API
export default {
  /**
   * 获取香型列表
   * @param {Object} params - 查询参数 { page, pageSize, keyword }
   * @returns {Promise}
   */
  getList(params) {
    return request({
      url: '/api/admin/aromas',
      method: 'get',
      params
    })
  },

  /**
   * 获取所有香型（不分页）
   * @returns {Promise}
   */
  getAll() {
    return request({
      url: '/api/admin/aromas/all',
      method: 'get'
    })
  },

  /**
   * 获取香型详情
   * @param {Number|String} id - 香型ID
   * @returns {Promise}
   */
  getDetail(id) {
    return request({
      url: `/api/admin/aromas/${id}`,
      method: 'get'
    })
  },

  /**
   * 创建香型
   * @param {Object} data - 香型数据
   * @returns {Promise}
   */
  create(data) {
    return request({
      url: '/api/admin/aromas',
      method: 'post',
      data
    })
  },

  /**
   * 更新香型
   * @param {Number|String} id - 香型ID
   * @param {Object} data - 香型数据
   * @returns {Promise}
   */
  update(id, data) {
    return request({
      url: `/api/admin/aromas/${id}`,
      method: 'put',
      data
    })
  },

  /**
   * 更新香型状态
   * @param {Number|String} id - 香型ID
   * @param {Object} data - 状态数据 { status }
   * @returns {Promise}
   */
  updateStatus(id, data) {
    return request({
      url: `/api/admin/aromas/${id}/status`,
      method: 'put',
      data
    })
  },

  /**
   * 删除香型
   * @param {Number|String} id - 香型ID
   * @returns {Promise}
   */
  delete(id) {
    return request({
      url: `/api/admin/aromas/${id}`,
      method: 'delete'
    })
  },

  /**
   * 批量删除香型
   * @param {Array} ids - 香型ID数组
   * @returns {Promise}
   */
  batchDelete(ids) {
    return request({
      url: '/api/admin/aromas/batch',
      method: 'delete',
      data: { ids }
    })
  }
}
