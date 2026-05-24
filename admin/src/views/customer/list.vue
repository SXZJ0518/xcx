<template>
  <div class="customer-list">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input v-model="searchKeyword" placeholder="搜索客户姓名/手机号" style="width: 200px;" clearable />
      <el-cascader v-model="selectedRegion" :options="regionOptions" placeholder="选择地区" clearable style="width: 200px; margin-left: 10px;" />
      <el-button type="primary" icon="el-icon-search" style="margin-left: 10px;" @click="handleSearch">搜索</el-button>
      <el-button type="success" icon="el-icon-plus" style="margin-left: 10px;" @click="handleAdd">新增客户</el-button>
    </div>

    <!-- 客户列表 -->
    <el-table :data="customerList" v-loading="loading" border>
      <el-table-column type="index" width="50" label="#" />
      <el-table-column prop="name" label="客户姓名" width="120" />
      <el-table-column prop="phone" label="手机号" width="130" />
      <el-table-column label="收货地址" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.district }}{{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" style="color: #f56c6c;" @click="handleDelete(scope.row)">删除</el-button>
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="客户姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11" />
        </el-form-item>
        <el-form-item label="所在地区" prop="region">
          <el-cascader v-model="form.region" :options="regionOptions" placeholder="请选择省市区" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" type="textarea" :rows="2" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注（可选）" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 省市区数据（简化版）
const regionData = [
  {
    value: '广东省',
    label: '广东省',
    children: [
      {
        value: '广州市',
        label: '广州市',
        children: [
          { value: '天河区', label: '天河区' },
          { value: '越秀区', label: '越秀区' },
          { value: '海珠区', label: '海珠区' },
          { value: '白云区', label: '白云区' }
        ]
      },
      {
        value: '深圳市',
        label: '深圳市',
        children: [
          { value: '福田区', label: '福田区' },
          { value: '罗湖区', label: '罗湖区' },
          { value: '南山区', label: '南山区' },
          { value: '宝安区', label: '宝安区' }
        ]
      },
      {
        value: '汕头市',
        label: '汕头市',
        children: [
          { value: '金平区', label: '金平区' },
          { value: '龙湖区', label: '龙湖区' },
          { value: '澄海区', label: '澄海区' }
        ]
      }
    ]
  },
  {
    value: '北京市',
    label: '北京市',
    children: [
      {
        value: '北京市',
        label: '北京市',
        children: [
          { value: '朝阳区', label: '朝阳区' },
          { value: '海淀区', label: '海淀区' },
          { value: '东城区', label: '东城区' },
          { value: '西城区', label: '西城区' }
        ]
      }
    ]
  },
  {
    value: '上海市',
    label: '上海市',
    children: [
      {
        value: '上海市',
        label: '上海市',
        children: [
          { value: '浦东新区', label: '浦东新区' },
          { value: '黄浦区', label: '黄浦区' },
          { value: '静安区', label: '静安区' },
          { value: '徐汇区', label: '徐汇区' }
        ]
      }
    ]
  },
  {
    value: '浙江省',
    label: '浙江省',
    children: [
      {
        value: '杭州市',
        label: '杭州市',
        children: [
          { value: '西湖区', label: '西湖区' },
          { value: '上城区', label: '上城区' },
          { value: '下城区', label: '下城区' }
        ]
      }
    ]
  }
]

export default {
  name: 'CustomerList',
  data() {
    return {
      searchKeyword: '',
      selectedRegion: [],
      regionOptions: regionData,
      loading: false,
      customerList: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      dialogVisible: false,
      dialogTitle: '新增客户',
      isEdit: false,
      currentId: null,
      form: {
        name: '',
        phone: '',
        region: [],
        address: '',
        remark: ''
      },
      rules: {
        name: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        region: [{ required: true, message: '请选择所在地区', trigger: 'change' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      // 从 localStorage 加载数据
      const data = JSON.parse(localStorage.getItem('customers') || '[]')
      this.customerList = data.map(item => ({
        ...item,
        province: item.region[0],
        city: item.region[1],
        district: item.region[2]
      }))
      this.total = this.customerList.length
    },
    handleSearch() {
      this.currentPage = 1
      this.loadData()
    },
    handlePageChange(page) {
      this.currentPage = page
    },
    handleAdd() {
      this.isEdit = false
      this.currentId = null
      this.form = { name: '', phone: '', region: [], address: '', remark: '' }
      this.dialogTitle = '新增客户'
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.isEdit = true
      this.currentId = row.id
      this.form = {
        name: row.name,
        phone: row.phone,
        region: row.region,
        address: row.address,
        remark: row.remark || ''
      }
      this.dialogTitle = '编辑客户'
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('确定删除该客户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = JSON.parse(localStorage.getItem('customers') || '[]')
        const index = data.findIndex(item => item.id === row.id)
        if (index > -1) {
          data.splice(index, 1)
          localStorage.setItem('customers', JSON.stringify(data))
          this.loadData()
          this.$message.success('删除成功')
        }
      })
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return

        const data = JSON.parse(localStorage.getItem('customers') || '[]')
        
        if (this.isEdit) {
          const index = data.findIndex(item => item.id === this.currentId)
          if (index > -1) {
            data[index] = {
              ...data[index],
              ...this.form,
              updateTime: new Date().toISOString()
            }
          }
        } else {
          data.push({
            id: 'c_' + Date.now(),
            ...this.form,
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString()
          })
        }

        localStorage.setItem('customers', JSON.stringify(data))
        this.dialogVisible = false
        this.loadData()
        this.$message.success(this.isEdit ? '编辑成功' : '新增成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.customer-list {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}
</style>
