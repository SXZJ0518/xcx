<template>
  <div class="login-container">
    <div class="login-decoration">
      <div class="zen-circle"></div>
      <div class="zen-line"></div>
    </div>
    
    <div class="login-form-wrapper">
      <div class="brand-section">
        <div class="brand-icon">
          <i class="el-icon-mug"></i>
        </div>
        <h1 class="brand-title">凤凰单枞</h1>
        <p class="brand-subtitle">茶品展示管理系统</p>
      </div>
      
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on">
        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          >
            <i slot="prefix" class="el-icon-user"></i>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            ref="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            name="password"
            :type="passwordVisible ? 'text' : 'password'"
            tabindex="2"
            autocomplete="on"
            @keyup.enter.native="handleLogin"
          >
            <i slot="prefix" class="el-icon-lock"></i>
            <i 
              slot="suffix" 
              :class="passwordVisible ? 'el-icon-view' : 'el-icon-hide'"
              @click="passwordVisible = !passwordVisible"
              style="cursor: pointer;"
            ></i>
          </el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            :loading="loading" 
            type="primary" 
            class="login-button" 
            @click.native.prevent="handleLogin"
          >
            <i class="el-icon-right"></i> 进入茶室
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-footer">
        <span class="zen-quote">茶禅一味 · 静心品茗</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value || value.trim() === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value || value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    
    return {
      loginForm: {
        username: 'admin',
        password: 'admin123'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordVisible: false,
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('user', ['login']),
    
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.login(this.loginForm)
            .then(() => {
              this.$message.success('欢迎回来')
              
              // 跳转到首页或重定向的页面
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(error => {
              this.$message.error(error.message || '登录失败，请重试')
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$teaGold: #c9a86c;
$teaDark: #2d2520;
$teaLight: #a89b8c;
$paper: #f5f0e8;

.login-container {
  min-height: 100%;
  width: 100%;
  background: linear-gradient(135deg, #f5f0e8 0%, #ebe4d6 50%, #f8f4ed 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  .login-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    overflow: hidden;
    
    .zen-circle {
      position: absolute;
      width: 600px;
      height: 600px;
      border: 1px solid rgba(201, 168, 108, 0.15);
      border-radius: 50%;
      top: -200px;
      right: -200px;
    }
    
    .zen-line {
      position: absolute;
      width: 1px;
      height: 300px;
      background: linear-gradient(180deg, transparent 0%, rgba(201, 168, 108, 0.2) 50%, transparent 100%);
      left: 30%;
      top: 20%;
    }
  }
  
  .login-form-wrapper {
    width: 420px;
    padding: 50px 45px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    box-shadow: 
      0 20px 60px rgba(45, 37, 32, 0.1),
      0 8px 25px rgba(45, 37, 32, 0.05);
    position: relative;
    backdrop-filter: blur(10px);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, $teaGold 0%, #d4b87a 100%);
      border-radius: 16px 16px 0 0;
    }
    
    .brand-section {
      text-align: center;
      margin-bottom: 40px;
      
      .brand-icon {
        width: 64px;
        height: 64px;
        background: linear-gradient(135deg, $teaGold 0%, #d4b87a 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        box-shadow: 0 4px 15px rgba(201, 168, 108, 0.3);
        
        i {
          font-size: 28px;
          color: #fff;
        }
      }
      
      .brand-title {
        font-size: 28px;
        color: $teaDark;
        margin: 0 0 8px 0;
        font-weight: 600;
        letter-spacing: 4px;
        font-family: 'STSong', 'SimSun', serif;
      }
      
      .brand-subtitle {
        font-size: 14px;
        color: $teaLight;
        margin: 0;
        letter-spacing: 2px;
      }
    }
    
    .login-form {
      ::v-deep .el-input__inner {
        height: 48px;
        line-height: 48px;
        border-radius: 8px;
        border: 1px solid #e0d8cc;
        background: #faf8f5;
        padding-left: 45px;
        font-size: 14px;
        transition: all 0.3s;
        
        &:focus {
          border-color: $teaGold;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(201, 168, 108, 0.1);
        }
        
        &::placeholder {
          color: #b8b0a4;
        }
      }
      
      ::v-deep .el-input__prefix {
        left: 15px;
        
        i {
          font-size: 16px;
          color: $teaLight;
          line-height: 48px;
        }
      }
      
      ::v-deep .el-input__suffix {
        right: 15px;
        
        i {
          font-size: 14px;
          color: $teaLight;
          line-height: 48px;
        }
      }
      
      .login-button {
        width: 100%;
        height: 48px;
        margin-top: 15px;
        border-radius: 8px;
        font-size: 16px;
        letter-spacing: 2px;
        background: linear-gradient(135deg, $teaGold 0%, #b8995a 100%);
        border: none;
        box-shadow: 0 4px 15px rgba(201, 168, 108, 0.3);
        transition: all 0.3s;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(201, 168, 108, 0.4);
        }
        
        &:active {
          transform: translateY(0);
        }
        
        i {
          margin-right: 6px;
        }
      }
    }
    
    .login-footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 25px;
      border-top: 1px solid #f0ebe3;
      
      .zen-quote {
        font-size: 12px;
        color: $teaLight;
        letter-spacing: 3px;
        font-family: 'STSong', 'SimSun', serif;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .login-container {
    padding: 20px;
    
    .login-form-wrapper {
      width: 100%;
      max-width: 360px;
      padding: 40px 30px;
    }
  }
}
</style>