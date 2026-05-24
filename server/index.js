/**
 * 管理后台 API 代理服务
 * 
 * 作用：架在你的 Windows 服务器上，接收 Vercel 后台请求，
 *       通过 CloudBase SDK 直连云函数（不需要开通 HTTP 访问，免费）
 * 
 * 启动：npm install && node index.js
 */
const express = require('express')
const cors = require('cors')
const tcb = require('@cloudbase/node-sdk')

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '10mb' }))

// 初始化云开发（使用环境变量配置密钥）
const cloudApp = tcb.init({
  env: process.env.TCB_ENV || 'cloud1-d2gzj9p633865ea93',
  secretId: process.env.TCB_SECRET_ID,
  secretKey: process.env.TCB_SECRET_KEY
})

// 健康检查
app.get('/health', async (req, res) => {
  if (!process.env.TCB_SECRET_ID) {
    return res.json({ status: 'error', message: '请配置 TCB_SECRET_ID 和 TCB_SECRET_KEY 环境变量' })
  }
  res.json({ status: 'ok', env: process.env.TCB_ENV })
})

// 转发所有 API 请求到 mall 云函数
app.all('/mall', async (req, res) => {
  const { action, params } = req.body
  const start = Date.now()

  console.log(`→ ${action || 'unknown'}`)

  try {
    const result = await cloudApp.callFunction({
      name: 'mall',
      data: { action, params: params || {} }
    })

    const data = result.result || { code: -1, message: '云函数无返回' }
    res.json(data)

    console.log(`← ${action} ✓ ${Date.now() - start}ms`)
  } catch (error) {
    console.error(`← ${action} ✗ ${error.message}`)
    res.json({ code: -1, message: `调用失败: ${error.message}` })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`
=================================
  管理后台 API 代理已启动
  端口: ${PORT}
  环境: ${process.env.TCB_ENV || 'cloud1-d2gzj9p633865ea93'}
=================================
`)
})
