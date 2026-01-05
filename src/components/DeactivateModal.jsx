import React from 'react';

const DeactivateModal = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="bg-[var(--bg-surface)] text-[var(--text-main)] rounded-2xl p-6 w-full max-w-md border border-[var(--border-main)]">
        <h3 className="text-xl font-bold mb-2">Deactivate account</h3>
        <p className="text-[var(--text-secondary)] mb-6">This will deactivate your account. Your data may be removed. This action cannot be undone.</p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[var(--border-main)] hover:border-[var(--border-main)]/50 hover:bg-[var(--bg-accent)]/50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600/75 hover:bg-red-600/50 transition-colors text-white">Deactivate</button>
        </div>
      </div>
    </div>
  );
};

export default DeactivateModal;
