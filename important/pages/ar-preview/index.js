const app = getApp();

Page({
  data: {
    loading: true,
    arReady: false,
    showInstructions: true,
    cameraAuth: false,
    teaware: [
      {
        id: 1,
        name: '紫砂壶',
        description: '宜兴紫砂壶，造型古朴，具有良好的透气性，最适合泡乌龙茶和普洱茶。',
        modelPath: '/models/teapot.gltf',
        thumbnail: '/images/ar/teapot-thumb.jpg',
        scale: 0.5
      },
      {
        id: 2,
        name: '盖碗',
        description: '盖碗是功夫茶的理想器具，由碗、碟、盖三部分组成，适合泡各种茶类。',
        modelPath: '/models/gaiwan.gltf',
        thumbnail: '/images/ar/gaiwan-thumb.jpg',
        scale: 0.4
      },
      {
        id: 3,
        name: '茶杯套装',
        description: '精致的透明玻璃茶杯套装，可以清晰地观察茶汤的颜色和茶叶舒展状态。',
        modelPath: '/models/teacup.gltf',
        thumbnail: '/images/ar/teacup-thumb.jpg',
        scale: 0.3
      },
      {
        id: 4,
        name: '茶盘',
        description: '优质竹木茶盘，蓄水排水功能完善，是茶道必备的基础器具。',
        modelPath: '/models/teatray.gltf',
        thumbnail: '/images/ar/teatray-thumb.jpg',
        scale: 0.7
      }
    ],
    currentTeaware: null,
    showDetails: false
  },

  onLoad: function() {
    this.setData({
      loading: true
    });
    
    // 检查AR能力
    this.checkARAbility();
    
    // 默认选择第一个茶具
    this.setData({
      currentTeaware: this.data.teaware[0]
    });
  },
  
  onShow: function() {
    // 检查相机权限
    this.checkCameraPermission();
  },
  
  // 检查设备AR能力
  checkARAbility: function() {
    if (wx.isVKSupport) {
      const isSupported = wx.isVKSupport('v2');
      console.log('AR能力支持状态:', isSupported);
      
      if (!isSupported) {
        wx.showModal({
          title: '设备不支持AR功能',
          content: '您的设备不支持AR功能，无法使用茶具预览体验。',
          showCancel: false,
          confirmText: '我知道了',
          success: () => {
            wx.navigateBack();
          }
        });
      } else {
        this.setData({
          loading: false
        });
      }
    } else {
      // 兼容旧版本微信
      console.warn('当前微信版本不支持AR能力检测');
      this.setData({
        loading: false
      });
    }
  },
  
  // 检查相机权限
  checkCameraPermission: function() {
    wx.authorize({
      scope: 'scope.camera',
      success: () => {
        this.setData({
          cameraAuth: true
        });
      },
      fail: () => {
        wx.showModal({
          title: '相机权限未授权',
          content: '使用AR功能需要相机权限，是否前往设置？',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting({
                success: (settingRes) => {
                  if (settingRes.authSetting['scope.camera']) {
                    this.setData({
                      cameraAuth: true
                    });
                  }
                }
              });
            } else {
              wx.navigateBack();
            }
          }
        });
      }
    });
  },
  
  // AR场景初始化完成
  onARReady: function(e) {
    console.log('AR场景准备就绪');
    this.setData({
      arReady: true
    });
    
    // 加载当前选择的茶具模型
    this.loadTeawareModel();
  },
  
  // AR场景错误
  onARError: function(e) {
    console.error('AR错误:', e.detail.errorMessage);
    wx.showModal({
      title: 'AR加载失败',
      content: '很抱歉，AR功能加载失败，请检查设备兼容性或重新进入。',
      showCancel: false,
      confirmText: '返回',
      success: () => {
        wx.navigateBack();
      }
    });
  },
  
  // 加载茶具模型
  loadTeawareModel: function() {
    if (!this.data.arReady || !this.data.currentTeaware) return;
    
    const teaware = this.data.currentTeaware;
    
    // 获取AR场景上下文
    const xrScene = wx.getXrFrameSystem().xrScene;
    
    // 清除之前的模型
    if (this.currentModel) {
      xrScene.removeNode(this.currentModel);
    }
    
    // 创建新模型
    const modelNode = xrScene.createNode();
    modelNode.setPosition([0, -0.5, -1]); // 设置模型位置
    modelNode.setScale([teaware.scale, teaware.scale, teaware.scale]); // 设置模型缩放
    
    // 加载模型
    xrScene.loadModel({
      url: teaware.modelPath,
      success: (model) => {
        modelNode.addChild(model);
        this.currentModel = modelNode;
        
        // 显示成功提示
        wx.showToast({
          title: '加载成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('模型加载失败:', err);
        wx.showToast({
          title: '模型加载失败',
          icon: 'none'
        });
      }
    });
  },
  
  // 选择茶具
  selectTeaware: function(e) {
    const id = e.currentTarget.dataset.id;
    const teaware = this.data.teaware.find(item => item.id === id);
    
    if (teaware) {
      this.setData({
        currentTeaware: teaware,
        showDetails: true
      });
      
      // 如果AR场景已就绪，加载新选择的模型
      if (this.data.arReady) {
        this.loadTeawareModel();
      }
    }
  },
  
  // 关闭茶具详情
  closeDetails: function() {
    this.setData({
      showDetails: false
    });
  },
  
  // 关闭使用说明
  closeInstructions: function() {
    this.setData({
      showInstructions: false
    });
  },
  
  // 打开使用说明
  openInstructions: function() {
    this.setData({
      showInstructions: true
    });
  },
  
  // 分享
  onShareAppMessage: function() {
    return {
      title: 'AR茶具体验 - 在家预览精美茶具',
      path: '/important/pages/ar-preview/index',
      imageUrl: '/images/ar/share-image.jpg'
    };
  }
}); 