/**
 * 管理后台 API 代理 + 静态文件服务
 * 
 * 启动：npm install && node index.js
 * 访问：http://你的服务器IP:3000
 */
const express = require('express')
const cors = require('cors')
const path = require('path')
const https = require('https')
const http = require('http')

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '10mb' }))

// 云函数 HTTP 入口
const CLOUD_URL = 'https://cloud1-d2gzj9p633865ea93.tcb.qcloud.la/mall'

// ============ 静态文件 ============
app.use('/static', express.static(path.join(__dirname, 'public'), { maxAge: '1h' }))
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h' }))

app.get(/^\/(?!mall|health).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// ============ API 代理 ============

app.get('/health', (req, res) => {
  res.json({ status: 'ok', target: CLOUD_URL })
})

app.all('/mall', async (req, res) => {
  const { action, params } = req.body
  const start = Date.now()

  console.log(`→ ${action || 'unknown'}`)

  const data = JSON.stringify({ action, params: params || {} })
  const url = new URL(CLOUD_URL)
  const transport = url.protocol === 'https:' ? https : http

  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    },
    timeout: 15000
  }

  const cloudReq = transport.request(options, (cloudRes) => {
    let body = ''
    cloudRes.on('data', chunk => body += chunk)
    cloudRes.on('end', () => {
      try {
        const result = JSON.parse(body)
        // 云函数 corsResponse 格式：{ body: "json字符串" }
        if (result.body && typeof result.body === 'string') {
          res.json(JSON.parse(result.body))
        } else {
          res.json(result)
        }
        console.log(`← ${action} ✓ ${Date.now() - start}ms`)
      } catch (e) {
        res.json({ code: -1, message: '响应解析失败' })
      }
    })
  })

  cloudReq.on('error', (err) => {
    console.error(`← ${action} ✗ ${err.message}`)
    res.json({ code: -1, message: `调用失败: ${err.message}` })
  })

  cloudReq.write(data)
  cloudReq.end()
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`
=================================
  管理后台已启动
  地址: http://localhost:${PORT}
=================================
`)
})
