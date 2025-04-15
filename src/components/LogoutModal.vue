<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-dark-secondary rounded-lg p-6 max-w-sm w-full mx-4">
      <h3 class="text-xl font-semibold mb-4">Confirm Logout</h3>
      <p class="text-gray-300 mb-6">Are you sure you want to logout?</p>
      <div class="flex justify-end space-x-3">
        <button @click="onCancel" class="btn-secondary">Cancel</button>
        <button @click="onConfirm" class="btn-primary">Logout</button>
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

const emit = defineEmits(["confirm", "cancel"]);

const onConfirm = () => {
  emit("confirm");
};

const onCancel = () => {
  emit("cancel");
};
</script>
