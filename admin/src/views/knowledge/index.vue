<template>
  <div class="knowledge-container">
    <el-card>
      <!-- 筛选区域 -->
      <div class="filter-bar">
        <el-form :inline="true" :model="query" size="small">
          <el-form-item label="标题">
            <el-input v-model="query.keyword" placeholder="搜索标题" clearable @keyup.enter.native="handleSearch" />
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="query.categoryId" placeholder="全部分类" clearable>
              <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="query.status" placeholder="全部" clearable>
              <el-option label="已发布" :value="1" />
              <el-option label="草稿" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 操作栏 -->
      <div class="action-bar">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加文章</el-button>
        <el-button icon="el-icon-menu" @click="showCategoryDialog = true">分类管理</el-button>
        <el-button type="danger" icon="el-icon-delete" :disabled="!selected.length" @click="handleBatchDelete">批量删除</el-button>
      </div>

      <!-- 文章列表 -->
      <el-table v-loading="loading" :data="list" @selection-change="s => selected = s" stripe border>
        <el-table-column type="selection" width="50" />
        <el-table-column label="封面" width="90" align="center">
          <template slot-scope="s">
            <img :src="s.row.cover || defaultCover" class="cover-img" @error="$event.target.src = defaultCover" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="categoryName" label="分类" width="120" align="center" />
        <el-table-column prop="views" label="浏览量" width="90" align="center" />
        <el-table-column prop="status" label="状态" width="90" align="center">
          <template slot-scope="s">
            <el-tag :type="s.row.status === 1 ? 'success' : 'info'" size="small">{{ s.row.status === 1 ? '已发布' : '草稿' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" align="center" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template slot-scope="s">
            <el-button type="text" size="mini" @click="handleEdit(s.row)">编辑</el-button>
            <el-button type="text" size="mini" :type="s.row.status === 1 ? 'warning' : 'success'" @click="toggleStatus(s.row)">
              {{ s.row.status === 1 ? '下架' : '发布' }}
            </el-button>
            <el-button type="text" size="mini" style="color:#f56c6c" @click="handleDelete(s.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!loading && list.length === 0" description="暂无数据" />

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination 
          background 
          layout="total, sizes, prev, pager, next" 
          :total="total" 
          :page-size="query.pageSize" 
          :current-page.sync="query.page" 
          :page-sizes="[10, 20, 50, 100]"
          @size-change="s => { query.pageSize = s; fetchData() }" 
          @current-change="p => { query.page = p; fetchData() }" 
        />
      </div>
    </el-card>

    <!-- 分类管理弹窗 -->
    <el-dialog title="茶知识分类管理" :visible.sync="showCategoryDialog" width="550px">
      <div style="margin-bottom:12px">
        <el-input v-model="newCatName" placeholder="输入分类名称" style="width:200px" size="small" />
        <el-button type="primary" size="small" style="margin-left:8px" @click="addCategory">添加</el-button>
      </div>
      <el-table :data="categories" size="small" border>
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="s">
            <el-button type="text" size="mini" @click="editCategory(s.row)">编辑</el-button>
            <el-button type="text" size="mini" style="color:#f56c6c" @click="deleteCategory(s.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import knowledgeApi from '@/api/knowledge'

const defaultCover = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij7nvJQ8L3RleHQ+PC9zdmc+'

export default {
  name: 'KnowledgeList',
  data() {
    return {
      defaultCover,
      query: { page: 1, pageSize: 10, keyword: '', categoryId: '', status: '' },
      list: [],
      total: 0,
      loading: false,
      selected: [],
      categories: [],
      showCategoryDialog: false,
      newCatName: ''
    }
  },
  created() {
    this.fetchData()
    this.fetchCategories()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const res = await knowledgeApi.getList(this.query)
        this.list = (res.data && res.data.list) || []
        this.total = (res.data && res.data.total) || 0
      } catch {
        this.list = [
          { id: '1', title: '西湖龙井的冲泡技巧', cover: '', categoryName: '冲泡技巧', views: 1280, status: 1, createTime: '2026-05-18' },
          { id: '2', title: '如何辨别正宗大红袍', cover: '', categoryName: '茶叶鉴别', views: 856, status: 1, createTime: '2026-05-15' },
          { id: '3', title: '普洱茶存放方法指南', cover: '', categoryName: '茶文化', views: 2340, status: 1, createTime: '2026-05-10' }
        ]
        this.total = 3
      }
      this.loading = false
    },
    async fetchCategories() {
      try {
        const res = await knowledgeApi.getCategories()
        this.categories = res.data || []
      } catch {
        this.categories = [
          { id: 'c1', name: '茶文化', sort: 1 },
          { id: 'c2', name: '冲泡技巧', sort: 2 },
          { id: 'c3', name: '茶叶鉴别', sort: 3 }
        ]
      }
    },
    handleSearch() {
      this.query.page = 1
      this.fetchData()
    },
    resetQuery() {
      this.query = { page: 1, pageSize: 10, keyword: '', categoryId: '', status: '' }
      this.fetchData()
    },
    handleAdd() {
      this.$router.push('/content/knowledge-detail')
    },
    handleEdit(row) {
      this.$router.push(`/content/knowledge-detail?id=${row.id}`)
    },
    handleDelete(row) {
      this.$confirm('确定删除该文章？', '提示', { type: 'warning' }).then(async () => {
        try {
          await knowledgeApi.delete(row.id)
          this.$message.success('已删除')
          this.fetchData()
        } catch {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    handleBatchDelete() {
      this.$confirm(`确定删除选中的 ${this.selected.length} 篇文章？`, '提示', { type: 'warning' }).then(async () => {
        try {
          await knowledgeApi.batchDelete(this.selected.map(s => s.id))
          this.$message.success('已删除')
          this.fetchData()
        } catch {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    async toggleStatus(row) {
      const newStatus = row.status === 1 ? 0 : 1
      try {
        await knowledgeApi.updateStatus(row.id, newStatus)
        row.status = newStatus
        this.$message.success(newStatus === 1 ? '已发布' : '已下架')
      } catch {
        this.$message.error('操作失败')
      }
    },
    async addCategory() {
      if (!this.newCatName.trim()) return this.$message.warning('请输入分类名称')
      try {
        await knowledgeApi.createCategory({ name: this.newCatName.trim(), sort: (this.categories.length + 1) })
        this.newCatName = ''
        this.fetchCategories()
        this.$message.success('添加成功')
      } catch {
        this.$message.error('添加失败')
      }
    },
    async deleteCategory(row) {
      this.$confirm('删除分类不会删除关联文章', '提示', { type: 'warning' }).then(async () => {
        try {
          await knowledgeApi.deleteCategory(row.id)
          this.fetchCategories()
          this.$message.success('已删除')
        } catch {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    editCategory(row) {
      this.$prompt('请输入新名称', '编辑分类', { inputValue: row.name }).then(async ({ value }) => {
        try {
          await knowledgeApi.updateCategory(row.id, { name: value })
          this.fetchCategories()
          this.$message.success('已更新')
        } catch {
          this.$message.error('更新失败')
        }
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.knowledge-container {
  .filter-bar {
    margin-bottom: 10px;
  }
  .action-bar {
    margin-bottom: 16px;
    .el-button {
      margin-right: 8px;
    }
  }
  .cover-img {
    width: 60px;
    height: 60px;
    border-radius: 6px;
    object-fit: cover;
    background: #f5f5f5;
  }
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
