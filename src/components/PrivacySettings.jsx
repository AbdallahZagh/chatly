import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { mockContacts } from '../lib/mockData';

const PrivacySettings = () => {
  const { settings, addBlockedUser, removeBlockedUser } = useAppStore();
  const [username, setUsername] = useState('');

  const blocked = settings.blockedUsers || [];

  const addByUsername = () => {
    if (!username.trim()) return;
    addBlockedUser({ username, avatar: '👤' });
    setUsername('');
  };

  const addFromContacts = (contact) => {
    addBlockedUser({ username: contact.name, avatar: contact.avatar });
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg">
        <h4 className="font-semibold mb-2">Blocked users</h4>
        {blocked.length === 0 ? (
          <p className="text-[var(--text-secondary)]">No blocked users</p>
        ) : (
          <ul className="space-y-2">
            {blocked.map((u, i) => (
              <li key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{u.avatar}</div>
                  <div>
                    <div className="font-semibold">{u.username}</div>
                  </div>
                </div>

                <button onClick={() => removeBlockedUser(u.username)} className="text-sm text-[var(--accent-primary)]">Unblock</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg">
        <h4 className="font-semibold mb-2">Add to blocked list</h4>
        <div className="flex gap-2">
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-accent)]" />
          <button onClick={addByUsername} className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-[var(--bg-main)]">Block</button>
        </div>

        <div className="mt-4">
          <h5 className="text-sm text-[var(--text-secondary)] mb-2">From contacts</h5>
          <div className="grid grid-cols-2 gap-2">
            {mockContacts.map((c) => (
              <button key={c.id} onClick={() => addFromContacts(c)} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-accent)]">
                <div className="text-xl">{c.avatar}</div>
                <div className="text-sm">{c.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
