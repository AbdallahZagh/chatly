import { useState } from 'react';
import ProfileForm from '../components/ProfileForm';
import NotificationsSettings from '../components/NotificationsSettings';
import PrivacySettings from '../components/PrivacySettings';
import ProfileNavbar from '../components/ProfileNavbar';
import DeactivateModal from '../components/DeactivateModal';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [openSection, setOpenSection] = useState(null); // 'notifications' | 'privacy' | null
  const [showDeactivate, setShowDeactivate] = useState(false);
  const navigate = useNavigate();
  const { logout, updateProfile, profile } = useAppStore();

  const handleDeactivate = () => {
    // Placeholder: hook for API integration -> deactivate user
    // For now, logout and clear profile
    logout();
    updateProfile({ avatar: '', displayName: '', username: '', email: '' });
    setShowDeactivate(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
      <ProfileNavbar />

      <main className=" mx-auto space-y-8 px-20 py-8 flex justify-evenly flex-col md:flex-row">
        {/* User info */}
        <section className="w-[100%] md:w-[50%] bg-[var(--bg-surface)] border border-[var(--border-main)] space-y-10 rounded-xl py-6 px-8">
          <h1 className="text-2xl font-medium">Your profile</h1>
          <ProfileForm />
        </section>

        {/* Settings */}
        <section className="w-[100%] md:w-[45%] bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-6">
          <h2 className="text-2xl font-medium mb-4">Settings</h2>

          <div className="flex flex-col gap-2 mb-4">
            {/* Buttons row - each acts as accordion trigger */}
              <button
                aria-expanded={openSection === 'notifications'}
                onClick={() => setOpenSection(openSection === 'notifications' ? null : 'notifications')}
                className={`flex-1 flex justify-between items-center px-4 py-3 rounded-md ${openSection === 'notifications' ? 'bg-[var(--accent-primary)] text-[var(--bg-main)]' : 'bg-[var(--bg-accent)] hover:bg-[var(--bg-accent)]/50 transition-colors'}`}>
                <span>Notifications</span>
                <span className={`transform transition-transform duration-300 ${openSection === 'notifications' ? 'rotate-90' : ''}`}>›</span>
              </button>

              <button
                aria-expanded={openSection === 'privacy'}
                onClick={() => setOpenSection(openSection === 'privacy' ? null : 'privacy')}
                className={`flex-1 flex justify-between items-center px-4 py-3 rounded-md ${openSection === 'privacy' ? 'bg-[var(--accent-primary)] text-[var(--bg-main)]' : 'bg-[var(--bg-accent)] hover:bg-[var(--bg-accent)]/50 transition-colors'}`}>
                <span>Privacy</span>
                <span className={`transform transition-transform duration-300 ${openSection === 'privacy' ? 'rotate-90' : ''}`}>›</span>
              </button>

              <button onClick={() => navigate('/forgot-password')} className="px-4 py-3 rounded-md text-left bg-[var(--bg-accent)] hover:bg-[var(--bg-accent)]/50 transition-colors">Reset password</button>

              <button onClick={() => setShowDeactivate(true)} className="px-4 py-3 rounded-md text-left text-red-600/75 bg-[var(--bg-accent)] hover:bg-[var(--bg-accent)]/50 transition-colors">Deactivate account</button>
            {/* CONTENT PANELS - ALWAYS MOUNTED */}
            <div className="space-y-3 mt-2">
              <div className={`overflow-hidden transition-all duration-300 ease-out origin-top rounded-lg border border-[var(--border-main)] bg-[var(--bg-main)] ${openSection === 'notifications' ? 'max-h-96 opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-95'}`}>
                <div className="p-4">
                  <NotificationsSettings />
                </div>
              </div>

              <div className={`overflow-hidden transition-all duration-300 ease-out origin-top rounded-lg border border-[var(--border-main)] bg-[var(--bg-main)] ${openSection === 'privacy' ? 'max-h-96 opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-95'}`}>
                <div className="p-4">
                  <PrivacySettings />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <DeactivateModal open={showDeactivate} onClose={() => setShowDeactivate(false)} onConfirm={handleDeactivate} />
    </div>
  );
};

export default ProfilePage;
