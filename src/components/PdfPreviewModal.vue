<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm"
      @click="close"
    ></div>
    <div class="relative min-h-screen flex items-center justify-center p-4">
      <div
        class="relative bg-dark-secondary rounded-lg shadow-xl w-full max-w-6xl"
      >
        <!-- Modal Header -->
        <div
          class="flex items-center justify-between p-4 border-b border-dark-accent"
        >
          <h3 class="text-xl font-semibold">{{ title }}</h3>
          <button
            @click="close"
            class="p-1 hover:bg-dark-accent rounded-full transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-4">
          <div
            class="w-full aspect-[4/3] bg-dark-accent rounded-lg overflow-hidden"
          >
            <iframe
              :src="pdfUrl"
              class="w-full h-full"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <!-- Modal Footer -->
        <div
          class="flex items-center justify-end gap-2 p-4 border-t border-dark-accent"
        >
          <button @click="close" class="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "PDF Preview",
  },
  pdfUrl: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>
