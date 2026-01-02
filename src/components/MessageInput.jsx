import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useChatStore } from '../store/useChatStore';

const MessageInput = ({ chatSelected }) => {
  const [message, setMessage] = useState('');
  const { addMessage } = useChatStore();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatSelected]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        sender: 'user',
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      addMessage(newMessage);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!chatSelected) {
    return (
      <div className="h-24 bg-[var(--bg-surface)] border-t border-[var(--border-main)] flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Select a chat to send messages</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-24 bg-[var(--bg-surface)] border-t border-[var(--border-main)] p-4 flex gap-3 items-end"
    >
      {/* Emoji Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="p-2.5 rounded-full bg-[var(--bg-accent)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-main)] transition text-lg flex-shrink-0"
      >
        😀
      </motion.button>

      {/* Input Field */}
      <div className="flex-1 flex items-center gap-2">
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          rows="1"
          className="flex-1 px-4 py-2.5 rounded-2xl bg-[var(--bg-accent)] text-[var(--text-main)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] resize-none"
          style={{ maxHeight: '100px' }}
        />

        {/* Attachment Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-full bg-[var(--bg-accent)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-main)] transition text-lg flex-shrink-0"
        >
          📎
        </motion.button>
      </div>

      {/* Send Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSend}
        disabled={!message.trim()}
        className="p-2.5 rounded-full bg-[var(--accent-primary)] text-[var(--bg-main)] hover:opacity-90 transition text-lg font-bold flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ➤
      </motion.button>
    </motion.div>
  );
};

export default MessageInput;
