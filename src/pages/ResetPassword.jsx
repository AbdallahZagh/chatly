import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email || '';

  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    // Simulate API: verify OTP & reset password
    await new Promise((r) => setTimeout(r, 800));
    setConfirmed(true);
    // Optionally navigate to login
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] text-[var(--text-main)] p-6">
      <div className="max-w-md w-full bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Enter OTP & New Password</h2>
        <p className="text-[var(--text-secondary)] mb-4">We've sent an OTP to <strong>{email}</strong>. Enter it below with your new password.</p>

        <form onSubmit={handleReset} className="space-y-4">
          <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="OTP code" className="w-full px-4 py-2 rounded-lg bg-[var(--bg-accent)]" />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="w-full px-4 py-2 rounded-lg bg-[var(--bg-accent)]" />

          <button type="submit" className="w-full px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-[var(--bg-main)]">Reset password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
