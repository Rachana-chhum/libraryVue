import { createRouter, createWebHistory } from 'vue-router'
import BookView from '../views/BookView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'book',
      component: BookView,
    },
    {
      path: '/borrow',
      name: 'borrow',
      // route level code-splitting
      // this generates a separate chunk (Borrow.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/BorrowView.vue'),
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/LibrariesView.vue'),
    },
    {
      path: '/members',
      name: 'members', 
      component: () => import('../views/MemberView.vue'),
    }, 
    {
      path: '/category',
      name: 'category', 
      component: () => import('../views/CategoriesView.vue'),
    }, 

  ],
})


export default router
