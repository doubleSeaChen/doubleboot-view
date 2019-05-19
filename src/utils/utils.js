import axios from 'axios'

export const formatRoutes = (routes) => {
  let fmRoutes = []
  routes.forEach(routerIns => {
    let {
      path,
      component,
      text,
      meta,
      icon,
      children
    } = routerIns
    if (children && children instanceof Array) {
      children = formatRoutes(children)
    }
    let fmRouter = {
      path: path,
      component: require('../components' + component + '.vue').default,
      name: text,
      iconCls: icon,
      meta: meta,
      children: children
    }
    fmRoutes.push(fmRouter)
  })
  return fmRoutes
}

export const initMenu2 = (router) => {
  if (router.length > 0) {
    return
  }
  axios.get('/api/menu/listOfNoButton').then(function (response) {
    if (response.data) {
      localStorage.setItem('menuData', JSON.stringify(response.data))
      let fmtRoutes = formatRoutes(response.data)
      for (let i = 0; i < fmtRoutes.length; i++) {
        console.log(fmtRoutes[i])
        router.addRoutes(fmtRoutes)
      }
    }
  }).catch(function (response) {
    console.log(response)
  })
}
