<template>
  <div class="dashboard-container">
    <!-- 欢迎区 -->
    <div class="welcome-section">
      <h1 class="welcome-title">凤凰单枞管理后台</h1>
      <p class="welcome-desc">一丛一味 · 百丛百香</p>
    </div>

    <!-- 数据概览 -->
    <el-row :gutter="20" class="data-overview">
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon icon-product">
            <i class="el-icon-goods"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.productCount }}</div>
            <div class="stat-label">茶品数量</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon icon-category">
            <i class="el-icon-menu"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.categoryCount }}</div>
            <div class="stat-label">香型分类</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon icon-knowledge">
            <i class="el-icon-reading"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.knowledgeCount }}</div>
            <div class="stat-label">茶知识文章</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon icon-views">
            <i class="el-icon-view"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.viewCount }}</div>
            <div class="stat-label">今日浏览</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 快捷入口 -->
    <el-row :gutter="20" class="quick-actions">
      <el-col :span="24">
        <el-card class="action-card">
          <div slot="header" class="card-header">
            <span>快捷入口</span>
          </div>
          <div class="action-list">
            <div class="action-item" @click="goTo('/product/detail')">
              <div class="action-icon icon-add">
                <i class="el-icon-plus"></i>
              </div>
              <div class="action-text">
                <div class="action-title">商品管理</div>
                <div class="action-desc">管理单枞茶商品</div>
              </div>
            </div>
            <div class="action-item" @click="goTo('/aroma/index')">
              <div class="action-icon icon-category">
                <i class="el-icon-menu"></i>
              </div>
              <div class="action-text">
                <div class="action-title">香型管理</div>
                <div class="action-desc">管理十大香型分类</div>
              </div>
            </div>
            <div class="action-item" @click="goTo('/knowledge/detail')">
              <div class="action-icon icon-knowledge">
                <i class="el-icon-document"></i>
              </div>
              <div class="action-text">
                <div class="action-title">文章管理</div>
                <div class="action-desc">茶知识内容管理</div>
              </div>
            </div>
            <div class="action-item" @click="goTo('/settings/index')">
              <div class="action-icon icon-contact">
                <i class="el-icon-phone"></i>
              </div>
              <div class="action-text">
                <div class="action-title">站点设置</div>
                <div class="action-desc">品牌信息、联系方式、轮播图</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近更新 -->
    <el-row :gutter="20" class="recent-section">
      <el-col :xs="24" :md="12">
        <el-card class="recent-card">
          <div slot="header" class="card-header">
            <span>最近添加的茶品</span>
            <el-button type="text" @click="goTo('/product/index')">查看全部</el-button>
          </div>
          <div class="recent-list">
            <div v-if="recentProducts.length === 0" class="empty-text">暂无茶品</div>
            <div v-else class="recent-item" v-for="item in recentProducts" :key="item.id" @click="goTo('/product/detail?id=' + item.id)">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-meta">
                <span class="item-price">¥{{ item.price }}</span>
                <span class="item-time">{{ formatTime(item.createTime) }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card class="recent-card">
          <div slot="header" class="card-header">
            <span>最近发布的文章</span>
            <el-button type="text" @click="goTo('/knowledge/detail')">查看全部</el-button>
          </div>
          <div class="recent-list">
            <div v-if="recentKnowledge.length === 0" class="empty-text">暂无文章</div>
            <div v-else class="recent-item" v-for="item in recentKnowledge" :key="item.id" @click="goTo('/knowledge/detail?id=' + item.id)">
              <div class="item-name">{{ item.title }}</div>
              <div class="item-meta">
                <span class="item-category">{{ item.category }}</span>
                <span class="item-time">{{ formatTime(item.createTime) }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import request from '@/api'

export default {
  name: 'Dashboard',
  data() {
    return {
      stats: {
        productCount: 0,
        categoryCount: 10,
        knowledgeCount: 0,
        viewCount: 0
      },
      recentProducts: [],
      recentKnowledge: []
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        // 获取统计数据
        const productRes = await request({ url: '/api/admin/products/count', method: 'get' }).catch(() => ({ data: { count: 0 } }))
        const knowledgeRes = await request({ url: '/api/admin/knowledge/count', method: 'get' }).catch(() => ({ data: { count: 0 } }))
        
        this.stats.productCount = (productRes.data && productRes.data.count) || 0
        this.stats.knowledgeCount = (knowledgeRes.data && knowledgeRes.data.count) || 0
        this.stats.viewCount = Math.floor(Math.random() * 100) + 50 // 模拟今日浏览
        
        // 获取最近数据
        const productsRes = await request({ url: '/api/admin/products', method: 'get', params: { page: 1, pageSize: 5 } }).catch(() => ({ data: { list: [] } }))
        const knowledgeListRes = await request({ url: '/api/admin/knowledge', method: 'get', params: { page: 1, pageSize: 5 } }).catch(() => ({ data: { list: [] } }))
        
        this.recentProducts = (productsRes.data && productsRes.data.list && productsRes.data.list.slice(0, 5)) || []
        this.recentKnowledge = (knowledgeListRes.data && knowledgeListRes.data.list && knowledgeListRes.data.list.slice(0, 5)) || []
      } catch (error) {
        console.error('加载数据失败:', error)
      }
    },
    goTo(path) {
      this.$router.push(path)
    },
    formatTime(time) {
      if (!time) return '-'
      const date = new Date(time)
      return (date.getMonth() + 1) + '/' + date.getDate()
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  
  .welcome-section {
    text-align: center;
    padding: 30px 0;
    margin-bottom: 20px;
    
    .welcome-title {
      font-size: 28px;
      font-weight: 500;
      color: #2d2520;
      margin-bottom: 10px;
      letter-spacing: 4px;
    }
    
    .welcome-desc {
      font-size: 16px;
      color: #8b7355;
      letter-spacing: 2px;
    }
  }
  
  .data-overview {
    margin-bottom: 20px;
    
    .stat-card {
      display: flex;
      align-items: center;
      padding: 24px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      transition: transform 0.3s;
      
      &:hover {
        transform: translateY(-2px);
      }
      
      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        
        i {
          font-size: 28px;
          color: #fff;
        }
        
        &.icon-product {
          background: linear-gradient(135deg, #c9a86c, #a08050);
        }
        
        &.icon-category {
          background: linear-gradient(135deg, #5b9cf5, #3d7dd8);
        }
        
        &.icon-knowledge {
          background: linear-gradient(135deg, #67c23a, #4a9c2a);
        }
        
        &.icon-views {
          background: linear-gradient(135deg, #e6a23c, #c9821c);
        }
      }
      
      .stat-info {
        .stat-value {
          font-size: 32px;
          font-weight: 600;
          color: #2d2520;
          line-height: 1;
          margin-bottom: 6px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #8b7355;
        }
      }
    }
  }
  
  .quick-actions {
    margin-bottom: 20px;
    
    .action-card {
      .card-header {
        font-size: 16px;
        font-weight: 500;
        color: #2d2520;
      }
      
      .action-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
        
        .action-item {
          display: flex;
          align-items: center;
          padding: 20px;
          background: #f9f7f4;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          
          &:hover {
            background: #f0ebe0;
            transform: translateX(4px);
          }
          
          .action-icon {
            width: 48px;
            height: 48px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16px;
            
            i {
              font-size: 24px;
              color: #fff;
            }
            
            &.icon-add {
              background: #c9a86c;
            }
            
            &.icon-category {
              background: #5b9cf5;
            }
            
            &.icon-knowledge {
              background: #67c23a;
            }
            
            &.icon-contact {
              background: #e6a23c;
            }
          }
          
          .action-text {
            .action-title {
              font-size: 16px;
              font-weight: 500;
              color: #2d2520;
              margin-bottom: 4px;
            }
            
            .action-desc {
              font-size: 13px;
              color: #8b7355;
            }
          }
        }
      }
    }
  }
  
  .recent-section {
    .recent-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        span {
          font-size: 16px;
          font-weight: 500;
          color: #2d2520;
        }
      }
      
      .recent-list {
        .empty-text {
          text-align: center;
          padding: 40px 0;
          color: #8b7355;
        }
        
        .recent-item {
          padding: 16px 0;
          border-bottom: 1px solid #f0ebe0;
          cursor: pointer;
          transition: background 0.2s;
          
          &:last-child {
            border-bottom: none;
          }
          
          &:hover {
            background: #f9f7f4;
            margin: 0 -20px;
            padding: 16px 20px;
          }
          
          .item-name {
            font-size: 15px;
            color: #2d2520;
            margin-bottom: 6px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .item-meta {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            
            .item-price {
              color: #b8860b;
              font-weight: 500;
            }
            
            .item-category {
              color: #5b9cf5;
            }
            
            .item-time {
              color: #a09080;
            }
          }
        }
      }
    }
  }
}
</style>
