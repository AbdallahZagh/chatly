import { create } from "zustand";

export const useAppStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),

  // Profile & Settings
  profile: {
    avatar: '🙂',
    displayName: '',
    username: '',
    email: '',
  },
  settings: {
    notifications: true,
    sound: true,
    desktop: true,
    blockedUsers: [],
  },

  updateProfile: (patch) => set((state) => ({ profile: { ...state.profile, ...patch } })),
  updateSettings: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),
  addBlockedUser: (user) => set((state) => ({ settings: { ...state.settings, blockedUsers: [...state.settings.blockedUsers, user] } })),
  removeBlockedUser: (username) => set((state) => ({ settings: { ...state.settings, blockedUsers: state.settings.blockedUsers.filter(u => u.username !== username) } })),
}));
