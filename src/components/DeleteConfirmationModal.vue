<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm"
      @click="close"
    ></div>
    <div class="relative min-h-screen flex items-center justify-center p-4">
      <div
        class="relative bg-dark-secondary rounded-lg shadow-xl w-full max-w-md p-6"
      >
        <div class="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 mx-auto text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 class="mt-4 text-xl font-semibold text-light-primary">
            Delete Document
          </h3>
          <p class="mt-2 text-light-secondary">
            Are you sure you want to delete this document? This action cannot be
            undone.
          </p>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="close"
            class="px-4 py-2 text-sm font-medium text-light-secondary hover:text-light-primary transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirm"
            class="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "confirm"]);

const close = () => {
  emit("close");
};

const confirm = () => {
  emit("confirm");
  close();
};
</script>
