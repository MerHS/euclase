import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-container',
      component: require('@/components/MainContainer'),
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
