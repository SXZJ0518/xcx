Component({
  properties: {
    src: {
      type: String,
      value: ''
    },
    autoplay: {
      type: Boolean,
      value: true
    },
    loop: {
      type: Boolean,
      value: true
    },
    speed: {
      type: Number,
      value: 1
    },
    width: {
      type: String,
      value: '100%'
    },
    height: {
      type: String,
      value: '100%'
    }
  },
  data: {
    animationData: null,
    isPlaying: false,
    animationInstance: null
  },
  lifetimes: {
    attached() {
      if (this.data.autoplay) {
        this.play();
      }
    },
    detached() {
      this.destroy();
    }
  },
  methods: {
    play() {
      // 如果没有设置动画源则退出
      if (!this.data.src) {
        console.warn('No animation source provided for lottie component');
        return;
      }

      // 加载动画数据
      this.loadAnimation();
    },
    stop() {
      if (this.data.animationInstance) {
        this.data.animationInstance.stop();
        this.setData({
          isPlaying: false
        });
      }
    },
    pause() {
      if (this.data.animationInstance) {
        this.data.animationInstance.pause();
        this.setData({
          isPlaying: false
        });
      }
    },
    resume() {
      if (this.data.animationInstance) {
        this.data.animationInstance.play();
        this.setData({
          isPlaying: true
        });
      }
    },
    destroy() {
      if (this.data.animationInstance) {
        this.data.animationInstance.destroy();
        this.setData({
          animationInstance: null,
          isPlaying: false
        });
      }
    },
    loadAnimation() {
      // 这里模拟Lottie动画加载
      // 在实际项目中，需要引入lottie-miniprogram库
      // 由于微信小程序限制，这里我们使用canvas来模拟动画效果
      
      this.createParticleEffect();
      
      // 标记为播放中
      this.setData({
        isPlaying: true
      });
    },
    createParticleEffect() {
      // 创建茶叶飘落粒子效果
      // 实际项目中使用真正的lottie库替代
      this.triggerEvent('ready', {});
      
      // 获取canvas上下文
      const query = this.createSelectorQuery();
      query.select('#lottie-canvas').fields({ node: true, size: true }).exec((res) => {
        if (!res[0] || !res[0].node) return;
        
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        
        // 设置canvas大小
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);
        
        // 创建粒子系统
        this.createTeaLeafParticles(canvas, ctx);
      });
    },
    createTeaLeafParticles(canvas, ctx) {
      const width = canvas.width;
      const height = canvas.height;
      const particles = [];
      const particleCount = 20;
      
      // 茶叶粒子颜色
      const colors = ['#2A5D3E', '#4A7C3E', '#8BAF4C', '#D4AF37'];
      
      // 创建粒子
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 10 + 5,
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 1 + 0.5,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 2 - 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.6 + 0.2
        });
      }
      
      // 动画循环
      const animate = () => {
        if (!this.data.isPlaying) return;
        
        ctx.clearRect(0, 0, width, height);
        
        // 更新和绘制粒子
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          
          // 更新位置
          p.x += p.speedX;
          p.y += p.speedY;
          p.rotation += p.rotationSpeed;
          
          // 如果粒子超出边界，重置位置
          if (p.y > height) {
            p.y = -p.size;
            p.x = Math.random() * width;
          }
          
          // 边界检查
          if (p.x < -p.size) p.x = width + p.size;
          if (p.x > width + p.size) p.x = -p.size;
          
          // 绘制茶叶形状
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          
          // 绘制茶叶
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, 2 * Math.PI);
          ctx.fill();
          
          // 添加茶叶纹理
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-p.size / 2, 0);
          ctx.lineTo(p.size / 2, 0);
          ctx.stroke();
          
          ctx.restore();
        }
        
        // 继续下一帧
        this.animationFrame = canvas.requestAnimationFrame(animate);
      };
      
      // 开始动画
      this.animationFrame = canvas.requestAnimationFrame(animate);
      
      // 保存引用以便清理
      this.setData({
        animationInstance: {
          stop: () => {
            if (this.animationFrame) {
              canvas.cancelAnimationFrame(this.animationFrame);
              this.animationFrame = null;
            }
          },
          play: () => {
            if (!this.animationFrame) {
              this.animationFrame = canvas.requestAnimationFrame(animate);
            }
          },
          pause: () => {
            if (this.animationFrame) {
              canvas.cancelAnimationFrame(this.animationFrame);
              this.animationFrame = null;
            }
          },
          destroy: () => {
            if (this.animationFrame) {
              canvas.cancelAnimationFrame(this.animationFrame);
              this.animationFrame = null;
            }
          }
        }
      });
    }
  }
}); 