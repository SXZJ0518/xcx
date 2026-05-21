<template>
  <div class="product-list-container">
    <el-card class="box-card">
      <!-- 搜索和操作区域 -->
      <div class="filter-container">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="茶品名称">
            <el-input 
              v-model="listQuery.keyword" 
              placeholder="搜索茶品名称" 
              clearable
              prefix-icon="el-icon-search"
            ></el-input>
          </el-form-item>
          <el-form-item label="香型">
            <el-select v-model="listQuery.categoryId" placeholder="选择香型" clearable>
              <el-option 
                v-for="item in categoryOptions" 
                :key="item.value" 
                :label="item.label" 
                :value="item.value"
              ></el-option>
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
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加茶品</el-button>
        <el-button icon="el-icon-collection-tag" @click="handleManageCategories">香型管理</el-button>
      </div>
      
      <!-- 茶品卡片网格 -->
      <div v-loading="listLoading" class="product-grid">
        <div 
          v-for="item in list" 
          :key="item.id" 
          class="product-card"
          @click="handleEdit(item)"
        >
          <div class="product-image-wrapper">
            <img :src="item.imageUrl" alt="" class="product-img">
            <div class="product-overlay">
              <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click.stop="handleDelete(item)">删除</el-button>
            </div>
            <div class="product-tags">
              <el-tag v-if="item.isNew" type="success" size="mini">新品</el-tag>
              <el-tag v-if="item.isHot" type="danger" size="mini">热销</el-tag>
              <el-tag v-if="item.isRecommend" type="warning" size="mini">推荐</el-tag>
            </div>
          </div>
          <div class="product-info">
            <h4 class="product-name">{{ item.name }}</h4>
            <p class="product-category">
              <i class="el-icon-collection-tag"></i> {{ item.categoryName }}
            </p>
            <p class="product-desc" v-if="item.description">{{ item.description }}</p>
            <div class="product-meta">
              <span class="product-price" v-if="item.price">
                <small>¥</small>{{ item.price }}
              </span>
              <span class="product-unit" v-if="item.unit">/{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <el-empty v-if="!listLoading && list.length === 0" description="暂无茶品数据" />
      
      <!-- 分页区域 -->
      <div class="pagination-container" v-if="total > 0">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-sizes="[12, 24, 36, 48]"
          :page-size="listQuery.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import productApi from '@/api/product'
import categoryApi from '@/api/category'

export default {
  name: 'ProductList',
  data() {
    return {
      list: [], // 茶品列表
      total: 0, // 总记录数
      listLoading: true, // 加载状态
      listQuery: { // 查询参数
        page: 1,
        pageSize: 12,
        keyword: '',
        categoryId: ''
      },
      categoryOptions: [], // 香型选项
    }
  },
  created() {
    this.fetchData()
    this.fetchCategories()
  },
  methods: {
    // 获取茶品列表
    fetchData() {
      this.listLoading = true
      
      productApi.getList(this.listQuery)
        .then(response => {
          if (response.code === 0) {
            this.list = response.data.list || []
            this.total = response.data.total || 0
          } else {
            this.$message.error(response.message || '获取茶品列表失败')
          }
          this.listLoading = false
        })
        .catch(error => {
          console.error('获取茶品列表出错:', error)
          this.$message.error('获取数据失败，请稍后重试')
          this.listLoading = false
          
          // 模拟数据
          this.mockProductList()
        })
    },
    
    // 获取香型列表
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
          console.error('获取香型列表出错:', error)
          this.mockCategoryOptions()
        })
    },
    
    // 模拟茶品数据
    mockProductList() {
      this.list = [
        {
          id: 1,
          name: '鸭屎香 特级春茶',
          imageUrl: 'https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=400&h=400&fit=crop',
          categoryName: '鸭屎香',
          description: '银花香浓郁，回甘持久',
          price: 388,
          unit: '500g',
          isHot: true,
          isRecommend: true
        },
        {
          id: 2,
          name: '蜜兰香 老枞',
          imageUrl: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&h=400&fit=crop',
          categoryName: '蜜兰香',
          description: '蜜香浓郁，兰香幽雅',
          price: 268,
          unit: '500g',
          isRecommend: true
        },
        {
          id: 3,
          name: '黄枝香 清香型',
          imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&fit=crop',
          categoryName: '黄枝香',
          description: '栀子花香，清新淡雅',
          price: 198,
          unit: '500g',
          isNew: true
        },
        {
          id: 4,
          name: '桂花香 特级',
          imageUrl: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&h=400&fit=crop',
          categoryName: '桂花香',
          description: '桂花香气，甜润可口',
          price: 328,
          unit: '500g'
        },
        {
          id: 5,
          name: '芝兰香 高山茶',
          imageUrl: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=400&h=400&fit=crop',
          categoryName: '芝兰香',
          description: '芝兰幽香，韵味悠长',
          price: 458,
          unit: '500g',
          isHot: true
        },
        {
          id: 6,
          name: '杏仁香 老枞',
          imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=400&fit=crop',
          categoryName: '杏仁香',
          description: '杏仁果香，醇厚甘滑',
          price: 298,
          unit: '500g'
        }
      ]
      
      this.total = this.list.length
    },
    
    // 模拟香型数据
    mockCategoryOptions() {
      this.categoryOptions = [
        { value: 1, label: '鸭屎香' },
        { value: 2, label: '蜜兰香' },
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
        pageSize: 12,
        keyword: '',
        categoryId: ''
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
    
    // 添加茶品
    handleAdd() {
      this.$router.push('/product/add')
    },
    
    // 编辑茶品
    handleEdit(item) {
      this.$router.push(`/product/edit/${item.id}`)
    },
    
    // 删除茶品
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
            console.error('删除茶品出错:', error)
            this.$message.error('删除失败，请重试')
          })
      }).catch(() => {})
    },
    
    // 香型管理
    handleManageCategories() {
      this.$router.push('/product/category')
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
  
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 24px;
    margin-bottom: 24px;
  }
  
  .product-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(45, 37, 32, 0.06);
    transition: all 0.3s ease;
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(45, 37, 32, 0.12);
      
      .product-overlay {
        opacity: 1;
      }
    }
    
    .product-image-wrapper {
      position: relative;
      padding-top: 100%;
      overflow: hidden;
      background: #f8f6f3;
      
      .product-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
      
      .product-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(45, 37, 32, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .product-tags {
        position: absolute;
        top: 12px;
        left: 12px;
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
    }
    
    .product-info {
      padding: 16px;
      
      .product-name {
        font-size: 15px;
        font-weight: 600;
        color: $teaDark;
        margin: 0 0 8px 0;
        line-height: 1.4;
      }
      
      .product-category {
        font-size: 12px;
        color: $teaLight;
        margin: 0 0 8px 0;
        
        i {
          margin-right: 4px;
        }
      }
      
      .product-desc {
        font-size: 12px;
        color: #999;
        margin: 0 0 12px 0;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .product-meta {
        display: flex;
        align-items: baseline;
        
        .product-price {
          font-size: 18px;
          font-weight: 600;
          color: $teaGold;
          
          small {
            font-size: 12px;
            margin-right: 2px;
          }
        }
        
        .product-unit {
          font-size: 12px;
          color: $teaLight;
          margin-left: 2px;
        }
      }
    }
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