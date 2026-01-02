// Mock data for chat application
export const mockChats = [
  {
    id: 1,
    name: 'Sarah Wilson',
    avatar: '👩‍💻',
    lastMessage: 'That sounds great! Let me know when you\'re ready.',
    timestamp: '2:45 PM',
    unread: 2,
    status: 'online',
  },
  {
    id: 2,
    name: 'Alex Chen',
    avatar: '👨‍🔬',
    lastMessage: 'Did you see the new design updates?',
    timestamp: 'Yesterday',
    unread: 0,
    status: 'offline',
  },
  {
    id: 3,
    name: 'Jordan Lee',
    avatar: '👨‍🎨',
    lastMessage: 'Perfect! I\'ll start working on it tomorrow.',
    timestamp: '10:30 AM',
    unread: 1,
    status: 'online',
  },
  {
    id: 4,
    name: 'Casey Roberts',
    avatar: '👩‍📊',
    lastMessage: 'The presentation is ready for review.',
    timestamp: '3 days ago',
    unread: 0,
    status: 'offline',
  },
  {
    id: 5,
    name: 'Morgan Taylor',
    avatar: '👨‍💼',
    lastMessage: 'Can we schedule a call next week?',
    timestamp: '5 days ago',
    unread: 0,
    status: 'offline',
  },
];

export const mockContacts = [
  {
    id: 6,
    name: 'Emma Davis',
    avatar: '👩‍💪',
    status: 'online',
  },
  {
    id: 7,
    name: 'Lucas Martinez',
    avatar: '👨‍🎭',
    status: 'away',
  },
  {
    id: 8,
    name: 'Sophie Anderson',
    avatar: '👩‍🚀',
    status: 'offline',
  },
  {
    id: 9,
    name: 'Oliver Johnson',
    avatar: '👨‍⚖️',
    status: 'online',
  },
];

export const mockMessages = {
  1: [
    { id: 1, sender: 'other', text: 'Hey! How are you?', timestamp: '2:30 PM' },
    { id: 2, sender: 'user', text: 'Hi Sarah! I\'m doing great, thanks for asking!', timestamp: '2:35 PM' },
    { id: 3, sender: 'other', text: 'That sounds great! Let me know when you\'re ready.', timestamp: '2:45 PM' },
    { id: 4, sender: 'user', text: 'Will do! I\'ll reach out tomorrow.', timestamp: '2:50 PM' },
  ],
  2: [
    { id: 1, sender: 'user', text: 'Hi Alex!', timestamp: '9:00 AM' },
    { id: 2, sender: 'other', text: 'Hey! Did you see the new design updates?', timestamp: '10:30 AM' },
    { id: 3, sender: 'user', text: 'Not yet, let me check right now', timestamp: '10:35 AM' },
  ],
  3: [
    { id: 1, sender: 'other', text: 'I\'ve reviewed the project scope', timestamp: '8:15 AM' },
    { id: 2, sender: 'user', text: 'Great! And what do you think?', timestamp: '8:20 AM' },
    { id: 3, sender: 'other', text: 'Perfect! I\'ll start working on it tomorrow.', timestamp: '10:30 AM' },
  ],
};
