import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useChatStore } from '../store/useChatStore';
import ChatList from '../components/ChatList';
import ChatHeader from '../components/ChatHeader';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import bg from '../assets/chat-bg.png';

const Chats = () => {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const { activeChat, messages } = useChatStore();

  // Redirect to login if not authenticated
//   useEffect(() => {
//     if (!user) {
//       navigate('/login');
//     }
//   }, [user, navigate]);

//   if (!user) {
//     return null;
//   }

  return (
    <div className="flex h-screen bg-[var(--bg-main)]">
      {/* Left Sidebar - Chat List */}
      <div className="w-1/4 hidden md:flex flex-col">
        <ChatList />
      </div>

      {/* Right Panel - Chat Window */}
      <div className="flex-1 md:w-3/4 flex flex-col relative overflow-hidden">
              <img src={bg} className=" h-full absolute inset-0 object-cover bg-center opacity-15 z-0"/>
      
        <ChatHeader chat={activeChat} />
        <ChatWindow chat={activeChat} messages={messages} />
        <MessageInput chatSelected={!!activeChat} />
      </div>
    </div>
  );
};

export default Chats;
