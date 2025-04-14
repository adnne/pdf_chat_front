<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";
import DashboardLayout from "./components/layout/DashboardLayout.vue";

const route = useRoute();
const isAuthRoute = computed(() => route.path === "/login");
</script>

<template>
  <div class="min-h-screen bg-dark-primary text-light-primary">
    <template v-if="isAuthRoute">
      <router-view></router-view>
    </template>
    <template v-else>
      <DashboardLayout>
        <router-view></router-view>
      </DashboardLayout>
    </template>
  </div>
</template>
