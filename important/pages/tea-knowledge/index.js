const app = getApp();
const cache = require('../../../utils/cache');

Page({
  data: {
    loading: true,
    currentTab: 0,
    tabs: ['茶叶基础', '茶艺文化', '冲泡技巧', '健康功效'],
    articles: [],
    recommended: [],
    searchKeyword: '',
    windowHeight: 0,
    scrollTop: 0,
    showBackToTop: false
  },

  onLoad: function() {
    // 获取系统信息设置窗口高度
    this.getSystemInfo();
    
    // 加载文章数据
    this.loadArticles();
  },
  
  onShow: function() {
    // 检查登录状态
    if (app.globalData && app.globalData.checkLoginStatus) {
      app.globalData.checkLoginStatus();
    }
    
    // 记录用户访问
    this.recordVisit();
  },
  
  // 获取系统信息
  getSystemInfo: function() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      this.setData({
        windowHeight: systemInfo.windowHeight
      });
    } catch (e) {
      console.error('获取系统信息失败', e);
    }
  },
  
  // 加载文章数据
  loadArticles: function() {
    this.setData({ loading: true });
    
    // 尝试从缓存获取
    const cachedArticles = cache.get('teaKnowledgeArticles');
    if (cachedArticles) {
      this.setData({
        articles: cachedArticles,
        loading: false
      });
      this.getRecommended();
      return;
    }
    
    // 模拟API请求获取文章数据
    setTimeout(() => {
      // 模拟数据
      const articles = [
        // 茶叶基础
        [
          {
            id: 101,
            title: '中国六大茶类详细介绍',
            cover: '/images/knowledge/tea-types.jpg',
            description: '详细介绍绿茶、红茶、白茶、黄茶、青茶和黑茶的特点、产地和代表品种。',
            author: '茶道大师',
            views: 2356,
            likes: 458,
            publishDate: '2025-03-15',
            tags: ['茶类', '基础知识']
          },
          {
            id: 102,
            title: '认识茶叶等级与评价标准',
            cover: '/images/knowledge/tea-grades.jpg',
            description: '解析茶叶的品质等级划分、评价标准和品鉴方法，助您挑选好茶。',
            author: '品茶专家',
            views: 1823,
            likes: 326,
            publishDate: '2025-03-10',
            tags: ['品质', '评价']
          },
          {
            id: 103,
            title: '茶叶保存方法完全指南',
            cover: '/images/knowledge/tea-storage.jpg',
            description: '教您正确保存各类茶叶的方法，延长保质期并保持茶叶的香气和口感。',
            author: '茶艺研究员',
            views: 2689,
            likes: 512,
            publishDate: '2025-03-05',
            tags: ['保存', '存储']
          }
        ],
        // 茶艺文化
        [
          {
            id: 201,
            title: '中国茶道的历史演变',
            cover: '/images/knowledge/tea-history.jpg',
            description: '从唐代陆羽《茶经》到现代茶道，探索中国茶文化的起源与发展。',
            author: '文化学者',
            views: 3021,
            likes: 687,
            publishDate: '2025-02-28',
            tags: ['茶道', '历史']
          },
          {
            id: 202,
            title: '日本茶道与中国茶艺的异同',
            cover: '/images/knowledge/jp-tea.jpg',
            description: '比较中日两国茶文化的差异，了解不同文化背景下的茶道精神。',
            author: '跨文化研究员',
            views: 1756,
            likes: 289,
            publishDate: '2025-02-20',
            tags: ['日本', '文化比较']
          },
          {
            id: 203,
            title: '茶席设计与美学原则',
            cover: '/images/knowledge/tea-table.jpg',
            description: '掌握茶席布置的基本要素和美学原则，打造雅致的品茶环境。',
            author: '茶席设计师',
            views: 1982,
            likes: 345,
            publishDate: '2025-02-15',
            tags: ['茶席', '美学']
          }
        ],
        // 冲泡技巧
        [
          {
            id: 301,
            title: '龙井茶的正确冲泡方法',
            cover: '/images/knowledge/longjing-brewing.jpg',
            description: '详解龙井茶的水温、时间和手法，让您在家也能冲泡出完美口感。',
            author: '冲泡大师',
            views: 4125,
            likes: 876,
            publishDate: '2025-01-28',
            tags: ['龙井', '冲泡']
          },
          {
            id: 302,
            title: '功夫茶道详细图解',
            cover: '/images/knowledge/gongfu-tea.jpg',
            description: '一步步图解功夫茶的完整流程，从温杯到出汤的每个细节。',
            author: '茶艺师',
            views: 3567,
            likes: 723,
            publishDate: '2025-01-20',
            tags: ['功夫茶', '图解']
          },
          {
            id: 303,
            title: '如何冲泡普洱生茶与熟茶',
            cover: '/images/knowledge/puer-brewing.jpg',
            description: '解析普洱生茶与熟茶的冲泡差异，掌握获取最佳风味的技巧。',
            author: '普洱专家',
            views: 2854,
            likes: 562,
            publishDate: '2025-01-15',
            tags: ['普洱', '技巧']
          }
        ],
        // 健康功效
        [
          {
            id: 401,
            title: '茶多酚的健康益处',
            cover: '/images/knowledge/tea-health.jpg',
            description: '科学解读茶多酚的抗氧化作用及其对心血管健康的积极影响。',
            author: '营养学博士',
            views: 3698,
            likes: 842,
            publishDate: '2024-12-28',
            tags: ['健康', '茶多酚']
          },
          {
            id: 402,
            title: '不同茶类的药理功效对比',
            cover: '/images/knowledge/tea-medicine.jpg',
            description: '对比六大茶类的不同药理作用，根据体质选择适合的茶饮。',
            author: '中医药理研究员',
            views: 2932,
            likes: 615,
            publishDate: '2024-12-20',
            tags: ['药理', '功效']
          },
          {
            id: 403,
            title: '茶与睡眠：科学饮茶时间',
            cover: '/images/knowledge/tea-sleep.jpg',
            description: '分析茶叶中咖啡因的含量及代谢时间，科学安排饮茶时间不影响睡眠。',
            author: '睡眠专家',
            views: 3241,
            likes: 712,
            publishDate: '2024-12-15',
            tags: ['睡眠', '咖啡因']
          }
        ]
      ];
      
      // 设置数据并缓存
      this.setData({
        articles: articles,
        loading: false
      });
      
      // 缓存数据，有效期2小时
      cache.set('teaKnowledgeArticles', articles, 2 * 60 * 60);
      
      // 获取推荐文章
      this.getRecommended();
      
    }, 800);
  },
  
  // 获取推荐文章
  getRecommended: function() {
    // 从所有分类中选取高点击量的文章作为推荐
    let allArticles = [];
    this.data.articles.forEach(category => {
      allArticles = allArticles.concat(category);
    });
    
    // 按浏览量排序，取前3篇
    allArticles.sort((a, b) => b.views - a.views);
    const recommended = allArticles.slice(0, 3);
    
    this.setData({ recommended });
  },
  
  // 切换标签页
  switchTab: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index
    });
  },
  
  // 搜索文章
  searchArticles: function(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
    
    if (!keyword) return;
    
    wx.navigateTo({
      url: `/important/pages/tea-knowledge/search?keyword=${encodeURIComponent(keyword)}`
    });
  },
  
  // 查看文章详情
  viewArticle: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/important/pages/tea-knowledge/detail?id=${id}`
    });
  },
  
  // 记录用户访问
  recordVisit: function() {
    // 可以发送请求记录用户访问数据
    console.log('用户访问茶叶知识页面');
  },
  
  // 页面滚动事件
  onPageScroll: function(e) {
    // 显示/隐藏回到顶部按钮
    if (e.scrollTop > 200 && !this.data.showBackToTop) {
      this.setData({
        showBackToTop: true
      });
    } else if (e.scrollTop <= 200 && this.data.showBackToTop) {
      this.setData({
        showBackToTop: false
      });
    }
    
    this.setData({
      scrollTop: e.scrollTop
    });
  },
  
  // 返回顶部
  backToTop: function() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  },
  
  // 分享功能
  onShareAppMessage: function() {
    return {
      title: '茶叶知识百科 - 探索茶的世界',
      path: '/important/pages/tea-knowledge/index',
      imageUrl: '/images/knowledge/share-cover.jpg'
    };
  }
}); 