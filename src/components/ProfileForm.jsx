import { useState, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { User } from 'lucide-react';

const ProfileForm = () => {
  const { profile, updateProfile } = useAppStore();
  const [form, setForm] = useState(profile);
  const [editing, setEditing] = useState(false);
  const fileRef = useRef(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = () => {
    updateProfile(form);
    setEditing(false);
  };

  const onCancel = () => {
    setForm(profile);
    setEditing(false);
  };

  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((s) => ({ ...s, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => setForm((s) => ({ ...s, avatar: '' }));

  return (
    <>
      <div className="flex items-center flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-28 h-28 rounded-full flex items-center justify-center text-4xl bg-[var(--bg-accent)] overflow-hidden">
            {form.avatar ? (
              // If avatar is a data URL, render it
              typeof form.avatar === 'string' && form.avatar.startsWith('data:') ? (
                <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{form.avatar}</span>
              )
            ) : (
                <User/>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={() => fileRef.current?.click()} className="px-3 py-1 rounded-md bg-[var(--bg-accent)] hover:bg-[var(--bg-accent)]/50 transition-colors">Upload</button>
            <button onClick={removeImage} className="px-3 py-1 rounded-md border border-[var(--border-main)] hover:bg-[var(--bg-accent)]/50 hover:border-[var(--border-main)]/50 transition-colors">Remove</button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickImage} />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <input
              name="displayName"
              value={form.displayName}
              onChange={onChange}
              disabled={!editing}
              placeholder="Display name"
              className={`${editing ? 'px-3 py-2 rounded-lg bg-[var(--bg-accent)] w-full outline-none focus:ring focus:ring-[var(--accent-primary)]' : 'text-2xl font-bold bg-transparent focus:outline-none'} `}
            />
            {!editing ? (
              <button onClick={() => setEditing(true)} className="ml-auto rounded-md py-1 px-5 bg-[var(--text-main)] text-[var(--bg-accent)] hover:bg-[var(--text-main)]/80 transition-colors">Edit</button>
            ) : null}
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              disabled={!editing}
              placeholder="username"
              className="px-3 py-2 rounded-lg bg-[var(--bg-accent)] outline-none focus:ring focus:ring-[var(--accent-primary)]"
            />

            <input
              name="email"
              value={form.email}
              onChange={onChange}
              disabled={!editing}
              placeholder="email"
              className="px-3 py-2 rounded-lg bg-[var(--bg-accent)] outline-none focus:ring focus:ring-[var(--accent-primary)]"
            />
          </div>

          {/* Render any extra profile fields dynamically */}
          {Object.keys(form)
            .filter((k) => !['avatar', 'displayName', 'username', 'email'].includes(k))
            .map((key) => (
              <div className="mt-3" key={key}>
                <input name={key} value={form[key] || ''} onChange={onChange} disabled={!editing} placeholder={key} className="w-full px-3 py-2 rounded-lg bg-[var(--bg-accent)]" />
              </div>
            ))}
        </div>
      </div>

      {editing && (
        <div className="mt-4 flex gap-3">
          <button onClick={onSave} className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 transition-colors text-[var(--bg-main)]">Save</button>
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-[var(--border-main)] hover:border-[var(--border-main)]/50 hover:bg-[var(--bg-accent)]/50 transition-colors">Cancel</button>
        </div>
      )}
    </>
  );
};

export default ProfileForm;
