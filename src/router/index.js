import { createRouter, createWebHistory } from 'vue-router'

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

export default router