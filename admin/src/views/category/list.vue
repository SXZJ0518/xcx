<template>
  <div class="category-list-container">
    <el-card>
      <!-- 操作区域 -->
      <div class="action-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索分类名称"
          style="width: 250px; margin-right: 10px;"
          clearable
          @clear="handleSearch"
          @input="handleSearch"
        >
          <i slot="prefix" class="el-icon-search"></i>
        </el-input>
        <el-button type="primary" @click="handleAddCategory" icon="el-icon-plus">添加分类</el-button>
      </div>

      <!-- 列表区域 -->
      <div class="table-info">
        共 {{ totalCount }} 个分类
      </div>

      <el-table
        v-loading="listLoading"
        :data="filteredCategoryList"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="name" label="分类名称" min-width="200"></el-table-column>
        <el-table-column prop="level" label="层级" width="100">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.level === 1 ? 'primary' : 'success'"
              size="mini"
            >
              {{ scope.row.level === 1 ? '一级分类' : '二级分类' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="true"
              :inactive-value="false"
              @change="handleStatusChange(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              v-if="scope.row.level === 1"
              size="mini"
              type="success"
              @click="handleAddSubCategory(scope.row)">
              添加子分类
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!listLoading && categoryList.length === 0" description="暂无数据" />
    </el-card>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog :title="dialogStatus === 'create' ? '添加分类' : '编辑分类'" :visible.sync="dialogVisible" width="500px">
      <el-form :model="form" :rules="rules" ref="categoryForm" label-width="100px">
        <el-form-item label="上级分类">
          <el-cascader
            v-model="selectedParentCategory"
            :options="parentCategoryOptions"
            :props="{ checkStrictly: true, value: 'id', label: 'name' }"
            placeholder="请选择上级分类"
            clearable
            :disabled="dialogStatus === 'update' && form.level === 1"
            @change="handleParentCategoryChange"
          ></el-cascader>
          <div class="form-tip">不选择则默认为一级分类</div>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="9999"></el-input-number>
          <div class="form-tip">数值越小排序越靠前</div>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="true"
            :inactive-value="false"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
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
      categoryList: [], // 分类树形结构数据
      allCategoryList: [], // 所有分类的平铺数据（用于构建级联选择器的选项）
      dialogVisible: false,
      dialogStatus: 'create', // create 或 update
      submitLoading: false,
      selectedParentCategory: [], // 级联选择器选中的值
      searchKeyword: '', // 搜索关键词

      // 表单数据
      form: {
        id: undefined,
        parentId: 0,
        name: '',
        level: 1,
        sort: 0,
        status: true
      },

      // 表单校验规则
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序值', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 计算过滤后的分类列表（支持搜索）
    filteredCategoryList() {
      if (!this.searchKeyword) {
        return this.categoryList
      }
      const keyword = this.searchKeyword.toLowerCase()
      const filterTree = (list) => {
        const result = []
        for (const item of list) {
          const nameMatch = item.name.toLowerCase().includes(keyword)
          const children = item.children && item.children.length > 0 ? filterTree(item.children) : []
          if (nameMatch || children.length > 0) {
            result.push({ ...item, children })
          }
        }
        return result
      }
      return filterTree(this.categoryList)
    },
    // 计算分类总数
    totalCount() {
      let count = 0
      const countAll = (list) => {
        list.forEach(item => {
          count++
          if (item.children && item.children.length > 0) {
            countAll(item.children)
          }
        })
      }
      countAll(this.categoryList)
      return count
    },
    // 构建上级分类选项
    parentCategoryOptions() {
      return this.allCategoryList.filter(item => item.level === 1).map(item => {
        // 深拷贝一级分类，避免修改原数组
        const category = { ...item }
        // 只显示一级分类，不允许选择二级分类作为父级
        category.children = []
        return category
      })
    }
  },
  created() {
    this.fetchCategoryList()
  },
  methods: {
    // 搜索处理
    handleSearch() {
      // 搜索时会自动通过计算属性 filteredCategoryList 过滤
    },

    // 获取分类列表
    fetchCategoryList() {
      this.listLoading = true

      categoryApi.getList()
        .then(response => {
          if (response.code === 0) {
            this.categoryList = response.data || []

            // 构建平铺的分类列表，用于级联选择器
            this.buildFlatCategoryList()
          } else {
            this.$message.error(response.message || '获取分类列表失败')
          }
          this.listLoading = false
        })
        .catch(error => {
          console.error('获取分类列表出错:', error)
          this.listLoading = false

          // 模拟数据（实际开发中应该删除）
          this.mockCategoryList()
        })
    },

    // 构建平铺的分类列表
    buildFlatCategoryList() {
      this.allCategoryList = []
      const flattenCategories = (categories, parentId = 0) => {
        if (!categories) return

        categories.forEach(category => {
          this.allCategoryList.push({ ...category })

          if (category.children && category.children.length > 0) {
            flattenCategories(category.children, category.id)
          }
        })
      }

      flattenCategories(this.categoryList)
    },

    // 模拟分类数据（实际开发中应该删除）
    mockCategoryList() {
      this.categoryList = [
        {
          id: 1,
          parentId: 0,
          name: '绿茶',
          level: 1,
          sort: 1,
          status: true,
          createTime: '2024-03-15 10:00:00',
          children: [
            {
              id: 3,
              parentId: 1,
              name: '西湖龙井',
              level: 2,
              sort: 1,
              status: true,
              createTime: '2024-03-15 10:01:00'
            },
            {
              id: 4,
              parentId: 1,
              name: '碧螺春',
              level: 2,
              sort: 2,
              status: true,
              createTime: '2024-03-15 10:02:00'
            },
            {
              id: 5,
              parentId: 1,
              name: '黄山毛峰',
              level: 2,
              sort: 3,
              status: true,
              createTime: '2024-03-15 10:03:00'
            }
          ]
        },
        {
          id: 2,
          parentId: 0,
          name: '红茶',
          level: 1,
          sort: 2,
          status: true,
          createTime: '2024-03-15 10:10:00',
          children: [
            {
              id: 6,
              parentId: 2,
              name: '正山小种',
              level: 2,
              sort: 1,
              status: true,
              createTime: '2024-03-15 10:11:00'
            },
            {
              id: 7,
              parentId: 2,
              name: '祁门红茶',
              level: 2,
              sort: 2,
              status: true,
              createTime: '2024-03-15 10:12:00'
            }
          ]
        },
        {
          id: 8,
          parentId: 0,
          name: '乌龙茶',
          level: 1,
          sort: 3,
          status: true,
          createTime: '2024-03-15 10:20:00',
          children: [
            {
              id: 9,
              parentId: 8,
              name: '铁观音',
              level: 2,
              sort: 1,
              status: true,
              createTime: '2024-03-15 10:21:00'
            },
            {
              id: 10,
              parentId: 8,
              name: '大红袍',
              level: 2,
              sort: 2,
              status: true,
              createTime: '2024-03-15 10:22:00'
            }
          ]
        },
        {
          id: 11,
          parentId: 0,
          name: '白茶',
          level: 1,
          sort: 4,
          status: true,
          createTime: '2024-03-15 10:30:00',
          children: [
            {
              id: 12,
              parentId: 11,
              name: '白毫银针',
              level: 2,
              sort: 1,
              status: true,
              createTime: '2024-03-15 10:31:00'
            }
          ]
        },
        {
          id: 13,
          parentId: 0,
          name: '黑茶',
          level: 1,
          sort: 5,
          status: true,
          createTime: '2024-03-15 10:40:00',
          children: [
            {
              id: 14,
              parentId: 13,
              name: '普洱茶',
              level: 2,
              sort: 1,
              status: true,
              createTime: '2024-03-15 10:41:00'
            }
          ]
        }
      ]

      this.buildFlatCategoryList()
    },

    // 判断分类是否有子分类
    hasChildren(row) {
      return row.children && row.children.length > 0
    },

    // 添加分类
    handleAddCategory() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.categoryForm && this.$refs.categoryForm.clearValidate()
      })
    },

    // 添加子分类
    handleAddSubCategory(row) {
      this.resetForm()
      this.dialogStatus = 'create'
      // 设置上级分类
      this.selectedParentCategory = [row.id]
      this.form.parentId = row.id
      this.form.level = 2
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.categoryForm && this.$refs.categoryForm.clearValidate()
      })
    },

    // 编辑分类
    handleEdit(row) {
      this.dialogStatus = 'update'
      this.form = {
        id: row.id,
        parentId: row.parentId,
        name: row.name,
        level: row.level,
        sort: row.sort,
        status: row.status
      }

      // 如果是二级分类，设置级联选择器的值
      if (row.level === 2) {
        this.selectedParentCategory = [row.parentId]
      } else {
        this.selectedParentCategory = []
      }

      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.categoryForm && this.$refs.categoryForm.clearValidate()
      })
    },

    // 删除分类
    handleDelete(row) {
      // 判断是否有子分类
      if (this.hasChildren(row)) {
        this.$message.warning('该分类下存在子分类，请先删除子分类')
        return
      }

      this.$confirm(`确定要删除分类"${row.name}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        categoryApi.delete(row.id)
          .then(response => {
            if (response.code === 0) {
              this.$message.success('删除成功')
              this.fetchCategoryList()
            } else {
              this.$message.error(response.message || '删除失败')
            }
          })
          .catch(error => {
            console.error('删除分类出错:', error)
            this.$message.error('删除失败，请重试')
          })
      }).catch(() => {
        // 取消操作
      })
    },

    // 状态变更
    handleStatusChange(row) {
      const status = row.status
      const statusText = status ? '启用' : '禁用'

      categoryApi.updateStatus(row.id, { status })
        .then(response => {
          if (response.code === 0) {
            this.$message.success(`已${statusText}`)
          } else {
            // 恢复原状态
            row.status = !status
            this.$message.error(response.message || `${statusText}失败`)
          }
        })
        .catch(error => {
          console.error('更新状态出错:', error)
          // 恢复原状态
          row.status = !status
          this.$message.error('获取数据失败，请稍后重试')
        })
    },

    // 上级分类变更
    handleParentCategoryChange(value) {
      if (value && value.length > 0) {
        this.form.parentId = value[0]
        this.form.level = 2
      } else {
        this.form.parentId = 0
        this.form.level = 1
      }
    },

    // 提交表单
    submitForm() {
      this.$refs.categoryForm.validate(valid => {
        if (valid) {
          this.submitLoading = true

          const data = { ...this.form }

          if (this.dialogStatus === 'create') {
            // 创建
            categoryApi.create(data)
              .then(this.handleSubmitSuccess)
              .catch(this.handleSubmitError)
          } else {
            // 更新
            categoryApi.update(data.id, data)
              .then(this.handleSubmitSuccess)
              .catch(this.handleSubmitError)
          }
        }
      })
    },

    // 提交成功处理
    handleSubmitSuccess(response) {
      if (response.code === 0) {
        this.$message.success(this.dialogStatus === 'create' ? '添加成功' : '更新成功')
        this.dialogVisible = false
        this.fetchCategoryList()
      } else {
        this.$message.error(response.message || (this.dialogStatus === 'create' ? '添加失败' : '更新失败'))
      }
      this.submitLoading = false
    },

    // 提交错误处理
    handleSubmitError(error) {
      console.error('提交分类数据出错:', error)
      this.$message.error(this.dialogStatus === 'create' ? '添加失败，请重试' : '更新失败，请重试')
      this.submitLoading = false
    },

    // 重置表单
    resetForm() {
      this.form = {
        id: undefined,
        parentId: 0,
        name: '',
        level: 1,
        sort: 0,
        status: true
      }
      this.selectedParentCategory = []
    }
  }
}
</script>

<style lang="scss" scoped>
.category-list-container {
  padding: 20px;

  .action-container {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
  }

  .table-info {
    margin-bottom: 10px;
    color: #909399;
    font-size: 14px;
  }

  .form-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 5px;
  }
}
</style>
