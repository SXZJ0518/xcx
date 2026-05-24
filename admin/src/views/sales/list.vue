<template>
  <div class="sales-list">
    <el-card>
      <div slot="header">
        <span>销售记录管理</span>
        <el-button type="primary" size="small" @click="handleAdd" style="float: right;">新增销售记录</el-button>
      </div>

      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="客户姓名">
          <el-input v-model="searchForm.customerName" placeholder="请输入客户姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="茶叶类型">
          <el-select v-model="searchForm.teaType" placeholder="请选择茶叶类型" clearable>
            <el-option v-for="item in teaTypes" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经手人">
          <el-select v-model="searchForm.handler" placeholder="请选择经手人" clearable>
            <el-option v-for="item in handlers" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 数据表格 -->
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column prop="customerName" label="客户姓名" width="100"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
        <el-table-column prop="teaType" label="茶叶类型" width="100"></el-table-column>
        <el-table-column prop="weight" label="购买斤数" width="90" align="center"></el-table-column>
        <el-table-column prop="packageType" label="包装类型" width="90" align="center"></el-table-column>
        <el-table-column prop="handler" label="经手人" width="90" align="center"></el-table-column>
        <el-table-column prop="saleAmount" label="销售金额" width="100" align="right">
          <template slot-scope="scope">
            <span>¥{{ scope.row.saleAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cost" label="成本" width="100" align="right">
          <template slot-scope="scope">
            <span>¥{{ scope.row.cost }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="profit" label="利润" width="100" align="right">
          <template slot-scope="scope">
            <span :class="scope.row.profit >= 0 ? 'profit-positive' : 'profit-negative'">
              ¥{{ scope.row.profit }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="saleTime" label="销售时间" width="150"></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" style="color: #f56c6c" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        style="margin-top: 20px; text-align: right;">
      </el-pagination>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="客户姓名" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11" clearable></el-input>
        </el-form-item>
        <el-form-item label="茶叶类型" prop="teaType">
          <el-select v-model="form.teaType" placeholder="请选择茶叶类型" style="width: 100%;">
            <el-option v-for="item in teaTypes" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="购买斤数" prop="weight">
          <el-input-number v-model="form.weight" :min="0.1" :precision="2" :step="0.5" style="width: 100%;"></el-input-number>
        </el-form-item>
        <el-form-item label="包装类型" prop="packageType">
          <el-select v-model="form.packageType" placeholder="请选择包装类型" style="width: 100%;">
            <el-option v-for="item in packageTypes" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经手人" prop="handler">
          <el-select v-model="form.handler" placeholder="请选择经手人" style="width: 100%;">
            <el-option v-for="item in handlers" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售金额" prop="saleAmount">
          <el-input-number v-model="form.saleAmount" :min="0" :precision="2" :step="10" style="width: 100%;"></el-input-number>
        </el-form-item>
        <el-form-item label="成本" prop="cost">
          <el-input-number v-model="form.cost" :min="0" :precision="2" :step="10" style="width: 100%;"></el-input-number>
        </el-form-item>
        <el-form-item label="利润">
          <el-input v-model="calculatedProfit" disabled>
            <template slot="prepend">¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销售时间" prop="saleTime">
          <el-date-picker v-model="form.saleTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
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
export default {
  name: 'SalesList',
  data() {
    return {
      loading: false,
      // 茶叶类型选项
      teaTypes: ['蜜兰香', '大乌叶', '鸭屎香', '锯朵仔', '凹富后', '东方红', '宋种', '芝兰香', '桂花香', '黄枝香'],
      // 包装类型选项
      packageTypes: ['袋装', '铁罐', '礼盒'],
      // 经手人选项
      handlers: ['老板', '员工A', '员工B'],
      // 客户列表
      customers: [],
      // 搜索表单
      searchForm: {
        customerName: '',
        phone: '',
        teaType: '',
        handler: '',
        dateRange: []
      },
      // 分页
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      // 表格数据
      tableData: [],
      // 所有销售数据
      allSalesData: [],
      // 弹窗
      dialogVisible: false,
      dialogTitle: '新增销售记录',
      isEdit: false,
      editId: null,
      // 表单
      form: {
        customerId: '',
        customerName: '',
        phone: '',
        teaType: '',
        weight: 1,
        packageType: '袋装',
        handler: '老板',
        saleAmount: 0,
        cost: 0,
        saleTime: ''
      },
      // 表单验证规则
      rules: {
        customerName: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        teaType: [{ required: true, message: '请选择茶叶类型', trigger: 'change' }],
        weight: [{ required: true, message: '请输入购买斤数', trigger: 'blur' }],
        packageType: [{ required: true, message: '请选择包装类型', trigger: 'change' }],
        handler: [{ required: true, message: '请选择经手人', trigger: 'change' }],
        saleAmount: [{ required: true, message: '请输入销售金额', trigger: 'blur' }],
        cost: [{ required: true, message: '请输入成本', trigger: 'blur' }],
        saleTime: [{ required: true, message: '请选择销售时间', trigger: 'change' }]
      }
    }
  },
  computed: {
    // 计算利润
    calculatedProfit() {
      return (this.form.saleAmount - this.form.cost).toFixed(2)
    }
  },
  created() {
    this.loadCustomers()
    this.loadSalesData()
    // 设置默认销售时间为当前时间
    this.form.saleTime = this.formatDateTime(new Date())
  },
  methods: {
    // 加载客户数据
    loadCustomers() {
      const customers = localStorage.getItem('customers')
      if (customers) {
        this.customers = JSON.parse(customers)
      }
    },
    // 加载销售数据
    loadSalesData() {
      const sales = localStorage.getItem('sales')
      if (sales) {
        this.allSalesData = JSON.parse(sales).sort((a, b) => new Date(b.saleTime) - new Date(a.saleTime))
      } else {
        this.allSalesData = []
      }
      this.handleSearch()
    },
    // 格式化日期时间
    formatDateTime(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    // 搜索
    handleSearch() {
      let filteredData = [...this.allSalesData]

      if (this.searchForm.customerName) {
        filteredData = filteredData.filter(item => 
          item.customerName && item.customerName.includes(this.searchForm.customerName)
        )
      }

      if (this.searchForm.phone) {
        filteredData = filteredData.filter(item => 
          item.phone && item.phone.includes(this.searchForm.phone)
        )
      }

      if (this.searchForm.teaType) {
        filteredData = filteredData.filter(item => item.teaType === this.searchForm.teaType)
      }

      if (this.searchForm.handler) {
        filteredData = filteredData.filter(item => item.handler === this.searchForm.handler)
      }

      if (this.searchForm.dateRange && this.searchForm.dateRange.length === 2) {
        const startDate = new Date(this.searchForm.dateRange[0] + ' 00:00:00')
        const endDate = new Date(this.searchForm.dateRange[1] + ' 23:59:59')
        filteredData = filteredData.filter(item => {
          const saleDate = new Date(item.saleTime)
          return saleDate >= startDate && saleDate <= endDate
        })
      }

      this.page.total = filteredData.length
      const start = (this.page.current - 1) * this.page.size
      const end = start + this.page.size
      this.tableData = filteredData.slice(start, end)
    },
    // 重置搜索
    handleReset() {
      this.searchForm = {
        customerName: '',
        phone: '',
        teaType: '',
        handler: '',
        dateRange: []
      }
      this.page.current = 1
      this.handleSearch()
    },
    // 分页大小变化
    handleSizeChange(val) {
      this.page.size = val
      this.handleSearch()
    },
    // 页码变化
    handleCurrentChange(val) {
      this.page.current = val
      this.handleSearch()
    },
    // 新增
    handleAdd() {
      this.isEdit = false
      this.editId = null
      this.dialogTitle = '新增销售记录'
      this.form = {
        customerName: '',
        phone: '',
        teaType: '',
        weight: 1,
        packageType: '袋装',
        handler: '老板',
        saleAmount: 0,
        cost: 0,
        saleTime: this.formatDateTime(new Date())
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },
    // 编辑
    handleEdit(row) {
      this.isEdit = true
      this.editId = row.id
      this.dialogTitle = '编辑销售记录'
      this.form = {
        customerName: row.customerName,
        phone: row.phone,
        teaType: row.teaType,
        weight: row.weight,
        packageType: row.packageType,
        handler: row.handler,
        saleAmount: row.saleAmount,
        cost: row.cost,
        saleTime: row.saleTime
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('确定要删除这条销售记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.allSalesData.findIndex(item => item.id === row.id)
        if (index > -1) {
          this.allSalesData.splice(index, 1)
          localStorage.setItem('sales', JSON.stringify(this.allSalesData))
          this.handleSearch()
          this.$message.success('删除成功')
        }
      }).catch(() => {})
    },
    // 提交表单
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const profit = parseFloat(this.calculatedProfit)
          const saleData = {
            id: this.isEdit ? this.editId : Date.now().toString(),
            customerName: this.form.customerName,
            phone: this.form.phone,
            teaType: this.form.teaType,
            weight: this.form.weight,
            packageType: this.form.packageType,
            handler: this.form.handler,
            saleAmount: this.form.saleAmount,
            cost: this.form.cost,
            profit: profit,
            saleTime: this.form.saleTime
          }

          if (this.isEdit) {
            const index = this.allSalesData.findIndex(item => item.id === this.editId)
            if (index > -1) {
              this.allSalesData[index] = saleData
            }
          } else {
            this.allSalesData.unshift(saleData)
          }

          localStorage.setItem('sales', JSON.stringify(this.allSalesData))
          this.dialogVisible = false
          this.handleSearch()
          this.$message.success(this.isEdit ? '编辑成功' : '新增成功')
        }
      })
    }
  }
}
</script>

<style scoped>
.sales-list {
  padding: 20px;
}
.search-form {
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
