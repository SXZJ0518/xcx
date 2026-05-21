// pages/search/search.js
const api = require('../../utils/api');

Page({
  data: {
    keyword: '',
    searchResults: [],
    historyList: [],
    showHistory: true,
    isLoading: false,
    pageNo: 1,
    pageSize: 10,
    hasMore: true
  },

  onLoad(options) {
    this.getHistorySearch();
  },

  onPullDownRefresh() {
    if (this.data.keyword) {
      this.setData({
        pageNo: 1,
        hasMore: true,
        searchResults: []
      });
      this.fetchSearchResults(this.data.keyword);
    } else {
      wx.stopPullDownRefresh();
    }
  },

  onReachBottom() {
    if (this.data.keyword && this.data.hasMore) {
      this.fetchSearchResults(this.data.keyword);
    }
  },

  onShareAppMessage() {
    return {
      title: '凤凰单枞 · 一丛一味 百丛百香',
      path: '/pages/index/index'
    }
  },

  // 获取历史搜索
  getHistorySearch: function() {
    const historyList = wx.getStorageSync('searchHistory') || [];
    this.setData({ historyList });
  },

  // 输入关键词
  inputKeyword: function(e) {
    this.setData({
      keyword: e.detail.value
    });
  },

  // 清空输入框
  clearInput: function() {
    this.setData({
      keyword: '',
      searchResults: [],
      showHistory: true
    });
  },

  // 点击搜索按钮
  search: function() {
    const keyword = this.data.keyword.trim();
    if (!keyword) {
      return;
    }
    this.saveSearchHistory(keyword);
    this.setData({
      pageNo: 1,
      hasMore: true,
      searchResults: []
    });
    this.fetchSearchResults(keyword);
  },

  // 保存搜索历史
  saveSearchHistory: function(keyword) {
    let historyList = wx.getStorageSync('searchHistory') || [];
    historyList = historyList.filter(item => item !== keyword);
    historyList.unshift(keyword);
    if (historyList.length > 10) {
      historyList = historyList.slice(0, 10);
    }
    wx.setStorageSync('searchHistory', historyList);
    this.setData({ historyList });
  },

  // 点击历史记录
  clickSearch: function(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({
      keyword,
      pageNo: 1,
      hasMore: true,
      searchResults: [],
      showHistory: false
    });
    this.fetchSearchResults(keyword);
  },

  // 清空历史记录
  clearHistory: function() {
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确定要清空搜索历史吗？',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('searchHistory');
          that.setData({ historyList: [] });
        }
      }
    });
  },

  // 获取搜索结果
  fetchSearchResults: async function(keyword) {
    if (!this.data.hasMore || this.data.isLoading) {
      return;
    }

    this.setData({
      isLoading: true,
      showHistory: false
    });

    try {
      const res = await api.searchProducts({
        keyword: keyword,
        page: this.data.pageNo,
        pageSize: this.data.pageSize
      });
      const data = res.data || {};
      const newResults = data.list || [];

      this.setData({
        searchResults: [...this.data.searchResults, ...newResults],
        hasMore: newResults.length >= this.data.pageSize,
        pageNo: this.data.pageNo + 1,
        isLoading: false
      });
    } catch (error) {
      console.error('搜索失败:', error);
      wx.showToast({
        title: '搜索失败，请重试',
        icon: 'none'
      });
      this.setData({ isLoading: false });
    } finally {
      wx.stopPullDownRefresh();
    }
  },

  // 跳转到商品详情
  navigateToDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product/detail/detail?id=${id}`
    });
  }
})
