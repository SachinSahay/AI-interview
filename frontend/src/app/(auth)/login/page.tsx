'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    // For demo: auto-login or redirect to signup
    const success = login(email, password);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('No account found. Please sign up first.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      <div className="hero-gradient" style={{ background: 'var(--accent-primary)', top: -200, right: -100 }} />
      <div className="hero-gradient" style={{ background: 'var(--accent-secondary)', bottom: -200, left: -100, width: 400, height: 400 }} />

      <div className="animate-scale-in" style={{
        width: '100%', maxWidth: 420, position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, justifyContent: 'center' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 800, color: 'white',
          }}>IQ</div>
          <span style={{ fontSize: '1.3rem', fontWeight: 700 }}>Interview<span className="gradient-text">IQ</span></span>
        </Link>

        <div className="card-static" style={{ padding: 36 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 28 }}>
            Log in to continue your preparation
          </p>

          {error && (
            <div style={{
              padding: '10px 14px', marginBottom: 20, borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-warm-dim)', color: 'var(--accent-warm)', fontSize: '0.85rem',
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Email</label>
              <input
                type="email" className="input" placeholder="you@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                id="login-email"
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label className="label">Password</label>
              <input
                type="password" className="input" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                id="login-password"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} id="login-submit">
              Log In
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
