<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>页面未找到</h2>
      <p>抱歉，您访问的页面不存在</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  
  .not-found-content {
    text-align: center;
    
    h1 {
      font-size: 144px;
      font-weight: 600;
      color: #1989fa;
      margin: 0;
      line-height: 1.2;
    }
    
    h2 {
      font-size: 36px;
      color: #303133;
      margin: 0 0 20px;
    }
    
    p {
      font-size: 18px;
      color: #606266;
      margin-bottom: 30px;
    }
  }
}
</style> 