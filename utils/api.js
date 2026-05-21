/**
 * mock.js - 开发环境模拟数据
 * 
 * 使用规则：
 * 1. 开发阶段：设置 USE_MOCK = true，使用模拟数据调试界面
 * 2. 正式上线：设置 USE_MOCK = false，所有请求走真实 API
 * 
 * 环境切换：修改下方 USE_MOCK 值即可，无需改动任何业务代码
 */
const USE_MOCK = true; // 【上线时改为 false】

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

// ==================== 商品相关 ====================
const getProductList = function(params = {}) { return callCloudFunction('getProductList', params) }
const getProductDetail = function(id) { return callCloudFunction('getProductDetail', { id }) }
const searchProducts = function(params) { return callCloudFunction('searchProducts', params) }

// ==================== 分类相关 ====================
const getCategoryList = function() { return callCloudFunction('getCategoryList') }

// ==================== 轮播图相关 ====================
const getBannerList = function() { return callCloudFunction('getBannerList') }

// ==================== 热门/新品商品 ====================
const getHotProducts = function() { return callCloudFunction('getHotProducts') }
const getNewProducts = function() { return callCloudFunction('getNewProducts') }

// ==================== 导出模块 ====================
module.exports = {
  // 扁平导出
  getProductList, getProductDetail, searchProducts,
  getCategoryList, getBannerList, getHotProducts, getNewProducts,

  // 命名空间导出（兼容旧代码调用方式）
  product: {
    list: getProductList,
    detail: getProductDetail,
    search: searchProducts,
    category: function(categoryId, params) { return getProductList({ ...params, categoryId }) }
  },
  category: { list: getCategoryList },
  banner: { list: getBannerList }
}
