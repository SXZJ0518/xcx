import request from './index'

export default {
  getList(params) {
    return request({
      url: '/api/admin/returns',
      method: 'get',
      params
    })
  },
  
  getDetail(id) {
    return request({
      url: `/api/admin/returns/${id}`,
      method: 'get'
    })
  },
  
  handle(id, data) {
    return request({
      url: `/api/admin/returns/${id}/handle`,
      method: 'put',
      data
    })
  },
  
  updateLogistics(id, data) {
    return request({
      url: `/api/admin/returns/${id}/logistics`,
      method: 'put',
      data
    })
  },
  
  batchHandle(ids, data) {
    return request({
      url: '/api/admin/returns/batch',
      method: 'put',
      data: { ids, ...data }
    })
  },
  
  delete(id) {
    return request({
      url: `/api/admin/returns/${id}`,
      method: 'delete'
    })
  }
}