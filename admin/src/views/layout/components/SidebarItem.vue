<template>
  <div v-if="shouldRender">
    <!-- 没有子路由或只有一个可见子路由：直接渲染为菜单项 -->
    <template v-if="!item.children || showingChildren.length === 0">
      <el-menu-item :index="resolvePath(item.path)" :class="{'submenu-title-noDropdown': !isNest}">
        <i v-if="item.meta && item.meta.icon" :class="item.meta.icon"></i>
        <span slot="title">{{ item.meta.title }}</span>
      </el-menu-item>
    </template>

    <!-- 只有一个可见子路由：直接展示子路由（不显示箭头） -->
    <template v-else-if="showingChildren.length === 1">
      <el-menu-item :index="resolvePath(showingChildren[0].path)" :class="{'submenu-title-noDropdown': !isNest}">
        <i v-if="showingChildren[0].meta && showingChildren[0].meta.icon" :class="showingChildren[0].meta.icon"></i>
        <span slot="title">{{ showingChildren[0].meta.title }}</span>
      </el-menu-item>
    </template>

    <!-- 多个可见子路由：渲染为可折叠子菜单 -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <i v-if="item.meta && item.meta.icon" :class="item.meta.icon"></i>
        <span>{{ item.meta.title }}</span>
      </template>
      <el-menu-item
        v-for="child in showingChildren"
        :key="child.path"
        :index="resolvePath(child.path)"
        class="nest-menu"
      >
        <i v-if="child.meta && child.meta.icon" :class="child.meta.icon"></i>
        <span slot="title">{{ child.meta.title }}</span>
      </el-menu-item>
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'

export default {
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  computed: {
    shouldRender() {
      if (this.item.hidden) return false
      if (this.item.meta && this.item.meta.title) return true
      if (this.showingChildren.length > 0) return true
      return false
    },
    showingChildren() {
      if (!this.item.children) return []
      return this.item.children.filter(child => !child.hidden && child.meta && child.meta.title)
    }
  },
  methods: {
    resolvePath(routePath) {
      if (this.isExternalLink(routePath)) return routePath
      return path.resolve(this.basePath, routePath)
    },
    isExternalLink(pathStr) {
      return /^(https?:|mailto:|tel:)/.test(pathStr)
    }
  }
}
</script>
