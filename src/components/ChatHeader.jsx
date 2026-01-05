import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

const ChatHeader = ({ chat }) => {
  if (!chat) {
    return (
      <div className="relative z-10 h-20 bg-[var(--bg-main)] border-b border-[var(--border-main)] flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Select a chat to start messaging</p>
      </div>
    );
  }

  const statusColor = chat.status === 'online' ? 'bg-green-500' : 'bg-gray-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 h-20 bg-[var(--bg-surface)] border-b border-[var(--border-main)] flex items-center justify-between px-6"
    >
      <div className="flex items-center gap-3">
        <div className="text-4xl">{chat.avatar}</div>
        <div>
          <h2 className="font-bold text-[var(--text-main)]">{chat.name}</h2>
          <p className="text-xs text-[var(--text-secondary)]">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${statusColor}`}></span>
            {chat.status === 'online' ? 'Active now' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-full bg-[var(--bg-main)] text-[var(--text-main)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-main)] transition text-lg"
        >
          <Phone/>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-full bg-[var(--bg-main)] text-[var(--text-main)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-main)] transition text-lg"
        >
          ⋮
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ChatHeader;
