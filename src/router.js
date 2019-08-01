import Vue from 'vue'
import Router from 'vue-router'
import routerMap from './config/router.js'
import vpsAuthLogin from 'vps-auth-login';
const authLogin = vpsAuthLogin();

Vue.use(Router)
const router = new Router({
  routes: routerMap,
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
  base: '/',
  mode: 'history',
  scrollBehavior: function (to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    }
    return savedPosition || {
      x: 0,
      y: 0
    }
  }
});

router.beforeEach((to, from, next) => {
  const {
    meta,
    matched
  } = to;
  const {
    title
  } = meta;
  const code = [];
  let nextName = '';
  matched.forEach(item => {
    nextName = item.meta.nextName ? item.meta.nextName : nextName;
    item.meta.authorityCode && code.push(item.meta.authorityCode);
  });
  document.title = title;
  if (code.length) {
    let hasAuth = true;
    code.forEach(code => {
      if (!authLogin.hasAuth(code)) {
        hasAuth = false
      }
    });
    if (hasAuth) {
      next()
    } else {
      next({
        name: nextName || 'noAuth'
      })
    }
  } else {
    next()
  }
});

export default router
