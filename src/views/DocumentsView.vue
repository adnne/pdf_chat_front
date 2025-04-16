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
        
      </div>
    </div>

    <!-- Documents Grid/List -->
     <div v-if="documents.length===0" class="text-center mb-4 h-44 flex justify-center items-center">
      <p class="text-light-secondary">No documents found.</p>
     </div>
    <div
      :class="{
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6': isGridView,
        'space-y-4': !isGridView,
      }"
    >
      <div
        v-for="document in filteredDocuments"
        :key="document.id"
        class="card hover:shadow-lg transition-shadow duration-200 "
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
            <div class="mt-2">
              <span
                :class="{
                  'px-2 py-1 rounded text-xs font-medium': true,
                  'bg-green-100 text-green-800':
                    document.status === 'processed',
                  'bg-yellow-100 text-yellow-800':
                    document.status === 'processing',
                  'bg-red-100 text-red-800': document.status === 'failed',
                }"
              >
                {{ document.status }}
              </span>
            </div>
          </div>
          
        </div>

        <!-- Action Buttons -->
        <div class="mt-4 flex justify-end space-x-2">
         
          <button
            class="btn-primary py-1 px-3"
            @click.stop="openDocument(document)"
          >
            Preview file
          </button>
          <button
            class="btn-primary py-1 px-3"
            @click.stop="openChat(document)"
          >
            Chat
          </button>
        </div>
      </div>
    </div>
  </div>
  <PdfPreviewModal
    :is-open="isPdfPreviewOpen"
    :title="selectedDocument?.name || 'PDF Preview'"
    :pdf-url="selectedDocument?.url || ''"
    @close="closePdfPreview"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import PdfPreviewModal from "../components/PdfPreviewModal.vue";
import { documents as documentsService } from "../services/documents";

const router = useRouter();
const searchQuery = ref("");
const sortBy = ref("date");
const isGridView = ref(true);
const documents = ref([]);
const isLoading = ref(false);
const error = ref(null);

const fetchDocuments = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await documentsService.list();
    documents.value = response.data.results.map((doc) => ({
      id: doc.id,
      name: doc.title,
      date: new Date(doc.created_at).toLocaleDateString(),
      size: `${(doc.file_size / (1024 * 1024)).toFixed(2)} MB`,
      url: `${import.meta.env.VITE_API_URL}/pdf/${doc.id}/`,
      processed: doc.processed,
    }));
  } catch (err) {
    error.value = "Failed to load documents";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDocuments();
});


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


const selectedDocument = ref(null);
const isPdfPreviewOpen = ref(false);

const openDocument = (document) => {
  selectedDocument.value = document;
  isPdfPreviewOpen.value = true;
};

const closePdfPreview = () => {
  isPdfPreviewOpen.value = false;
  selectedDocument.value = null;
};
</script>
