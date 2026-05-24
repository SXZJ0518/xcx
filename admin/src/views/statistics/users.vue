<template>
  <div class="statistics-users">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input v-model="searchKeyword" placeholder="搜索用户昵称/手机号" style="width: 200px;" clearable />
      <el-select v-model="loginType" placeholder="登录方式" clearable style="width: 120px; margin-left: 10px;">
        <el-option label="全部" value="" />
        <el-option label="微信" value="wechat" />
        <el-option label="手机号" value="phone" />
      </el-select>
      <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="margin-left: 10px;" />
      <el-button type="primary" icon="el-icon-search" style="margin-left: 10px;" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 用户列表 -->
    <el-table :data="userList" v-loading="loading" border>
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column label="头像" width="80">
        <template slot-scope="scope">
          <el-avatar v-if="scope.row.avatar" :src="scope.row.avatar" size="small" />
          <el-avatar v-else icon="el-icon-user-solid" size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" width="150" />
      <el-table-column prop="phone" label="手机号" width="130" />
      <el-table-column label="登录方式" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.loginType === 'wechat'" type="success" size="small">微信</el-tag>
          <el-tag v-else-if="scope.row.loginType === 'phone'" type="primary" size="small">手机号</el-tag>
          <el-tag v-else type="info" size="small">未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="visitCount" label="访问次数" width="100" sortable />
      <el-table-column prop="lastVisitTime" label="最后访问" width="180" />
      <el-table-column prop="createTime" label="注册时间" width="180" />
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewDetail(scope.row)">详情</el-button>
          <el-button type="text" size="small" @click="viewVisits(scope.row)">访问记录</el-button>
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

    <!-- 用户详情弹窗 -->
    <el-dialog title="用户详情" :visible.sync="detailVisible" width="500px">
      <el-descriptions :column="1" border v-if="currentUser">
        <el-descriptions-item label="用户ID">{{ currentUser.id }}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{ currentUser.nickname }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentUser.phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="OpenID">{{ currentUser.openid || '-' }}</el-descriptions-item>
        <el-descriptions-item label="登录方式">{{ currentUser.loginType === 'wechat' ? '微信授权' : '手机号登录' }}</el-descriptions-item>
        <el-descriptions-item label="访问次数">{{ currentUser.visitCount }}</el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ currentUser.createTime }}</el-descriptions-item>
        <el-descriptions-item label="最后访问">{{ currentUser.lastVisitTime }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'StatisticsUsers',
  data() {
    return {
      searchKeyword: '',
      loginType: '',
      dateRange: null,
      loading: false,
      userList: [
        { id: 'u_001', nickname: '茶友8888', phone: '138****8888', avatar: '', loginType: 'phone', visitCount: 12, createTime: '2026-05-20 10:30:00', lastVisitTime: '2026-05-24 15:20:00' },
        { id: 'u_002', nickname: '品茶人', phone: '', avatar: 'https://picsum.photos/seed/user1/100/100', loginType: 'wechat', visitCount: 8, createTime: '2026-05-21 14:20:00', lastVisitTime: '2026-05-24 12:10:00' },
        { id: 'u_003', nickname: '茶友6666', phone: '139****6666', avatar: '', loginType: 'phone', visitCount: 5, createTime: '2026-05-22 09:15:00', lastVisitTime: '2026-05-23 18:45:00' },
        { id: 'u_004', nickname: '单枞爱好者', phone: '', avatar: 'https://picsum.photos/seed/user2/100/100', loginType: 'wechat', visitCount: 15, createTime: '2026-05-18 16:40:00', lastVisitTime: '2026-05-24 09:30:00' },
        { id: 'u_005', nickname: '茶友9999', phone: '137****9999', avatar: '', loginType: 'phone', visitCount: 3, createTime: '2026-05-23 11:00:00', lastVisitTime: '2026-05-23 11:30:00' }
      ],
      total: 5,
      pageSize: 10,
      currentPage: 1,
      detailVisible: false,
      currentUser: null
    }
  },
  methods: {
    handleSearch() {
      // TODO: 调用 API 搜索
    },
    handlePageChange(page) {
      this.currentPage = page
    },
    viewDetail(user) {
      this.currentUser = user
      this.detailVisible = true
    },
    viewVisits(user) {
      this.$router.push({ path: '/statistics/visits', query: { userId: user.id } })
    }
  }
}
</script>

<style lang="scss" scoped>
.statistics-users {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}
</style>
