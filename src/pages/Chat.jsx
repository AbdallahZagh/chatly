import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { useChatStore } from '../store/chat.store';
import { useChats } from '../hooks/useChats';
import { useMessages } from '../hooks/useMessages';
import ChatList from '../components/ChatList';
import ChatHeader from '../components/ChatHeader';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';

const ChatPage = () => {
  const { user } = useAuthStore();
  const { activeChat, messages } = useChatStore();
  useChats(user?.uid);
  useMessages(activeChat?.id, user?.uid);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[var(--bg-main)]">
      <div className="w-1/4 hidden md:flex flex-col">
        <ChatList />
      </div>
      <div className="flex-1 flex flex-col">
        <ChatHeader chat={activeChat} />
        <ChatWindow chat={activeChat} messages={messages} />
        <MessageInput chatSelected={!!activeChat} />
      </div>
    </div>
  );
};

export default ChatPage;
