<template>
  <el-breadcrumb class="app-breadcrumb" separator="">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index === levelList.length - 1" class="no-redirect">
          {{ item.meta.title }}
        </span>
        <router-link v-else :to="item.path">{{ item.meta.title }}</router-link>
        <span v-if="index < levelList.length - 1" class="separator">
          <i class="el-icon-arrow-right"></i>
        </span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'Breadcrumb',
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)

      // 始终在面包屑最前面加上"控制台"
      const hasHome = matched.length > 0 && matched[0].name === 'DashboardIndex'
      if (!hasHome) {
        matched = [{ path: '/dashboard/index', meta: { title: '控制台' } }].concat(matched)
      }

      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    }
  }
}
</script>

<style lang="scss" scoped>
$teaGold: #c9a86c;
$teaDark: #2d2520;
$teaLight: #a89b8c;

.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 60px;
  margin-left: 8px;

  .no-redirect {
    color: $teaDark;
    cursor: text;
    font-weight: 500;
  }

  .separator {
    margin: 0 8px;
    color: $teaLight;
    font-size: 12px;
  }

  ::v-deep .el-breadcrumb__item {
    .el-breadcrumb__inner {
      color: $teaLight;
      font-weight: normal;
      cursor: pointer;
      transition: color 0.3s;
      
      &:hover {
        color: $teaGold;
      }
      
      a {
        color: inherit;
        text-decoration: none;
        
        &:hover {
          color: $teaGold;
        }
      }
    }
    
    &:last-child .el-breadcrumb__inner {
      color: $teaDark;
      font-weight: 500;
      cursor: default;
    }
  }
}
</style>