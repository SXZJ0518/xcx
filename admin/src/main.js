import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import axios from 'axios'

// 配置 Element UI
Vue.use(ElementUI, { size: 'small' })
Vue.config.productionTip = false

// 配置 axios（使用环境变量）
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL || '/api'
axios.defaults.timeout = 15000

axios.interceptors.request.use(
  config => {
    const token = store.getters.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

axios.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response && error.response.status === 401) {
      store.dispatch('user/logout')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
