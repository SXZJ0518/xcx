import request from './index'

// 分类管理API
export default {
  /**
   * 获取分类列表
   * @param {Object} params - 查询参数 { page, pageSize, keyword }
   * @returns {Promise}
   */
  getList(params) {
    return request({
      url: '/api/admin/categories',
      method: 'get',
      params
    })
  },
  
  /**
   * 获取所有分类（不分页）
   * @returns {Promise}
   */
  getAll() {
    return request({
      url: '/api/admin/categories/all',
      method: 'get'
    })
  },
  
  /**
   * 获取分类详情
   * @param {Number|String} id - 分类ID
   * @returns {Promise}
   */
  getDetail(id) {
    return request({
      url: `/api/admin/categories/${id}`,
      method: 'get'
    })
  },
  
  /**
   * 创建分类
   * @param {Object} data - 分类数据
   * @returns {Promise}
   */
  create(data) {
    return request({
      url: '/api/admin/categories',
      method: 'post',
      data
    })
  },
  
  /**
   * 更新分类
   * @param {Number|String} id - 分类ID
   * @param {Object} data - 分类数据
   * @returns {Promise}
   */
  update(id, data) {
    return request({
      url: `/api/admin/categories/${id}`,
      method: 'put',
      data
    })
  },
  
  /**
   * 更新分类状态
   * @param {Number|String} id - 分类ID
   * @param {Object} data - 状态数据 { status }
   * @returns {Promise}
   */
  updateStatus(id, data) {
    return request({
      url: `/api/admin/categories/${id}/status`,
      method: 'put',
      data
    })
  },
  
  /**
   * 删除分类
   * @param {Number|String} id - 分类ID
   * @returns {Promise}
   */
  delete(id) {
    return request({
      url: `/api/admin/categories/${id}`,
      method: 'delete'
    })
  },
  
  /**
   * 上传分类图片
   * @param {FormData} formData - 包含图片的FormData
   * @returns {Promise}
   */
  uploadImage(formData) {
    return request({
      url: '/api/admin/upload/category',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
} 