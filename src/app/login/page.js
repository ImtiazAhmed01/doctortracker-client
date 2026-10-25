'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { IconMedicalCross, IconLock } from '@/components/Icons';

function LoginForm() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const queryMode = searchParams.get('mode');
    if (queryMode === 'register') setMode('register');
    else if (queryMode === 'login') setMode('login');
  }, [searchParams]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(form.email, form.password);
        toast.success('Signed in successfully');
      } else {
        await registerWithEmail(form.email, form.password, form.name);
        toast.success('Account created successfully');
      }
      router.push('/dashboard');
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg;
      toast.error(serverMsg || err.message || 'Authentication failed');
      console.error('Auth error details:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Signed in with Google');
      router.push('/dashboard');
    } catch (err) {
      console.error('Google Auth error:', err);
      const msg = err.code ? `Google Auth: ${err.code.replace('auth/', '')}` : (err.message || 'Google sign-in failed');
      toast.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <IconMedicalCross size={26} />
          </div>
          <h1 className="auth-title">DoctorTracker</h1>
          <p className="auth-subtitle">
            {mode === 'login' ? 'Sign in to access your clinical portal' : 'Create a new user account'}
          </p>
        </div>

        {/* Tab Switcher for Sign In vs Sign Up */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: '#f1f5f9',
          borderRadius: 8,
          padding: 4,
          marginBottom: 20
        }}>
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              padding: '8px 12px',
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'var(--transition)',
              background: mode === 'login' ? '#ffffff' : 'transparent',
              color: mode === 'login' ? '#0f172a' : 'var(--text-muted)',
              boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            style={{
              padding: '8px 12px',
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'var(--transition)',
              background: mode === 'register' ? '#ffffff' : 'transparent',
              color: mode === 'register' ? '#0f172a' : 'var(--text-muted)',
              boxShadow: mode === 'register' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Google Sign In */}
        <button className="google-btn" onClick={handleGoogle} disabled={googleLoading}>
          {googleLoading ? (
            <div className="spinner spinner-sm" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
          )}
          Continue with Google Workspace
        </button>

        <div className="divider"><span className="divider-text">or authenticate with email</span></div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                name="name"
                className="form-control"
                placeholder="Dr. John Smith"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="admin@hospital.org"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder={mode === 'login' ? '••••••••' : 'Min. 6 characters'}
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
            {loading ? <div className="spinner spinner-sm" /> : null}
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--text-muted)' }}>
          {mode === 'login' ? 'Need an account? ' : 'Already registered? '}
          <button
            onClick={() => setMode(m => m === 'login' ? 'register' : 'login')}
            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            {mode === 'login' ? 'Create credential' : 'Sign in'}
          </button>
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, fontSize: 11.5, color: 'var(--text-muted)' }}>
          <IconLock size={12} />
          <span>Encrypted healthcare administration session</span>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a href="/" style={{ color: 'var(--text-muted)', fontSize: 12.5, textDecoration: 'none' }}>
            &larr; Back to Public Home Page
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
        <div className="spinner" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
