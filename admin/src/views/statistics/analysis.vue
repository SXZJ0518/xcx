<template>
  <div class="statistics-analysis">
    <!-- 页面访问热力图 -->
    <el-card class="analysis-card">
      <div slot="header">页面访问热力图</div>
      <div ref="heatmapChart" class="chart-container"></div>
    </el-card>

    <!-- 用户行为路径 -->
    <el-card class="analysis-card">
      <div slot="header">用户行为路径分析</div>
      <el-table :data="pathData" size="small">
        <el-table-column prop="path" label="访问路径" show-overflow-tooltip />
        <el-table-column prop="count" label="次数" width="100" sortable />
        <el-table-column prop="avgDuration" label="平均停留(秒)" width="120" />
        <el-table-column prop="conversion" label="转化率" width="100">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.conversion" :stroke-width="8" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 商品浏览偏好 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="analysis-card">
          <div slot="header">香型偏好分布</div>
          <div ref="aromaChart" class="chart-container-small"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="analysis-card">
          <div slot="header">分类浏览分布</div>
          <div ref="categoryChart" class="chart-container-small"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'StatisticsAnalysis',
  data() {
    return {
      pathData: [
        { path: '首页 → 商品列表 → 商品详情', count: 156, avgDuration: 120, conversion: 45 },
        { path: '首页 → 发现 → 香型详情', count: 89, avgDuration: 85, conversion: 32 },
        { path: '商品列表 → 商品详情 → 收藏', count: 67, avgDuration: 150, conversion: 28 },
        { path: '首页 → 茶知识 → 文章详情', count: 45, avgDuration: 180, conversion: 15 },
        { path: '商品详情 → 分享', count: 34, avgDuration: 200, conversion: 12 }
      ],
      heatmapChart: null,
      aromaChart: null,
      categoryChart: null
    }
  },
  mounted() {
    this.initCharts()
  },
  beforeDestroy() {
    if (this.heatmapChart) this.heatmapChart.dispose()
    if (this.aromaChart) this.aromaChart.dispose()
    if (this.categoryChart) this.categoryChart.dispose()
  },
  methods: {
    initCharts() {
      // 热力图
      this.heatmapChart = echarts.init(this.$refs.heatmapChart)
      const hours = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
      const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      const data = []
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 24; j++) {
          data.push([j, i, Math.floor(Math.random() * 50) + 10])
        }
      }
      this.heatmapChart.setOption({
        tooltip: { position: 'top' },
        grid: { top: 10, left: 50, right: 10, bottom: 30 },
        xAxis: { type: 'category', data: hours, splitArea: { show: true } },
        yAxis: { type: 'category', data: days, splitArea: { show: true } },
        visualMap: { min: 0, max: 60, calculable: true, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: ['#f5f0e8', '#c9a86c', '#8b7355'] } },
        series: [{ type: 'heatmap', data: data, label: { show: false } }]
      })

      // 香型偏好饼图
      this.aromaChart = echarts.init(this.$refs.aromaChart)
      this.aromaChart.setOption({
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [{
          type: 'pie',
          radius: '60%',
          data: [
            { value: 35, name: '蜜兰香' },
            { value: 25, name: '黄栀香' },
            { value: 18, name: '鸭屎香' },
            { value: 12, name: '桂花香' },
            { value: 10, name: '其他' }
          ],
          emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
        }]
      })

      // 分类浏览饼图
      this.categoryChart = echarts.init(this.$refs.categoryChart)
      this.categoryChart.setOption({
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [{
          type: 'pie',
          radius: '60%',
          data: [
            { value: 65, name: '单枞茶' },
            { value: 25, name: '特惠茶' },
            { value: 10, name: '农产品' }
          ],
          emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
        }]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.statistics-analysis {
  padding: 20px;
}

.analysis-card {
  margin-bottom: 20px;
}

.chart-container {
  height: 300px;
}

.chart-container-small {
  height: 250px;
}
</style>
