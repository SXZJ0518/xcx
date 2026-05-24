/**
 * 收藏工具模块
 * 使用本地存储管理收藏的商品
 */
const STORAGE_KEY = 'tea_favorites'

/**
 * 获取所有收藏
 * @returns {Array<{id, name, imageUrl, price, aromaName, categoryId, savedAt}>}
 */
function getAll() {
  try {
    const raw = wx.getStorageSync(STORAGE_KEY) || '[]'
    return JSON.parse(raw)
  } catch {
    return []
  }
}

/**
 * 检查是否已收藏
 * @param {string} productId
 * @returns {boolean}
 */
function isFavorited(productId) {
  const list = getAll()
  return list.some(item => item.id === productId)
}

/**
 * 添加收藏
 * @param {{id, name, imageUrl, price, aromaName, categoryId}} product
 */
function add(product) {
  const list = getAll()
  if (list.some(item => item.id === product.id)) return
  list.unshift({
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl || product.cover || '',
    price: product.price || 0,
    aromaName: product.aromaName || '',
    categoryId: product.categoryId || '',
    savedAt: Date.now()
  })
  wx.setStorageSync(STORAGE_KEY, JSON.stringify(list))
}

/**
 * 移除收藏
 * @param {string} productId
 */
function remove(productId) {
  let list = getAll()
  list = list.filter(item => item.id !== productId)
  wx.setStorageSync(STORAGE_KEY, JSON.stringify(list))
}

/**
 * 切换收藏状态
 * @param {{id, name, imageUrl, price, aromaName, categoryId}} product
 * @returns {boolean} 返回操作后是否已收藏
 */
function toggle(product) {
  if (isFavorited(product.id)) {
    remove(product.id)
    return false
  } else {
    add(product)
    return true
  }
}

/**
 * 获取收藏数量
 * @returns {number}
 */
function getCount() {
  return getAll().length
}

module.exports = { getAll, isFavorited, add, remove, toggle, getCount }
