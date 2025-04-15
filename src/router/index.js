import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/DocumentsView.vue')
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/documents',
      name: 'Documents',
      component: () => import('../views/DocumentsView.vue')
    },
    {
      path: '/upload',
      name: 'Upload',
      component: () => import('../views/UploadView.vue')
    },
    {
      path: '/chat/:id',
      name: 'Chat',
      component: () => import('../views/ChatView.vue'),
      props: true
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = await authStore.checkAuth()

  if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
    return
  }

  const publicRoutes = ['/login']
  if (!publicRoutes.includes(to.path) && !isAuthenticated) {
    next('/login')
    return
  }

  next()
})
export default router