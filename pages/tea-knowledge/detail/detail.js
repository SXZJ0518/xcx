/**
 * 茶知识详情页
 */
const api = require('../../../utils/api')
const Mock = require('../../../utils/wx.mock')

Page({
  data: {
    article: null,
    loading: true
  },

  onLoad(options) {
    const id = options.id
    if (id) {
      this.loadArticle(id)
    } else {
      this.setData({ loading: false })
    }
  },

  /**
   * 加载文章详情
   */
  async loadArticle(id) {
    this.setData({ loading: true })
    try {
      const list = await api.getKnowledgeList()
      const articles = (list && list.list) || []
      const article = articles.find(item => item.id === id) || null

      if (article) {
        wx.setNavigationBarTitle({ title: article.title || '茶知识' })
      }

      this.setData({ article, loading: false })
    } catch (err) {
      console.error('加载文章失败:', err)
      // 降级使用 mock
      const article = Mock.mockKnowledge.find(item => item.id === id) || null
      if (article) {
        wx.setNavigationBarTitle({ title: article.title || '茶知识' })
      }
      this.setData({ article, loading: false })
    }
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/discover/discover' }) })
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    const { article } = this.data
    return {
      title: article ? article.title : '茶知识',
      path: `/pages/tea-knowledge/detail/detail?id=${article ? article.id : ''}`
    }
  }
})
