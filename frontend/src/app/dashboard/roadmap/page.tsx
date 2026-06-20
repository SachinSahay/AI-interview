'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { roadmapStore, feedbackStore } from '@/lib/store';
import { generateRoadmap } from '@/lib/mock-ai';
import type { Roadmap } from '@/lib/types';

const CATEGORY_ICONS: Record<string, string> = {
  dsa: '💻', resume: '📄', interview: '🎙️', theory: '📚', project: '🔨',
};
const CATEGORY_COLORS: Record<string, string> = {
  dsa: 'var(--accent-primary)', resume: 'var(--accent-secondary)', interview: 'var(--accent-warm)',
  theory: 'var(--accent-gold)', project: 'var(--accent-success)',
};

export default function RoadmapPage() {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = roadmapStore.get();
    if (existing) {
      setRoadmap(existing);
      setLoading(false);
    } else {
      // Generate roadmap based on feedback
      const feedbacks = feedbackStore.getAll();
      const weakAreas = feedbacks.flatMap(f => f.weaknesses).slice(0, 5);
      generateRoadmap(user?.targetRole || 'Software Engineer', weakAreas).then(r => {
        roadmapStore.set(r);
        setRoadmap(r);
        setLoading(false);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTask = (weekNumber: number, taskId: string, completed: boolean) => {
    roadmapStore.updateTask(weekNumber, taskId, completed);
    setRoadmap(roadmapStore.get());
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--text-tertiary)' }}>Generating your roadmap...</p>
      </div>
    </div>
  );

  if (!roadmap) return null;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>
          Preparation Roadmap
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Your personalized {roadmap.weeks.length}-week plan for {roadmap.targetRole}
        </p>
      </div>

      {/* Progress overview */}
      <div className="card-static" style={{ padding: 24, marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          {roadmap.weeks.map(week => {
            const completed = week.tasks.filter(t => t.completed).length;
            const total = week.tasks.length;
            const pct = Math.round((completed / total) * 100);
            return (
              <div key={week.weekNumber} style={{ flex: 1, minWidth: 120, textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: 6 }}>
                  Week {week.weekNumber}
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: pct === 100 ? 'var(--accent-success)' : 'var(--text-primary)' }}>
                  {completed}/{total}
                </div>
                <div className="progress-bar" style={{ marginTop: 8 }}>
                  <div className="progress-fill" style={{
                    width: `${pct}%`,
                    background: pct === 100 ? 'var(--accent-success)' : undefined,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weeks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {roadmap.weeks.map(week => (
          <div key={week.weekNumber} className="card-static" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  Week {week.weekNumber} — {week.title}
                </h3>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {week.focusAreas.map(area => (
                    <span key={area} className="badge badge-purple">{area}</span>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                {week.tasks.filter(t => t.completed).length}/{week.tasks.length} done
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {week.tasks.map(task => (
                <div key={task.id}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px',
                    borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)',
                    opacity: task.completed ? 0.6 : 1, transition: 'opacity 0.3s',
                  }}
                >
                  <button
                    onClick={() => toggleTask(week.weekNumber, task.id, !task.completed)}
                    style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 2,
                      border: `2px solid ${task.completed ? 'var(--accent-success)' : 'var(--border-default)'}`,
                      background: task.completed ? 'var(--accent-success)' : 'transparent',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, color: 'white', transition: 'all 0.2s',
                    }}
                    id={`task-${task.id}`}
                  >
                    {task.completed ? '✓' : ''}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600, textDecoration: task.completed ? 'line-through' : 'none' }}>
                        {task.title}
                      </span>
                      <span style={{ fontSize: '0.85rem' }}>{CATEGORY_ICONS[task.category]}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
                      {task.description}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: CATEGORY_COLORS[task.category], fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {task.estimatedHours}h
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
