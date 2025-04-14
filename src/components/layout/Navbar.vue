<template>
  <nav
    class="fixed top-0 right-0 left-64 h-16 bg-dark-secondary border-b border-dark-accent px-4 flex items-center justify-between"
  >
    <!-- Mobile Menu Button (visible on small screens) -->
    <button
      class="lg:hidden btn-primary p-2"
      @click="isSidebarOpen = !isSidebarOpen"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <!-- Search Bar -->
    <div class="hidden md:block flex-1 max-w-xl mx-4">
      <div class="relative">
        <input
          type="text"
          placeholder="Search documents..."
          class="input-field pl-10"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    <!-- User Menu -->
    <div class="flex items-center space-x-4">
      <button class="btn-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span class="ml-2">Logout</span>
      </button>

      <div class="relative">
        <button
          class="flex items-center space-x-2 focus:outline-none"
          @click="isUserMenuOpen = !isUserMenuOpen"
        >
          <div
            class="w-8 h-8 rounded-full bg-dark-accent flex items-center justify-center"
          >
            <span class="text-sm font-medium">JD</span>
          </div>
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="isUserMenuOpen"
          class="absolute right-0 mt-2 w-48 bg-dark-secondary rounded-lg shadow-lg py-1"
        >
          <a href="#" class="block px-4 py-2 text-sm hover:bg-dark-accent">
            Profile
          </a>
          <a href="#" class="block px-4 py-2 text-sm hover:bg-dark-accent">
            Settings
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";

const isUserMenuOpen = ref(false);
const isSidebarOpen = ref(false);
</script>
