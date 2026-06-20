'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SIDEBAR_NAV } from '@/lib/constants';
import { getInitials } from '@/lib/utils';

const NAV_META: Record<string, { icon: string; color: string }> = {
  dashboard: { icon: '⬡',  color: '#6c63ff' },
  resume:    { icon: '◈',  color: '#00d1ff' },
  interview: { icon: '◎',  color: '#7f5af0' },
  feedback:  { icon: '◇',  color: '#f59e0b' },
  dsa:       { icon: '⬟',  color: '#22c55e' },
  analytics: { icon: '◈',  color: '#f97066' },
  roadmap:   { icon: '◉',  color: '#a78bfa' },
};

const ICON_LABELS: Record<string, string> = {
  dashboard: '📊', resume: '📄', interview: '🎙️',
  feedback: '💡', dsa: '💻', analytics: '📈', roadmap: '🗺️',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login');
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-glow))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, color: 'white', margin: '0 auto 16px',
            boxShadow: '0 0 30px rgba(108,99,255,0.4)',
          }}>IQ</div>
          <div className="spinner" style={{ width: 28, height: 28, margin: '0 auto' }} />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  const currentNav = SIDEBAR_NAV.find(n => isActive(n.href));

  return (
    <div className="dashboard-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 35, backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-glow))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: 'white',
              boxShadow: '0 0 16px rgba(108,99,255,0.35)',
            }}>IQ</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Interview<span className="gradient-text">IQ</span>
            </span>
          </Link>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 10px 10px' }}>
            Navigation
          </div>
          {SIDEBAR_NAV.map(item => {
            const active = isActive(item.href);
            const meta = NAV_META[item.icon] || { icon: '○', color: 'var(--accent-primary)' };
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                id={`nav-${item.icon}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  padding: '9px 12px', borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem', fontWeight: active ? 600 : 500,
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: active ? `${meta.color}18` : 'transparent',
                  border: active ? `1px solid ${meta.color}30` : '1px solid transparent',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}
              >
                <span style={{ fontSize: '1rem', width: 20, textAlign: 'center' }}>
                  {ICON_LABELS[item.icon]}
                </span>
                <span>{item.label}</span>
                {active && (
                  <div style={{
                    marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%',
                    background: meta.color, boxShadow: `0 0 8px ${meta.color}`,
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div style={{ padding: '16px 12px 20px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
            borderRadius: 'var(--radius-sm)', marginBottom: 8,
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: user.avatarColor || 'var(--accent-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 800, color: 'white', flexShrink: 0,
            }}>
              {getInitials(user.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.targetRole}</div>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ width: '100%', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}
            onClick={() => { logout(); router.push('/'); }}
            id="logout-btn"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────── */}
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ padding: 8 }}
              id="menu-toggle"
            >
              <span style={{ fontSize: '1.1rem' }}>☰</span>
            </button>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                {currentNav?.label || 'Dashboard'}
              </h2>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>{user.experience}</span>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: user.avatarColor || 'var(--accent-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 800, color: 'white',
            }}>
              {getInitials(user.name)}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main style={{ padding: '32px 36px', maxWidth: 1200 }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 1025px) { #menu-toggle { display: none; } }
        @media (max-width: 1024px) { #menu-toggle { display: flex !important; } }
        .sidebar a:hover:not([style*="border: 1px solid"]) {
          color: var(--text-primary) !important;
          background: rgba(255,255,255,0.05) !important;
        }
      `}</style>
    </div>
  );
}
