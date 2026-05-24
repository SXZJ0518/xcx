/**
 * api.js - 接口统一管理
 *
 * 使用规则：
 * 1. 开发阶段：设置 USE_MOCK = true，使用模拟数据调试界面
 * 2. 正式上线：设置 USE_MOCK = false，所有请求走真实 API
 *
 * 环境切换：修改下方 USE_MOCK 值即可，无需改动任何业务代码
 */

const USE_MOCK = true // 【开发阶段用Mock数据，云函数部署后再改为 false】

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
        if (res.result && res.result.code === 0) {
          resolve(res.result.data)
        } else {
          reject(new Error(res.result?.message || '请求失败'))
        }
      }).catch(reject)
    })
  }

  // 开发环境：走模拟数据
  return new Promise(resolve => {
    setTimeout(() => {
      const data = Mock.getMockData(action, params)
      resolve(data)
    }, 300)
  })
}

// ==================== 首页相关 ====================
/**
 * 获取首页数据（轮播图、热销商品、分类、香型、站点配置）
 */
const getHomeData = function() { return callCloudFunction('getHomeData') }

/**
 * 获取轮播图列表
 */
const getBannerList = function() { return callCloudFunction('getBannerList') }

/**
 * 获取热销商品
 */
const getHotProducts = function() { return callCloudFunction('getHotProducts') }

// ==================== 商品相关 ====================
/**
 * 获取商品列表
 * @param {Object} params
 * @param {string} params.categoryId - 分类ID
 * @param {string} params.type - 类型：normal(单枞茶)/special(特惠茶)/farm(农产品)
 * @param {string} params.season - 季节：spring(春茶)/second_spring(二春)
 * @param {string} params.packType - 包装：bag(袋装)/can(铁罐)/gift(礼盒)
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
 * 获取商品分类列表（单枞茶/特惠茶/农产品）
 */
const getCategoryList = function() { return callCloudFunction('getCategoryList') }

// ==================== 香型相关 ====================
/**
 * 获取十大香型列表
 */
const getAromaTypes = function() { return callCloudFunction('getAromaTypes') }

// ==================== 茶知识相关 ====================
/**
 * 获取茶知识文章列表
 * @param {Object} params
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 */
const getKnowledgeList = function(params = {}) { return callCloudFunction('getKnowledgeList', params) }

/**
 * 获取茶知识详情
 * @param {string} id - 文章ID
 */
const getKnowledgeDetail = function(id) { return callCloudFunction('getKnowledgeDetail', { id }) }

// ==================== 站点配置 ====================
/**
 * 获取站点配置（品牌名、微信号、电话、地址等）
 */
const getSiteConfig = function() { return callCloudFunction('getSiteConfig') }

// ==================== 导出模块 ====================
module.exports = {
  // 扁平导出
  getHomeData,
  getBannerList,
  getHotProducts,
  getProductList,
  getProductDetail,
  getCategoryList,
  getAromaTypes,
  getKnowledgeList,
  getKnowledgeDetail,
  getSiteConfig,

  // 命名空间导出（兼容旧代码调用方式）
  product: {
    list: getProductList,
    detail: getProductDetail,
    hot: getHotProducts
  },
  category: { list: getCategoryList },
  aroma: { list: getAromaTypes },
  knowledge: { list: getKnowledgeList, detail: getKnowledgeDetail },
  site: { config: getSiteConfig },
  banner: { list: getBannerList }
}
