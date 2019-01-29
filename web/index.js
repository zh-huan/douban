import Vue from 'vue';
import main from './componet/main.vue'
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import router from './router/router.js'

import "./common/css/common.css"
let v=new Vue({
    el: '#app',
    router:router,
    render: h => h(main)
});
