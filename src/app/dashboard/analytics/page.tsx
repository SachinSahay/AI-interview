'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { feedbackStore, interviewStore, resumeStore } from '@/lib/store';
import { getScoreColor, formatDate } from '@/lib/utils';
import ScoreRing from '@/components/ui/ScoreRing';
import type { Feedback, Interview, Resume } from '@/lib/types';

// Mini bar chart component
function BarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1, background: color,
          height: `${(v / max) * 100}%`,
          borderRadius: '3px 3px 0 0', minHeight: 4,
          opacity: 0.5 + (i / data.length) * 0.5,
          transition: 'height 0.5s ease',
        }} />
      ))}
    </div>
  );
}

// Trend arrow
function Trend({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span style={{ color: up ? 'var(--accent-success)' : 'var(--accent-warm)', fontSize: '0.8rem', fontWeight: 600 }}>
      {up ? '↑' : '↓'} {Math.abs(value)}%
    </span>
  );
}

export default function AnalyticsPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    setFeedbacks(feedbackStore.getAll());
    setInterviews(interviewStore.getAll());
    setResume(resumeStore.getLatest() || null);
  }, []);

  const completed = interviews.filter(i => i.status === 'completed');
  const avgScore = feedbacks.length > 0
    ? Math.round(feedbacks.reduce((s, f) => s + f.scores.overall, 0) / feedbacks.length)
    : 0;

  // Build score trend from feedbacks
  const scoreTrend = feedbacks.slice(-8).map(f => f.scores.overall);
  const technicalTrend = feedbacks.slice(-8).map(f => f.scores.technical);
  const commTrend = feedbacks.slice(-8).map(f => f.scores.communication);

  // Category breakdown
  const catCounts: Record<string, number> = { technical: 0, hr: 0, behavioral: 0, mixed: 0 };
  completed.forEach(i => catCounts[i.type]++);

  // Score improvement
  const firstScore = feedbacks[0]?.scores.overall || 0;
  const lastScore = feedbacks[feedbacks.length - 1]?.scores.overall || 0;
  const improvement = lastScore - firstScore;

  const latestFb = feedbacks[feedbacks.length - 1];

  if (feedbacks.length === 0 && completed.length === 0) {
    return (
      <div className="animate-fade-in">
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>Analytics</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your performance trends over time</p>
        </div>
        <div className="card-static" style={{ padding: 60, textAlign: 'center' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: 16 }}>📊</span>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No data yet</h3>
          <p style={{ color: 'var(--text-tertiary)', marginBottom: 24 }}>
            Complete interviews to start seeing analytics here
          </p>
          <Link href="/dashboard/interview" className="btn btn-primary">Start Interview</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>Analytics Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Your complete performance overview</p>
      </div>

      {/* Top KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Interviews', value: completed.length, icon: '🎙️', color: 'var(--accent-primary)', trend: null },
          { label: 'Avg Score', value: `${avgScore}%`, icon: '📊', color: 'var(--accent-secondary)', trend: null },
          { label: 'Score Improvement', value: `+${Math.max(0, improvement)}%`, icon: '📈', color: 'var(--accent-success)', trend: improvement },
          { label: 'ATS Score', value: resume ? `${resume.atsScore}` : '—', icon: '📄', color: 'var(--accent-gold)', trend: null },
          { label: 'Hireability', value: latestFb ? `${latestFb.hireability}%` : '—', icon: '🎯', color: 'var(--accent-warm)', trend: null },
        ].map(stat => (
          <div key={stat.label} className="card-static" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: 6 }}>{stat.label}</div>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                {stat.trend !== null && <Trend value={stat.trend} />}
              </div>
              <span style={{ fontSize: '1.3rem' }}>{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Score Trend Chart */}
        <div className="card-static" style={{ padding: 28 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>📈 Overall Score Trend</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 20 }}>Last {scoreTrend.length} interviews</p>
          {scoreTrend.length > 0 ? (
            <>
              <BarChart data={scoreTrend} color="var(--accent-primary)" />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                <span>Oldest</span>
                <span>Latest</span>
              </div>
            </>
          ) : (
            <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
              No data yet
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <div className="card-static" style={{ padding: 28 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>🎯 Interview Categories</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { key: 'technical', label: 'Technical', color: 'var(--accent-primary)' },
              { key: 'hr', label: 'HR Round', color: 'var(--accent-secondary)' },
              { key: 'behavioral', label: 'Behavioral', color: 'var(--accent-gold)' },
              { key: 'mixed', label: 'Mixed', color: 'var(--accent-warm)' },
            ].map(cat => {
              const pct = completed.length > 0 ? Math.round((catCounts[cat.key] / completed.length) * 100) : 0;
              return (
                <div key={cat.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{cat.label}</span>
                    <span style={{ fontWeight: 600, color: cat.color }}>{catCounts[cat.key]}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: cat.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Technical vs Communication */}
        <div className="card-static" style={{ padding: 28 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>🧠 Skill Breakdown</h3>
          {latestFb ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <ScoreRing score={latestFb.scores.overall} size={120} strokeWidth={8} label="Overall" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Technical', score: latestFb.scores.technical },
                  { label: 'Communication', score: latestFb.scores.communication },
                  { label: 'Problem Solving', score: latestFb.scores.problemSolving },
                  { label: 'Behavioral', score: latestFb.scores.behavioral },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.82rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                      <span style={{ color: getScoreColor(s.score), fontWeight: 600 }}>{s.score}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${s.score}%`, background: getScoreColor(s.score) }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-tertiary)', textAlign: 'center' }}>Complete an interview first</p>
          )}
        </div>

        {/* Recent interviews list */}
        <div className="card-static" style={{ padding: 28 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>📋 Recent Interviews</h3>
          {completed.length === 0 ? (
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>No interviews yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {completed.slice(-6).reverse().map(int => {
                const fb = feedbacks.find(f => f.interviewId === int.id);
                return (
                  <div key={int.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)',
                    fontSize: '0.85rem',
                  }}>
                    <div>
                      <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{int.type}</span>
                      <span style={{ color: 'var(--text-tertiary)', marginLeft: 8, fontSize: '0.75rem' }}>
                        {int.completedAt ? formatDate(int.completedAt) : ''}
                      </span>
                    </div>
                    {fb ? (
                      <span style={{ fontWeight: 700, color: getScoreColor(fb.scores.overall) }}>
                        {fb.scores.overall}%
                      </span>
                    ) : (
                      <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>Pending</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <Link href="/dashboard/feedback" className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}>
            View All Feedback →
          </Link>
        </div>
      </div>

      {/* Communication vs Technical trend */}
      {(technicalTrend.length > 1 || commTrend.length > 1) && (
        <div className="card-static" style={{ padding: 28 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>📊 Technical vs Communication Trend</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: 8 }}>Technical</div>
              <BarChart data={technicalTrend} color="var(--accent-primary)" />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--accent-secondary)', fontWeight: 600, marginBottom: 8 }}>Communication</div>
              <BarChart data={commTrend} color="var(--accent-secondary)" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
