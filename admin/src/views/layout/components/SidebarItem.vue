<template>
  <div v-if="shouldRender">
    <!-- 没有子路由：直接渲染为菜单项 -->
    <template v-if="!item.children || showingChildren.length === 0">
      <app-link :to="resolvePath(item.path)">
        <el-menu-item :index="resolvePath(item.path)" :class="{'submenu-title-noDropdown': !isNest}">
          <i v-if="item.meta && item.meta.icon" :class="item.meta.icon"></i>
          <span>{{ item.meta.title }}</span>
        </el-menu-item>
      </app-link>
    </template>

    <!-- 只有一个可见子路由：直接展示子路由（不显示箭头） -->
    <template v-else-if="showingChildren.length === 1">
      <sidebar-item
        :item="showingChildren[0]"
        :base-path="basePath"
        :is-nest="isNest"
      />
    </template>

    <!-- 多个可见子路由：渲染为可折叠子菜单 -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <i v-if="item.meta && item.meta.icon" :class="item.meta.icon"></i>
        <span>{{ item.meta.title }}</span>
      </template>
      <sidebar-item
        v-for="child in showingChildren"
        :key="child.path"
        :item="child"
        :base-path="basePath"
        :is-nest="true"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import AppLink from './Link'

export default {
  name: 'SidebarItem',
  components: { AppLink },
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
      // 必须有标题或至少一个可见子菜单
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
