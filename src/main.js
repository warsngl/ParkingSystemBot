import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import './main.css';

const router = new createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/map/:lat/:lng',
      component: App,
      props: true,
    },
    { path: '/:pathMatch(.*)*', redirect: '/map/62.6726051/50.8237546' },
  ],
});
const app = createApp(App).use(router);
router.isReady().then(() => {
  app.mount('#app');
});
