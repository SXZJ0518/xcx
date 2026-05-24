/**
 * 管理后台 API 代理服务
 * 
 * 作用：架在你自己服务器上，接收 Vercel 后台的请求，
 * 通过 SDK 调用微信云函数（免费，不需要开通 HTTP 访问服务）
 * 
 * 使用前：
 * 1. 在云开发控制台 → 环境设置 → 获取「环境ID」和「密钥」
 * 2. 设置环境变量：
 *    set TCB_ENV=cloud1-d2gzj9p633865ea93
 *    set TCB_SECRET_ID=你的SecretId
 *    set TCB_SECRET_KEY=你的SecretKey
 * 3. npm install 然后 node index.js
 */
const express = require('express')
const cors = require('cors')
const tcb = require('@cloudbase/node-sdk')

const app = express()

// 云环境配置（优先级：环境变量 > 默认）
const TCB_ENV = process.env.TCB_ENV || 'cloud1-d2gzj9p633865ea93'

// 初始化云开发 SDK
const cloudApp = tcb.init({
  env: TCB_ENV,
  secretId: process.env.TCB_SECRET_ID,
  secretKey: process.env.TCB_SECRET_KEY
})

app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '10mb' }))

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: TCB_ENV, timestamp: new Date().toISOString() })
})

// 通用 API 入口：接收 { action, params }，转发到 mall 云函数
app.post('/mall', async (req, res) => {
  try {
    const { action, params = {} } = req.body

    if (!action) {
      return res.json({ code: -1, message: '缺少 action 参数' })
    }

    console.log(`[${new Date().toLocaleTimeString()}] 调用: ${action}`, JSON.stringify(params).slice(0, 200))

    // 通过 SDK 调用 mall 云函数（非 HTTP，免费）
    const result = await cloudApp.callFunction({
      name: 'mall',
      data: { action, params }
    })

    const data = result.result || { code: -1, message: '云函数无返回' }
    res.json(data)

  } catch (error) {
    console.error('API 调用失败:', error.message)
    res.json({
      code: -1,
      message: error.message || '服务器内部错误',
      data: null
    })
  }
})

// 启动服务
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`\n=================================`)
  console.log(`  茶品管理后台 API 代理已启动`)
  console.log(`  地址: http://localhost:${PORT}/mall`)
  console.log(`  环境: ${TCB_ENV}`)
  console.log(`  时间: ${new Date().toLocaleString()}`)
  console.log(`=================================\n`)
})
