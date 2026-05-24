/**
 * 管理后台 API 代理服务
 * 
 * 作用：架在你的服务器上，接收 Vercel 的请求，
 *       转发到微信云函数的 HTTP 入口
 * 
 * ⚠️ 前提：需要在云开发控制台开启 mall 云函数的 HTTP 访问
 * 
 * 启动：npm install && node index.js
 */
const express = require('express')
const cors = require('cors')
const axios = require('axios')

// ⚠️ 改成你的云函数 HTTP 地址
// 在云开发控制台 → 云函数 → mall → HTTP 触发器 → 复制地址
const CLOUD_URL = 'https://cloud1-d2gzj9p633865ea93.tcb.qcloud.la/mall'

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '10mb' }))

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', target: CLOUD_URL })
})

// 转发所有请求到云函数
app.all('/mall', async (req, res) => {
  const start = Date.now()
  const body = req.body

  console.log(`→ ${body.action || 'unknown'}`)

  try {
    const result = await axios.post(CLOUD_URL, body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000
    })

    const data = result.data

    // 处理云函数返回的 corsResponse 格式
    if (data.body && typeof data.body === 'string') {
      res.json(JSON.parse(data.body))
    } else if (data.body && typeof data.body === 'object') {
      res.json(data.body)
    } else {
      res.json(data)
    }

    console.log(`← ${body.action} ✓ ${Date.now() - start}ms`)
  } catch (error) {
    const msg = error.response ? `${error.response.status}` : error.message
    console.error(`← ${body.action} ✗ ${msg}`)
    res.json({ code: -1, message: `云函数调用失败: ${msg}` })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`
=================================
  管理后台 API 代理已启动
  地址: http://localhost:${PORT}/mall
  云函数: ${CLOUD_URL}
=================================
`)
})
