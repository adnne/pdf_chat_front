<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">My Documents</h1>
      <router-link to="/upload" class="btn-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        Upload New
      </router-link>
    </div>

    <!-- Search and Filter Bar -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
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
      <div class="flex gap-2">
        <select v-model="sortBy" class="input-field">
          <option value="date">Date Added</option>
          <option value="name">Name</option>
          <option value="size">Size</option>
        </select>
        <button @click="isGridView = !isGridView" class="btn-primary p-2">
          <svg
            v-if="isGridView"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M2 4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM6 4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1V4zM10 4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Documents Grid/List -->
    <div
      :class="{
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6': isGridView,
        'space-y-4': !isGridView,
      }"
    >
      <div
        v-for="document in filteredDocuments"
        :key="document.id"
        class="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        @click="openDocument(document)"
      >
        <!-- Document Card Content -->
        <div class="flex items-start space-x-4">
          <div class="p-2 bg-dark-accent rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-medium truncate">{{ document.name }}</h3>
            <p class="text-sm text-light-secondary">{{ document.date }}</p>
            <p class="text-sm text-light-secondary mt-2">{{ document.size }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-4 flex justify-end space-x-2">
          <button
            class="btn-primary py-1 px-3"
            @click.stop="openChat(document)"
          >
            Chat
          </button>
          <button
            class="btn-primary py-1 px-3"
            @click.stop="downloadDocument(document)"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const searchQuery = ref("");
const sortBy = ref("date");
const isGridView = ref(true);

// Mock data - replace with actual API calls
const documents = ref([
  {
    id: 1,
    name: "Project Proposal.pdf",
    date: "2024-04-14",
    size: "2.5 MB",
  },
  {
    id: 2,
    name: "Technical Documentation.pdf",
    date: "2024-04-13",
    size: "1.8 MB",
  },
  {
    id: 3,
    name: "Research Paper.pdf",
    date: "2024-04-12",
    size: "3.2 MB",
  },
]);

const filteredDocuments = computed(() => {
  let filtered = [...documents.value];

  // Apply search filter
  if (searchQuery.value) {
    filtered = filtered.filter((doc) =>
      doc.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case "date":
        return new Date(b.date) - new Date(a.date);
      case "name":
        return a.name.localeCompare(b.name);
      case "size":
        return parseFloat(b.size) - parseFloat(a.size);
      default:
        return 0;
    }
  });

  return filtered;
});

const openChat = (document) => {
  router.push(`/chat/${document.id}`);
};

const downloadDocument = (document) => {
  // TODO: Implement document download
  console.log("Downloading:", document.name);
};

const openDocument = (document) => {
  // TODO: Implement document preview
  console.log("Opening:", document.name);
};
</script>
