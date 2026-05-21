import request from './index'

// 统计分析API
export default {
  /**
   * 获取控制台概览数据
   * @returns {Promise}
   */
  getDashboard() {
    return request({
      url: '/api/admin/statistics/dashboard',
      method: 'get'
    })
  },
  
  /**
   * 获取销售统计数据
   * @param {Object} params - 查询参数 { dateType, startDate, endDate }
   * @returns {Promise}
   */
  getSales(params) {
    return request({
      url: '/api/admin/statistics/sales',
      method: 'get',
      params
    })
  },
  
  /**
   * 获取商品销售排行
   * @param {Object} params - 查询参数 { dateType, limit }
   * @returns {Promise}
   */
  getProductRanking(params) {
    return request({
      url: '/api/admin/statistics/products/ranking',
      method: 'get',
      params
    })
  },
  
  /**
   * 获取用户增长数据
   * @param {Object} params - 查询参数 { dateType, startDate, endDate }
   * @returns {Promise}
   */
  getUserGrowth(params) {
    return request({
      url: '/api/admin/statistics/users/growth',
      method: 'get',
      params
    })
  },
  
  /**
   * 获取分类销售占比
   * @param {Object} params - 查询参数 { dateType }
   * @returns {Promise}
   */
  getCategorySales(params) {
    return request({
      url: '/api/admin/statistics/categories/sales',
      method: 'get',
      params
    })
  }
} 