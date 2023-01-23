import { createApp } from 'vue'
import { createRouter,createWebHashHistory } from 'vue-router'
import App from './App.vue'

const router = new VueRouter({
    routes: [
        {
            path: "/map/:lat/:lng",
            component: Map,
            props: true,
        },
    ],
});
const router = createRouter({
  history: createWebHashHistory(),
  routes, 
})

createApp(App).use(router).mount('#app')