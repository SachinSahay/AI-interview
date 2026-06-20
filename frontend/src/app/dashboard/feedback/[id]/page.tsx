'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { feedbackStore } from '@/lib/store';
import ScoreRing from '@/components/ui/ScoreRing';
import { getScoreColor, capitalize } from '@/lib/utils';
import type { Feedback } from '@/lib/types';

export default function FeedbackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    const fb = feedbackStore.getById(id);
    if (!fb) { router.push('/dashboard/feedback'); return; }
    setFeedback(fb);
  }, [id, router]);

  if (!feedback) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );

  return (
    <div className="animate-fade-in">
      <button className="btn btn-ghost btn-sm" onClick={() => router.back()} style={{ marginBottom: 20 }}>
        ← Back to Feedback
      </button>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>
          Interview Analysis
        </h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>{feedback.interviewType} Interview</span>
        </div>
      </div>

      {/* Scores Overview */}
      <div className="card-static" style={{ padding: 32, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24 }}>
          <ScoreRing score={feedback.scores.overall} size={150} strokeWidth={10} label="Overall" />
          {Object.entries(feedback.scores).filter(([k]) => k !== 'overall').map(([key, val]) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <ScoreRing score={val} size={90} strokeWidth={6} />
              <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, padding: '16px 20px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Hireability Score: </span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: getScoreColor(feedback.hireability) }}>{feedback.hireability}%</span>
        </div>
      </div>

      {/* Strengths + Weaknesses */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card-static" style={{ padding: 28 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: 'var(--accent-success)' }}>✅ Strengths</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {feedback.strengths.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent-success)' }}>•</span> {s}
              </div>
            ))}
          </div>
        </div>
        <div className="card-static" style={{ padding: 28 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: 'var(--accent-warm)' }}>⚠️ Areas to Improve</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {feedback.weaknesses.map((w, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent-warm)' }}>•</span> {w}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="card-static" style={{ padding: 28, marginBottom: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>💡 Improvement Suggestions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {feedback.suggestions.map((s, i) => (
            <div key={i} style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 6, color: 'var(--accent-primary)' }}>{s.area}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 10 }}>{s.suggestion}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {s.resources.map(r => (
                  <span key={r} className="badge badge-purple">{r}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Answer Analysis */}
      {feedback.detailedAnalysis.length > 0 && (
        <div className="card-static" style={{ padding: 28 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>📝 Answer-by-Answer Analysis</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {feedback.detailedAnalysis.map((a, i) => (
              <div key={i} style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', borderLeft: `3px solid ${getScoreColor(a.score)}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Q{i + 1}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: getScoreColor(a.score) }}>{a.score}%</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 6 }}>{a.question}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 8, fontStyle: 'italic' }}>
                  &ldquo;{a.answer.substring(0, 150)}{a.answer.length > 150 ? '...' : ''}&rdquo;
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{a.feedback}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
