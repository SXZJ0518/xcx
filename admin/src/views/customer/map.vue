<template>
  <div class="customer-map">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon province">
            <i class="el-icon-map-location"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.provinceCount }}</div>
            <div class="stat-label">覆盖省份</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon city">
            <i class="el-icon-office-building"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.cityCount }}</div>
            <div class="stat-label">覆盖城市</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon district">
            <i class="el-icon-place"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.districtCount }}</div>
            <div class="stat-label">覆盖区县</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon customer">
            <i class="el-icon-user"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.totalCustomers }}</div>
            <div class="stat-label">客户总数</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 地图区域 -->
    <el-card class="map-card">
      <div slot="header">
        <span>客户分布地图</span>
        <el-radio-group v-model="mapLevel" size="small" style="float: right;">
          <el-radio-button label="province">省级</el-radio-button>
          <el-radio-button label="city">市级</el-radio-button>
        </el-radio-group>
      </div>
      <div ref="mapChart" class="map-container"></div>
    </el-card>

    <!-- 省份排行 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="rank-card">
          <div slot="header">客户分布排行 TOP10</div>
          <el-table :data="provinceRank" size="small">
            <el-table-column type="index" width="50" label="#" />
            <el-table-column prop="name" label="地区" />
            <el-table-column prop="count" label="客户数" width="100" sortable />
            <el-table-column label="占比" width="120">
              <template slot-scope="scope">
                <el-progress :percentage="scope.row.percentage" :stroke-width="8" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="rank-card">
          <div slot="header">城市分布排行 TOP10</div>
          <el-table :data="cityRank" size="small">
            <el-table-column type="index" width="50" label="#" />
            <el-table-column prop="name" label="城市" />
            <el-table-column prop="count" label="客户数" width="100" sortable />
            <el-table-column label="占比" width="120">
              <template slot-scope="scope">
                <el-progress :percentage="scope.row.percentage" :stroke-width="8" />
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

// 中国省份数据（简化版）
const provinceData = [
  { name: '北京', value: 0 },
  { name: '天津', value: 0 },
  { name: '上海', value: 0 },
  { name: '重庆', value: 0 },
  { name: '河北', value: 0 },
  { name: '山西', value: 0 },
  { name: '辽宁', value: 0 },
  { name: '吉林', value: 0 },
  { name: '黑龙江', value: 0 },
  { name: '江苏', value: 0 },
  { name: '浙江', value: 0 },
  { name: '安徽', value: 0 },
  { name: '福建', value: 0 },
  { name: '江西', value: 0 },
  { name: '山东', value: 0 },
  { name: '河南', value: 0 },
  { name: '湖北', value: 0 },
  { name: '湖南', value: 0 },
  { name: '广东', value: 0 },
  { name: '海南', value: 0 },
  { name: '四川', value: 0 },
  { name: '贵州', value: 0 },
  { name: '云南', value: 0 },
  { name: '陕西', value: 0 },
  { name: '甘肃', value: 0 },
  { name: '青海', value: 0 },
  { name: '台湾', value: 0 },
  { name: '内蒙古', value: 0 },
  { name: '广西', value: 0 },
  { name: '西藏', value: 0 },
  { name: '宁夏', value: 0 },
  { name: '新疆', value: 0 },
  { name: '香港', value: 0 },
  { name: '澳门', value: 0 }
]

export default {
  name: 'CustomerMap',
  data() {
    return {
      mapLevel: 'province',
      mapChart: null,
      stat: {
        provinceCount: 0,
        cityCount: 0,
        districtCount: 0,
        totalCustomers: 0
      },
      provinceRank: [],
      cityRank: []
    }
  },
  mounted() {
    this.loadData()
    this.initMap()
  },
  beforeDestroy() {
    if (this.mapChart) {
      this.mapChart.dispose()
    }
  },
  watch: {
    mapLevel() {
      this.initMap()
    }
  },
  methods: {
    loadData() {
      const customers = JSON.parse(localStorage.getItem('customers') || '[]')
      
      // 统计省份
      const provinceMap = {}
      const cityMap = {}
      const districtMap = {}
      
      customers.forEach(c => {
        const province = (c.region && c.region[0] ? c.region[0].replace('省', '').replace('市', '') : '未知')
        const city = (c.region && c.region[1]) || '未知'
        const district = (c.region && c.region[2]) || '未知'
        
        provinceMap[province] = (provinceMap[province] || 0) + 1
        cityMap[city] = (cityMap[city] || 0) + 1
        districtMap[district] = (districtMap[district] || 0) + 1
      })
      
      this.stat = {
        provinceCount: Object.keys(provinceMap).length,
        cityCount: Object.keys(cityMap).length,
        districtCount: Object.keys(districtMap).length,
        totalCustomers: customers.length
      }
      
      // 生成排行数据
      const total = customers.length || 1
      this.provinceRank = Object.entries(provinceMap)
        .map(([name, count]) => ({ name, count, percentage: Math.round(count / total * 100) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
      
      this.cityRank = Object.entries(cityMap)
        .map(([name, count]) => ({ name, count, percentage: Math.round(count / total * 100) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
      
      // 更新地图数据
      this.mapData = provinceData.map(p => ({
        ...p,
        value: provinceMap[p.name] || 0
      }))
    },
    initMap() {
      if (!this.$refs.mapChart) return
      
      if (this.mapChart) {
        this.mapChart.dispose()
      }
      
      this.mapChart = echarts.init(this.$refs.mapChart)
      
      // 显示加载中
      this.mapChart.showLoading()
      
      // 加载中国地图 GeoJSON 数据
      fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
        .then(res => res.json())
        .then(chinaJson => {
          echarts.registerMap('china', chinaJson)
          this.mapChart.hideLoading()
          this.renderMap()
        })
        .catch(err => {
          console.error('加载地图数据失败:', err)
          this.mapChart.hideLoading()
          // 降级为柱状图
          this.renderBarChart()
        })
    },
    renderMap() {
      const maxValue = Math.max(...this.mapData.map(d => d.value), 1)
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            if (params.value === undefined || params.value === null) return params.name + '<br/>暂无客户'
            return params.name + '<br/>客户数: ' + params.value + '人'
          }
        },
        visualMap: {
          min: 0,
          max: maxValue,
          left: 'left',
          bottom: '10px',
          text: ['高', '低'],
          inRange: {
            color: ['#f5f0e8', '#e8d5b0', '#c9a86c', '#8b7355']
          },
          calculable: true
        },
        series: [{
          name: '客户分布',
          type: 'map',
          map: 'china',
          roam: true,
          scaleLimit: { min: 1, max: 5 },
          label: {
            show: false,
            emphasis: { show: true }
          },
          itemStyle: {
            areaColor: '#f5f0e8',
            borderColor: '#c9a86c',
            borderWidth: 1
          },
          emphasis: {
            label: { show: true, fontSize: 14, color: '#2d2520' },
            itemStyle: {
              areaColor: '#b8965c',
              shadowBlur: 20,
              shadowColor: 'rgba(201, 168, 108, 0.5)'
            }
          },
          data: this.mapData
        }]
      }
      
      this.mapChart.setOption(option)
    },
    renderBarChart() {
      const barOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.provinceRank.map(p => p.name),
          axisLabel: { rotate: 45 }
        },
        yAxis: {
          type: 'value',
          name: '客户数'
        },
        series: [{
          type: 'bar',
          data: this.provinceRank.map(p => p.count),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#c9a86c' },
              { offset: 1, color: '#8b7355' }
            ])
          }
        }]
      }
      
      this.mapChart.setOption(barOption)
    },
    generateScatterData() {
      // 模拟城市坐标数据
      const cityCoords = {
        '北京': [116.46, 39.92],
        '上海': [121.48, 31.22],
        '广州': [113.23, 23.16],
        '深圳': [114.07, 22.62],
        '杭州': [120.19, 30.26],
        '汕头': [116.71, 23.37]
      }
      
      const customers = JSON.parse(localStorage.getItem('customers') || '[]')
      const cityMap = {}
      
      customers.forEach(c => {
        const city = c.region[1]
        if (city) {
          cityMap[city] = (cityMap[city] || 0) + 1
        }
      })
      
      return Object.entries(cityMap).map(([city, count]) => {
        const coord = cityCoords[city] || [116.46 + Math.random() * 10, 35 + Math.random() * 10]
        return {
          name: city,
          value: [...coord, count]
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.customer-map {
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
  
  &.province { background: linear-gradient(135deg, #667eea, #764ba2); }
  &.city { background: linear-gradient(135deg, #f093fb, #f5576c); }
  &.district { background: linear-gradient(135deg, #4facfe, #00f2fe); }
  &.customer { background: linear-gradient(135deg, #43e97b, #38f9d7); }
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

.map-card {
  margin-bottom: 20px;
}

.map-container {
  height: 400px;
}

.rank-card {
  margin-bottom: 20px;
}
</style>
