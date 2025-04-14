<template>
  <div
    class="min-h-screen flex items-center justify-center bg-dark-primary py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <!-- Logo/Branding -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-light-primary mb-2">PDF Chatbot</h1>
        <p class="text-light-secondary">
          Sign in to start chatting with your documents
        </p>
      </div>

      <!-- Login Form -->
      <div class="card space-y-6">
        <form class="space-y-4" @submit.prevent="handleLogin">
          <!-- Email Input -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-light-secondary mb-1"
              >Email address</label
            >
            <input
              id="email"
              type="email"
              required
              v-model="email"
              class="input-field"
              placeholder="Enter your email"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-light-secondary mb-1"
              >Password</label
            >
            <input
              id="password"
              type="password"
              required
              v-model="password"
              class="input-field"
              placeholder="Enter your password"
            />
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <!-- <input
                id="remember-me"
                type="checkbox"
                v-model="rememberMe"
                class="h-4 w-4 bg-dark-accent rounded border-dark-accent focus:ring-dark-accent"
              />
              <label
                for="remember-me"
                class="ml-2 block text-sm text-light-secondary"
                >Remember me</label
              > -->
            </div>

            <a
              href="#"
              class="text-sm text-light-secondary hover:text-light-primary"
              >Forgot password?</a
            >
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            class="btn-primary w-full flex justify-center py-3"
          >
            Sign in
          </button>
        </form>

        <!-- Divider -->
        <!-- <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-dark-accent"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-dark-secondary text-light-secondary"
              >Or continue with</span
            >
          </div>
        </div> -->

        <!-- Social Login Buttons -->
        <!-- <div class="grid grid-cols-2 gap-3">
          <button
            class="btn-primary flex items-center justify-center space-x-2"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            class="btn-primary flex items-center justify-center space-x-2"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              />
            </svg>
            <span>Facebook</span>
          </button>
        </div> -->
      </div>

      <!-- Sign Up Link -->
      <!-- <p class="text-center text-sm text-light-secondary">
        Don't have an account?
        <a href="#" class="font-medium text-light-primary hover:text-opacity-80"
          >Sign up</a
        >
      </p> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");
const rememberMe = ref(false);

const handleLogin = () => {
  // TODO: Implement actual login logic
  router.push("/documents");
};
</script>
