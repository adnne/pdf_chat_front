import { defineStore } from 'pinia'
import { auth } from '@/services/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false
  }),
  
  actions: {
    setUser(userData) {
      this.user = userData
      this.isAuthenticated = true
    },
    
    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('access_token')
      localStorage.removeItem('refreshToken')
    },
    
    async checkAuth() {
      const token = localStorage.getItem('access_token')
      if (!token) {
        this.isAuthenticated = false
        return false
      }
      
      try {
        const response = await auth.isAuthenticated()
        this.user = response.data
        this.isAuthenticated = true
        return true
      } catch (error) {
        this.user = null
        this.isAuthenticated = false
        return false
      }
    },

    async initialize() {
      await this.checkAuth()
    }
  },
  
  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated
  }
})