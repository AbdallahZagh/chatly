import { useEffect, useState, useCallback } from 'react';
import { listenToUserChats, getOrCreateChat } from '../lib/firebase/chats';
import { useChatStore } from '../store/chat.store';

export const useChats = (userId) => {
  const { setChats, setActiveChat } = useChatStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const unsub = listenToUserChats(userId, (chats) => {
      setChats(chats);
      setLoading(false);
    });
    return () => unsub();
  }, [userId, setChats]);

  const openChatWith = useCallback(async (otherUserId) => {
    const chatId = await getOrCreateChat(userId, otherUserId);
    setActiveChat({ id: chatId, participants: [userId, otherUserId] });
    return chatId;
  }, [userId, setActiveChat]);

  return { loading, openChatWith };
};
