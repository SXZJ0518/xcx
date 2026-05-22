<template>
  <div class="aroma-list-container">
    <el-card>
      <!-- 操作区域 -->
      <div class="action-container">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增香型</el-button>
        <el-button icon="el-icon-refresh" @click="fetchData">刷新</el-button>
        <el-button type="success" plain icon="el-icon-document" @click="initDefaultData">初始化默认香型</el-button>
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
        <el-table-column prop="name" label="香型名称" min-width="150"></el-table-column>
        <el-table-column prop="feature" label="香气特征" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.feature">{{ scope.row.feature }}</span>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="variety" label="代表品种" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.variety">{{ scope.row.variety }}</span>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="quality" label="品质特点" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.quality">{{ scope.row.quality }}</span>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="hasProduct" label="有对应产品" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.hasProduct ? 'success' : 'info'" size="mini">
              {{ scope.row.hasProduct ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
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
      
      <el-empty v-if="!listLoading && list.length === 0" description="暂无香型数据" />
    </el-card>

    <!-- 添加/编辑香型对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="香型名称" prop="name">
          <el-input v-model="form.name" placeholder="如：蜜兰香、鸭屎香" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="香气特征">
          <el-input 
            v-model="form.feature" 
            type="textarea" 
            :rows="2" 
            placeholder="描述该香型的香气特点"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="代表品种">
          <el-input v-model="form.variety" placeholder="如：白叶单枞" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="品质特点">
          <el-input 
            v-model="form.quality" 
            type="textarea" 
            :rows="2" 
            placeholder="描述茶叶的品质特点"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="有对应产品">
          <el-radio-group v-model="form.hasProduct">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
          <div class="form-hint">选择"是"表示该香型有对应的产品在售</div>
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
import aromaApi from '@/api/aroma'

// 默认十大香型数据
const defaultAromas = [
  {
    name: '蜜兰香',
    feature: '蜜香浓郁，兰香幽雅，香气高锐持久',
    variety: '白叶单枞',
    quality: '汤色橙黄明亮，滋味浓醇甘爽，回甘力强',
    hasProduct: true,
    sort: 10,
    status: 1
  },
  {
    name: '鸭屎香',
    feature: '银花香浓郁，带有独特的奶香味，回甘持久',
    variety: '大乌叶单枞',
    quality: '汤色金黄明亮，滋味醇厚鲜爽，韵味独特',
    hasProduct: true,
    sort: 9,
    status: 1
  },
  {
    name: '黄枝香',
    feature: '栀子花香明显，清新淡雅，香气持久',
    variety: '黄枝香单枞',
    quality: '汤色清黄明亮，滋味清醇爽口，花香馥郁',
    hasProduct: true,
    sort: 8,
    status: 1
  },
  {
    name: '桂花香',
    feature: '桂花香气浓郁，甜润芬芳，沁人心脾',
    variety: '桂花香单枞',
    quality: '汤色金黄清澈，滋味甘醇甜润，桂香悠长',
    hasProduct: true,
    sort: 7,
    status: 1
  },
  {
    name: '芝兰香',
    feature: '芝兰幽香，清雅脱俗，韵味悠长',
    variety: '芝兰香单枞',
    quality: '汤色橙黄清澈，滋味醇厚甘滑，兰香持久',
    hasProduct: true,
    sort: 6,
    status: 1
  },
  {
    name: '杏仁香',
    feature: '杏仁果香明显，醇厚甘滑，香气独特',
    variety: '锯朵仔单枞',
    quality: '汤色橙黄明亮，滋味浓醇甘爽，杏仁香显',
    hasProduct: true,
    sort: 5,
    status: 1
  },
  {
    name: '玉兰香',
    feature: '玉兰花香清雅，幽香持久，沁人心脾',
    variety: '玉兰香单枞',
    quality: '汤色清黄明亮，滋味清醇爽口，花香馥郁',
    hasProduct: true,
    sort: 4,
    status: 1
  },
  {
    name: '姜花香',
    feature: '姜花香气浓郁，辛辣中带甜，独特迷人',
    variety: '姜花香单枞',
    quality: '汤色金黄明亮，滋味醇厚甘爽，姜香突出',
    hasProduct: true,
    sort: 3,
    status: 1
  },
  {
    name: '肉桂香',
    feature: '肉桂香气浓郁，辛香甘甜，温暖醇厚',
    variety: '肉桂香单枞',
    quality: '汤色橙黄明亮，滋味浓醇甘滑，肉桂香显',
    hasProduct: true,
    sort: 2,
    status: 1
  },
  {
    name: '茉莉香',
    feature: '茉莉花香清雅，芬芳怡人，香气持久',
    variety: '茉莉香单枞',
    quality: '汤色清黄明亮，滋味清醇甘爽，花香馥郁',
    hasProduct: true,
    sort: 1,
    status: 1
  }
]

export default {
  name: 'AromaList',
  data() {
    return {
      listLoading: true,
      list: [],
      dialogVisible: false,
      dialogTitle: '新增香型',
      isEdit: false,
      editId: null,
      submitLoading: false,
      
      form: {
        name: '',
        feature: '',
        variety: '',
        quality: '',
        hasProduct: true,
        sort: 0,
        status: 1
      },
      
      rules: {
        name: [
          { required: true, message: '请输入香型名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取香型列表
    fetchData() {
      this.listLoading = true
      
      aromaApi.getList()
        .then(response => {
          if (response.code === 0) {
            this.list = response.data.list || []
          } else {
            this.$message.error(response.message || '获取香型列表失败')
          }
          this.listLoading = false
        })
        .catch(error => {
          console.error('获取香型列表出错:', error)
          this.listLoading = false
          // 模拟数据
          this.mockData()
        })
    },
    
    // 模拟数据
    mockData() {
      this.list = defaultAromas.map((item, index) => ({
        id: index + 1,
        ...item
      }))
    },
    
    // 初始化默认香型
    initDefaultData() {
      this.$confirm('确定要初始化默认十大香型数据吗？这将添加所有默认香型。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const loading = this.$loading({
          lock: true,
          text: '正在初始化...',
          spinner: 'el-icon-loading'
        })
        
        try {
          // 逐个添加默认香型
          for (const aroma of defaultAromas) {
            await aromaApi.create(aroma)
          }
          this.$message.success('默认香型初始化成功')
          this.fetchData()
        } catch (error) {
          console.error('初始化失败:', error)
          this.$message.error('初始化失败，请重试')
        } finally {
          loading.close()
        }
      }).catch(() => {})
    },
    
    // 新增香型
    handleAdd() {
      this.isEdit = false
      this.editId = null
      this.dialogTitle = '新增香型'
      this.form = {
        name: '',
        feature: '',
        variety: '',
        quality: '',
        hasProduct: true,
        sort: 0,
        status: 1
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.formRef && this.$refs.formRef.clearValidate()
      })
    },
    
    // 编辑香型
    handleEdit(row) {
      this.isEdit = true
      this.editId = row.id
      this.dialogTitle = '编辑香型'
      this.form = {
        name: row.name,
        feature: row.feature || '',
        variety: row.variety || '',
        quality: row.quality || '',
        hasProduct: row.hasProduct !== false,
        sort: row.sort || 0,
        status: row.status
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.formRef && this.$refs.formRef.clearValidate()
      })
    },
    
    // 删除香型
    handleDelete(row) {
      this.$confirm(`确定要删除香型「${row.name}」吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        aromaApi.delete(row.id)
          .then(response => {
            if (response.code === 0) {
              this.$message.success('删除成功')
              this.fetchData()
            } else {
              this.$message.error(response.message || '删除失败')
            }
          })
          .catch(error => {
            console.error('删除香型出错:', error)
            this.$message.error('删除失败，请重试')
          })
      }).catch(() => {})
    },
    
    // 状态变更
    handleStatusChange(row) {
      const status = row.status
      const statusText = status === 1 ? '启用' : '禁用'
      
      aromaApi.updateStatus(row.id, { status })
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
            aromaApi.update(this.editId, this.form)
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
                console.error('更新香型出错:', error)
                this.$message.error('更新失败，请重试')
                this.submitLoading = false
              })
          } else {
            aromaApi.create(this.form)
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
                console.error('添加香型出错:', error)
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

.aroma-list-container {
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
