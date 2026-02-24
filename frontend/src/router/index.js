import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Public - main invitation (SPA per guest dengan query param ?to=NamaUndangan)
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    // Admin routes
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard',
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/DashboardView.vue'),
        },
        {
          path: 'guestbook',
          name: 'admin-guestbook',
          component: () => import('@/views/admin/GuestBookView.vue'),
        },
        {
          path: 'gallery',
          name: 'admin-gallery',
          component: () => import('@/views/admin/GalleryView.vue'),
        },
        {
          path: 'config',
          name: 'admin-config',
          component: () => import('@/views/admin/ConfigView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 80 }
    }
    return savedPosition || { top: 0 }
  },
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token')
  if (to.meta.requiresAuth && !token) {
    return next('/admin/login')
  }
  if (to.meta.guestOnly && token) {
    return next('/admin/dashboard')
  }
  next()
})

export default router
