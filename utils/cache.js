/**
 * 缓存工具模块
 * 统一管理缓存存储和读取，支持过期时间设置
 */

// 缓存前缀，避免命名冲突
const CACHE_PREFIX = 'tea_shop_';

/**
 * 设置缓存
 * @param {string} key - 缓存键名
 * @param {*} data - 要缓存的数据
 * @param {number} [expire=0] - 过期时间(毫秒)，0表示永不过期
 */
const set = function(key, data, expire = 0) {
  try {
    const cacheData = {
      data: data,
      expire: expire > 0 ? Date.now() + expire : 0,
      createTime: Date.now()
    };
    
    wx.setStorageSync(CACHE_PREFIX + key, cacheData);
  } catch (e) {
    console.error('缓存数据失败:', e);
  }
};

/**
 * 获取缓存
 * @param {string} key - 缓存键名
 * @returns {*} 缓存的数据，如果已过期或不存在则返回null
 */
const get = function(key) {
  try {
    const cacheData = wx.getStorageSync(CACHE_PREFIX + key);
    
    if (!cacheData) {
      return null;
    }
    
    // 检查是否过期
    if (cacheData.expire > 0 && cacheData.expire < Date.now()) {
      // 缓存已过期，删除缓存
      remove(key);
      return null;
    }
    
    return cacheData.data;
  } catch (e) {
    console.error('获取缓存数据失败:', e);
    return null;
  }
};

/**
 * 删除缓存
 * @param {string} key - 缓存键名
 */
const remove = function(key) {
  try {
    wx.removeStorageSync(CACHE_PREFIX + key);
  } catch (e) {
    console.error('删除缓存数据失败:', e);
  }
};

/**
 * 清除所有缓存
 */
const clear = function() {
  try {
    wx.clearStorageSync();
  } catch (e) {
    console.error('清除缓存数据失败:', e);
  }
};

module.exports = {
  CACHE_PREFIX,
  set,
  get,
  remove,
  clear
};
