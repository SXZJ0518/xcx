import request from './index'

// 茶知识管理 API
export default {
  // ===== 文章管理 =====
  getList(params) {
    return request({ url: '/api/admin/knowledge', method: 'get', params })
  },
  getDetail(id) {
    return request({ url: `/api/admin/knowledge/${id}`, method: 'get' })
  },
  create(data) {
    return request({ url: '/api/admin/knowledge', method: 'post', data })
  },
  update(id, data) {
    return request({ url: `/api/admin/knowledge/${id}`, method: 'put', data })
  },
  delete(id) {
    return request({ url: `/api/admin/knowledge/${id}`, method: 'delete' })
  },
  updateStatus(id, status) {
    return request({ url: `/api/admin/knowledge/${id}/status`, method: 'put', data: { status } })
  },
  batchDelete(ids) {
    return request({ url: '/api/admin/knowledge/batch', method: 'delete', data: { ids } })
  },

  // ===== 分类管理 =====
  getCategories() {
    return request({ url: '/api/admin/knowledge/categories', method: 'get' })
  },
  createCategory(data) {
    return request({ url: '/api/admin/knowledge/categories', method: 'post', data })
  },
  updateCategory(id, data) {
    return request({ url: `/api/admin/knowledge/categories/${id}`, method: 'put', data })
  },
  deleteCategory(id) {
    return request({ url: `/api/admin/knowledge/categories/${id}`, method: 'delete' })
  },

  // ===== 上传 =====
  uploadImage(formData) {
    return request({ url: '/api/admin/upload/knowledge', method: 'post', data: formData, headers: { 'Content-Type': 'multipart/form-data' } })
  }
}
