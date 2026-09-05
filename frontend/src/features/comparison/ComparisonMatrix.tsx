import React from 'react';
import { Layers, ArrowRight, X, Sparkles, Check, Info } from 'lucide-react';
import { ProjectIdea } from '../../types/index.js';
import { MetricMeter } from '../../components/MetricMeter.js';

interface ComparisonMatrixProps {
  ideas: ProjectIdea[];
  onRemoveFromCompare: (id: string) => void;
  onSelectPlan: (idea: ProjectIdea) => void;
  onGoBack: () => void;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  ideas,
  onRemoveFromCompare,
  onSelectPlan,
  onGoBack,
}) => {
  if (ideas.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <Layers size={48} color="var(--cyan)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
        <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.5rem' }}>
          No Ideas Selected for Comparison
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
          Select 2 or more project proposals from the Idea Generator by checking the "Compare" box on any project card.
        </p>
        <button className="btn btn-primary" onClick={onGoBack}>
          <Sparkles size={16} />
          <span>Explore Generated Ideas</span>
        </button>
      </div>
    );
  }

  // Generate automated synthesis comparing selected ideas
  const highestFeasibility = [...ideas].sort((a, b) => b.feasibilityScore - a.feasibilityScore)[0];
  const highestImpact = [...ideas].sort((a, b) => b.impactScore - a.impactScore)[0];
  const highestDemo = [...ideas].sort((a, b) => b.demoValueScore - a.demoValueScore)[0];

  return (
    <div style={{ marginTop: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Layers size={22} color="var(--cyan)" />
            <span>Capstone Multi-Idea Comparison Matrix</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Side-by-side trade-off analysis across feasibility, evaluation impact, novelty, and demo potential.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={onGoBack}>
          ← Back to All Ideas
        </button>
      </div>

      {/* Strategic Synthesis Callout */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          borderLeft: '4px solid var(--cyan)',
          background: 'rgba(6, 182, 212, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <Info size={20} color="var(--cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.25rem' }}>
              Mentor Recommendation & Trade-Off Summary
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              • <strong>Safest Implementation:</strong> <span style={{ color: 'var(--success)' }}>{highestFeasibility.title}</span> ({highestFeasibility.feasibilityScore}% feasibility) maximizes completion certainty within your semester timeline.
              <br />
              • <strong>Highest Evaluation Impact:</strong> <span style={{ color: 'var(--primary)' }}>{highestImpact.title}</span> ({highestImpact.impactScore}% impact) will receive higher academic recognition from faculty committees.
              <br />
              • <strong>Best Presentation Demo:</strong> <span style={{ color: 'var(--cyan)' }}>{highestDemo.title}</span> ({highestDemo.demoValueScore}% demo value) has the highest visual 'wow' factor during live defense.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${ideas.length}, minmax(300px, 1fr))`,
          gap: '1.5rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
        }}
      >
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="glass-card"
            style={{
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              borderTop: '3px solid var(--primary)',
            }}
          >
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="badge badge-cyan">{idea.difficulty}</span>
                {idea.id === highestFeasibility?.id && (
                  <span className="badge badge-success" style={{ fontSize: '0.675rem' }}>
                    🏆 Safest Implementation
                  </span>
                )}
                {idea.id === highestImpact?.id && (
                  <span className="badge badge-purple" style={{ fontSize: '0.675rem' }}>
                    ⭐ Highest Impact
                  </span>
                )}
                {idea.id === highestDemo?.id && (
                  <span className="badge badge-indigo" style={{ fontSize: '0.675rem' }}>
                    🚀 Best Demo Value
                  </span>
                )}
              </div>

              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onRemoveFromCompare(idea.id)}
                title="Remove from comparison"
                style={{ color: 'var(--text-muted)', padding: '0.25rem' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Title & Pitch */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff', minHeight: '52px', lineHeight: 1.25 }}>
              {idea.title}
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', minHeight: '60px', lineHeight: 1.45, fontStyle: 'italic' }}>
              "{idea.pitch}"
            </p>

            {/* Metrics Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
              <MetricMeter label="Feasibility" score={idea.feasibilityScore} color="emerald" size="sm" />
              <MetricMeter label="Skill Match" score={idea.skillFitScore} color="indigo" size="sm" />
              <MetricMeter label="Expected Impact" score={idea.impactScore} color="purple" size="sm" />
              <MetricMeter label="Novelty Score" score={idea.noveltyScore} color="cyan" size="sm" />
              <MetricMeter label="Live Demo Potential" score={idea.demoValueScore} color="amber" size="sm" />
            </div>

            {/* Timeline & Complexity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.8rem' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Timeline</span>
                <strong style={{ color: '#ffffff' }}>{idea.estimatedScopeWeeks} Weeks</strong>
              </div>
              <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Key Strength</span>
                <strong style={{ color: 'var(--cyan)' }}>{idea.demoValueScore >= 90 ? 'Demo Appeal' : 'High Feasibility'}</strong>
              </div>
            </div>

            {/* Recommended Tech Stack */}
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                TECH STACK:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {idea.techStackSummary.map((t) => (
                  <span key={t} className="tag-pill" style={{ fontSize: '0.7rem' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Features Preview */}
            <div style={{ marginBottom: '1.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <p style={{ fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem' }}>Core Differentiator:</p>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                <Check size={14} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{idea.keyFeaturesSummary[0]}</span>
              </div>
            </div>

            {/* Choose this Project CTA */}
            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                className="btn btn-primary"
                onClick={() => onSelectPlan(idea)}
                style={{ width: '100%' }}
              >
                <span>Select & Build Roadmap</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
