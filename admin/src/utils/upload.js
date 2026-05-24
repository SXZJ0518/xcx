/**
 * 图片上传工具
 * 将文件转为 base64，通过云函数上传到微信云存储
 */
import request from '@/api'

/**
 * 上传图片到云存储
 * @param {File} file - 文件对象
 * @param {String} folder - 存储文件夹（如 'products', 'banners', 'knowledge'）
 * @returns {Promise} { fileID, url, cloudPath }
 */
export function uploadImage(file, folder = 'products') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target.result.split(',')[1]
      const fileName = file.name
      
      request({
        url: '/api/admin/upload',
        method: 'post',
        data: { fileName, fileBase64: base64, folder }
      })
        .then(res => {
          if (res.code === 0 && res.data) {
            resolve(res.data)
          } else {
            reject(new Error(res.message || '上传失败'))
          }
        })
        .catch(err => reject(err))
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

/**
 * el-upload 自定义上传方法
 * @param {String} folder - 存储文件夹
 * @returns {Function} http-request 处理函数
 */
export function createUploadHandler(folder = 'products') {
  return function(options) {
    const { file, onSuccess, onError } = options
    uploadImage(file, folder)
      .then(data => {
        onSuccess({ code: 0, data })
      })
      .catch(err => {
        onError(err)
      })
  }
}
