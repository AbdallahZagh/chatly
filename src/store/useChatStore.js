import { create } from 'zustand';
import { mockChats, mockMessages } from '../lib/mockData';

export const useChatStore = create((set) => ({
  chats: mockChats,
  activeChat: null,
  messages: [],
  searchQuery: '',
  showContacts: false,

  setActiveChat: (chat) => set({ activeChat: chat, messages: mockMessages[chat?.id] || [] }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message],
    chats: state.chats.map((c) => 
      c.id === state.activeChat?.id 
        ? { ...c, lastMessage: message.text, timestamp: 'Now' }
        : c
    ),
  })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setShowContacts: (show) => set({ showContacts: show }),
  clearChat: () => set({ activeChat: null, messages: [] }),
}));