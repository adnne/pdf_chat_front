<template>
  <div class="h-[calc(100vh-130px)] flex flex-col border border-dark-accent/20">
    <PdfPreviewModal
      :is-open="isPdfPreviewOpen"
      :title="document?.document_title || 'PDF Preview'"
      :pdf-url="fileUrl || ''"
      @close="closePdfPreview"
    />
    <!-- Chat Header -->
    <div
      class="flex items-center p-4 border-b border-dark-accent bg-dark-secondary"
    >
      <div class="flex items-center space-x-4 w-full">
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
        <div class="flex items-center space-x-4 w-full">
          <h2 class="text-lg font-semibold">
            {{ document.document_title || "Chat" }}
          </h2>
          <button
            @click="isPdfPreviewOpen = true"
            class="btn-primary p-2"
            title="Preview PDF"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fill-rule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
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
            class="max-w-[80%] rounded-lg p-3 relative"
            :class="{
              'bg-dark-accent text-light-primary': message.type === 'user',
              'bg-dark-secondary text-light-primary':
                message.type === 'assistant',
            }"
          >
            <p class="whitespace-pre-wrap break-words">
              {{ message.content }}
            </p>

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
      <div v-if="isloadning" class="flex justify-start">
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
import PdfPreviewModal from "../components/PdfPreviewModal.vue";
import { chat } from "@/services/chat";

// Debounce utility
function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}
const route = useRoute();
const messagesContainer = ref(null);
const newMessage = ref("");
const isTyping = ref(false);
const isloadning = ref(false);

const conversationId = route.params.id;
const document = ref({});
const fileUrl = computed(
  () => `${import.meta.env.VITE_API_URL}/pdf/${document.value.document}/`
);
const messages = ref([]);
const isPdfPreviewOpen = ref(false);
const currentPage = ref(1);
const isLoading = ref(false);
const hasMoreMessages = ref(true);

const closePdfPreview = () => {
  isPdfPreviewOpen.value = false;
};

// Load conversation details
const loadConversation = async () => {
  try {
    const response = await chat.getConversation(conversationId);
    console.log(response.data);

    document.value = response.data;
    await loadMessages();
  } catch (error) {
    console.log("Error loading conversation:", error);
  }
};

// Load paginated messages
const loadMessages = async () => {
  if (isLoading.value || !hasMoreMessages.value) return;

  isLoading.value = true;
  try {
    const response = await chat.getMessages(conversationId, currentPage.value);
    const newMessages = response.data.results.map((msg) => ({
      type: msg.role,
      content: msg.content,
      timestamp: new Date(msg.created_at),
      status: "sent",
    }));

    messages.value = [...newMessages.reverse(), ...messages.value];
    hasMoreMessages.value = response.data.next !== null;
    currentPage.value++;

    if (currentPage.value === 1) {
      await nextTick();
      scrollToBottom();
    }
  } catch (error) {
    console.log("Error loading messages:", error);
  } finally {
    isLoading.value = false;
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isTyping.value) return;

  const token = localStorage.getItem("access_token");

  const userMessage = {
    type: "user",
    content: newMessage.value,
    timestamp: new Date(),
    status: "sent",
  };
  messages.value.push(userMessage);
  const contentToSend = newMessage.value;
  newMessage.value = "";

  await nextTick();
  scrollToBottom();

  isTyping.value = true;
  isloadning.value = true;

  const assistantMessage = {
    type: "assistant",
    content: "",
    timestamp: new Date(),
    status: "pending",
  };
  messages.value.push(assistantMessage);
  await nextTick();
  scrollToBottom();

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/conversations/${conversationId}/chat/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: contentToSend }),
      }
    );

    if (!response.ok || !response.body) {
      throw new Error("Streaming request failed");
    }
    isloadning.value = false;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let assistantText = "";
    let readerDone = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        readerDone = true;
        break;
      }
      let chunk = decoder.decode(value, { stream: true });
      chunk.split("\n").forEach(async (line) => {
        if (line.startsWith("data:")) {
          let clean = line.replace(/^data:/, "").trimStart();
          if (clean) {
            assistantText += clean + " ";
            assistantMessage.content = assistantText;
            messages.value[messages.value.length - 1] = {
              ...assistantMessage,
            };
            scrollToBottom();
            await new Promise((resolve) => setTimeout(resolve, 22));
          }
        }
      });
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    if (readerDone) {
      assistantMessage.status = "sent";
      assistantMessage.timestamp = new Date();
      isTyping.value = false;
    }
  } catch (error) {
    console.error("Streaming error:", error);
    assistantMessage.status = "error";
    isTyping.value = false;
    isloadning.value = false;
  }
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

const handleScroll = debounce(() => {
  const container = messagesContainer.value;
  if (container.scrollTop <= container.clientHeight * 0.2 && !isLoading.value) {
    loadMessages();
  }
}, 300);

const toggleSidebar = () => {
  // TODO: Implement sidebar toggle for document preview
};

onMounted(async () => {
  await loadConversation();
  scrollToBottom();
});
</script>

<style scoped>
.blinking-cursor {
  display: inline-block;
  width: 1ch;
  animation: blink 1s steps(1) infinite;
}

.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-left: 2px;
  background: #bbb;
  border-radius: 50%;
  animation: bounce 1.2s infinite;
}
.dot1 {
  animation-delay: 0s;
}
.dot2 {
  animation-delay: 0.2s;
}
.dot3 {
  animation-delay: 0.4s;
}
@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.5);
  }
}
</style>
