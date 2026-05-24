<template>
  <div class="statistics-analysis">
    <!-- 时段访问趋势 -->
    <el-card class="analysis-card">
      <div slot="header">
        <span>时段访问趋势</span>
        <el-radio-group v-model="timeRange" size="mini" style="float: right;">
          <el-radio-button label="today">今日</el-radio-button>
          <el-radio-button label="week">本周</el-radio-button>
          <el-radio-button label="month">本月</el-radio-button>
        </el-radio-group>
      </div>
      <div ref="timeChart" class="chart-container"></div>
      <div class="chart-legend">
        <div class="legend-item">
          <span class="legend-color" style="background: #c9a86c;"></span>
          <span>访问量</span>
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background: #8b7355;"></span>
          <span>访客数</span>
        </div>
      </div>
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
      timeRange: 'today',
      pathData: [
        { path: '首页 → 商品列表 → 商品详情', count: 156, avgDuration: 120, conversion: 45 },
        { path: '首页 → 发现 → 香型详情', count: 89, avgDuration: 85, conversion: 32 },
        { path: '商品列表 → 商品详情 → 收藏', count: 67, avgDuration: 150, conversion: 28 },
        { path: '首页 → 茶知识 → 文章详情', count: 45, avgDuration: 180, conversion: 15 },
        { path: '商品详情 → 分享', count: 34, avgDuration: 200, conversion: 12 }
      ],
      timeChart: null,
      aromaChart: null,
      categoryChart: null
    }
  },
  mounted() {
    this.initCharts()
  },
  beforeDestroy() {
    if (this.timeChart) this.timeChart.dispose()
    if (this.aromaChart) this.aromaChart.dispose()
    if (this.categoryChart) this.categoryChart.dispose()
  },
  watch: {
    timeRange() {
      this.updateTimeChart()
    }
  },
  methods: {
    initCharts() {
      this.initTimeChart()
      this.initAromaChart()
      this.initCategoryChart()
    },
    initTimeChart() {
      this.timeChart = echarts.init(this.$refs.timeChart)
      this.updateTimeChart()
    },
    updateTimeChart() {
      let xAxisData, pvData, uvData, title

      if (this.timeRange === 'today') {
        // 今日：24小时
        title = '今日各时段访问趋势'
        xAxisData = Array.from({ length: 24 }, (_, i) => `${i}:00`)
        pvData = [12, 8, 5, 3, 2, 5, 15, 45, 78, 120, 145, 160, 155, 140, 135, 150, 165, 180, 175, 150, 120, 90, 60, 35]
        uvData = [8, 5, 3, 2, 1, 3, 10, 32, 55, 85, 102, 115, 110, 98, 92, 105, 118, 128, 122, 105, 85, 65, 42, 25]
      } else if (this.timeRange === 'week') {
        // 本周：7天
        title = '本周每日访问趋势'
        xAxisData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        pvData = [320, 280, 356, 290, 410, 380, 356]
        uvData = [98, 85, 128, 92, 145, 120, 128]
      } else {
        // 本月：30天
        title = '本月每日访问趋势'
        xAxisData = Array.from({ length: 30 }, (_, i) => `${i + 1}日`)
        pvData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 200) + 200)
        uvData = pvData.map(v => Math.floor(v * 0.35))
      }

      this.timeChart.setOption({
        title: {
          text: title,
          left: 'center',
          top: 5,
          textStyle: { fontSize: 14, color: '#606266' }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' }
        },
        legend: {
          data: ['访问量', '访客数'],
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#dcdfe6' } },
          axisLabel: { color: '#606266' }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#ebeef5' } },
          axisLabel: { color: '#606266' }
        },
        series: [
          {
            name: '访问量',
            type: 'line',
            smooth: true,
            data: pvData,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(201, 168, 108, 0.4)' },
                { offset: 1, color: 'rgba(201, 168, 108, 0.05)' }
              ])
            },
            itemStyle: { color: '#c9a86c' },
            lineStyle: { width: 2 }
          },
          {
            name: '访客数',
            type: 'line',
            smooth: true,
            data: uvData,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(139, 115, 85, 0.4)' },
                { offset: 1, color: 'rgba(139, 115, 85, 0.05)' }
              ])
            },
            itemStyle: { color: '#8b7355' },
            lineStyle: { width: 2 }
          }
        ]
      })
    },
    initAromaChart() {
      this.aromaChart = echarts.init(this.$refs.aromaChart)
      this.aromaChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}次 ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: { fontSize: 12 }
        },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          data: [
            { value: 35, name: '蜜兰香', itemStyle: { color: '#c9a86c' } },
            { value: 25, name: '黄栀香', itemStyle: { color: '#d4a574' } },
            { value: 18, name: '鸭屎香', itemStyle: { color: '#b8956a' } },
            { value: 12, name: '桂花香', itemStyle: { color: '#a08060' } },
            { value: 10, name: '其他', itemStyle: { color: '#e8dcc8' } }
          ]
        }]
      })
    },
    initCategoryChart() {
      this.categoryChart = echarts.init(this.$refs.categoryChart)
      this.categoryChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}次 ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: { fontSize: 12 }
        },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          data: [
            { value: 65, name: '单枞茶', itemStyle: { color: '#c9a86c' } },
            { value: 25, name: '特惠茶', itemStyle: { color: '#d4a574' } },
            { value: 10, name: '农产品', itemStyle: { color: '#e8dcc8' } }
          ]
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

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #ebeef5;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #606266;

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }
  }
}
</style>
