import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form);
      navigate('/chats');
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-6">
      <form onSubmit={onSubmit} className="max-w-md w-full bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-main)] space-y-4">
        <h2 className="text-xl font-bold">Sign in</h2>
        {error && <div className="text-red-400">{error}</div>}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} className="w-full px-3 py-2 rounded-lg bg-[var(--bg-accent)]" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} className="w-full px-3 py-2 rounded-lg bg-[var(--bg-accent)]" />

        <div className="flex items-center justify-between">
          <button disabled={loading} className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-[var(--bg-main)]">{loading ? 'Signing in...' : 'Sign in'}</button>
          <button type="button" onClick={() => navigate('/forgot-password')} className="text-sm text-[var(--text-secondary)]">Forgot?</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
