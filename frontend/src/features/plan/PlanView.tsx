import React, { useState } from 'react';
import { Download, CheckCircle2, Circle, Layers, Cpu, Database, Wrench, Shield, ArrowLeft, Sparkles, Check, BrainCircuit } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProjectIdea, ProjectPlan } from '../../types/index.js';
import { api } from '../../services/api.js';

interface PlanViewProps {
  idea: ProjectIdea;
  plan: ProjectPlan;
  onGoBack: () => void;
  onAnalyzeInMentor?: (idea: ProjectIdea) => void;
}

export const PlanView: React.FC<PlanViewProps> = ({
  idea,
  plan,
  onGoBack,
  onAnalyzeInMentor,
}) => {

  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      if (next[taskId]) {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.8 },
        });
      }
      return next;
    });
  };

  const handleDownloadMarkdown = async () => {
    try {
      setIsDownloading(true);
      const markdown = await api.downloadPlanMarkdown(idea.id);
      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${idea.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_blueprint.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Failed to download markdown blueprint: ' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify({ idea, plan }, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      {/* Top Bar Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button className="btn btn-secondary btn-sm" onClick={onGoBack}>
          <ArrowLeft size={16} />
          <span>Back to Ideas</span>
        </button>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {onAnalyzeInMentor && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onAnalyzeInMentor(idea)}
              style={{ color: 'var(--cyan)' }}
              title="Send to AI Mentor Lab for faculty evaluation"
            >
              <BrainCircuit size={15} />
              <span>Critique in Mentor Lab</span>
            </button>
          )}

          <button className="btn btn-secondary btn-sm" onClick={handleCopyJson}>
            {copiedJson ? <Check size={14} color="var(--success)" /> : null}
            <span>{copiedJson ? 'JSON Copied!' : 'Copy Spec JSON'}</span>
          </button>

          <button className="btn btn-primary btn-sm" onClick={handleDownloadMarkdown} disabled={isDownloading}>
            <Download size={15} />
            <span>{isDownloading ? 'Generating...' : 'Download Markdown Blueprint'}</span>
          </button>
        </div>
      </div>

      {/* Blueprint Header */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', borderTop: '3px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-indigo">Live AI Capstone Blueprint</span>
              <span className="badge badge-cyan">{idea.estimatedScopeWeeks} Weeks Timeline</span>
              <span className="badge badge-success">{idea.feasibilityScore}% Feasibility</span>
              <span className="badge badge-purple">{idea.demoValueScore}% Demo Appeal</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
              {idea.title}
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '850px' }}>
              {idea.pitch}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: FEATURE TIERING BOARD (Must-Have, Good-to-Have, Future) */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} color="var(--primary)" />
            <span>Tiered Feature Scope (MVP vs Future Vision)</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Generated specifically by Groq LLM to isolate core MVP features from post-graduation extensions.
          </p>
        </div>

        <div className="grid-3" style={{ gap: '1.25rem' }}>
          {/* Must-Have (MVP) */}
          <div className="glass-card" style={{ padding: '1.25rem', borderTop: '3px solid var(--success)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', color: '#6ee7b7', fontWeight: 700 }}>Must-Have (Core MVP)</h3>
              <span className="badge badge-success">{plan.mustHaveFeatures.length} Features</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {plan.mustHaveFeatures.map((f, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>{f.title}</h4>
                    <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>{f.complexity}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{f.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Good-to-Have */}
          <div className="glass-card" style={{ padding: '1.25rem', borderTop: '3px solid var(--cyan)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', color: '#67e8f9', fontWeight: 700 }}>Good-to-Have</h3>
              <span className="badge badge-cyan">{plan.goodToHaveFeatures.length} Features</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {plan.goodToHaveFeatures.map((f, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>{f.title}</h4>
                    <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{f.complexity}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{f.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Future Extensions */}
          <div className="glass-card" style={{ padding: '1.25rem', borderTop: '3px solid var(--secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', color: '#c4b5fd', fontWeight: 700 }}>Future Extensions</h3>
              <span className="badge badge-purple">{plan.futureFeatures.length} Features</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {plan.futureFeatures.map((f, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>{f.title}</h4>
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{f.complexity}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: JUSTIFIED TECHNOLOGY STACK MATRIX */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={20} color="var(--cyan)" />
            <span>Justified Technology Recommendations</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Specific technology selections based on student familiarity, development speed, and ease of demonstration.
          </p>
        </div>

        <div className="grid-3" style={{ gap: '1rem' }}>
          {plan.techStackDetailed.frontend?.length > 0 && (
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Frontend Client
              </h4>
              {plan.techStackDetailed.frontend.map((t, i) => (
                <div key={i} style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>{t.name}</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{t.rationale}</p>
                </div>
              ))}
            </div>
          )}

          {plan.techStackDetailed.backend?.length > 0 && (
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Backend / API Service
              </h4>
              {plan.techStackDetailed.backend.map((t, i) => (
                <div key={i} style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>{t.name}</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{t.rationale}</p>
                </div>
              ))}
            </div>
          )}

          {plan.techStackDetailed.database?.length > 0 && (
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Database Storage
              </h4>
              {plan.techStackDetailed.database.map((t, i) => (
                <div key={i} style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>{t.name}</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{t.rationale}</p>
                </div>
              ))}
            </div>
          )}

          {plan.techStackDetailed.ai?.length > 0 && (
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                AI Model / Core Algorithm
              </h4>
              {plan.techStackDetailed.ai.map((t, i) => (
                <div key={i} style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>{t.name}</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{t.rationale}</p>
                </div>
              ))}
            </div>
          )}

          {plan.techStackDetailed.deployment?.length > 0 && (
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Deployment & Hosting
              </h4>
              {plan.techStackDetailed.deployment.map((t, i) => (
                <div key={i} style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>{t.name}</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{t.rationale}</p>
                </div>
              ))}
            </div>
          )}

          {plan.techStackDetailed.tools?.length > 0 && (
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Developer Tools & CI/CD
              </h4>
              {plan.techStackDetailed.tools.map((t, i) => (
                <div key={i} style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>{t.name}</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{t.rationale}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: SYSTEM ARCHITECTURE SUMMARY */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2.5rem', background: 'rgba(15, 21, 38, 0.85)' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Wrench size={18} color="var(--primary)" />
          <span>System Component Architecture</span>
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6 }}>
          {plan.architectureSummary}
        </p>
      </div>

      {/* SECTION 4: 10-PHASE DEVELOPMENT ROADMAP */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="var(--warning)" />
            <span>10-Phase Practical Capstone Roadmap</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Track progress milestone by milestone throughout your senior semester. Check off deliverables as you build!
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {plan.roadmapPhases.map((phase) => (
            <div
              key={phase.phaseNum}
              className="glass-card"
              style={{
                padding: '1.25rem 1.5rem',
                borderLeft: `4px solid ${phase.phaseNum <= 4 ? 'var(--primary)' : phase.phaseNum <= 8 ? 'var(--cyan)' : 'var(--success)'}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      color: '#ffffff',
                    }}
                  >
                    {phase.phaseNum}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                    Phase {phase.phaseNum}: {phase.title}
                  </h3>
                </div>
                <span className="badge badge-cyan">{phase.durationWeeks} Weeks</span>
              </div>

              {/* Tasks & Deliverables Columns */}
              <div className="grid-2" style={{ gap: '1.25rem' }}>
                {/* Tasks */}
                <div>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
                    KEY TASKS:
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {phase.tasks.map((task, idx) => {
                      const taskId = `p${phase.phaseNum}_t${idx}`;
                      const isDone = completedTasks[taskId] || false;
                      return (
                        <li
                          key={idx}
                          onClick={() => toggleTask(taskId)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.5rem',
                            fontSize: '0.8125rem',
                            color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                            textDecoration: isDone ? 'line-through' : 'none',
                            cursor: 'pointer',
                          }}
                        >
                          {isDone ? (
                            <CheckCircle2 size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          ) : (
                            <Circle size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          )}
                          <span>{task}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Deliverables */}
                <div>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
                    EVALUATION DELIVERABLES:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {phase.deliverables.map((del, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          fontSize: '0.8125rem',
                          color: '#6ee7b7',
                          background: 'rgba(16, 185, 129, 0.08)',
                          padding: '0.35rem 0.65rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                        }}
                      >
                        <Check size={14} />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: STRATEGIC IMPROVEMENTS & FACULTY DEFENSE */}
      {plan.improvements?.length > 0 && (
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2.5rem', borderLeft: '4px solid var(--warning)' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={18} color="var(--warning)" />
            <span>Architect Recommendations for Thesis & Faculty Defense</span>
          </h3>
          <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {plan.improvements.map((imp, i) => (
              <li key={i} style={{ fontSize: '0.85rem', color: '#fcd34d', lineHeight: 1.5 }}>
                {imp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
