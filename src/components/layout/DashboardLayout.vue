<template>
  <div class="min-h-screen bg-dark-primary text-light-primary">
    <!-- Sidebar -->
    <Sidebar class="hidden lg:block" />

    <!-- Mobile Sidebar -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-40 lg:hidden"
      @click="isSidebarOpen = false"
    >
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="fixed inset-y-0 left-0 w-64 bg-dark-secondary">
        <Sidebar />
      </div>
    </div>

    <!-- Main Content -->
    <div class="lg:pl-64">
      <!-- Navbar -->
      <Navbar @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

      <!-- Page Content -->
      <main class="pt-16 min-h-screen">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Sidebar from "./Sidebar.vue";
import Navbar from "./Navbar.vue";

const isSidebarOpen = ref(false);
</script>
