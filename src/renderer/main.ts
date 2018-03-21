import Vue from 'vue';
import axios from 'axios';
import Vuetify from 'vuetify';
import FastClick from 'fastclick';
import { ipcRenderer } from 'electron';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(Vuetify);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.prototype.$http = axios;
Vue.config.productionTip = false;

FastClick(document.body);

ipcRenderer.on('undo', () => {
  // console.log('undo');
});

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
