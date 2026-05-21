const app = getApp()

// 云函数调用工具
const cloudAPI = {
  // 通用云函数调用
  callCloudFunction: function(name, action, params = {}) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: name,
        data: {
          action: action,
          params: params
        },
        success: res => {
          if (res.result.code === 0) {
            resolve(res.result.data)
          } else {
            reject(new Error(res.result.message))
          }
        },
        fail: err => {
          console.error('云函数调用失败:', err)
          reject(new Error('网络请求失败'))
        }
      })
    })
  },

  // 商品相关
  product: {
    // 获取商品列表
    list: function(params = {}) {
      return cloudAPI.callCloudFunction('mall', 'getProductList', params)
    },

    // 获取商品详情
    detail: function(id) {
      return cloudAPI.callCloudFunction('mall', 'getProductDetail', { id })
    },

    // 搜索商品
    search: function(keyword, params = {}) {
      return cloudAPI.callCloudFunction('mall', 'searchProducts', {
        keyword,
        ...params
      })
    }
  },

  // 分类相关
  category: {
    // 获取分类列表
    list: function() {
      return cloudAPI.callCloudFunction('mall', 'getCategoryList')
    }
  },

  // 轮播图相关
  banner: {
    // 获取轮播图列表
    list: function() {
      return cloudAPI.callCloudFunction('mall', 'getBannerList')
    }
  }
}

module.exports = cloudAPI
