/**
 * 管理后台 API 代理 + 静态文件服务
 * 
 * 同时提供：
 * 1. /mall      → API 代理（直连云函数）
 * 2. /           → 管理后台页面（admin/dist）
 * 
 * 启动：npm install && node index.js
 * 访问：http://你的服务器IP:3000
 */
const express = require('express')
const cors = require('cors')
const path = require('path')
const tcb = require('@cloudbase/node-sdk')

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '10mb' }))

// 初始化云开发
const cloudApp = tcb.init({
  env: process.env.TCB_ENV || 'cloud1-d2gzj9p633865ea93',
  secretId: process.env.TCB_SECRET_ID,
  secretKey: process.env.TCB_SECRET_KEY
})

// ============ 静态文件（管理后台页面） ============
// 把 admin/dist 文件夹复制到 server/public/
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache')
    }
  }
}))

// ⚠️ 关键：/static/ 路径映射
// Vue 构建后 index.html 引用的是 /static/css/... 和 /static/js/...
// 但实际文件在 public/css/ 和 public/js/（没有 static 目录）
app.use('/static', express.static(path.join(__dirname, 'public'), {
  maxAge: '1h'
}))

// SPA fallback：所有非 API / 非静态文件请求都返回 index.html
app.get(/^\/(?!mall|health).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// ============ API 代理 ============

// 健康检查
app.get('/health', async (req, res) => {
  res.json({ status: 'ok', env: process.env.TCB_ENV || 'cloud1-d2gzj9p633865ea93' })
})

// 转发到 mall 云函数
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
  管理后台已启动
  地址: http://localhost:${PORT}
  API:  http://localhost:${PORT}/mall
=================================
`)
})
