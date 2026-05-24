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

// axios 全局配置已移除，统一使用 api/index.js 中的 service 实例处理请求/拦截/认证
// 如需在组件中直接使用 axios 实例，可通过 Vue.prototype.$http 访问
Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
