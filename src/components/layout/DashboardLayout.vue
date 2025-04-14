<template>
  <div class="min-h-screen bg-dark-primary text-light-primary flex">
    <!-- Sidebar -->
    <Sidebar class="hidden lg:block fixed inset-y-0 left-0 w-64 z-30" />

    <!-- Mobile Sidebar -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-40 lg:hidden"
      @click="isSidebarOpen = false"
    >
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div
        class="fixed inset-y-0 left-0 w-64 bg-dark-secondary transform transition-transform duration-300 ease-in-out"
      >
        <Sidebar />
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 lg:ml-64 min-h-screen flex flex-col">
      <!-- Navbar -->
      <Navbar
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
        class="fixed top-0 right-0 left-0 lg:left-64 z-20 bg-dark-secondary border-b border-dark-accent"
      />

      <!-- Page Content -->
      <main class="flex-1 pt-16">
        <div
          class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 w-full h-full"
        >
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from "vue";
import Sidebar from "./Sidebar.vue";
import Navbar from "./Navbar.vue";

const isSidebarOpen = ref(false);
provide("isSidebarOpen", isSidebarOpen);
</script>
