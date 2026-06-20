'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { resumeStore, interviewStore, feedbackStore } from '@/lib/store';
import { generateFeedback } from '@/lib/mock-ai';
import ScoreRing from '@/components/ui/ScoreRing';
import { getScoreColor } from '@/lib/utils';
import type { Resume, Interview, Feedback } from '@/lib/types';

const QUICK_ACTIONS = [
  { label: 'Start Interview', href: '/dashboard/interview', icon: '🎙️', desc: 'Practice with AI', color: '#7f5af0' },
  { label: 'Analyze Resume', href: '/dashboard/resume', icon: '📄', desc: 'Get ATS score', color: '#00d1ff' },
  { label: 'View Roadmap', href: '/dashboard/roadmap', icon: '🗺️', desc: 'Your plan', color: '#a78bfa' },
  { label: 'DSA Tracker', href: '/dashboard/dsa', icon: '💻', desc: 'Coding progress', color: '#22c55e' },
];

export default function DashboardOverview() {
  const { user } = useAuth();
  const [resume, setResume] = useState<Resume | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    setResume(resumeStore.getLatest() || null);
    setInterviews(interviewStore.getAll());
    const existing = feedbackStore.getAll();
    const completed = interviewStore.getCompleted();
    const existingIds = existing.map(f => f.interviewId);
    const missing = completed.filter(i => !existingIds.includes(i.id));
    if (missing.length > 0) {
      Promise.all(missing.map(i => generateFeedback(i))).then(results => {
        results.forEach(f => feedbackStore.add(f));
        setFeedbacks(feedbackStore.getAll());
      });
    } else {
      setFeedbacks(existing);
    }
  }, []);

  const completedCount = interviews.filter(i => i.status === 'completed').length;
  const avgScore = feedbacks.length > 0
    ? Math.round(feedbacks.reduce((s, f) => s + f.scores.overall, 0) / feedbacks.length) : 0;
  const latestFb = feedbacks[feedbacks.length - 1];
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="animate-fade-in">
      {/* Welcome banner */}
      <div style={{
        marginBottom: 36, padding: '28px 32px',
        background: 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(0,209,255,0.06))',
        border: '1px solid rgba(108,99,255,0.18)',
        borderRadius: 'var(--radius-lg)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.15), transparent 70%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 700,
            letterSpacing: '-0.03em', marginBottom: 6,
          }}>
            Welcome back, <span className="gradient-text">{firstName}</span> 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {latestFb
              ? `Your last interview scored ${latestFb.scores.overall}% · Keep pushing 🚀`
              : `Ready to ace your ${user?.targetRole} interview? Let's get started.`}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'ATS Score', value: resume ? `${resume.atsScore}` : '—', icon: '📄', color: '#6c63ff', href: '/dashboard/resume' },
          { label: 'Interviews', value: `${completedCount}`, icon: '🎙️', color: '#00d1ff', href: '/dashboard/interview' },
          { label: 'Avg Score', value: avgScore ? `${avgScore}%` : '—', icon: '📊', color: '#f59e0b', href: '/dashboard/analytics' },
          { label: 'Hireability', value: latestFb ? `${latestFb.hireability}%` : '—', icon: '🎯', color: '#22c55e', href: '/dashboard/feedback' },
        ].map(s => (
          <Link key={s.label} href={s.href} style={{ textDecoration: 'none' }}>
            <div className="card metric-card" style={{ padding: '22px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</span>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem',
                }}>{s.icon}</div>
              </div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700,
                color: s.value === '—' ? 'var(--text-muted)' : s.color,
                letterSpacing: '-0.03em',
              }}>{s.value}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Quick Actions */}
        <div className="card-static" style={{ padding: 28 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: 20, letterSpacing: '-0.02em' }}>
            ⚡ Quick Actions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {QUICK_ACTIONS.map(a => (
              <Link key={a.label} href={a.href} style={{
                padding: '16px 14px', borderRadius: 'var(--radius-md)',
                background: `${a.color}0d`, border: `1px solid ${a.color}20`,
                transition: 'all 0.2s', display: 'block', textDecoration: 'none',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${a.color}50`; e.currentTarget.style.background = `${a.color}15`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${a.color}20`; e.currentTarget.style.background = `${a.color}0d`; }}
              >
                <div style={{ fontSize: '1.3rem', marginBottom: 6 }}>{a.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 2 }}>{a.label}</div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{a.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Latest Performance / Empty state */}
        {latestFb ? (
          <div className="card-static" style={{ padding: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: 20, letterSpacing: '-0.02em' }}>
              📊 Latest Performance
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
              <ScoreRing score={latestFb.scores.overall} size={110} strokeWidth={7} label="Overall" />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Object.entries(latestFb.scores).filter(([k]) => k !== 'overall').map(([key, val]) => (
                    <div key={key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.78rem' }}>
                        <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key}</span>
                        <span style={{ color: getScoreColor(val), fontWeight: 700 }}>{val}%</span>
                      </div>
                      <div className="progress-bar" style={{ height: 4 }}>
                        <div className="progress-fill" style={{ width: `${val}%`, background: getScoreColor(val) }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/dashboard/feedback" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              View Full Feedback →
            </Link>
          </div>
        ) : (
          <div className="card-static" style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 'var(--radius-lg)', marginBottom: 20,
              background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem',
            }}>🎯</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>
              No interviews yet
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 24, maxWidth: 240, lineHeight: 1.6 }}>
              Take your first mock interview to unlock AI feedback and performance analytics.
            </p>
            <Link href="/dashboard/interview" className="btn btn-primary btn-sm">
              Start Now →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
