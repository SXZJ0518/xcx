import request from './index'

export default {
  getList(params) {
    return request({
      url: '/api/admin/logs',
      method: 'get',
      params
    })
  },
  
  getDetail(id) {
    return request({
      url: `/api/admin/logs/${id}`,
      method: 'get'
    })
  },
  
  exportData(params) {
    return request({
      url: '/api/admin/logs/export',
      method: 'get',
      params,
      responseType: 'blob'
    })
  },
  
  clearLogs(days) {
    return request({
      url: '/api/admin/logs/clear',
      method: 'delete',
      data: { days }
    })
  }
}