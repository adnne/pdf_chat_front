<template>
  <div class="h-[calc(100vh-4rem)] flex flex-col border border-dark-accent/20">
    <!-- Chat Header -->
    <div
      class="flex items-center justify-between p-4 border-b border-dark-accent bg-dark-secondary "
    >
      <div class="flex items-center space-x-4">
        <router-link to="/documents" class="btn-primary p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </router-link>
        <div>
          <h2 class="text-lg font-semibold">{{ document?.name || "Chat" }}</h2>
          <p class="text-sm text-light-secondary">PDF Assistant</p>
        </div>
      </div>
     
    </div>

    <!-- Chat Messages -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4"
      @scroll="handleScroll"
    >
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="flex flex-col space-y-2"
      >
        <!-- Message Timestamp -->
        <div v-if="showMessageDate(message, index)" class="flex justify-center">
          <span
            class="text-xs text-light-secondary bg-dark-accent px-2 py-1 rounded-full"
          >
            {{ formatDate(message.timestamp) }}
          </span>
        </div>

        <!-- Message Bubble -->
        <div
          class="flex"
          :class="message.type === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-[80%] rounded-lg p-3"
            :class="{
              'bg-dark-accent text-light-primary': message.type === 'user',
              'bg-dark-secondary text-light-primary':
                message.type === 'assistant',
            }"
          >
            <p class="whitespace-pre-wrap">{{ message.content }}</p>
            <div class="mt-1 flex justify-end items-center space-x-2">
              <span class="text-xs text-light-secondary">
                {{ formatTime(message.timestamp) }}
              </span>
              <span
                v-if="message.type === 'user'"
                class="text-xs text-light-secondary"
              >
                <svg
                  v-if="message.status === 'sent'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div v-if="isTyping" class="flex justify-start">
        <div
          class="bg-dark-secondary text-light-secondary rounded-lg p-3 space-x-1"
        >
          <span class="animate-bounce">•</span>
          <span class="animate-bounce" style="animation-delay: 0.2s">•</span>
          <span class="animate-bounce" style="animation-delay: 0.4s">•</span>
        </div>
      </div>
    </div>

    <!-- Message Input -->
    <div class="p-4 border-t border-dark-accent bg-dark-secondary">
      <form @submit.prevent="sendMessage" class="flex space-x-2">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type your message..."
          class="input-field flex-1"
          :disabled="isTyping"
        />
        <button
          type="submit"
          class="btn-primary p-2"
          :disabled="!newMessage.trim() || isTyping"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
            />
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const messagesContainer = ref(null);
const newMessage = ref("");
const isTyping = ref(false);

// Mock document data - replace with actual API call
const document = ref({
  id: route.params.id,
  name: "Technical Documentation.pdf",
});

// Mock messages - replace with actual chat history
const messages = ref([
  {
    type: "assistant",
    content:
      "Hello! I'm your PDF assistant. How can I help you with this document?",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: "sent",
  },
  {
    type: "user",
    content: "Can you summarize the main points of the document?",
    timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
    status: "sent",
  },
  {
    type: "assistant",
    content:
      "I'll analyze the document and provide a summary of the key points...",
    timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
    status: "sent",
  },
]);

const sendMessage = async () => {
  if (!newMessage.value.trim() || isTyping.value) return;

  // Add user message
  const userMessage = {
    type: "user",
    content: newMessage.value,
    timestamp: new Date(),
    status: "sent",
  };
  messages.value.push(userMessage);
  newMessage.value = "";

  // Scroll to bottom
  await nextTick();
  scrollToBottom();

  // Simulate AI response
  isTyping.value = true;
  setTimeout(() => {
    const assistantMessage = {
      type: "assistant",
      content:
        "I'm analyzing your question and will provide a response based on the document content...",
      timestamp: new Date(),
      status: "sent",
    };
    messages.value.push(assistantMessage);
    isTyping.value = false;
    scrollToBottom();
  }, 2000);
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const formatTime = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};

const showMessageDate = (message, index) => {
  if (index === 0) return true;
  const prevMessage = messages.value[index - 1];
  return formatDate(message.timestamp) !== formatDate(prevMessage.timestamp);
};

const handleScroll = () => {
  // TODO: Implement infinite scroll for chat history
};

const toggleSidebar = () => {
  // TODO: Implement sidebar toggle for document preview
};

onMounted(() => {
  scrollToBottom();
});
</script>
