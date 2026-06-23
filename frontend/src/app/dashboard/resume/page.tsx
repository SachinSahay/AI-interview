'use client';

import { useState, useCallback } from 'react';
import { analyzeResume } from '@/lib/mock-ai';
import { resumeStore } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { formatFileSize, getScoreColor, getScoreLabel } from '@/lib/utils';
import ScoreRing from '@/components/ui/ScoreRing';
import type { Resume } from '@/lib/types';

export default function ResumePage() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [resume, setResume] = useState<Resume | null>(() => resumeStore.getLatest() || null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback((f: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(f.type)) {
      alert('Please upload a PDF or DOCX file');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      alert('File size must be under 5MB');
      return;
    }
    setFile(f);
  }, []);

  const handleAnalyze = async () => {
    if (!file || !user) return;
    setAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64String = (reader.result as string).split(',')[1];
          const result = await analyzeResume(file.name, file.size, user.targetRole, base64String);
          resumeStore.add(result);
          setResume(result);
        } catch (err) {
          console.error(err);
          alert('Analysis failed. Please try again.');
        } finally {
          setAnalyzing(false);
        }
      };
      reader.onerror = () => {
        alert('Failed to read the file.');
        setAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch {
      alert('Analysis failed. Please try again.');
      setAnalyzing(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>Resume Analyzer</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Upload your resume for AI-powered ATS scoring and improvement suggestions
        </p>
      </div>

      {/* Upload Section */}
      <div className="card-static" style={{ padding: 32, marginBottom: 28 }}>
        <div
          className={`upload-zone ${dragActive ? 'upload-zone-active' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={e => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => document.getElementById('file-input')?.click()}
          id="upload-zone"
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf,.docx"
            style={{ display: 'none' }}
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📄</div>
          {file ? (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{file.name}</div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>{formatFileSize(file.size)}</div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Drop your resume here</div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                PDF or DOCX, max 5MB
              </div>
            </div>
          )}
        </div>

        {file && (
          <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" onClick={handleAnalyze} disabled={analyzing} id="analyze-btn">
              {analyzing ? (<><div className="spinner" /> Analyzing...</>) : 'Analyze Resume'}
            </button>
            <button className="btn btn-ghost" onClick={() => { setFile(null); }} id="clear-btn">
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {analyzing && (
        <div className="card-static animate-fade-in" style={{ padding: 40, textAlign: 'center' }}>
          <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 16px' }} />
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Analyzing your resume...</div>
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
            Checking ATS compatibility, keywords, formatting, and more
          </div>
        </div>
      )}

      {resume && !analyzing && (
        <div className="animate-fade-in-up">
          {/* Score Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 28, marginBottom: 28 }}>
            <div className="card-static" style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ScoreRing score={resume.atsScore} size={160} strokeWidth={10} label="ATS Score" />
              <div style={{ marginTop: 16, fontWeight: 700, fontSize: '1.1rem', color: getScoreColor(resume.atsScore) }}>
                {getScoreLabel(resume.atsScore)}
              </div>
            </div>

            <div className="card-static" style={{ padding: 28 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Section Scores</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {Object.entries(resume.sections).map(([key, section]) => (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.85rem' }}>
                      <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{key}</span>
                      <span style={{ fontWeight: 600, color: getScoreColor(section.score) }}>{section.score}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${section.score}%`, background: getScoreColor(section.score) }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suggestions + Missing Keywords */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
            <div className="card-static" style={{ padding: 28 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>💡 Improvement Suggestions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {resume.suggestions.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span className={`badge ${s.category === 'critical' ? 'badge-pink' : s.category === 'important' ? 'badge-gold' : 'badge-teal'}`}
                      style={{ flexShrink: 0, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                      {s.category}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-static" style={{ padding: 28 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>🔑 Missing Keywords</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 12 }}>
                Add these keywords to improve your ATS score for {user?.targetRole}:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {resume.missingKeywords.map(kw => (
                  <span key={kw} className="badge badge-pink">{kw}</span>
                ))}
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginTop: 28, marginBottom: 16 }}>✅ Strengths</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {resume.strengths.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--accent-success)' }}>✓</span> {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
