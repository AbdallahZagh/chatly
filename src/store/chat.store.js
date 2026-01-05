import { create } from 'zustand';

export const useChatStore = create((set) => ({
  chats: [],
  activeChat: null,
  messages: [],
  setChats: (chats) => set({ chats }),
  setActiveChat: (chat) => set({ activeChat: chat }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
}));
