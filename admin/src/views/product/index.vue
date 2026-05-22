<template>
  <div class="product-list-container">
    <el-card class="box-card">
      <!-- 搜索和筛选区域 -->
      <div class="filter-container">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="商品名称">
            <el-input 
              v-model="listQuery.keyword" 
              placeholder="搜索商品名称" 
              clearable
              prefix-icon="el-icon-search"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select v-model="listQuery.categoryId" placeholder="选择分类" clearable>
              <el-option 
                v-for="item in categoryOptions" 
                :key="item.value" 
                :label="item.label" 
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="香型">
            <el-select v-model="listQuery.aromaId" placeholder="选择香型" clearable>
              <el-option 
                v-for="item in aromaOptions" 
                :key="item.value" 
                :label="item.label" 
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="listQuery.status" placeholder="全部状态" clearable>
              <el-option label="上架" :value="1"></el-option>
              <el-option label="下架" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 操作按钮区域 -->
      <div class="action-container">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增商品</el-button>
        <el-button icon="el-icon-collection-tag" @click="handleManageAromas">香型管理</el-button>
      </div>
      
      <!-- 商品列表表格 -->
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
        <el-table-column label="封面" width="100" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl || scope.row.coverImage" class="product-thumb" @click="previewImage(scope.row.imageUrl || scope.row.coverImage)">
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="categoryName" label="分类" width="120" align="center"></el-table-column>
        <el-table-column prop="aromaName" label="香型" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.aromaName">{{ scope.row.aromaName }}</span>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="150" align="center">
          <template slot-scope="scope">
            <div class="price-cell">
              <span class="sale-price">¥{{ scope.row.price }}</span>
              <span v-if="scope.row.originalPrice" class="original-price">¥{{ scope.row.originalPrice }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" align="center"></el-table-column>
        <el-table-column label="标签" width="150" align="center">
          <template slot-scope="scope">
            <div class="tag-cell">
              <el-tag v-if="scope.row.isNew" type="success" size="mini">新品</el-tag>
              <el-tag v-if="scope.row.isHot" type="danger" size="mini">热销</el-tag>
              <el-tag v-if="scope.row.isRecommend" type="warning" size="mini">推荐</el-tag>
            </div>
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
      
      <el-empty v-if="!listLoading && list.length === 0" description="暂无商品数据" />
      
      <!-- 分页区域 -->
      <div class="pagination-container" v-if="total > 0">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="listQuery.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog :visible.sync="previewVisible" append-to-body width="600px">
      <img :src="previewUrl" style="width: 100%; display: block;">
    </el-dialog>
  </div>
</template>

<script>
import productApi from '@/api/product'
import categoryApi from '@/api/category'
import aromaApi from '@/api/aroma'

export default {
  name: 'ProductList',
  data() {
    return {
      list: [], // 商品列表
      total: 0, // 总记录数
      listLoading: true, // 加载状态
      listQuery: { // 查询参数
        page: 1,
        pageSize: 10,
        keyword: '',
        categoryId: '',
        aromaId: '',
        status: ''
      },
      categoryOptions: [], // 分类选项
      aromaOptions: [], // 香型选项
      previewVisible: false,
      previewUrl: ''
    }
  },
  created() {
    this.fetchData()
    this.fetchCategories()
    this.fetchAromas()
  },
  methods: {
    // 获取商品列表
    fetchData() {
      this.listLoading = true
      
      productApi.getList(this.listQuery)
        .then(response => {
          if (response.code === 0) {
            this.list = response.data.list || []
            this.total = response.data.total || 0
          } else {
            this.$message.error(response.message || '获取商品列表失败')
          }
          this.listLoading = false
        })
        .catch(error => {
          console.error('获取商品列表出错:', error)
          this.$message.error('获取数据失败，请稍后重试')
          this.listLoading = false
          
          // 模拟数据
          this.mockProductList()
        })
    },
    
    // 获取分类列表
    fetchCategories() {
      categoryApi.getAll()
        .then(response => {
          if (response.code === 0) {
            this.categoryOptions = (response.data || []).map(item => ({
              value: item.id,
              label: item.name
            }))
          }
        })
        .catch(error => {
          console.error('获取分类列表出错:', error)
          this.mockCategoryOptions()
        })
    },
    
    // 获取香型列表
    fetchAromas() {
      aromaApi.getAll()
        .then(response => {
          if (response.code === 0) {
            this.aromaOptions = (response.data || []).map(item => ({
              value: item.id,
              label: item.name
            }))
          }
        })
        .catch(error => {
          console.error('获取香型列表出错:', error)
          this.mockAromaOptions()
        })
    },
    
    // 模拟商品数据
    mockProductList() {
      this.list = [
        {
          id: 1,
          name: '鸭屎香 特级春茶',
          imageUrl: 'https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=400&h=400&fit=crop',
          categoryName: '单枞茶',
          aromaName: '鸭屎香',
          price: 388,
          originalPrice: 458,
          stock: 100,
          isHot: true,
          isRecommend: true,
          status: 1
        },
        {
          id: 2,
          name: '蜜兰香 老枞',
          imageUrl: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&h=400&fit=crop',
          categoryName: '单枞茶',
          aromaName: '蜜兰香',
          price: 268,
          originalPrice: 328,
          stock: 80,
          isRecommend: true,
          status: 1
        },
        {
          id: 3,
          name: '黄枝香 清香型',
          imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&fit=crop',
          categoryName: '单枞茶',
          aromaName: '黄枝香',
          price: 198,
          originalPrice: 238,
          stock: 150,
          isNew: true,
          status: 1
        },
        {
          id: 4,
          name: '特惠茶礼盒装',
          imageUrl: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&h=400&fit=crop',
          categoryName: '特惠茶',
          aromaName: '',
          price: 128,
          originalPrice: 168,
          stock: 200,
          status: 1
        },
        {
          id: 5,
          name: '高山有机茶叶',
          imageUrl: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=400&h=400&fit=crop',
          categoryName: '农产品',
          aromaName: '',
          price: 88,
          originalPrice: 108,
          stock: 300,
          isNew: true,
          status: 1
        }
      ]
      
      this.total = this.list.length
    },
    
    // 模拟分类数据
    mockCategoryOptions() {
      this.categoryOptions = [
        { value: 1, label: '单枞茶' },
        { value: 2, label: '特惠茶' },
        { value: 3, label: '农产品' }
      ]
    },
    
    // 模拟香型数据
    mockAromaOptions() {
      this.aromaOptions = [
        { value: 1, label: '蜜兰香' },
        { value: 2, label: '鸭屎香' },
        { value: 3, label: '黄枝香' },
        { value: 4, label: '桂花香' },
        { value: 5, label: '芝兰香' },
        { value: 6, label: '杏仁香' },
        { value: 7, label: '玉兰香' },
        { value: 8, label: '姜花香' },
        { value: 9, label: '肉桂香' },
        { value: 10, label: '茉莉香' }
      ]
    },
    
    // 搜索
    handleSearch() {
      this.listQuery.page = 1
      this.fetchData()
    },
    
    // 重置查询条件
    resetQuery() {
      this.listQuery = {
        page: 1,
        pageSize: 10,
        keyword: '',
        categoryId: '',
        aromaId: '',
        status: ''
      }
      this.fetchData()
    },
    
    // 每页数量改变
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.fetchData()
    },
    
    // 页码改变
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchData()
    },
    
    // 新增商品
    handleAdd() {
      this.$router.push('/product/detail')
    },
    
    // 编辑商品
    handleEdit(item) {
      this.$router.push(`/product/detail?id=${item.id}`)
    },
    
    // 删除商品
    handleDelete(item) {
      this.$confirm(`确定要删除「${item.name}」吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        productApi.delete(item.id)
          .then(response => {
            if (response.code === 0) {
              this.$message.success('删除成功')
              this.fetchData()
            } else {
              this.$message.error(response.message || '删除失败')
            }
          })
          .catch(error => {
            console.error('删除商品出错:', error)
            this.$message.error('删除失败，请重试')
          })
      }).catch(() => {})
    },
    
    // 状态变更
    handleStatusChange(row) {
      const status = row.status
      const statusText = status === 1 ? '上架' : '下架'
      
      productApi.updateStatus(row.id, status)
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
    
    // 香型管理
    handleManageAromas() {
      this.$router.push('/aroma')
    },
    
    // 预览图片
    previewImage(url) {
      if (url) {
        this.previewUrl = url
        this.previewVisible = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$teaGold: #c9a86c;
$teaDark: #2d2520;
$teaLight: #a89b8c;

.product-list-container {
  .filter-container {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0ebe3;
    
    ::v-deep .el-input__inner {
      border-radius: 8px;
      border-color: #e0d8cc;
      
      &:focus {
        border-color: $teaGold;
      }
    }
    
    ::v-deep .el-button--primary {
      background: linear-gradient(135deg, $teaGold 0%, #b8995a 100%);
      border: none;
      
      &:hover {
        opacity: 0.9;
      }
    }
  }
  
  .action-container {
    margin-bottom: 24px;
    display: flex;
    gap: 12px;
  }
  
  .product-thumb {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      opacity: 0.8;
    }
  }
  
  .price-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .sale-price {
      color: #f56c6c;
      font-weight: bold;
      font-size: 14px;
    }
    
    .original-price {
      color: #999;
      font-size: 12px;
      text-decoration: line-through;
    }
  }
  
  .tag-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;
  }
  
  .text-muted {
    color: #999;
  }
  
  .pagination-container {
    margin-top: 24px;
    text-align: center;
    padding-top: 24px;
    border-top: 1px solid #f0ebe3;
    
    ::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
      background: $teaGold;
    }
    
    ::v-deep .el-pagination.is-background .el-pager li:not(.disabled):hover {
      color: $teaGold;
    }
  }
}
</style>
