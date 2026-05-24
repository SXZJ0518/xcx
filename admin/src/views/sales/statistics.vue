<template>
  <div class="sales-statistics">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-icon" style="background-color: #409eff;">
            <i class="el-icon-money"></i>
          </div>
          <div class="stat-info">
            <div class="stat-label">本月销售额</div>
            <div class="stat-value">¥{{ formatNumber(monthStats.salesAmount) }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-icon" style="background-color: #67c23a;">
            <i class="el-icon-coin"></i>
          </div>
          <div class="stat-info">
            <div class="stat-label">本月利润</div>
            <div class="stat-value" :class="monthStats.profit >= 0 ? 'profit-positive' : 'profit-negative'">
              ¥{{ formatNumber(monthStats.profit) }}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-icon" style="background-color: #e6a23c;">
            <i class="el-icon-s-order"></i>
          </div>
          <div class="stat-info">
            <div class="stat-label">本月订单数</div>
            <div class="stat-value">{{ monthStats.orderCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-icon" style="background-color: #f56c6c;">
            <i class="el-icon-user"></i>
          </div>
          <div class="stat-info">
            <div class="stat-label">客单价</div>
            <div class="stat-value">¥{{ formatNumber(monthStats.avgOrderValue) }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>月度趋势图（近6个月）</span>
          </div>
          <div ref="trendChart" style="height: 350px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>茶叶类型销量分布</span>
          </div>
          <div ref="pieChart" style="height: 350px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>经手人业绩排行</span>
          </div>
          <div ref="handlerChart" style="height: 350px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>利润分析</span>
          </div>
          <el-table :data="profitAnalysisData" border style="width: 100%" height="350">
            <el-table-column prop="teaType" label="茶叶类型" width="120"></el-table-column>
            <el-table-column prop="totalWeight" label="销量(斤)" width="100" align="right">
              <template slot-scope="scope">
                {{ scope.row.totalWeight.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="salesAmount" label="销售额" width="120" align="right">
              <template slot-scope="scope">
                ¥{{ formatNumber(scope.row.salesAmount) }}
              </template>
            </el-table-column>
            <el-table-column prop="cost" label="成本" width="120" align="right">
              <template slot-scope="scope">
                ¥{{ formatNumber(scope.row.cost) }}
              </template>
            </el-table-column>
            <el-table-column prop="profit" label="利润" width="120" align="right">
              <template slot-scope="scope">
                <span :class="scope.row.profit >= 0 ? 'profit-positive' : 'profit-negative'">
                  ¥{{ formatNumber(scope.row.profit) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="profitRate" label="利润率" align="right">
              <template slot-scope="scope">
                <span :class="scope.row.profitRate >= 0 ? 'profit-positive' : 'profit-negative'">
                  {{ scope.row.profitRate.toFixed(2) }}%
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'SalesStatistics',
  data() {
    return {
      salesData: [],
      monthStats: {
        salesAmount: 0,
        profit: 0,
        orderCount: 0,
        avgOrderValue: 0
      },
      profitAnalysisData: [],
      trendChart: null,
      pieChart: null,
      handlerChart: null
    }
  },
  mounted() {
    this.loadSalesData()
    this.calculateStats()
    this.initCharts()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.trendChart) this.trendChart.dispose()
    if (this.pieChart) this.pieChart.dispose()
    if (this.handlerChart) this.handlerChart.dispose()
  },
  methods: {
    // 加载销售数据
    loadSalesData() {
      const sales = localStorage.getItem('sales')
      if (sales) {
        this.salesData = JSON.parse(sales)
      } else {
        this.salesData = []
      }
    },
    // 格式化数字
    formatNumber(num) {
      if (num === undefined || num === null) return '0.00'
      return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    // 计算统计数据
    calculateStats() {
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth()

      // 本月数据
      const monthData = this.salesData.filter(item => {
        const saleDate = new Date(item.saleTime)
        return saleDate.getFullYear() === currentYear && saleDate.getMonth() === currentMonth
      })

      this.monthStats.salesAmount = monthData.reduce((sum, item) => sum + (item.saleAmount || 0), 0)
      this.monthStats.profit = monthData.reduce((sum, item) => sum + (item.profit || 0), 0)
      this.monthStats.orderCount = monthData.length
      this.monthStats.avgOrderValue = this.monthStats.orderCount > 0 
        ? this.monthStats.salesAmount / this.monthStats.orderCount 
        : 0

      // 利润分析数据
      const teaTypeMap = new Map()
      this.salesData.forEach(item => {
        if (!teaTypeMap.has(item.teaType)) {
          teaTypeMap.set(item.teaType, {
            teaType: item.teaType,
            totalWeight: 0,
            salesAmount: 0,
            cost: 0,
            profit: 0
          })
        }
        const data = teaTypeMap.get(item.teaType)
        data.totalWeight += item.weight || 0
        data.salesAmount += item.saleAmount || 0
        data.cost += item.cost || 0
        data.profit += item.profit || 0
      })

      this.profitAnalysisData = Array.from(teaTypeMap.values()).map(item => {
        item.profitRate = item.salesAmount > 0 ? (item.profit / item.salesAmount) * 100 : 0
        return item
      }).sort((a, b) => b.profit - a.profit)
    },
    // 获取近6个月的数据
    getLast6MonthsData() {
      const months = []
      const salesData = []
      const profitData = []
      const now = new Date()

      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const year = date.getFullYear()
        const month = date.getMonth()
        const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
        months.push(monthStr)

        const monthSales = this.salesData.filter(item => {
          const saleDate = new Date(item.saleTime)
          return saleDate.getFullYear() === year && saleDate.getMonth() === month
        })

        const sales = monthSales.reduce((sum, item) => sum + (item.saleAmount || 0), 0)
        const profit = monthSales.reduce((sum, item) => sum + (item.profit || 0), 0)
        salesData.push(sales.toFixed(2))
        profitData.push(profit.toFixed(2))
      }

      return { months, salesData, profitData }
    },
    // 获取茶叶类型销量数据
    getTeaTypeData() {
      const teaTypeMap = new Map()
      this.salesData.forEach(item => {
        if (!teaTypeMap.has(item.teaType)) {
          teaTypeMap.set(item.teaType, 0)
        }
        teaTypeMap.set(item.teaType, teaTypeMap.get(item.teaType) + (item.weight || 0))
      })

      return Array.from(teaTypeMap.entries()).map(([name, value]) => ({ name, value }))
    },
    // 获取经手人业绩数据
    getHandlerData() {
      const handlerMap = new Map()
      this.salesData.forEach(item => {
        if (!handlerMap.has(item.handler)) {
          handlerMap.set(item.handler, { sales: 0, profit: 0 })
        }
        const data = handlerMap.get(item.handler)
        data.sales += item.saleAmount || 0
        data.profit += item.profit || 0
      })

      const handlers = Array.from(handlerMap.entries())
      return {
        names: handlers.map(([name]) => name),
        sales: handlers.map(([, data]) => data.sales.toFixed(2)),
        profits: handlers.map(([, data]) => data.profit.toFixed(2))
      }
    },
    // 初始化图表
    initCharts() {
      this.initTrendChart()
      this.initPieChart()
      this.initHandlerChart()
    },
    // 月度趋势图
    initTrendChart() {
      const chartDom = this.$refs.trendChart
      if (!chartDom) return
      
      this.trendChart = echarts.init(chartDom)
      const { months, salesData, profitData } = this.getLast6MonthsData()

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' }
        },
        legend: {
          data: ['销售额', '利润']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: months
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '¥{value}'
          }
        },
        series: [
          {
            name: '销售额',
            type: 'line',
            data: salesData,
            smooth: true,
            itemStyle: { color: '#409eff' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
                { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
              ])
            }
          },
          {
            name: '利润',
            type: 'line',
            data: profitData,
            smooth: true,
            itemStyle: { color: '#67c23a' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
                { offset: 1, color: 'rgba(103, 194, 58, 0.05)' }
              ])
            }
          }
        ]
      }

      this.trendChart.setOption(option)
    },
    // 茶叶类型饼图
    initPieChart() {
      const chartDom = this.$refs.pieChart
      if (!chartDom) return

      this.pieChart = echarts.init(chartDom)
      const data = this.getTeaTypeData()

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}斤 ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'center'
        },
        series: [
          {
            name: '销量分布',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: data
          }
        ]
      }

      this.pieChart.setOption(option)
    },
    // 经手人业绩柱状图
    initHandlerChart() {
      const chartDom = this.$refs.handlerChart
      if (!chartDom) return

      this.handlerChart = echarts.init(chartDom)
      const { names, sales, profits } = this.getHandlerData()

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        legend: {
          data: ['销售额', '利润']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: names
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '¥{value}'
          }
        },
        series: [
          {
            name: '销售额',
            type: 'bar',
            data: sales,
            itemStyle: { color: '#409eff' }
          },
          {
            name: '利润',
            type: 'bar',
            data: profits,
            itemStyle: { color: '#67c23a' }
          }
        ]
      }

      this.handlerChart.setOption(option)
    },
    // 窗口大小变化处理
    handleResize() {
      if (this.trendChart) this.trendChart.resize()
      if (this.pieChart) this.pieChart.resize()
      if (this.handlerChart) this.handlerChart.resize()
    }
  }
}
</script>

<style scoped>
.sales-statistics {
  padding: 20px;
}
.stat-cards {
  margin-bottom: 20px;
}
.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
}
.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}
.stat-icon i {
  font-size: 28px;
  color: #fff;
}
.stat-info {
  flex: 1;
}
.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}
.chart-row {
  margin-bottom: 20px;
}
.profit-positive {
  color: #67c23a;
  font-weight: bold;
}
.profit-negative {
  color: #f56c6c;
  font-weight: bold;
}
</style>
