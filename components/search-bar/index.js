Component({
  properties: {
    placeholder: {
      type: String,
      value: '搜索'
    },
    value: {
      type: String,
      value: '',
      observer: function(newVal) {
        this.setData({
          inputValue: newVal
        });
      }
    },
    focus: {
      type: Boolean,
      value: false
    },
    bgColor: {
      type: String,
      value: 'rgba(255, 255, 255, 0.8)'
    },
    borderRadius: {
      type: String,
      value: '99rpx'
    },
    height: {
      type: String,
      value: '72rpx'
    },
    showCancel: {
      type: Boolean,
      value: false
    }
  },
  data: {
    inputValue: '',
    isFocus: false
  },
  lifetimes: {
    attached() {
      this.setData({
        inputValue: this.properties.value,
        isFocus: this.properties.focus
      });
    }
  },
  methods: {
    onInput(e) {
      const value = e.detail.value;
      this.setData({
        inputValue: value
      });
      this.triggerEvent('input', { value });
    },
    onFocus(e) {
      this.setData({
        isFocus: true
      });
      this.triggerEvent('focus', e.detail);
    },
    onBlur(e) {
      this.setData({
        isFocus: false
      });
      this.triggerEvent('blur', e.detail);
    },
    onConfirm(e) {
      this.triggerEvent('search', { value: this.data.inputValue });
      this.triggerEvent('confirm', e.detail);
    },
    onClear() {
      this.setData({
        inputValue: ''
      });
      this.triggerEvent('clear');
      this.triggerEvent('input', { value: '' });
      
      // 聚焦输入框
      const inputComponent = this.selectComponent('#search-input');
      if (inputComponent) {
        inputComponent.focus();
      }
    },
    onCancel() {
      this.setData({
        inputValue: '',
        isFocus: false
      });
      this.triggerEvent('cancel');
    },
    onTap() {
      this.triggerEvent('click');
    },
    // 添加涟漪效果
    onTapWithRipple(e) {
      // 获取点击位置相对于按钮的坐标
      const { x, y } = e.detail;
      const query = this.createSelectorQuery();
      query.select('.search-bar').boundingClientRect();
      query.exec((res) => {
        if (!res[0]) return;
        
        const buttonRect = res[0];
        const rippleX = x - buttonRect.left;
        const rippleY = y - buttonRect.top;
        
        // 创建涟漪效果
        this.setData({
          rippleStyle: `left: ${rippleX}px; top: ${rippleY}px;`,
          showRipple: true
        });
        
        // 涟漪动画结束后隐藏
        setTimeout(() => {
          this.setData({
            showRipple: false
          });
        }, 600);
      });
      
      this.onTap();
    }
  }
}); 