import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ChatWindow = ({ chat, messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg-main)]">
        <p className="text-6xl mb-4">💬</p>
        <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2">No Chat Selected</h2>
        <p className="text-[var(--text-secondary)]">Select a chat from the left to start messaging</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--bg-main)]"
    >
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center">
          <p className="text-5xl mb-4">{chat.avatar}</p>
          <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">Say hi to {chat.name}</h3>
          <p className="text-[var(--text-secondary)]">Start a conversation by sending a message</p>
        </div>
      ) : (
        <>
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2.5 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-[var(--accent-primary)] text-[var(--bg-main)] rounded-br-none'
                    : 'bg-[var(--bg-surface)] text-[var(--text-main)] rounded-bl-none border border-[var(--border-main)]'
                }`}
              >
                <p className="break-words">{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === 'user'
                      ? 'text-[var(--bg-main)]/70'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </motion.div>
  );
};

export default ChatWindow;
