// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'font-awesome/scss/font-awesome.scss'
import {formatRoutes} from './utils/utils'
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  if (to.name === 'Login') {
    next()
    return
  }
  var name = localStorage.getItem('user')
  if (name === null) {
    if (to.meta.requireAuth || to.name == null) {
      next({path: '/', query: {redirect: to.path}})
    } else {
      next()
    }
  } else {
    if (to.matched.length === 0) {
      next({path: '/main'})
      return
    }
    let fmtRoutes = formatRoutes(JSON.parse(localStorage.getItem('menuData')))
    for (let i = 0; i < fmtRoutes.length; i++) {
      router.addRoutes(fmtRoutes)
    }
    if (to.path !== null) {
      next()
    }
  }
})

/* eslint-disable no-new */

/**
 * 权限指令
 *
 * **/
Vue.directive('has', {
  inserted: function (el, binding) {
    if (Vue.prototype.$_has(binding.value) === false) {
      el.parentNode.removeChild(el)
    }
  }
})
// 权限检查方法
Vue.prototype.$_has = function (value) {
  let isExist = false
  let buttonpermsStr = localStorage.getItem('permissionSign')
  if (buttonpermsStr === undefined || buttonpermsStr === null) {
    return false
  }
  let buttonperms = JSON.parse(buttonpermsStr)
  for (let i = 0; i < buttonperms.length; i++) {
    if (buttonperms[i] === value) {
      isExist = true
      break
    }
  }
  return isExist
}

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
