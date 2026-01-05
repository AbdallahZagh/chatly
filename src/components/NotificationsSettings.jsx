import { useAppStore } from '../store/useAppStore';
import { useState, useEffect } from 'react';

const NotificationsSettings = () => {
  const { settings, updateSettings } = useAppStore();
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission) {
      setPermission(Notification.permission);
    }
  }, []);

  const toggle = (key) => updateSettings({ [key]: !settings[key] });

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return;
    try {
      const p = await Notification.requestPermission();
      setPermission(p);
      if (p === 'granted') {
        // Optionally send a test notification
        new Notification('Notifications enabled', { body: 'You will receive message notifications.' });
        updateSettings({ notifications: true });
      }
    } catch (e) {
      console.warn('Notification permission request failed', e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg">
        <div>
          <h4 className="font-semibold">Message notifications</h4>
          <p className="text-sm text-[var(--text-secondary)]">Receive notifications for new messages</p>
        </div>
        <label className="switch">
          <input type="checkbox" checked={settings.notifications} onChange={() => toggle('notifications')} />
          <span className="slider" />
        </label>
      </div>

      <div className="flex items-center justify-between p-4 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg">
        <div>
          <h4 className="font-semibold">Sound alerts</h4>
          <p className="text-sm text-[var(--text-secondary)]">Play a sound for incoming messages</p>
        </div>
        <label className="switch">
          <input type="checkbox" checked={settings.sound} onChange={() => toggle('sound')} />
          <span className="slider" />
        </label>
      </div>

      <div className="flex items-center justify-between p-4 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg">
        <div>
          <h4 className="font-semibold">Desktop notifications</h4>
          <p className="text-sm text-[var(--text-secondary)]">Show notifications on your desktop</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="switch">
            <input type="checkbox" checked={settings.desktop} onChange={() => toggle('desktop')} />
            <span className="slider" />
          </label>
          <button onClick={requestPermission} className="px-3 py-1 rounded-md bg-[var(--bg-accent)]">{permission === 'granted' ? 'Granted' : 'Request'}</button>
        </div>
      </div>

      {/* Optional: mute per chat would require per-chat state */}
    </div>
  );
};

export default NotificationsSettings;
