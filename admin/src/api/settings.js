import request from './index'

// 站点设置 API
export default {
  /**
   * 获取所有站点设置
   * @returns {Promise}
   */
  getSettings() {
    return request({
      url: '/api/admin/settings',
      method: 'get'
    })
  },

  /**
   * 更新品牌信息
   * @param {Object} data - 品牌信息 { brandName, slogan, logo }
   * @returns {Promise}
   */
  updateBrand(data) {
    return request({
      url: '/api/admin/settings/brand',
      method: 'put',
      data
    })
  },

  /**
   * 更新联系方式
   * @param {Object} data - 联系方式 { wechatId, phone, email, workHours, address }
   * @returns {Promise}
   */
  updateContact(data) {
    return request({
      url: '/api/admin/settings/contact',
      method: 'put',
      data
    })
  },

  /**
   * 更新品牌故事/关于我们
   * @param {Object} data - 品牌故事 { aboutUs }
   * @returns {Promise}
   */
  updateAbout(data) {
    return request({
      url: '/api/admin/settings/about',
      method: 'put',
      data
    })
  },

  /**
   * 上传Logo
   * @param {FormData} formData - 包含图片的FormData
   * @returns {Promise}
   */
  uploadLogo(formData) {
    return request({
      url: '/api/admin/upload/logo',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
