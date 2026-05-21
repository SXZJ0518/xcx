import request from './index'

export default {
  getList(params) {
    return request({
      url: '/api/admin/messages',
      method: 'get',
      params
    })
  },

  getDetail(id) {
    return request({
      url: `/api/admin/messages/${id}`,
      method: 'get'
    })
  },

  create(data) {
    return request({
      url: '/api/admin/messages',
      method: 'post',
      data
    })
  },

  update(id, data) {
    return request({
      url: `/api/admin/messages/${id}`,
      method: 'put',
      data
    })
  },

  delete(id) {
    return request({
      url: `/api/admin/messages/${id}`,
      method: 'delete'
    })
  },

  markRead(data) {
    return request({
      url: '/api/admin/messages/mark-read',
      method: 'put',
      data
    })
  },

  send(data) {
    return request({
      url: '/api/admin/messages/send',
      method: 'post',
      data
    })
  }
}
