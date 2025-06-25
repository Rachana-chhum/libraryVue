import { createRouter, createWebHistory } from 'vue-router';
import BookView from '../views/BookView.vue';
import BorrowView from '../views/BorrowView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/books',
      name: 'book',
      component: BookView,
    },
    {
      path: '/borrows',
      name: 'borrow',
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
      path: '/categories', // Changed from '/category' to '/categories'
      name: 'category',
      component: () => import('../views/CategoriesView.vue'),
    },
  ],
});

export default router;