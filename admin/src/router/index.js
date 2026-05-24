import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout'

// 简化后的路由 - 展示型小程序后台
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    redirect: '/dashboard',
    hidden: true
  },
  // 控制台
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    meta: { title: '控制台', icon: 'el-icon-s-data' },
    children: [
      {
        path: 'index',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '控制台', icon: 'el-icon-s-data' }
      }
    ]
  },
  // 商品管理
  {
    path: '/product',
    component: Layout,
    redirect: '/product/index',
    name: 'Product',
    meta: { title: '商品管理', icon: 'el-icon-goods' },
    children: [
      {
        path: 'index',
        name: 'ProductList',
        component: () => import('@/views/product/index'),
        meta: { title: '商品列表', icon: 'el-icon-s-order' }
      },
      {
        path: 'detail',
        name: 'ProductDetail',
        component: () => import('@/views/product/detail'),
        meta: { title: '商品详情', icon: 'el-icon-edit' },
        hidden: true
      },
      {
        path: 'add',
        redirect: '/product/detail'
      }
    ]
  },
  // 分类管理
  {
    path: '/category',
    component: Layout,
    redirect: '/category/index',
    name: 'Category',
    meta: { title: '分类管理', icon: 'el-icon-menu' },
    children: [
      {
        path: 'index',
        name: 'CategoryList',
        component: () => import('@/views/category/index'),
        meta: { title: '分类列表', icon: 'el-icon-folder' }
      }
    ]
  },
  // 香型管理
  {
    path: '/aroma',
    component: Layout,
    redirect: '/aroma/index',
    name: 'Aroma',
    meta: { title: '香型管理', icon: 'el-icon-collection-tag' },
    children: [
      {
        path: 'index',
        name: 'AromaList',
        component: () => import('@/views/aroma/index'),
        meta: { title: '香型列表', icon: 'el-icon-s-flag' }
      }
    ]
  },
  // 茶知识管理
  {
    path: '/knowledge',
    component: Layout,
    redirect: '/knowledge/list',
    name: 'Knowledge',
    meta: { title: '茶知识管理', icon: 'el-icon-reading' },
    children: [
      {
        path: 'list',
        name: 'KnowledgeList',
        component: () => import('@/views/knowledge/index'),
        meta: { title: '文章列表', icon: 'el-icon-document' }
      },
      {
        path: 'index',
        redirect: '/knowledge/detail'
      },
      {
        path: 'detail',
        name: 'KnowledgeDetail',
        component: () => import('@/views/knowledge/detail'),
        meta: { title: '文章详情', icon: 'el-icon-edit' },
        hidden: true
      }
    ]
  },
  // 站点设置
  {
    path: '/settings',
    component: Layout,
    redirect: '/settings/index',
    name: 'Settings',
    meta: { title: '站点设置', icon: 'el-icon-setting' },
    children: [
      {
        path: 'index',
        name: 'SettingsIndex',
        component: () => import('@/views/settings/index'),
        meta: { title: '站点设置', icon: 'el-icon-s-tools' }
      }
    ]
  },
  // 404
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

// 全局路由守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 凤凰单枞管理后台` : '凤凰单枞管理后台'
  
  if (to.path !== '/login' && to.path !== '/404') {
    const token = localStorage.getItem('Admin-Token')
    const userInfo = localStorage.getItem('adminUserInfo')
    
    if (!(store.getters['user/isLoggedIn'] || store.state.user.isLoggedIn) && (!token || !userInfo)) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      if (!(store.getters['user/isLoggedIn'] || store.state.user.isLoggedIn) && token && userInfo) {
        try {
          const parsedUserInfo = JSON.parse(userInfo)
          store.commit('user/SET_TOKEN', token)
          store.commit('user/SET_USER_INFO', parsedUserInfo)
        } catch (e) {
          console.error('Failed to parse user info:', e)
        }
      }
      next()
    }
  } else {
    if (to.path === '/login') {
      const token = localStorage.getItem('Admin-Token')
      const userInfo = localStorage.getItem('adminUserInfo')
      if (store.getters['user/isLoggedIn'] || store.state.user.isLoggedIn || (token && userInfo)) {
        next({ path: '/' })
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

export default router
