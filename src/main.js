import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import i18n from './i18n';
import store from './store/index';

Vue.use(ElementUI);

new Vue({
  i18n,
  store,
  render: h => h(App)
}).$mount('#app');