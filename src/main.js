// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'font-awesome/scss/font-awesome.scss'
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
    next()
  }

  /* console.log('beforeEache data is : ' + localStorage.getItem('menuData'))
  if (localStorage.getItem('menuData') === null) {
    console.log('beforeEache没得数据')
    console.log('用户数据：' + localStorage.getItem('user'))
    if (localStorage.getItem('user') === null) {
      console.log('用户没存储信息，进入登录页')
      next('/')
    } else {
      console.log('----------------初始化菜单开始-----------------')
      initMenu2(router)
      if (to.path !== null) {
        next()
      }
      console.log('----------------初始化菜单结束-----------------')
    }
  } else {
    if (to.path !== null) {
      next()
    }
    /!* console.log('----------------初始化菜单开始-----------------')
    initMenu(router, JSON.parse(localStorage.getItem('menuData')))
    if (to.path !== null) {
      next()
    }
    console.log('----------------初始化菜单结束-----------------') *!/
  } */
}
)
/* if (to.name == 'Login') {
    next()
    return
  }
  var name = store.state.user.name
  if (name == '未登录') {
    if (to.meta.requireAuth || to.name == null) {
      next({path: '/', query: {redirect: to.path}})
    } else {
      next()
    }
  } else {
    initMenu(router, store)
    if (to.path == '/chat') { store.commit('updateMsgList', []) }
    next()
  } */

/* eslint-disable no-new */

/**
 * 权限指令
 *
 * **/
Vue.directive('has', {
  bind: function (el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
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
  template: '<App/>',
  computed: {
    routes () {
      return global.antRouter
    }

  }
})
