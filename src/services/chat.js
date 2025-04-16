import axiosInterceptor from '@/utils/axiosInterceptor';

export const chat = {
    // Get conversation history
    getConversation(conversationId) {
        return axiosInterceptor.get(`/conversations/${conversationId}/`);    
    },

    // Get paginated messages for a conversation
    getMessages(conversationId, page = 1) {
        return axiosInterceptor.get(`/conversations/${conversationId}/messages/?page=${page}`);
    },

    // Send a message to the conversation
    sendMessage(conversationId, message) {
        return axiosInterceptor.post(`/conversations/${conversationId}/chat/`, {
            message
        });
    },

    // Get all conversations
    listConversations() {
        return axiosInterceptor.get('/conversations/');
    },
};