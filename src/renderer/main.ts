import Vue from 'vue';
import axios from 'axios';
import Vuetify from 'vuetify';
import FastClick from 'fastclick';
import { ipcRenderer } from 'electron';

import './utils/sortedList';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(Vuetify, {
  theme: {
    primary: '#1565C0',
    secondary: '#1E88E5',
    accent: '#039BE5',
    error: '#f44336',
    warning: '#ffeb3b',
    info: '#2196f3',
    success: '#4caf50',
  }
});

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.prototype.$http = axios;
Vue.config.productionTip = false;

FastClick(document.body);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
