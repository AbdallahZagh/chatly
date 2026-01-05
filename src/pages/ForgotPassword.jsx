import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    // Simulate API call to request OTP
    await new Promise((r) => setTimeout(r, 700));
    setSent(true);
    // Navigate to reset page with email in state
    navigate('/reset-password', { state: { email } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] text-[var(--text-main)] p-6">
      <div className="max-w-md w-full bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Reset your password</h2>
        <p className="text-[var(--text-secondary)] mb-4">Enter your account email to receive an OTP to reset your password.</p>

        <form onSubmit={handleSendOtp} className="space-y-4">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-2 rounded-lg bg-[var(--bg-accent)]" />

          <button type="submit" className="w-full px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-[var(--bg-main)]">Send OTP</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
