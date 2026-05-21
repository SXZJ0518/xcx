import request from './index'

export default {
  getList(params) {
    return request({
      url: '/api/admin/coupons',
      method: 'get',
      params
    })
  },
  
  getDetail(id) {
    return request({
      url: `/api/admin/coupons/${id}`,
      method: 'get'
    })
  },
  
  create(data) {
    return request({
      url: '/api/admin/coupons',
      method: 'post',
      data
    })
  },
  
  update(id, data) {
    return request({
      url: `/api/admin/coupons/${id}`,
      method: 'put',
      data
    })
  },
  
  delete(id) {
    return request({
      url: `/api/admin/coupons/${id}`,
      method: 'delete'
    })
  },
  
  batchDelete(ids) {
    return request({
      url: '/api/admin/coupons/batch',
      method: 'delete',
      data: { ids }
    })
  },
  
  updateStatus(id, status) {
    return request({
      url: `/api/admin/coupons/${id}/status`,
      method: 'put',
      data: { status }
    })
  },
  
  getStats(id) {
    return request({
      url: `/api/admin/coupons/${id}/stats`,
      method: 'get'
    })
  },

  getStatistics() {
    return request({
      url: '/api/admin/coupons/statistics',
      method: 'get'
    })
  },

  getUsageList(params) {
    return request({
      url: '/api/admin/coupons/usage',
      method: 'get',
      params
    })
  }
}