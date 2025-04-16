<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Upload PDF</h1>
      <router-link to="/documents" class="btn-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        Back to Documents
      </router-link>
    </div>

    <!-- Upload Area -->
    <div
      class="card border-2 border-dashed border-dark-accent relative"
      :class="{ 'border-light-primary bg-dark-accent': isDragging }"
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <div class="p-8 text-center">
        <div class="mx-auto w-16 h-16 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-full h-full text-light-secondary"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <h3 class="text-xl font-medium mb-2">Drag and drop your PDF here</h3>
        <p class="text-light-secondary mb-4">or</p>
        <input
          type="file"
          ref="fileInput"
          accept=".pdf"
          class="hidden"
          @change="handleFileSelect"
        />
        <div class="flex justify-center">
          <button
            class="btn-primary px-6 py-3 self-center"
            @click="$refs.fileInput.click()"
          >
            Select File
          </button>
        </div>

        <p class="text-sm text-light-secondary mt-4">Maximum file size: 10MB</p>
      </div>
    </div>

    <!-- Upload Progress -->
    <div v-if="uploadProgress > 0" class="card space-y-4">
      <div class="flex items-center justify-between text-sm">
        <span>Uploading...</span>
        <span>{{ uploadProgress }}%</span>
      </div>
      <div class="w-full bg-dark-accent rounded-full h-2">
        <div
          class="bg-light-primary h-2 rounded-full transition-all duration-300"
          :style="{ width: `${uploadProgress}%` }"
        ></div>
      </div>
    </div>

    <!-- File Preview -->
    <div v-if="selectedFile" class="card space-y-4">
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
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-medium">{{ selectedFile.name }}</h3>
          <p class="text-sm text-light-secondary">
            {{ formatFileSize(selectedFile.size) }}
          </p>
        </div>
        
        <button
          class="text-light-secondary hover:text-light-primary"
          @click="clearSelectedFile"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium mb-2"
            >Document Title</label
          >
          <input
            type="text"
            id="title"
            v-model="title"
            class="input-field w-full"
            placeholder="Enter document title"
            required
          />
        </div>
      </div>
      <button
        class="btn-primary w-full py-3"
        :disabled="isUploading"
        @click="uploadFile"
      >
        {{ isUploading ? "Uploading..." : "Upload File" }}
      </button>
    </div>
  
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isDragging = ref(false);
const selectedFile = ref(null);
const uploadProgress = ref(0);
const isUploading = ref(false);
const fileInput = ref(null);
const title = ref("");
const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file && file.type === "application/pdf") {
    if (file.size > maxFileSize) {
      alert("File size exceeds 10MB limit");
      return;
    }
    selectedFile.value = file;
    title.value = file.name.replace(".pdf", "");
  }
};

const handleDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file && file.type === "application/pdf") {
    if (file.size > maxFileSize) {
      alert("File size exceeds 10MB limit");
      return;
    }
    selectedFile.value = file;
    title.value = file.name.replace(".pdf", "");
  }
};

import { documents } from "@/services/documents";

const uploadFile = async () => {
  if (!selectedFile.value || !title.value.trim()) {
    alert("Please provide a title for the document");
    return;
  }

  isUploading.value = true;
  uploadProgress.value = 0;

  const interval = setInterval(() => {
    if (uploadProgress.value < 90) {
      uploadProgress.value += 10;
    }
  }, 500);

  try {
    console.log("Uploading file:", selectedFile.value);
    await documents.upload({
      file: selectedFile.value,
      title: title.value.trim(),
      file_size: selectedFile.value.size,
    });

    uploadProgress.value = 100;
    setTimeout(() => {
      router.push("/documents");
    }, 500);
  } catch (error) {
    console.error("Upload failed:", error);
  } finally {
    clearInterval(interval);
    isUploading.value = false;
  }
};

const clearSelectedFile = () => {
  selectedFile.value = null;
  title.value = "";
  uploadProgress.value = 0;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
</script>
