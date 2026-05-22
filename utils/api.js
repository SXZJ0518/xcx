/**
 * api.js - 接口统一管理
 *
 * 使用规则：
 * 1. 开发阶段：设置 USE_MOCK = true，使用模拟数据调试界面
 * 2. 正式上线：设置 USE_MOCK = false，所有请求走真实 API
 *
 * 环境切换：修改下方 USE_MOCK 值即可，无需改动任何业务代码
 */
const USE_MOCK = true // 【上线时改为 false】

const Mock = require('./wx.mock')

function callCloudFunction(action, params = {}) {
  if (!USE_MOCK) {
    // 生产环境：走真实云函数
    return new Promise((resolve, reject) => {
      if (!wx.cloud) {
        reject(new Error('云开发未初始化'))
        return
      }
      wx.cloud.callFunction({
        name: 'mall',
        data: { action, params }
      }).then(res => {
        if (res.result) {
          resolve(res.result)
        } else {
          reject(new Error('云函数返回异常'))
        }
      }).catch(reject)
    })
  }

  // 开发环境：走模拟数据
  return new Promise(resolve => {
    setTimeout(() => {
      const data = Mock.getMockData(action, params)
      resolve({ code: 0, data, message: 'ok' })
    }, 300)
  })
}

// ==================== 首页相关 ====================
/**
 * 获取首页聚合数据（轮播图、热销商品、分类列表、站点配置）
 */
const getHomeData = function() { return callCloudFunction('getHomeData') }

// ==================== 商品相关 ====================
/**
 * 获取商品列表
 * @param {Object} params
 * @param {string} params.categoryId - 分类ID
 * @param {string} params.type - 商品类型：normal(单枞茶) / special(特惠茶) / farm(农产品)
 * @param {string} params.season - 采摘季节：spring(春茶) / second_spring(二春)
 * @param {string} params.packType - 包装类型：bag(袋装) / can(铁罐) / gift(礼盒)
 * @param {string} params.keyword - 搜索关键词
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 */
const getProductList = function(params = {}) { return callCloudFunction('getProductList', params) }

/**
 * 获取商品详情
 * @param {string} id - 商品ID
 */
const getProductDetail = function(id) { return callCloudFunction('getProductDetail', { id }) }

// ==================== 分类相关 ====================
/**
 * 获取分类列表
 */
const getCategoryList = function() { return callCloudFunction('getCategoryList') }

// ==================== 茶知识相关 ====================
/**
 * 获取茶知识列表
 */
const getKnowledgeList = function() { return callCloudFunction('getKnowledgeList') }

/**
 * 获取茶知识详情
 * @param {string} id - 茶知识ID
 */
const getKnowledgeDetail = function(id) { return callCloudFunction('getKnowledgeDetail', { id }) }

// ==================== 站点配置 ====================
/**
 * 获取站点配置（品牌名、微信号、电话、地址等）
 */
const getSiteConfig = function() { return callCloudFunction('getSiteConfig') }

// ==================== 导出模块 ====================
module.exports = {
  getHomeData,
  getProductList,
  getProductDetail,
  getCategoryList,
  getKnowledgeList,
  getKnowledgeDetail,
  getSiteConfig
}
