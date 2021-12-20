import { createWebHistory, createRouter } from 'vue-router'
import Headphones from '../components/pages/Headphones.vue'
import Earphones from '../components/pages/Earphones.vue'
import Speakers from '../components/pages/Speakers.vue'
import Product from '../components/pages/Product.vue'
import Home from '../components/pages/Home.vue'
import Address from '../components/pages/Address.vue'
import Reset from '../components/pages/Reset.vue'
import Checkout from '../components/pages/Checkout.vue'
import Success from '../components/pages/Success.vue'

import {addDelayObserver} from './animations.js'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/home', component: Home },
        { path: '/address', component: Address },
        { path: '/reset', component: Reset },
        { path: '/checkout', component: Checkout },
        { path: '/success', component: Success },
        { path: '/headphones', component: Headphones },
        { path: '/earphones', component: Earphones },
        { path: '/speakers', component: Speakers },
        { path: `/products/:id`, component: Product },
        { path: '/', redirect: '/home' },
        { path: '/:pathMatch(.*)*', component: Home, redirect: '/home' },
    ]
})

router.beforeEach((to, from, next) => {
    window.scrollTo(0, 0);
    addDelayObserver();
    next();
})
export default router;
