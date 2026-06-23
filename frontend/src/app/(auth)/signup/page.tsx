'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { TARGET_ROLES, EXPERIENCE_LEVELS } from '@/lib/constants';
import type { ExperienceLevel } from '@/lib/types';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experience, setExperience] = useState<ExperienceLevel>('fresher');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('Please fill all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole) { setError('Please select a target role'); return; }
    signup(name, email, password, targetRole, experience);
    router.push('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      <div className="hero-gradient" style={{ background: 'var(--accent-primary)', top: -200, left: -100 }} />
      <div className="hero-gradient" style={{ background: 'var(--accent-warm)', bottom: -200, right: -100, width: 400, height: 400 }} />

      <div className="animate-scale-in" style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
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
          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
            {[1, 2].map(s => (
              <div key={s} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: s <= step ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>

          {step === 1 ? (
            <>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Create your account</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 28 }}>
                Start your interview preparation journey
              </p>

              {error && (
                <div style={{
                  padding: '10px 14px', marginBottom: 20, borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-warm-dim)', color: 'var(--accent-warm)', fontSize: '0.85rem',
                }}>{error}</div>
              )}

              <form onSubmit={handleStep1}>
                <div style={{ marginBottom: 16 }}>
                  <label className="label">Full Name</label>
                  <input className="input" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} id="signup-name" />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label className="label">Email</label>
                  <input type="email" className="input" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} id="signup-email" />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label className="label">Password</label>
                  <input type="password" className="input" placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} id="signup-password" />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} id="signup-next">
                  Continue →
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Tell us about yourself</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 28 }}>
                This helps us personalize your experience
              </p>

              {error && (
                <div style={{
                  padding: '10px 14px', marginBottom: 20, borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-warm-dim)', color: 'var(--accent-warm)', fontSize: '0.85rem',
                }}>{error}</div>
              )}

              <form onSubmit={handleStep2}>
                <div style={{ marginBottom: 20 }}>
                  <label className="label">Target Role</label>
                  <select className="input select" value={targetRole} onChange={e => setTargetRole(e.target.value)} id="signup-role">
                    <option value="">Select a role...</option>
                    {TARGET_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label className="label">Experience Level</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
                    {EXPERIENCE_LEVELS.map(lvl => (
                      <button
                        type="button"
                        key={lvl.value}
                        onClick={() => setExperience(lvl.value as ExperienceLevel)}
                        style={{
                          padding: '14px 12px', borderRadius: 'var(--radius-md)',
                          border: `1px solid ${experience === lvl.value ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                          background: experience === lvl.value ? 'var(--accent-primary-dim)' : 'var(--bg-input)',
                          color: experience === lvl.value ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'inherit',
                        }}
                        id={`signup-exp-${lvl.value}`}
                      >
                        <span style={{ fontSize: '1.2rem' }}>{lvl.icon}</span>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: 4 }}>{lvl.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2 }} id="signup-submit">Create Account</button>
                </div>
              </form>
            </>
          )}

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
