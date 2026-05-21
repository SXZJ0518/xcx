import request from './index'

// 订单管理API
export default {
  /**
   * 获取订单列表
   * @param {Object} params - 查询参数 { page, pageSize, keyword, status, dateRange }
   * @returns {Promise}
   */
  getList(params) {
    return request({
      url: '/api/admin/orders',
      method: 'get',
      params
    })
  },
  
  /**
   * 获取订单详情
   * @param {Number|String} id - 订单ID
   * @returns {Promise}
   */
  getDetail(id) {
    return request({
      url: `/api/admin/orders/${id}`,
      method: 'get'
    })
  },
  
  /**
   * 更新订单状态
   * @param {Number|String} id - 订单ID
   * @param {Object} data - 状态数据 { status, remark }
   * @returns {Promise}
   */
  updateStatus(id, data) {
    return request({
      url: `/api/admin/orders/${id}/status`,
      method: 'put',
      data
    })
  },
  
  /**
   * 发货
   * @param {Number|String} id - 订单ID
   * @param {Object} data - 发货数据 { shipCompany, shipNo }
   * @returns {Promise}
   */
  ship(id, data) {
    return request({
      url: `/api/admin/orders/${id}/ship`,
      method: 'put',
      data
    })
  },
  
  /**
   * 取消订单
   * @param {Number|String} id - 订单ID
   * @param {Object} data - 取消原因 { reason }
   * @returns {Promise}
   */
  cancel(id, data) {
    return request({
      url: `/api/admin/orders/${id}/cancel`,
      method: 'put',
      data
    })
  },
  
  /**
   * 订单退款
   * @param {Number|String} id - 订单ID
   * @param {Object} data - 退款信息 { amount, reason }
   * @returns {Promise}
   */
  refund(id, data) {
    return request({
      url: `/api/admin/orders/${id}/refund`,
      method: 'post',
      data
    })
  },
  
  /**
   * 获取订单统计数据
   * @returns {Promise}
   */
  getStatistics() {
    return request({
      url: '/api/admin/orders/statistics',
      method: 'get'
    })
  },

  /**
   * 导出订单Excel
   * @param {Object} params - 导出参数
   * @returns {Promise}
   */
  exportExcel(params) {
    return request({
      url: '/api/admin/orders/export',
      method: 'get',
      params,
      responseType: 'blob'
    })
  }
} 