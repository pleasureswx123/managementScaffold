import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App.vue';
import router from './router';
import store from './store/index.js';
import vpsAuthLogin from 'vps-auth-login';
import host from './config/hots.js'
import 'element-ui/lib/theme-chalk/index.css';
import '@/themes/theme/index.scss';

const authLogin = vpsAuthLogin();
authLogin.init(host.ENVIROMENT);

Vue.use(ElementUI, { size: 'small' });

Vue.config.productionTip = false;

authLogin.checkLogin().then(() => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
}).catch(() => {
  // 退出到msso单点登录页面
  authLogin.logout();
})
