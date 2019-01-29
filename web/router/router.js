import VueRouter from 'vue-router';
const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: () => import(/* webpackChunkName: "form" */ '../componet/main.vue')
        },
    ]
})
export default router;