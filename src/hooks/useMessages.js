import { useEffect, useCallback } from 'react';
import { listenToMessages, sendMessage } from '../lib/firebase/messages';
import { useChatStore } from '../store/chat.store';

export const useMessages = (chatId, currentUserId) => {
  const { setMessages, addMessage } = useChatStore();

  useEffect(() => {
    if (!chatId) return;
    const unsub = listenToMessages(chatId, (messages) => {
      setMessages(messages);
    });
    return () => unsub();
  }, [chatId, setMessages]);

  const send = useCallback(async (text) => {
    if (!chatId) throw new Error('No chat selected');
    const msg = { chatId, senderId: currentUserId, text };
    await sendMessage(msg);
    // optimistic add is handled by onSnapshot; optionally add local fallback
  }, [chatId, currentUserId]);

  return { send };
};
