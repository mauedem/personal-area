import Vue from 'vue';
import VueRouter from 'vue-router';
// import store from '../store';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import(/* webpackChunkName: "personal_area" */ '../views/Login.vue'),
    },
    {
        path: '/personal_area',
        name: 'personal_area',
        component: () => import(/* webpackChunkName: "personal_area" */ '../views/PersonalArea.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
