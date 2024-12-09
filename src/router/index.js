import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'editTable',
      component: () => import('../views/editTable/index.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/editTable',
      name: 'editTable',
      component: () => import('@/views/editTable/index.vue'),
    },
    {
      path: '/addAndSub',
      name: 'addAndSub',
      component: () => import('@/views/addAndSub/index.vue'),
    },
    {
      path: '/slotTest',
      name: 'slotTest',
      component: () => import('@/views/slotTest/parent.vue'),
    },
  ],
})

export default router
