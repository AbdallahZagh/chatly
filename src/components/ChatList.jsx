import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useChatStore } from '../store/useChatStore';
import { mockContacts } from '../lib/mockData';
import { Moon, Search, Sun, User } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';

const ChatList = () => {
  const { chats, activeChat, setActiveChat, searchQuery, setSearchQuery, showContacts, setShowContacts } =
    useChatStore();
    const { theme, toggleTheme } = useTheme();
      const [mounted, setMounted] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
      setMounted(true);
    }, []);

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    setSearchQuery(e.target.value);
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const filteredContacts = mockContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const displayList = showContacts ? filteredContacts : filteredChats;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg-main)] border-r border-[var(--accent-primary)]">
      {/* Header */}
      <div className="p-4 space-y-2 border-b border-[var(--border-main)]">
        <div className='flex justify-between'>
        <h1 className="text-2xl font-bold text-[var(--text-main)] mb-4">Chatly</h1>
        <div className='flex gap-2'>
        {/* Theme Toggle */}
            {mounted && (
              <motion.button
              whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="w-10 h-10 flex justify-center items-center rounded-full bg-[var(--bg-main)] text-[var(--text-main)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-main)] border border-[var(--accent-primary)] transition"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}
              </motion.button>
            )}

        <Link to="/profile">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 flex justify-center items-center rounded-full bg-[var(--bg-main)] text-[var(--text-main)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-main)] border border-[var(--accent-primary)] transition"
              >
                <User/>
              </motion.button>
            </Link>
        </div>
                </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchInput}
            onChange={handleSearch}
            className="w-full px-4 py-2.5 rounded-2xl bg-[var(--bg-surface)] text-[var(--text-main)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring focus:ring-[var(--accent-primary)]"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
          <Search/></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 px-4 pt-4 border-b border-[var(--border-main)]">
        <button
          onClick={() => setShowContacts(false)}
          className={`flex-1 pb-3 font-semibold border-b-2 transition ${
            !showContacts
              ? 'text-[var(--accent-primary)] border-[var(--accent-primary)]'
              : 'text-[var(--text-secondary)] border-transparent'
          }`}
        >
          Chats
        </button>
        <button
          onClick={() => setShowContacts(true)}
          className={`flex-1 pb-3 font-semibold border-b-2 transition ${
            showContacts
              ? 'text-[var(--accent-primary)] border-[var(--accent-primary)]'
              : 'text-[var(--text-secondary)] border-transparent'
          }`}
        >
          Contacts
        </button>
      </div>

      {/* Chat List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto"
      >
        {displayList.length === 0 ? (
          <div className="p-6 text-center text-[var(--text-secondary)]">
            <p className="text-lg">No {showContacts ? 'contacts' : 'chats'} found</p>
          </div>
        ) : (
          displayList.map((item) => (
            <motion.button
              key={item.id}
              variants={itemVariants}
              onClick={() => !showContacts && setActiveChat(item)}
              disabled={showContacts}
              className={`w-full p-3 flex items-center gap-3 hover:bg-[var(--bg-surface)] transition border-b border-[var(--border-main)]/50 ${
                activeChat?.id === item.id && !showContacts ? 'bg-[var(--bg-accent)]' : ''
              } ${showContacts ? 'cursor-default' : 'cursor-pointer'} disabled:hover:bg-transparent`}
            >
              {/* Avatar */}
              <div className="text-4xl flex-shrink-0">{item.avatar}</div>

              {/* Content */}
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-[var(--text-main)] truncate">{item.name}</h3>
                  {!showContacts && (
                    <span className="text-xs text-[var(--text-secondary)] flex-shrink-0">
                      {item.timestamp}
                    </span>
                  )}
                </div>

                {!showContacts && (
                  <p className="text-sm text-[var(--text-secondary)] truncate">{item.lastMessage}</p>
                )}

                {showContacts && item.status && (
                  <p className="text-xs text-[var(--text-secondary)]">
                    {item.status === 'online' ? '🟢' : item.status === 'away' ? '🟡' : '⚪'} {item.status}
                  </p>
                )}
              </div>

              {/* Unread Badge */}
              {!showContacts && item.unread > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-[var(--accent-primary)] text-[var(--bg-main)] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0"
                >
                  {item.unread}
                </motion.div>
              )}
            </motion.button>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default ChatList;
