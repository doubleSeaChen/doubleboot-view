import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Login from '@/components/Login'
import axios from 'axios'

Vue.use(Router)
Vue.use(ElementUI)
Vue.prototype.$ajax = axios

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/main',
      name: 'Main',
      component: require('../components/Index.vue').default
    }
  ]
})
