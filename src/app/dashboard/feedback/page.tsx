'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { feedbackStore, interviewStore } from '@/lib/store';
import { generateFeedback } from '@/lib/mock-ai';
import ScoreRing from '@/components/ui/ScoreRing';
import { formatDate, getScoreColor, capitalize } from '@/lib/utils';
import type { Feedback } from '@/lib/types';

export default function FeedbackListPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auto-generate feedback for any completed interviews missing it
    const completed = interviewStore.getCompleted();
    const existing = feedbackStore.getAll();
    const existingIds = existing.map(f => f.interviewId);
    const missing = completed.filter(i => !existingIds.includes(i.id));

    if (missing.length > 0) {
      Promise.all(missing.map(i => generateFeedback(i))).then(results => {
        results.forEach(f => feedbackStore.add(f));
        setFeedbacks(feedbackStore.getAll().reverse());
        setLoading(false);
      });
    } else {
      setFeedbacks(existing.reverse());
      setLoading(false);
    }
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--text-tertiary)' }}>Generating feedback...</p>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>Interview Feedback</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review detailed AI analysis of your interview performance</p>
      </div>

      {feedbacks.length === 0 ? (
        <div className="card-static" style={{ padding: 60, textAlign: 'center' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: 16 }}>💡</span>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No feedback yet</h3>
          <p style={{ color: 'var(--text-tertiary)', marginBottom: 24 }}>Complete an interview to receive AI feedback</p>
          <Link href="/dashboard/interview" className="btn btn-primary">Start Interview</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {feedbacks.map(fb => (
            <Link key={fb.id} href={`/dashboard/feedback/${fb.id}`} className="card" style={{ padding: 24, textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <ScoreRing score={fb.scores.overall} size={80} strokeWidth={6} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>{fb.interviewType}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{formatDate(fb.generatedAt)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    {Object.entries(fb.scores).filter(([k]) => k !== 'overall').map(([key, val]) => (
                      <div key={key} style={{ fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-tertiary)' }}>{capitalize(key)}: </span>
                        <span style={{ fontWeight: 600, color: getScoreColor(val) }}>{val}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>Hireability</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: getScoreColor(fb.hireability) }}>{fb.hireability}%</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
