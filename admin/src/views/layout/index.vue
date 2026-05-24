<template>
  <div class="app-wrapper" :class="{ 'mobile': device === 'mobile', 'hide-sidebar': !sidebar.opened }">
    <div class="sidebar-container">
      <div class="logo-container">
        <div class="logo-icon">
          <i class="el-icon-mug"></i>
        </div>
        <h1 class="sidebar-title">凤凰单枞</h1>
        <span class="sidebar-subtitle">茶品展示管理</span>
      </div>
      
      <div class="sidebar-menu-wrap">
        <el-menu
          :default-active="activeMenu"
          :collapse="!sidebar.opened"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :active-text-color="variables.menuActiveText"
          :unique-opened="false"
          :collapse-transition="false"
          mode="vertical"
        >
          <sidebar-item
            v-for="route in routes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
          />
        </el-menu>
      </div>
      
      <div class="sidebar-footer">
        <div class="zen-quote">
          <i class="el-icon-sunny"></i>
          <span>茶禅一味</span>
        </div>
      </div>
    </div>
    
    <div class="main-container">
      <div class="navbar">
        <hamburger 
          :is-active="sidebar.opened" 
          class="hamburger-container" 
          @toggleClick="toggleSideBar" 
        />
        
        <breadcrumb class="breadcrumb-container" />
        
        <div class="right-menu">
          <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
              <div class="user-info">
                <span class="user-name">{{ userName }}</span>
                <i class="el-icon-arrow-down" />
              </div>
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
              <el-dropdown-item @click.native="handleLogout">
                <span style="display:block;">
                  <i class="el-icon-switch-button"></i> 退出登录
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      
      <div class="app-main">
        <transition name="fade-transform" mode="out-in">
          <router-view />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import Hamburger from './components/Hamburger'
import Breadcrumb from './components/Breadcrumb'
import SidebarItem from './components/SidebarItem'

export default {
  name: 'Layout',
  components: {
    Hamburger,
    Breadcrumb,
    SidebarItem
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    ...mapState('user', { userName: state => state.userInfo && state.userInfo.name ? state.userInfo.name : '管理员' }),
    routes() {
      return this.$router.options.routes.filter(route => {
        return !route.hidden && 
               route.path !== '/login' && 
               route.path !== '/404' && 
               route.path !== '/profile' &&
               route.path !== '/'
      })
    },
    activeMenu() {
      const { meta, path } = this.$route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    variables() {
      return {
        menuBg: '#2d2520',
        menuText: '#a89b8c',
        menuActiveText: '#c9a86c'
      }
    },
    device() {
      return this.$store.state.app.device
    }
  },
  methods: {
    ...mapActions('app', ['toggleSideBar']),
    ...mapActions('user', ['logout']),
    
    async handleLogout() {
      await this.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
$sideBarWidth: 220px;
$teaGold: #c9a86c;
$teaDark: #2d2520;
$teaLight: #a89b8c;
$paper: #f5f0e8;

.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  
  &.mobile.hide-sidebar {
    .sidebar-container {
      transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }
}

.sidebar-container {
  width: $sideBarWidth;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  transition: width 0.28s;
  background: linear-gradient(180deg, #2d2520 0%, #3d3530 100%);
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  
  .logo-container {
    height: 80px;
    background: rgba(0, 0, 0, 0.2);
    text-align: center;
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-bottom: 1px solid rgba(201, 168, 108, 0.1);
    
    .logo-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, $teaGold 0%, #d4b87a 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 6px;
      box-shadow: 0 2px 8px rgba(201, 168, 108, 0.3);
      
      i {
        font-size: 18px;
        color: #2d2520;
      }
    }
    
    .sidebar-title {
      margin: 0;
      color: $teaGold;
      font-weight: 600;
      font-size: 16px;
      letter-spacing: 2px;
      font-family: 'STSong', 'SimSun', serif;
    }
    
    .sidebar-subtitle {
      color: $teaLight;
      font-size: 11px;
      margin-top: 2px;
      letter-spacing: 1px;
    }
  }
  
  .sidebar-menu-wrap {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 12px 0;

    ::v-deep .el-menu {
      border-right: none;
      background: transparent;
    }

    ::v-deep .el-menu-item {
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
      padding-left: 20px !important;
      height: 48px;
      line-height: 48px;
      margin: 4px 12px;
      border-radius: 0 8px 8px 0;

      &:hover {
        background: rgba(201, 168, 108, 0.1) !important;
        color: $teaGold !important;
        border-left-color: rgba(201, 168, 108, 0.5);
      }

      &.is-active {
        color: $teaGold !important;
        background: rgba(201, 168, 108, 0.15) !important;
        border-left-color: $teaGold;
        font-weight: 500;
      }

      i {
        color: inherit;
        margin-right: 10px;
        font-size: 16px;
      }
      
      span {
        font-size: 14px;
      }
    }

    ::v-deep .el-submenu {
      .el-submenu__title {
        transition: all 0.3s ease;
        border-left: 3px solid transparent;
        padding-left: 20px !important;
        height: 48px;
        line-height: 48px;
        margin: 4px 12px;
        border-radius: 0 8px 8px 0;

        &:hover {
          background: rgba(201, 168, 108, 0.1) !important;
          color: $teaGold !important;
        }

        i {
          color: inherit;
          margin-right: 10px;
          font-size: 16px;
        }
      }

      &.is-active .el-submenu__title {
        color: $teaGold !important;
        border-left-color: $teaGold;
      }

      .el-menu {
        background: rgba(0, 0, 0, 0.15) !important;

        .el-menu-item {
          padding-left: 52px !important;
          margin: 2px 12px;
          height: 42px;
          line-height: 42px;

          &:hover {
            background: rgba(201, 168, 108, 0.08) !important;
          }

          &.is-active {
            color: $teaGold !important;
            background: rgba(201, 168, 108, 0.12) !important;
            border-left-color: rgba(201, 168, 108, 0.7);
          }
        }
      }
    }
  }
  
  .sidebar-footer {
    padding: 16px;
    border-top: 1px solid rgba(201, 168, 108, 0.1);
    flex-shrink: 0;
    
    .zen-quote {
      display: flex;
      align-items: center;
      justify-content: center;
      color: $teaLight;
      font-size: 12px;
      opacity: 0.7;
      
      i {
        margin-right: 6px;
        color: $teaGold;
      }
      
      span {
        letter-spacing: 2px;
        font-family: 'STSong', 'SimSun', serif;
      }
    }
  }
}

.hide-sidebar .sidebar-container {
  width: 64px !important;
  
  .logo-container {
    padding: 12px 0;
    
    .logo-icon {
      margin-bottom: 0;
    }
    
    .sidebar-title,
    .sidebar-subtitle {
      display: none;
    }
  }
  
  .sidebar-footer {
    .zen-quote span {
      display: none;
    }
  }
}

.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sideBarWidth;
  position: relative;
}

.hide-sidebar .main-container {
  margin-left: 64px;
}

.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(90deg, #fff 0%, #faf8f5 100%);
  box-shadow: 0 2px 12px rgba(45, 37, 32, 0.06);
  border-bottom: 1px solid rgba(201, 168, 108, 0.1);
  
  .hamburger-container {
    line-height: 60px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    color: $teaDark;
    
    &:hover {
      background: rgba(201, 168, 108, 0.08);
    }
  }
  
  .breadcrumb-container {
    float: left;
    margin-left: 20px;
    line-height: 60px;
  }
  
  .right-menu {
    float: right;
    height: 100%;
    line-height: 60px;
    margin-right: 20px;
    
    &:focus {
      outline: none;
    }
    
    .avatar-container {
      margin-right: 20px;
      
      .avatar-wrapper {
        position: relative;
        cursor: pointer;
        
        .user-info {
          display: flex;
          align-items: center;
          padding: 0 12px;
          height: 36px;
          background: rgba(201, 168, 108, 0.1);
          border-radius: 18px;
          transition: all 0.3s;
          
          &:hover {
            background: rgba(201, 168, 108, 0.2);
          }
          
          .user-name {
            color: $teaDark;
            font-size: 14px;
            margin-right: 6px;
          }
          
          i {
            color: $teaLight;
            font-size: 12px;
          }
        }
      }
    }
  }
}

.app-main {
  min-height: calc(100vh - 60px);
  padding: 24px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f0e8 0%, #faf8f5 50%, #f8f4ed 100%);
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter,
.fade-transform-leave-active {
  opacity: 0;
  transform: translateX(30px);
}

// 滚动条样式
.sidebar-menu-wrap::-webkit-scrollbar {
  width: 4px;
}

.sidebar-menu-wrap::-webkit-scrollbar-thumb {
  background: rgba(201, 168, 108, 0.3);
  border-radius: 2px;
}

.sidebar-menu-wrap::-webkit-scrollbar-track {
  background: transparent;
}
</style>