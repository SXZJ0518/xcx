<template>
  <div class="statistics-visits">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input v-model="searchKeyword" placeholder="搜索页面路径" style="width: 200px;" clearable />
      <el-select v-model="eventType" placeholder="事件类型" clearable style="width: 120px; margin-left: 10px;">
        <el-option label="全部" value="" />
        <el-option label="页面访问" value="pageview" />
        <el-option label="商品查看" value="product_view" />
        <el-option label="搜索" value="search" />
        <el-option label="收藏" value="favorite" />
        <el-option label="分享" value="share" />
      </el-select>
      <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="margin-left: 10px;" />
      <el-button type="primary" icon="el-icon-search" style="margin-left: 10px;" @click="handleSearch">搜索</el-button>
      <el-button icon="el-icon-download" style="margin-left: 10px;" @click="handleExport">导出</el-button>
    </div>

    <!-- 访问记录列表 -->
    <el-table :data="visitList" v-loading="loading" border>
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column label="事件类型" width="100">
        <template slot-scope="scope">
          <el-tag :type="getEventTypeTag(scope.row.type)" size="small">{{ getEventTypeLabel(scope.row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="page" label="页面" width="200" show-overflow-tooltip />
      <el-table-column prop="title" label="标题" width="150" show-overflow-tooltip />
      <el-table-column prop="userId" label="用户ID" width="120" />
      <el-table-column label="设备" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.device">{{ scope.row.device.platform }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网络" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.network">{{ scope.row.network.networkType }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="timestamp" label="时间" width="180" />
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="total, prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handlePageChange"
      style="margin-top: 20px; text-align: right;"
    />

    <!-- 详情弹窗 -->
    <el-dialog title="访问详情" :visible.sync="detailVisible" width="600px">
      <el-descriptions :column="2" border v-if="currentVisit">
        <el-descriptions-item label="事件ID" :span="2">{{ currentVisit.id }}</el-descriptions-item>
        <el-descriptions-item label="事件类型">{{ getEventTypeLabel(currentVisit.type) }}</el-descriptions-item>
        <el-descriptions-item label="会话ID">{{ currentVisit.sessionId }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ currentVisit.userId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="OpenID">{{ currentVisit.openid || '-' }}</el-descriptions-item>
        <el-descriptions-item label="页面" :span="2">{{ currentVisit.page }}</el-descriptions-item>
        <el-descriptions-item label="标题" :span="2">{{ currentVisit.title }}</el-descriptions-item>
        <el-descriptions-item label="设备品牌" v-if="currentVisit.device">{{ currentVisit.device.brand }}</el-descriptions-item>
        <el-descriptions-item label="设备型号" v-if="currentVisit.device">{{ currentVisit.device.model }}</el-descriptions-item>
        <el-descriptions-item label="平台" v-if="currentVisit.device">{{ currentVisit.device.platform }}</el-descriptions-item>
        <el-descriptions-item label="网络" v-if="currentVisit.network">{{ currentVisit.network.networkType }}</el-descriptions-item>
        <el-descriptions-item label="时间" :span="2">{{ currentVisit.timestamp }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'StatisticsVisits',
  data() {
    return {
      searchKeyword: '',
      eventType: '',
      dateRange: null,
      loading: false,
      visitList: [
        { id: 'evt_001', type: 'pageview', page: '/pages/index/index', title: '首页', userId: 'u_001', sessionId: 'session_001', device: { platform: 'android', brand: 'Xiaomi', model: 'Redmi K50' }, network: { networkType: 'wifi' }, timestamp: '2026-05-24 15:20:30' },
        { id: 'evt_002', type: 'product_view', page: '/pages/product/detail/detail', title: '蜜兰香', userId: 'u_001', sessionId: 'session_001', device: { platform: 'android', brand: 'Xiaomi', model: 'Redmi K50' }, network: { networkType: 'wifi' }, timestamp: '2026-05-24 15:21:15' },
        { id: 'evt_003', type: 'search', page: '/pages/product/list/list', title: '搜索: 蜜兰', userId: 'u_002', sessionId: 'session_002', device: { platform: 'ios', brand: 'Apple', model: 'iPhone 14' }, network: { networkType: '4g' }, timestamp: '2026-05-24 15:18:00' },
        { id: 'evt_004', type: 'favorite', page: '/pages/product/detail/detail', title: '大乌叶', userId: 'u_003', sessionId: 'session_003', device: { platform: 'android', brand: 'HUAWEI', model: 'Mate 60' }, network: { networkType: 'wifi' }, timestamp: '2026-05-24 15:15:45' },
        { id: 'evt_005', type: 'share', page: '/pages/product/detail/detail', title: '鸭屎香', userId: 'u_001', sessionId: 'session_001', device: { platform: 'android', brand: 'Xiaomi', model: 'Redmi K50' }, network: { networkType: 'wifi' }, timestamp: '2026-05-24 15:22:00' }
      ],
      total: 5,
      pageSize: 10,
      currentPage: 1,
      detailVisible: false,
      currentVisit: null
    }
  },
  methods: {
    getEventTypeLabel(type) {
      const map = { pageview: '页面访问', product_view: '商品查看', search: '搜索', favorite: '收藏', share: '分享', login: '登录' }
      return map[type] || type
    },
    getEventTypeTag(type) {
      const map = { pageview: 'info', product_view: 'success', search: 'warning', favorite: 'danger', share: '', login: 'primary' }
      return map[type] || 'info'
    },
    handleSearch() {},
    handleExport() {
      this.$message.success('导出功能开发中')
    },
    handlePageChange(page) {
      this.currentPage = page
    },
    viewDetail(visit) {
      this.currentVisit = visit
      this.detailVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.statistics-visits {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}
</style>
