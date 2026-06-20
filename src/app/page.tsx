'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#testimonials', label: 'Testimonials' },
];

const FEATURES = [
  {
    icon: '📄', title: 'Resume Intelligence',
    desc: 'Upload your resume and get an instant ATS compatibility score, keyword gap analysis, and role-specific improvement suggestions.',
    color: '#6c63ff',
  },
  {
    icon: '🎙️', title: 'AI Mock Interviews',
    desc: 'Practice with an adaptive AI interviewer that asks follow-up questions, reacts to your answers, and simulates real interview pressure.',
    color: '#00d1ff',
  },
  {
    icon: '💡', title: 'Deep Feedback Engine',
    desc: 'After every session, receive per-answer breakdowns with technical accuracy, communication clarity, and hireability scores.',
    color: '#7f5af0',
  },
  {
    icon: '🗺️', title: 'Personalized Roadmap',
    desc: 'AI-generated week-by-week preparation plans that adapt based on your weaknesses, schedule, and target company.',
    color: '#f59e0b',
  },
  {
    icon: '💻', title: 'DSA Progress Tracker',
    desc: 'GitHub-style heatmaps, topic-wise mastery charts, streak tracking, and difficulty breakdowns all in one view.',
    color: '#22c55e',
  },
  {
    icon: '📈', title: 'Analytics Dashboard',
    desc: 'Track score trends, confidence growth, category performance, and hireability over every interview session.',
    color: '#f97066',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma', role: 'SDE II — Google', avatar: 'PS',
    text: 'InterviewIQ identified gaps in my system design answers that I had completely missed. The AI feedback felt like a senior engineer reviewing my responses.',
    rating: 5,
  },
  {
    name: 'Rahul Verma', role: 'Frontend Engineer — Amazon', avatar: 'RV',
    text: 'The adaptive follow-up questions were mind-blowing. It kept pushing me deeper until it actually found my weak spots. Got my offer in 6 weeks.',
    rating: 5,
  },
  {
    name: 'Ananya Patel', role: 'ML Engineer — Microsoft', avatar: 'AP',
    text: 'My resume ATS score jumped from 54 to 91 after one round of improvements. Cleared every screening call after that.',
    rating: 5,
  },
];

const STATS = [
  { value: '50K+', label: 'Mock Interviews' },
  { value: '94%', label: 'Success Rate' },
  { value: '120+', label: 'Companies' },
  { value: '4.9★', label: 'Rating' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── Navbar ─────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '18px 0',
        background: scrolled ? 'rgba(5,8,22,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-glow))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 800, color: 'white',
              boxShadow: '0 0 16px rgba(108,99,255,0.4)',
            }}>IQ</div>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              Interview<span className="gradient-text">IQ</span>
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 36 }} className="hide-mobile">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} className="navbar-link">{l.label}</a>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href="/login" className="btn btn-ghost btn-sm">Log in</Link>
            <Link href="/signup" className="btn btn-primary btn-sm">Get Started →</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────── */}
      <section style={{ position: 'relative', padding: '170px 32px 100px', overflow: 'hidden' }}>
        {/* Orbs */}
        <div className="orb orb-purple" style={{ width: 700, height: 700, top: -200, left: -100 }} />
        <div className="orb orb-cyan"   style={{ width: 500, height: 500, top: -100, right: -50 }} />
        <div className="orb orb-violet" style={{ width: 400, height: 400, bottom: -100, left: '40%' }} />

        {/* Subtle grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Left: Copy */}
          <div>
            <div className="animate-fade-in" style={{ marginBottom: 24 }}>
              <span className="pill-badge">✦ AI-Powered Career Intelligence</span>
            </div>

            <h1
              className="animate-fade-in stagger-1"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.6rem, 4.5vw, 3.8rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.04em',
                marginBottom: 24,
              }}
            >
              Master Interviews<br />
              With <span className="gradient-text-glow">AI Precision.</span>
            </h1>

            <p className="animate-fade-in stagger-2" style={{
              fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.75,
              maxWidth: 480, marginBottom: 40,
            }}>
              Practice realistic interviews, optimize your resume, track DSA progress,
              and receive personalized career guidance — all in one intelligent platform.
            </p>

            <div className="animate-fade-in stagger-3" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href="/signup" className="btn btn-primary btn-xl" id="hero-cta-primary">
                Start Mock Interview →
              </Link>
              <Link href="/signup" className="btn btn-secondary btn-xl" id="hero-cta-secondary">
                Analyze Resume
              </Link>
            </div>

            {/* Stats */}
            <div className="animate-fade-in stagger-4" style={{ display: 'flex', gap: 40, marginTop: 56, flexWrap: 'wrap' }}>
              {STATS.map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>{s.value}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating Dashboard Visual */}
          <div className="animate-fade-in stagger-3" style={{ position: 'relative' }}>
            {/* Main dashboard card */}
            <div className="glass-panel card-glow-top" style={{
              padding: 28,
              boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(108,99,255,0.1)',
            }}>
              {/* Window bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                {['#ff5f57','#ffbd2e','#28ca42'].map(c => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                ))}
                <span style={{ marginLeft: 10, fontSize: '0.72rem', color: 'var(--text-muted)' }}>InterviewIQ — Dashboard</span>
              </div>

              {/* Score row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div style={{ padding: '18px 20px', borderRadius: 'var(--radius-md)', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.2)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>ATS Score</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }} className="gradient-text">87</div>
                  <div className="progress-bar" style={{ marginTop: 10 }}>
                    <div className="progress-fill" style={{ width: '87%' }} />
                  </div>
                </div>
                <div style={{ padding: '18px 20px', borderRadius: 'var(--radius-md)', background: 'rgba(0,209,255,0.08)', border: '1px solid rgba(0,209,255,0.15)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>Hireability</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent-secondary)' }}>91%</div>
                  <div style={{ marginTop: 10, display: 'flex', gap: 4 }}>
                    {['Excellent','Good'].map(l => (
                      <span key={l} className={l === 'Excellent' ? 'badge badge-green' : 'badge badge-cyan'} style={{ fontSize: '0.62rem' }}>{l}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div style={{ padding: '18px 20px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 14 }}>Latest Interview · Technical Round</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Technical',    score: 82, color: 'var(--accent-primary)' },
                    { label: 'Communication',score: 76, color: 'var(--accent-secondary)' },
                    { label: 'Problem Solving',score: 89, color: 'var(--accent-gold)' },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 5 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                        <span style={{ color: s.color, fontWeight: 700 }}>{s.score}%</span>
                      </div>
                      <div className="progress-bar" style={{ height: 4 }}>
                        <div className="progress-fill" style={{ width: `${s.score}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating AI card */}
            <div className="glass-panel animate-float" style={{
              position: 'absolute', bottom: -24, left: -32,
              padding: '14px 18px', width: 200,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 6 }}>AI Recommendation</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.4 }}>
                Practice <span style={{ color: 'var(--accent-primary)' }}>Graph algorithms</span> this week 🎯
              </div>
            </div>

            {/* Floating score card */}
            <div className="glass-panel" style={{
              position: 'absolute', top: -20, right: -20,
              padding: '12px 16px', width: 140,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              animation: 'float 7s ease-in-out infinite',
              animationDelay: '-3s',
            }}>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: 4 }}>Streak</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>🔥 12</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>days coding</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────── */}
      <section id="features" style={{ padding: '120px 32px', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div className="section-divider" />
            <span className="pill-badge" style={{ marginBottom: 20, display: 'inline-flex' }}>Features</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)',
              fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 16,
            }}>
              Everything You Need to <span className="gradient-text">Land Your Dream Role</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.7 }}>
              One intelligent platform combining resume science, AI interviews, and continuous coaching.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card metric-card card-glow-top" style={{ padding: 32 }}>
                <div className="feature-icon" style={{ background: `${f.color}18`, border: `1px solid ${f.color}25` }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: 10, letterSpacing: '-0.02em' }}>
                  {f.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.93rem', lineHeight: 1.72 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────── */}
      <section id="how-it-works" style={{ padding: '120px 32px', background: 'rgba(11,17,32,0.6)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div className="section-divider" />
            <span className="pill-badge" style={{ marginBottom: 20, display: 'inline-flex' }}>Process</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)',
              fontWeight: 700, letterSpacing: '-0.04em',
            }}>
              Three Steps to <span className="gradient-text-warm">Interview Mastery</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { step: '01', icon: '📤', title: 'Upload & Analyze', desc: 'Upload your resume and select your target role. Our AI scores ATS compatibility, flags keyword gaps, and identifies formatting issues — in seconds.' },
              { step: '02', icon: '🎙️', title: 'Practice with AI', desc: 'Take fully adaptive mock interviews. The AI reacts to your answers, asks intelligent follow-ups, and simulates pressure from real interviewers at top companies.' },
              { step: '03', icon: '🚀', title: 'Improve & Track', desc: 'Receive answer-by-answer analysis, follow your personalized roadmap, and watch your hireability score climb over time.' },
            ].map(item => (
              <div key={item.step} className="glass-panel" style={{
                padding: '32px 36px',
                display: 'flex', alignItems: 'flex-start', gap: 28,
                transition: 'border-color 0.3s',
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 'var(--radius-md)', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-glow))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem', fontWeight: 800, color: 'white',
                  fontFamily: 'var(--font-display)', letterSpacing: '-0.02em',
                  boxShadow: 'var(--shadow-glow-sm)',
                }}>{item.step}</div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 10, letterSpacing: '-0.02em' }}>
                    {item.title} {item.icon}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.72, fontSize: '0.95rem' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────── */}
      <section id="testimonials" style={{ padding: '120px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div className="section-divider" />
            <span className="pill-badge" style={{ marginBottom: 20, display: 'inline-flex' }}>Testimonials</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)',
              fontWeight: 700, letterSpacing: '-0.04em',
            }}>
              Loved by <span className="gradient-text">Ambitious Candidates</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="glass-panel metric-card" style={{ padding: 32 }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 20 }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} style={{ color: 'var(--accent-gold)', fontSize: 15 }}>★</span>
                  ))}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: 24 }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-glow))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 800, color: 'white',
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────── */}
      <section style={{ padding: '120px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="orb orb-purple" style={{ width: 600, height: 600, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.12 }} />
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="section-divider" />
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 20,
          }}>
            Ready to <span className="gradient-text">Crack Your Interview?</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: 40, lineHeight: 1.7 }}>
            Join thousands of candidates who transformed their interview performance with AI-powered preparation.
          </p>
          <Link href="/signup" className="btn btn-primary btn-xl" id="cta-final">
            Start Free Today →
          </Link>
          <p style={{ marginTop: 18, fontSize: '0.82rem', color: 'var(--text-muted)' }}>No credit card required · Free forever plan</p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '40px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-glow))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color: 'white',
          }}>IQ</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700 }}>InterviewIQ</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
          © {new Date().getFullYear()} InterviewIQ AI. Built for the next generation of engineers.
        </p>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
