import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ShieldAlert,
  Send,
  Award
} from 'lucide-react';
import { VivaDefenseResponse, VivaQuestion } from '../../types/index.js';
import { api } from '../../services/api.js';

interface VivaDefenseSimulatorProps {
  initialTitle?: string;
  initialPitch?: string;
  initialTech?: string;
  initialAudience?: string;
}

export const VivaDefenseSimulator: React.FC<VivaDefenseSimulatorProps> = ({
  initialTitle = '',
  initialPitch = '',
  initialTech = '',
  initialAudience = '',
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [pitch, setPitch] = useState(initialPitch);
  const [intendedTech, setIntendedTech] = useState(initialTech);
  const [targetAudience, setTargetAudience] = useState(initialAudience);
  const [isSimulating, setIsSimulating] = useState(false);
  const [defenseResult, setDefenseResult] = useState<VivaDefenseResponse | null>(null);

  // Practice response state: maps question id to student's practice text
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  // Maps question id to whether the model answer is revealed
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  // Maps question id to evaluated feedback
  const [answerFeedback, setAnswerFeedback] = useState<Record<string, { status: 'passed' | 'review'; comment: string }>>({});

  const handleSimulate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !pitch.trim()) {
      alert('Please provide a Project Title and Pitch to simulate your defense.');
      return;
    }

    try {
      setIsSimulating(true);
      const res = await api.simulateVivaDefense({
        title: title.trim(),
        pitch: pitch.trim(),
        intendedTech: intendedTech.trim() || undefined,
        targetAudience: targetAudience.trim() || undefined,
      });
      setDefenseResult(res.defense);
    } catch (err: any) {
      alert('Failed to simulate Viva Defense: ' + err.message);
    } finally {
      setIsSimulating(false);
    }
  };

  const toggleRevealAnswer = (qId: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleEvaluatePracticeAnswer = (q: VivaQuestion) => {
    const studentAnswer = (practiceAnswers[q.id] || '').trim();
    if (studentAnswer.length < 15) {
      alert('Please provide a more detailed defense answer (at least 1-2 sentences) to evaluate.');
      return;
    }

    // Heuristic assessment against trap and length
    const words = studentAnswer.toLowerCase().split(/\s+/);
    const mentionsTech = intendedTech.toLowerCase().split(/[,\s]+/).some((t) => t.length > 2 && studentAnswer.toLowerCase().includes(t));

    if (words.length >= 25 && mentionsTech) {
      setAnswerFeedback((prev) => ({
        ...prev,
        [q.id]: {
          status: 'passed',
          comment: 'Strong Defense: You articulated technical depth and justified your stack effectively without stumbling into the examiner trap.',
        },
      }));
    } else {
      setAnswerFeedback((prev) => ({
        ...prev,
        [q.id]: {
          status: 'review',
          comment: `Examiner Warning: Your response is somewhat surface-level. Review the Model Defense below to see how to cite exact architectural trade-offs.`,
        },
      }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Simulation Setup Card */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={20} color="var(--primary-light)" />
              <span>Viva Voce (Project Defense) Cross-Examination Simulator</span>
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Face an exacting External Academic Committee. Prepare for high-stakes architectural traps before your final defense.
            </p>
          </div>
        </div>

        <form onSubmit={handleSimulate}>
          <div className="grid-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="viva-title" className="form-label">Project Title *</label>
              <input
                id="viva-title"
                type="text"
                className="form-input"
                placeholder="e.g. AI Sentinel: SAST Vulnerability Scanner"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="viva-tech" className="form-label">Tech Stack (Critical for questions)</label>
              <input
                id="viva-tech"
                type="text"
                className="form-input"
                placeholder="e.g. Python, FastAPI, Docker, PostgreSQL, AST Parsing"
                value={intendedTech}
                onChange={(e) => setIntendedTech(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="viva-pitch" className="form-label">Project Concept & Technical Scope *</label>
            <textarea
              id="viva-pitch"
              className="form-textarea"
              placeholder="Explain what the project builds, core algorithms, and how it executes..."
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isSimulating || !title.trim() || !pitch.trim()}
              style={{ minWidth: '240px' }}
            >
              {isSimulating ? (
                <>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTopColor: '#ffffff',
                      borderRadius: '50%',
                      animation: 'spinSlow 0.8s linear infinite',
                    }}
                  />
                  <span>Assembling External Panel...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Convene Viva Defense Panel</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Defense Results Section */}
      {defenseResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Panel Overview Card */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Committee Assessment
                </span>
                <h4 style={{ fontSize: '1.15rem', color: '#f8fafc', marginTop: '0.15rem' }}>
                  External Examiner Perspective
                </h4>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255, 255, 255, 0.04)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Defense Readiness:</span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: defenseResult.overallDefenseReadinessScore >= 80 ? 'var(--success)' : 'var(--warning)',
                  }}
                >
                  {defenseResult.overallDefenseReadinessScore}%
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              "{defenseResult.examinerPerspectiveSummary}"
            </p>

            {/* Critical Vulnerabilities the Committee will target */}
            <div>
              <h5 style={{ fontSize: '0.85rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
                <ShieldAlert size={16} color="var(--danger)" />
                <span>Primary Cross-Examination Attack Surfaces:</span>
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {defenseResult.criticalVulnerabilities.map((vuln, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      fontSize: '0.825rem',
                      color: 'var(--text-secondary)',
                      background: 'var(--danger-bg)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      padding: '0.55rem 0.85rem',
                      borderRadius: 'var(--radius-xs)',
                    }}
                  >
                    <AlertTriangle size={14} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{vuln}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Individual Defense Questions & Model Answers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '1.1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={18} color="var(--cyan)" />
              <span>5 Cross-Examination Questions & Model Answers</span>
            </h4>

            {defenseResult.questions.map((q, idx) => {
              const isRevealed = !!revealedAnswers[q.id];
              const feedback = answerFeedback[q.id];

              return (
                <div key={q.id || idx} className="glass-card" style={{ padding: '1.5rem' }}>
                  {/* Question Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-indigo">Question {idx + 1}</span>
                      <span className="badge badge-purple">{q.category}</span>
                    </div>

                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <strong>Intent:</strong> {q.examinerIntent}
                    </span>
                  </div>

                  <h5 style={{ fontSize: '1.025rem', color: '#ffffff', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                    "{q.question}"
                  </h5>

                  {/* Trap Warning Box */}
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '0.65rem 0.95rem',
                      marginBottom: '1rem',
                      fontSize: '0.8rem',
                      color: '#fef08a',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                    }}
                  >
                    <AlertTriangle size={15} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>Examiner Trap to Avoid: </strong>
                      <span>{q.trapToAvoid}</span>
                    </div>
                  </div>

                  {/* Interactive Student Practice Input */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor={`practice-${q.id}`} className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MessageSquare size={13} color="var(--text-secondary)" />
                        Practice Your Defense Answer:
                      </span>
                    </label>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <textarea
                        id={`practice-${q.id}`}
                        className="form-textarea"
                        placeholder="Type how you would answer the examiner panel in your own words..."
                        value={practiceAnswers[q.id] || ''}
                        onChange={(e) =>
                          setPracticeAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                        }
                        rows={2}
                        style={{ minHeight: '65px', fontSize: '0.825rem' }}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEvaluatePracticeAnswer(q)}
                        style={{ alignSelf: 'flex-end', height: '38px', flexShrink: 0 }}
                      >
                        <Send size={13} />
                        <span>Test Answer</span>
                      </button>
                    </div>

                    {feedback && (
                      <div
                        style={{
                          marginTop: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius-xs)',
                          fontSize: '0.8rem',
                          background: feedback.status === 'passed' ? 'var(--success-bg)' : 'var(--warning-bg)',
                          border: feedback.status === 'passed' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                          color: feedback.status === 'passed' ? '#6ee7b7' : '#fde68a',
                        }}
                      >
                        {feedback.comment}
                      </div>
                    )}
                  </div>

                  {/* Reveal Model Answer Toggle */}
                  <div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => toggleRevealAnswer(q.id)}
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                    >
                      {isRevealed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      <span>{isRevealed ? 'Hide Model Defense' : 'Reveal Winning Model Defense (Answer Key)'}</span>
                    </button>

                    {isRevealed && (
                      <div
                        style={{
                          marginTop: '0.75rem',
                          padding: '1rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(79, 70, 229, 0.08)',
                          border: '1px solid rgba(99, 102, 241, 0.25)',
                          fontSize: '0.85rem',
                          color: '#e2e8f0',
                          lineHeight: 1.6,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-light)', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.8rem' }}>
                          <Award size={15} />
                          <span>Committee Full-Mark Response:</span>
                        </div>
                        <p style={{ whiteSpace: 'pre-line' }}>{q.modelAnswer}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
