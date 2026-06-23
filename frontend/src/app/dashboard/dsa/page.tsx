'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

// ---- Interview DSA Data ----
const DSA_TOPICS = [
  { name: 'Arrays', icon: '📦', solved: 34, total: 50, easy: { s: 18, t: 20 }, medium: { s: 12, t: 20 }, hard: { s: 4, t: 10 } },
  { name: 'Strings', icon: '🔤', solved: 28, total: 40, easy: { s: 14, t: 15 }, medium: { s: 10, t: 18 }, hard: { s: 4, t: 7 } },
  { name: 'Linked Lists', icon: '🔗', solved: 19, total: 35, easy: { s: 10, t: 12 }, medium: { s: 8, t: 15 }, hard: { s: 1, t: 8 } },
  { name: 'Trees', icon: '🌳', solved: 22, total: 45, easy: { s: 10, t: 15 }, medium: { s: 9, t: 20 }, hard: { s: 3, t: 10 } },
  { name: 'Graphs', icon: '🕸️', solved: 12, total: 40, easy: { s: 5, t: 10 }, medium: { s: 5, t: 18 }, hard: { s: 2, t: 12 } },
  { name: 'Dynamic Programming', icon: '💡', solved: 15, total: 55, easy: { s: 6, t: 10 }, medium: { s: 7, t: 25 }, hard: { s: 2, t: 20 } },
  { name: 'Sorting & Searching', icon: '🔍', solved: 18, total: 25, easy: { s: 10, t: 10 }, medium: { s: 7, t: 11 }, hard: { s: 1, t: 4 } },
  { name: 'Recursion & Backtracking', icon: '🔄', solved: 10, total: 30, easy: { s: 5, t: 8 }, medium: { s: 4, t: 13 }, hard: { s: 1, t: 9 } },
  { name: 'Stack & Queue', icon: '📚', solved: 20, total: 28, easy: { s: 11, t: 12 }, medium: { s: 8, t: 12 }, hard: { s: 1, t: 4 } },
  { name: 'Heaps & Priority Queue', icon: '⛰️', solved: 8, total: 20, easy: { s: 4, t: 5 }, medium: { s: 3, t: 10 }, hard: { s: 1, t: 5 } },
];

// Generate 365 days of heatmap data
function generateHeatmap(): Record<string, number> {
  const data: Record<string, number> = {};
  const now = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    // Simulate activity with some empty days
    const r = Math.random();
    if (r > 0.45) {
      data[key] = r > 0.9 ? Math.floor(Math.random() * 8) + 5
        : r > 0.7 ? Math.floor(Math.random() * 4) + 2
        : 1;
    }
  }
  return data;
}

function getHeatmapColor(count: number): string {
  if (count === 0) return 'var(--bg-tertiary)';
  if (count === 1) return '#3d2f6e';
  if (count <= 3) return '#5a42a8';
  if (count <= 6) return '#7c6cf0';
  return '#a89ef8';
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DSATrackerPage() {
  const { user } = useAuth();
  const [heatmap] = useState(() => generateHeatmap());
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'topics' | 'heatmap'>('overview');

  const totalSolved = DSA_TOPICS.reduce((s, t) => s + t.solved, 0);
  const totalProblems = DSA_TOPICS.reduce((s, t) => s + t.total, 0);
  const streak = 12; // Interview streak
  const heatmapEntries = Object.entries(heatmap);
  const daysWithActivity = heatmapEntries.filter(([, v]) => v > 0).length;
  const maxCount = Math.max(...Object.values(heatmap));

  // Build 52-week grid
  const weeks: Array<Array<{ date: string; count: number }>> = [];
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 363);
  // Align to Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay());

  let current = new Date(startDate);
  while (current <= now) {
    const week: Array<{ date: string; count: number }> = [];
    for (let d = 0; d < 7; d++) {
      const key = current.toISOString().split('T')[0];
      week.push({ date: key, count: heatmap[key] || 0 });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>DSA Tracker</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Track your coding consistency and topic mastery
        </p>
      </div>

      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Solved', value: totalSolved, icon: '✅', color: 'var(--accent-success)' },
          { label: 'Current Streak', value: `${streak} days`, icon: '🔥', color: 'var(--accent-warm)' },
          { label: 'Active Days', value: daysWithActivity, icon: '📅', color: 'var(--accent-secondary)' },
          { label: 'Completion', value: `${Math.round((totalSolved / totalProblems) * 100)}%`, icon: '🎯', color: 'var(--accent-primary)' },
        ].map(stat => (
          <div key={stat.label} className="card-static" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: 6 }}>{stat.label}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
              </div>
              <span style={{ fontSize: '1.4rem' }}>{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 24 }}>
        {(['overview', 'topics', 'heatmap'] as const).map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(tab)}
            id={`dsa-tab-${tab}`}
            style={{ textTransform: 'capitalize' }}
          >
            {tab === 'overview' ? '📊 Overview' : tab === 'topics' ? '📚 Topics' : '🔥 Activity'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in">
          {/* Difficulty breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Easy', solved: DSA_TOPICS.reduce((s, t) => s + t.easy.s, 0), total: DSA_TOPICS.reduce((s, t) => s + t.easy.t, 0), color: 'var(--accent-success)' },
              { label: 'Medium', solved: DSA_TOPICS.reduce((s, t) => s + t.medium.s, 0), total: DSA_TOPICS.reduce((s, t) => s + t.medium.t, 0), color: 'var(--accent-gold)' },
              { label: 'Hard', solved: DSA_TOPICS.reduce((s, t) => s + t.hard.s, 0), total: DSA_TOPICS.reduce((s, t) => s + t.hard.t, 0), color: 'var(--accent-warm)' },
            ].map(d => (
              <div key={d.label} className="card-static" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, color: d.color }}>{d.label}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{d.solved}/{d.total}</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 10, color: d.color }}>
                  {d.solved}
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.round((d.solved / d.total) * 100)}%`, background: d.color }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 6 }}>
                  {Math.round((d.solved / d.total) * 100)}% complete
                </div>
              </div>
            ))}
          </div>

          {/* Top 5 topics progress */}
          <div className="card-static" style={{ padding: 28 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>📈 Topic Progress</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {DSA_TOPICS.slice(0, 6).map(topic => {
                const pct = Math.round((topic.solved / topic.total) * 100);
                return (
                  <div key={topic.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {topic.icon} {topic.name}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{topic.solved}/{topic.total}</span>
                        <span style={{
                          fontSize: '0.8rem', fontWeight: 700,
                          color: pct >= 70 ? 'var(--accent-success)' : pct >= 40 ? 'var(--accent-gold)' : 'var(--accent-warm)',
                        }}>{pct}%</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{
                        width: `${pct}%`,
                        background: pct >= 70 ? 'var(--accent-success)' : pct >= 40 ? 'var(--accent-gold)' : 'var(--accent-warm)',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Topics Tab */}
      {activeTab === 'topics' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {DSA_TOPICS.map(topic => {
            const pct = Math.round((topic.solved / topic.total) * 100);
            const isSelected = selectedTopic === topic.name;
            return (
              <div
                key={topic.name}
                className="card"
                style={{
                  padding: 22,
                  border: isSelected ? '1px solid var(--accent-primary)' : undefined,
                  background: isSelected ? 'var(--accent-primary-dim)' : undefined,
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedTopic(isSelected ? null : topic.name)}
                id={`topic-${topic.name.replace(/\s/g, '-').toLowerCase()}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.3rem' }}>{topic.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{topic.name}</span>
                  </div>
                  <span style={{
                    fontSize: '0.8rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)',
                    background: pct >= 70 ? 'var(--accent-success-dim)' : pct >= 40 ? 'var(--accent-gold-dim)' : 'var(--accent-warm-dim)',
                    color: pct >= 70 ? 'var(--accent-success)' : pct >= 40 ? 'var(--accent-gold)' : 'var(--accent-warm)',
                  }}>{pct}%</span>
                </div>

                <div className="progress-bar" style={{ marginBottom: 12 }}>
                  <div className="progress-fill" style={{
                    width: `${pct}%`,
                    background: pct >= 70 ? 'var(--accent-success)' : pct >= 40 ? 'var(--accent-gold)' : 'var(--accent-warm)',
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  {[
                    { label: 'Easy', s: topic.easy.s, t: topic.easy.t, color: 'var(--accent-success)' },
                    { label: 'Med', s: topic.medium.s, t: topic.medium.t, color: 'var(--accent-gold)' },
                    { label: 'Hard', s: topic.hard.s, t: topic.hard.t, color: 'var(--accent-warm)' },
                  ].map(d => (
                    <div key={d.label} style={{ textAlign: 'center' }}>
                      <div style={{ color: d.color, fontWeight: 600 }}>{d.s}/{d.t}</div>
                      <div style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem', marginTop: 2 }}>{d.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Heatmap Tab */}
      {activeTab === 'heatmap' && (
        <div className="animate-fade-in">
          <div className="card-static" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>🔥 Coding Activity</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                <span>Less</span>
                {[0, 1, 3, 6, 10].map(v => (
                  <div key={v} style={{ width: 12, height: 12, borderRadius: 3, background: getHeatmapColor(v) }} />
                ))}
                <span>More</span>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              {/* Month labels */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 4, marginLeft: 20 }}>
                {weeks.map((week, wi) => {
                  const firstDay = week.find(d => d.date);
                  if (!firstDay) return <div key={wi} style={{ width: 12 }} />;
                  const date = new Date(firstDay.date);
                  const isFirst = date.getDate() <= 7;
                  return (
                    <div key={wi} style={{ width: 12, fontSize: '0.65rem', color: 'var(--text-tertiary)', textAlign: 'center', overflow: 'visible', whiteSpace: 'nowrap' }}>
                      {isFirst ? MONTHS[date.getMonth()] : ''}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: 3 }}>
                {/* Day labels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginRight: 4 }}>
                  {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
                    <div key={i} style={{ height: 12, fontSize: '0.6rem', color: 'var(--text-tertiary)', lineHeight: '12px' }}>{d}</div>
                  ))}
                </div>

                {/* Heatmap grid */}
                {weeks.map((week, wi) => (
                  <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {week.map((day, di) => {
                      const isFuture = new Date(day.date) > now;
                      return (
                        <div
                          key={di}
                          title={day.count > 0 ? `${day.date}: ${day.count} problem${day.count > 1 ? 's' : ''}` : day.date}
                          style={{
                            width: 12, height: 12, borderRadius: 3,
                            background: isFuture ? 'transparent' : getHeatmapColor(day.count),
                            cursor: day.count > 0 ? 'pointer' : 'default',
                            transition: 'transform 0.1s',
                          }}
                          className={day.count > 0 ? 'heatmap-cell' : ''}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                { label: 'Total problems solved', value: totalSolved },
                { label: 'Active days (last year)', value: daysWithActivity },
                { label: 'Current streak', value: `${streak} days 🔥` },
                { label: 'Max in a day', value: maxCount },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{s.value}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
