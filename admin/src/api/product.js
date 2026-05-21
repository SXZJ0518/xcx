import request from './index'

// 商品管理API
export default {
  /**
   * 获取商品列表
   * @param {Object} params - 查询参数 { page, pageSize, keyword, categoryId, status }
   * @returns {Promise}
   */
  getList(params) {
    return request({
      url: '/api/admin/products',
      method: 'get',
      params
    })
  },
  
  /**
   * 获取商品详情
   * @param {Number|String} id - 商品ID
   * @returns {Promise}
   */
  getDetail(id) {
    return request({
      url: `/api/admin/products/${id}`,
      method: 'get'
    })
  },
  
  /**
   * 创建商品
   * @param {Object} data - 商品数据
   * @returns {Promise}
   */
  create(data) {
    return request({
      url: '/api/admin/products',
      method: 'post',
      data
    })
  },
  
  /**
   * 更新商品
   * @param {Number|String} id - 商品ID
   * @param {Object} data - 商品数据
   * @returns {Promise}
   */
  update(id, data) {
    return request({
      url: `/api/admin/products/${id}`,
      method: 'put',
      data
    })
  },
  
  /**
   * 删除商品
   * @param {Number|String} id - 商品ID
   * @returns {Promise}
   */
  delete(id) {
    return request({
      url: `/api/admin/products/${id}`,
      method: 'delete'
    })
  },
  
  /**
   * 更新商品状态（上架/下架）
   * @param {Number|String} id - 商品ID
   * @param {Number} status - 状态：0下架，1上架
   * @returns {Promise}
   */
  updateStatus(id, status) {
    return request({
      url: `/api/admin/products/${id}/status`,
      method: 'put',
      data: { status }
    })
  },
  
  /**
   * 批量删除商品
   * @param {Array} ids - 商品ID数组
   * @returns {Promise}
   */
  batchDelete(ids) {
    return request({
      url: '/api/admin/products/batch',
      method: 'delete',
      data: { ids }
    })
  },
  
  /**
   * 批量更新商品状态
   * @param {Array} ids - 商品ID数组
   * @param {Number} status - 状态：0下架，1上架
   * @returns {Promise}
   */
  batchUpdateStatus(ids, status) {
    return request({
      url: '/api/admin/products/batch/status',
      method: 'put',
      data: { ids, status }
    })
  },
  
  /**
   * 上传商品图片
   * @param {FormData} formData - 包含图片的FormData
   * @returns {Promise}
   */
  uploadImage(formData) {
    return request({
      url: '/api/admin/upload/product',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
} 