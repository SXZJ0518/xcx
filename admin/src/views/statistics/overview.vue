<template>
  <div class="statistics-overview">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon uv">
            <i class="el-icon-user"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.todayUV }}</div>
            <div class="stat-label">今日访客</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon pv">
            <i class="el-icon-view"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.todayPV }}</div>
            <div class="stat-label">今日访问</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon users">
            <i class="el-icon-s-custom"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalUsers }}</div>
            <div class="stat-label">累计用户</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon duration">
            <i class="el-icon-time"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.avgDuration }}s</div>
            <div class="stat-label">平均停留</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 趋势图表 -->
    <el-card class="chart-card">
      <div slot="header">
        <span>访问趋势（近7天）</span>
        <el-radio-group v-model="chartType" size="mini" style="float: right;">
          <el-radio-button label="pv">访问量</el-radio-button>
          <el-radio-button label="uv">访客数</el-radio-button>
        </el-radio-group>
      </div>
      <div ref="trendChart" class="chart-container"></div>
    </el-card>

    <!-- 热门页面 & 热门商品 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="rank-card">
          <div slot="header">热门页面 TOP10</div>
          <el-table :data="hotPages" size="small">
            <el-table-column type="index" width="50" label="#" />
            <el-table-column prop="page" label="页面" show-overflow-tooltip />
            <el-table-column prop="count" label="访问次数" width="100" sortable />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="rank-card">
          <div slot="header">热门商品 TOP10</div>
          <el-table :data="hotProducts" size="small">
            <el-table-column type="index" width="50" label="#" />
            <el-table-column prop="name" label="商品" show-overflow-tooltip />
            <el-table-column prop="count" label="浏览次数" width="100" sortable />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'StatisticsOverview',
  data() {
    return {
      stats: {
        todayUV: 128,
        todayPV: 356,
        totalUsers: 42,
        avgDuration: 45
      },
      chartType: 'pv',
      hotPages: [
        { page: '/pages/index/index', count: 120 },
        { page: '/pages/product/list/list', count: 89 },
        { page: '/pages/product/detail/detail', count: 76 },
        { page: '/pages/discover/discover', count: 45 },
        { page: '/pages/profile/profile', count: 38 }
      ],
      hotProducts: [
        { name: '蜜兰香', count: 56 },
        { name: '大乌叶', count: 48 },
        { name: '鸭屎香·高山', count: 42 },
        { name: '姜花香（通天香）', count: 35 },
        { name: '杏仁香·锯朵仔', count: 28 }
      ],
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.trendChart)
      const dates = this.getLast7Days()
      const pvData = [320, 280, 356, 290, 410, 380, 356]
      const uvData = [98, 85, 128, 92, 145, 120, 128]
      
      this.chart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['访问量', '访客数'] },
        xAxis: { type: 'category', data: dates },
        yAxis: { type: 'value' },
        series: [
          { name: '访问量', type: 'line', smooth: true, data: pvData, areaStyle: { opacity: 0.3 } },
          { name: '访客数', type: 'line', smooth: true, data: uvData, areaStyle: { opacity: 0.3 } }
        ]
      })
    },
    getLast7Days() {
      const days = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        days.push(`${d.getMonth() + 1}/${d.getDate()}`)
      }
      return days
    }
  }
}
</script>

<style lang="scss" scoped>
.statistics-overview {
  padding: 20px;
}

.stat-cards {
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  
  i { font-size: 28px; color: #fff; }
  
  &.uv { background: linear-gradient(135deg, #667eea, #764ba2); }
  &.pv { background: linear-gradient(135deg, #f093fb, #f5576c); }
  &.users { background: linear-gradient(135deg, #4facfe, #00f2fe); }
  &.duration { background: linear-gradient(135deg, #43e97b, #38f9d7); }
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-container {
  height: 300px;
}

.rank-card {
  margin-bottom: 20px;
}
</style>
