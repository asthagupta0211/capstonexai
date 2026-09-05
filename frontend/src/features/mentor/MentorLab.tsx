import React, { useState, useEffect } from 'react';
import { BrainCircuit, Send, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, Lightbulb, History, Zap } from 'lucide-react';
import { MentorReview } from '../../types/index.js';
import { MetricMeter } from '../../components/MetricMeter.js';
import { api } from '../../services/api.js';

interface MentorLabProps {
  initialIdea?: {
    title: string;
    pitch: string;
    intendedTech?: string;
    targetAudience?: string;
  } | null;
  onClearInitialIdea?: () => void;
}

const MENTOR_DEMO_PRESETS = [
  {
    name: 'Face Attendance',
    title: 'Automated Student Attendance via Classroom Face Recognition',
    pitch: 'A camera placed at the lecture hall entrance continuously scans faces and updates attendance databases to eliminate proxy marking.',
    intendedTech: 'Python, OpenCV, Flask, MySQL',
    targetAudience: 'University professors and academic registrar offices',
  },
  {
    name: 'Health Blockchain',
    title: 'Decentralized Electronic Health Records on Blockchain',
    pitch: 'Store all diagnostic reports and medical histories on a smart contract blockchain ledger to give patients 100% control over their data.',
    intendedTech: 'Solidity, React, Node.js, Web3.js, IPFS',
    targetAudience: 'Hospitals, diagnostic labs, and chronic illness patients',
  },
  {
    name: 'Smart Waste IoT',
    title: 'AI Smart Dustbin with Automated Waste Segregation',
    pitch: 'An IoT bin with ultrasonic sensors and computer vision camera that detects whether waste is wet, dry, or plastic and rotates internal flaps.',
    intendedTech: 'Raspberry Pi, TensorFlow Lite, Python, Arduino',
    targetAudience: 'Municipal corporations and smart campus facilities',
  },
];

export const MentorLab: React.FC<MentorLabProps> = ({ initialIdea, onClearInitialIdea }) => {
  const [title, setTitle] = useState(initialIdea?.title || '');
  const [pitch, setPitch] = useState(initialIdea?.pitch || '');
  const [intendedTech, setIntendedTech] = useState(initialIdea?.intendedTech || '');
  const [targetAudience, setTargetAudience] = useState(initialIdea?.targetAudience || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentReview, setCurrentReview] = useState<MentorReview | null>(null);
  const [pastReviews, setPastReviews] = useState<MentorReview[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'critique' | 'history'>('critique');

  useEffect(() => {
    loadPastReviews();
  }, []);

  useEffect(() => {
    if (initialIdea) {
      setTitle(initialIdea.title || '');
      setPitch(initialIdea.pitch || '');
      setIntendedTech(initialIdea.intendedTech || '');
      setTargetAudience(initialIdea.targetAudience || '');
      setActiveSubTab('critique');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [initialIdea]);

  const loadPastReviews = async () => {
    try {
      const data = await api.listMentorReviews();
      setPastReviews(data.reviews || []);
    } catch {
      // Non-blocking
    }
  };

  const handleApplyPreset = (p: typeof MENTOR_DEMO_PRESETS[0]) => {
    setTitle(p.title);
    setPitch(p.pitch);
    setIntendedTech(p.intendedTech);
    setTargetAudience(p.targetAudience);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !pitch.trim()) {
      alert('Please provide a project title and concept pitch.');
      return;
    }

    try {
      setIsAnalyzing(true);
      const data = await api.analyzeIdea({
        title,
        pitch,
        intendedTech,
        targetAudience,
      });
      setCurrentReview(data.review);
      loadPastReviews();
    } catch (err: any) {
      alert('Failed to analyze project idea: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BrainCircuit size={24} color="var(--primary)" />
            <span>AI Capstone Mentor Lab & Stress-Tester</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Submit an existing project idea to receive an objective, faculty-grade evaluation critique powered by Groq Cloud AI.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${activeSubTab === 'critique' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('critique')}
          >
            New Critique
          </button>
          <button
            className={`btn btn-sm ${activeSubTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('history')}
          >
            <History size={14} />
            <span>Past Reviews ({pastReviews.length})</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'history' ? (
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '1rem' }}>Previous Idea Reviews</h3>
          {pastReviews.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pastReviews.map((rev, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(0,0,0,0.25)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setCurrentReview(rev);
                    setActiveSubTab('critique');
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--cyan)' }}>{rev.projectTitle}</h4>
                    <span className="badge badge-indigo">Feasibility: {rev.feasibilityScore}%</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    "{rev.originalPitch}"
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {rev.actionableImprovements?.length || 0} actionable improvements identified • Click to view full report
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No past mentor reviews found in MongoDB Atlas.</p>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Submission Card */}
          <div className="glass-card" style={{ padding: '2rem', borderTop: '3px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} color="var(--primary)" />
                  <span>Submit Idea for Objective Stress-Testing</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Uncover hidden project flaws, evaluate grading feasibility, and identify how to avoid faculty rejection.
                </p>
              </div>

              {/* Quick Demo Test Presets */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Zap size={13} color="var(--warning)" />
                  <span>Test Ideas:</span>
                </span>
                {MENTOR_DEMO_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleApplyPreset(p)}
                    style={{ fontSize: '0.725rem', padding: '0.3rem 0.6rem' }}
                    title={`Test with ${p.title}`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAnalyze}>
              <div className="grid-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Project Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Automated Smart Triage Assistant"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Intended Tech Stack (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. React, Python, OpenCV, MongoDB"
                    value={intendedTech}
                    onChange={(e) => setIntendedTech(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Project Pitch / Concept *</label>
                <textarea
                  className="form-textarea"
                  placeholder="Describe what your system does, who uses it, and how it works..."
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Audience / Problem Context (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Hospital emergency staff, campus shuttle operators"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                  Evaluates academic novelty, implementation bottlenecks, and thesis defense rubrics
                </span>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isAnalyzing || !title.trim() || !pitch.trim()}
                  style={{ minWidth: '220px' }}
                >
                  {isAnalyzing ? (
                    <span>Calling Groq AI LLM...</span>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Run AI Mentor Critique</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Critique Results Card */}
          {currentReview && (
            <div className="glass-card" style={{ padding: '2rem', borderTop: '3px solid var(--primary)', animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span className="badge badge-indigo" style={{ marginBottom: '0.35rem' }}>Groq AI Mentor Report</span>
                  <h3 style={{ fontSize: '1.4rem', color: '#ffffff', fontWeight: 700 }}>
                    {currentReview.projectTitle}
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '1rem', minWidth: '260px' }}>
                  <MetricMeter label="Feasibility Score" score={currentReview.feasibilityScore} color="emerald" size="sm" />
                  <MetricMeter label="Implementation Complexity" score={currentReview.complexityScore} color="amber" size="sm" />
                </div>
              </div>

              {/* Strengths & Weaknesses Grid */}
              <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.75rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.06)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <h4 style={{ fontSize: '0.95rem', color: '#6ee7b7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    <CheckCircle size={17} />
                    <span>Key Strengths & Academic Merit</span>
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {currentReview.strengths.map((s, i) => (
                      <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.4, display: 'flex', gap: '0.4rem' }}>
                        <span style={{ color: 'var(--success)' }}>✔</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: 'rgba(239, 68, 68, 0.06)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <h4 style={{ fontSize: '0.95rem', color: '#fca5a5', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    <AlertTriangle size={17} />
                    <span>Critical Vulnerabilities & Weaknesses</span>
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {currentReview.weaknesses.map((w, i) => (
                      <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.4, display: 'flex', gap: '0.4rem' }}>
                        <span style={{ color: 'var(--danger)' }}>✖</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing Features & Technical Pitfalls */}
              <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.75rem' }}>
                <div style={{ background: 'rgba(245, 158, 11, 0.06)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <h4 style={{ fontSize: '0.95rem', color: '#fcd34d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    <Lightbulb size={17} />
                    <span>Missing Features Evaluators Expect</span>
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {currentReview.missingFeatures.map((m, i) => (
                      <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.4, display: 'flex', gap: '0.4rem' }}>
                        <span style={{ color: 'var(--warning)' }}>!</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: 'rgba(99, 102, 241, 0.06)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <h4 style={{ fontSize: '0.95rem', color: '#a5b4fc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    <ShieldAlert size={17} />
                    <span>Technical Architecture Pitfalls</span>
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {currentReview.technicalPitfalls.map((p, i) => (
                      <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.4, display: 'flex', gap: '0.4rem' }}>
                        <span style={{ color: 'var(--primary)' }}>•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Improvements */}
              <div style={{ marginBottom: '1.75rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>
                  Actionable Recommendations to Guarantee Passing Defense
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {currentReview.actionableImprovements.map((act, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '1rem',
                        background: 'rgba(0,0,0,0.25)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        display: 'grid',
                        gridTemplateColumns: '150px 1fr 1fr',
                        gap: '1rem',
                        alignItems: 'center',
                      }}
                    >
                      <span className="badge badge-cyan">{act.area}</span>
                      <p style={{ fontSize: '0.8125rem', color: '#ffffff' }}>{act.suggestion}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        <strong>Expected Benefit:</strong> {act.expectedBenefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Differentiation Advice */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))',
                  border: '1px solid var(--border-glow)',
                }}
              >
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--cyan)', marginBottom: '0.35rem' }}>
                  How to Stand Out From Cliché Student Projects
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  {currentReview.differentiationAdvice}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
