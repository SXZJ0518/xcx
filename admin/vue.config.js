const path = require('path')

module.exports = {
  lintOnSave: false,
  
  // 明确指定项目根目录，避免扫描到小程序代码
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  },
  
  // 配置入口
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  
  // 输出目录
  outputDir: 'dist',
  
  // 静态资源目录
  assetsDir: 'static',
  
  // 开发服务器配置
  devServer: {
    port: 8080,
    open: true
  }
}
