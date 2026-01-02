import { motion } from 'framer-motion';

const ChatHeader = ({ chat }) => {
  if (!chat) {
    return (
      <div className="h-20 bg-[var(--bg-surface)] border-b border-[var(--border-main)] flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Select a chat to start messaging</p>
      </div>
    );
  }

  const statusColor = chat.status === 'online' ? '🟢' : '⚪';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-20 bg-[var(--bg-surface)] border-b border-[var(--border-main)] flex items-center justify-between px-6"
    >
      <div className="flex items-center gap-3">
        <div className="text-4xl">{chat.avatar}</div>
        <div>
          <h2 className="font-bold text-[var(--text-main)]">{chat.name}</h2>
          <p className="text-xs text-[var(--text-secondary)]">
            {statusColor} {chat.status === 'online' ? 'Active now' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-full bg-[var(--bg-accent)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-main)] transition text-lg"
        >
          📞
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-full bg-[var(--bg-accent)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-main)] transition text-lg"
        >
          ⋮
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ChatHeader;
