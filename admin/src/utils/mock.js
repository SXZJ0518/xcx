// 模拟响应数据工具
export function mockResponse(data, code = 0, message = 'success') {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code,
        message,
        data
      })
    }, 300)
  })
}

// 模拟用户登录
export function mockLogin(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === '123456') {
        resolve({
          code: 0,
          message: '登录成功',
          data: {
            token: 'mock-admin-token-123456',
            userInfo: {
              id: 1,
              username: 'admin',
              name: '系统管理员',
              avatar: ''
            }
          }
        })
      } else {
        reject({
          code: 400,
          message: '用户名或密码错误',
          data: null
        })
      }
    }, 300)
  })
}

// 模拟用户数据
export const mockUserData = {
  users: [
    { id: 1, username: 'admin', name: '系统管理员', avatar: '', role: 'admin', status: 1, email: 'admin@example.com', phone: '13800000000', createTime: '2023-01-01 00:00:00' },
    { id: 2, username: 'test', name: '测试用户', avatar: '', role: 'user', status: 1, email: 'test@example.com', phone: '13800000001', createTime: '2023-01-02 00:00:00' }
  ],
  products: [
    { id: 1, name: '龙井茶', category: '绿茶', price: 299, originalPrice: 399, sales: 100, status: 1, isRecommend: 1, isNew: 1, isHot: 1, stock: 1000, createTime: '2023-01-01 00:00:00' },
    { id: 2, name: '铁观音', category: '乌龙茶', price: 199, originalPrice: 299, sales: 80, status: 1, isRecommend: 0, isNew: 1, isHot: 0, stock: 500, createTime: '2023-01-02 00:00:00' }
  ]
} 