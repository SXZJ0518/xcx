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
  // 商品管理（展示配置）
  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    name: 'Product',
    meta: { title: '茶品管理', icon: 'el-icon-goods' },
    children: [
      {
        path: 'list',
        name: 'ProductList',
        component: () => import('@/views/product/list'),
        meta: { title: '茶品列表', icon: 'el-icon-s-order' }
      },
      {
        path: 'add',
        name: 'ProductAdd',
        component: () => import('@/views/product/add'),
        meta: { title: '添加茶品', icon: 'el-icon-plus' }
      },
      {
        path: 'edit/:id',
        name: 'ProductEdit',
        component: () => import('@/views/product/edit'),
        meta: { title: '编辑茶品', icon: 'el-icon-edit' },
        hidden: true
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/list'),
        meta: { title: '香型管理', icon: 'el-icon-menu' }
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
        component: () => import('@/views/knowledge/list'),
        meta: { title: '文章列表', icon: 'el-icon-document' }
      },
      {
        path: 'add',
        name: 'KnowledgeAdd',
        component: () => import('@/views/knowledge/form'),
        meta: { title: '添加文章', icon: 'el-icon-plus' }
      },
      {
        path: 'edit/:id',
        name: 'KnowledgeEdit',
        component: () => import('@/views/knowledge/form'),
        meta: { title: '编辑文章', icon: 'el-icon-edit' },
        hidden: true
      }
    ]
  },
  // 联系方式配置
  {
    path: '/contact',
    component: Layout,
    redirect: '/contact/index',
    name: 'Contact',
    meta: { title: '联系方式', icon: 'el-icon-phone' },
    children: [
      {
        path: 'index',
        name: 'ContactSetting',
        component: () => import('@/views/contact/index'),
        meta: { title: '联系配置', icon: 'el-icon-phone-outline' }
      }
    ]
  },
  // 404
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
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
    
    if (!store.getters['user/isLoggedIn'] && (!token || !userInfo)) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      if (!store.getters['user/isLoggedIn'] && token && userInfo) {
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
      if (store.getters['user/isLoggedIn'] || (token && userInfo)) {
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
