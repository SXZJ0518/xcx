import request from './index'

export default {
  getList(params) {
    return request({
      url: '/api/admin/banners',
      method: 'get',
      params
    })
  },
  
  getDetail(id) {
    return request({
      url: `/api/admin/banners/${id}`,
      method: 'get'
    })
  },
  
  create(data) {
    return request({
      url: '/api/admin/banners',
      method: 'post',
      data
    })
  },
  
  update(id, data) {
    return request({
      url: `/api/admin/banners/${id}`,
      method: 'put',
      data
    })
  },
  
  delete(id) {
    return request({
      url: `/api/admin/banners/${id}`,
      method: 'delete'
    })
  },
  
  batchDelete(ids) {
    return request({
      url: '/api/admin/banners/batch',
      method: 'delete',
      data: { ids }
    })
  },
  
  updateStatus(id, status) {
    return request({
      url: `/api/admin/banners/${id}/status`,
      method: 'put',
      data: { status }
    })
  }
}