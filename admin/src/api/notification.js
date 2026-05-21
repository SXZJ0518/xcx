import request from './index'

// 消息通知管理API
export default {
  /**
   * 获取消息列表
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getList(params) {
    return request({
      url: '/api/admin/notifications',
      method: 'get',
      params
    })
  },

  /**
   * 获取消息详情
   * @param {Number|String} id - 消息ID
   * @returns {Promise}
   */
  getDetail(id) {
    return request({
      url: `/api/admin/notifications/${id}`,
      method: 'get'
    })
  },

  /**
   * 发送消息
   * @param {Object} data - 消息数据
   * @returns {Promise}
   */
  send(data) {
    return request({
      url: '/api/admin/notifications/send',
      method: 'post',
      data
    })
  },

  /**
   * 删除消息
   * @param {Number|String} id - 消息ID
   * @returns {Promise}
   */
  delete(id) {
    return request({
      url: `/api/admin/notifications/${id}`,
      method: 'delete'
    })
  },

  /**
   * 批量删除消息
   * @param {Array} ids - 消息ID数组
   * @returns {Promise}
   */
  batchDelete(ids) {
    return request({
      url: '/api/admin/notifications/batch',
      method: 'delete',
      data: { ids }
    })
  },

  /**
   * 获取系统公告列表
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getAnnouncements(params) {
    return request({
      url: '/api/admin/announcements',
      method: 'get',
      params
    })
  },

  /**
   * 创建系统公告
   * @param {Object} data - 公告数据
   * @returns {Promise}
   */
  createAnnouncement(data) {
    return request({
      url: '/api/admin/announcements',
      method: 'post',
      data
    })
  },

  /**
   * 更新系统公告
   * @param {Number|String} id - 公告ID
   * @param {Object} data - 公告数据
   * @returns {Promise}
   */
  updateAnnouncement(id, data) {
    return request({
      url: `/api/admin/announcements/${id}`,
      method: 'put',
      data
    })
  },

  /**
   * 删除系统公告
   * @param {Number|String} id - 公告ID
   * @returns {Promise}
   */
  deleteAnnouncement(id) {
    return request({
      url: `/api/admin/announcements/${id}`,
      method: 'delete'
    })
  },

  /**
   * 获取消息模板列表
   * @returns {Promise}
   */
  getTemplates() {
    return request({
      url: '/api/admin/notification/templates',
      method: 'get'
    })
  },

  /**
   * 创建消息模板
   * @param {Object} data - 模板数据
   * @returns {Promise}
   */
  createTemplate(data) {
    return request({
      url: '/api/admin/notification/templates',
      method: 'post',
      data
    })
  },

  /**
   * 更新消息模板
   * @param {Number|String} id - 模板ID
   * @param {Object} data - 模板数据
   * @returns {Promise}
   */
  updateTemplate(id, data) {
    return request({
      url: `/api/admin/notification/templates/${id}`,
      method: 'put',
      data
    })
  },

  /**
   * 删除消息模板
   * @param {Number|String} id - 模板ID
   * @returns {Promise}
   */
  deleteTemplate(id) {
    return request({
      url: `/api/admin/notification/templates/${id}`,
      method: 'delete'
    })
  }
}
