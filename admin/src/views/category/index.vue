<template>
  <div class="category-list-container">
    <el-card>
      <!-- 操作区域 -->
      <div class="action-container">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增分类</el-button>
        <el-button icon="el-icon-refresh" @click="fetchData">刷新</el-button>
      </div>

      <!-- 列表区域 -->
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
        <el-table-column prop="name" label="分类名称" min-width="200"></el-table-column>
        <el-table-column prop="description" label="描述" min-width="300" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.description">{{ scope.row.description }}</span>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-empty v-if="!listLoading && list.length === 0" description="暂无分类数据" />
    </el-card>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入分类描述"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" :max="9999"></el-input-number>
          <span class="form-hint">数值越大越靠前</span>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import categoryApi from '@/api/category'

export default {
  name: 'CategoryList',
  data() {
    return {
      listLoading: true,
      list: [],
      dialogVisible: false,
      dialogTitle: '新增分类',
      isEdit: false,
      editId: null,
      submitLoading: false,
      
      form: {
        name: '',
        description: '',
        sort: 0,
        status: 1
      },
      
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取分类列表
    fetchData() {
      this.listLoading = true
      
      categoryApi.getAll()
        .then(response => {
          if (response.code === 0) {
            this.list = response.data || []
          } else {
            this.$message.error(response.message || '获取分类列表失败')
          }
          this.listLoading = false
        })
        .catch(error => {
          console.error('获取分类列表出错:', error)
          this.listLoading = false
          // 模拟数据
          this.mockData()
        })
    },
    
    // 模拟数据
    mockData() {
      this.list = [
        { id: 1, name: '单枞茶', description: '凤凰单枞茶，十大香型', sort: 1, status: 1 },
        { id: 2, name: '特惠茶', description: '优惠特价茶叶', sort: 2, status: 1 },
        { id: 3, name: '农产品', description: '有机农产品', sort: 3, status: 1 }
      ]
    },
    
    // 新增分类
    handleAdd() {
      this.isEdit = false
      this.editId = null
      this.dialogTitle = '新增分类'
      this.form = {
        name: '',
        description: '',
        sort: 0,
        status: 1
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.formRef && this.$refs.formRef.clearValidate()
      })
    },
    
    // 编辑分类
    handleEdit(row) {
      this.isEdit = true
      this.editId = row.id
      this.dialogTitle = '编辑分类'
      this.form = {
        name: row.name,
        description: row.description || '',
        sort: row.sort || 0,
        status: row.status
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.formRef && this.$refs.formRef.clearValidate()
      })
    },
    
    // 删除分类
    handleDelete(row) {
      this.$confirm(`确定要删除分类「${row.name}」吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        categoryApi.delete(row.id)
          .then(response => {
            if (response.code === 0) {
              this.$message.success('删除成功')
              this.fetchData()
            } else {
              this.$message.error(response.message || '删除失败')
            }
          })
          .catch(error => {
            console.error('删除分类出错:', error)
            this.$message.error('删除失败，请重试')
          })
      }).catch(() => {})
    },
    
    // 状态变更
    handleStatusChange(row) {
      const status = row.status
      const statusText = status === 1 ? '启用' : '禁用'
      
      categoryApi.updateStatus(row.id, { status })
        .then(response => {
          if (response.code === 0) {
            this.$message.success(`已${statusText}`)
          } else {
            row.status = status === 1 ? 0 : 1
            this.$message.error(response.message || '操作失败')
          }
        })
        .catch(error => {
          console.error('更新状态出错:', error)
          row.status = status === 1 ? 0 : 1
          this.$message.error('操作失败，请重试')
        })
    },
    
    // 提交表单
    submitForm() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.submitLoading = true
          
          if (this.isEdit) {
            categoryApi.update(this.editId, this.form)
              .then(response => {
                if (response.code === 0) {
                  this.$message.success('更新成功')
                  this.dialogVisible = false
                  this.fetchData()
                } else {
                  this.$message.error(response.message || '更新失败')
                }
                this.submitLoading = false
              })
              .catch(error => {
                console.error('更新分类出错:', error)
                this.$message.error('更新失败，请重试')
                this.submitLoading = false
              })
          } else {
            categoryApi.create(this.form)
              .then(response => {
                if (response.code === 0) {
                  this.$message.success('添加成功')
                  this.dialogVisible = false
                  this.fetchData()
                } else {
                  this.$message.error(response.message || '添加失败')
                }
                this.submitLoading = false
              })
              .catch(error => {
                console.error('添加分类出错:', error)
                this.$message.error('添加失败，请重试')
                this.submitLoading = false
              })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$teaGold: #c9a86c;

.category-list-container {
  .action-container {
    margin-bottom: 20px;
    display: flex;
    gap: 12px;
  }
  
  .text-muted {
    color: #999;
  }
  
  .form-hint {
    margin-left: 10px;
    font-size: 12px;
    color: #999;
  }
  
  ::v-deep .el-button--primary {
    background: linear-gradient(135deg, $teaGold 0%, #b8995a 100%);
    border: none;
    
    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
