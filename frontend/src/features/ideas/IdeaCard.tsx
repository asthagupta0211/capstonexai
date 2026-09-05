import React from 'react';
import { Bookmark, Sparkles, AlertTriangle, ArrowRight, CheckSquare, Square, Trash2, BrainCircuit } from 'lucide-react';
import { ProjectIdea } from '../../types/index.js';
import { MetricMeter } from '../../components/MetricMeter.js';

interface IdeaCardProps {
  idea: ProjectIdea;
  onSelectPlan: (idea: ProjectIdea) => void;
  onToggleSave: (id: string) => void;
  onDelete: (id: string) => void;
  isCompared: boolean;
  onToggleCompare: (idea: ProjectIdea) => void;
  onAnalyzeIdea?: (idea: ProjectIdea) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  onSelectPlan,
  onToggleSave,
  onDelete,
  isCompared,
  onToggleCompare,
  onAnalyzeIdea,
}) => {

  const getDifficultyBadge = () => {
    switch (idea.difficulty) {
      case 'Beginner':
        return <span className="badge badge-success">Beginner Friendly</span>;
      case 'Advanced':
        return <span className="badge badge-danger">Advanced Research</span>;
      case 'Intermediate':
      default:
        return <span className="badge badge-indigo">Intermediate</span>;
    }
  };

  return (
    <div className={`glass-card ${isCompared ? 'glass-card-active' : ''}`} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header: Difficulty, Timeline & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {getDifficultyBadge()}
          <span className="badge badge-cyan">{idea.estimatedScopeWeeks} Weeks Scope</span>
          <span className="badge badge-purple">{idea.demoValueScore}% Demo Appeal</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onToggleCompare(idea)}
            title={isCompared ? 'Remove from Comparison Matrix' : 'Add to Comparison Matrix'}
            style={{ color: isCompared ? 'var(--cyan)' : 'var(--text-muted)' }}
          >
            {isCompared ? <CheckSquare size={17} /> : <Square size={17} />}
          </button>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onToggleSave(idea.id)}
            title={idea.isSaved ? 'Remove from Saved' : 'Save to Portfolio'}
            style={{ color: idea.isSaved ? 'var(--warning)' : 'var(--text-muted)' }}
          >
            <Bookmark size={17} fill={idea.isSaved ? 'var(--warning)' : 'none'} />
          </button>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onDelete(idea.id)}
            title="Dismiss Idea"
            style={{ color: 'var(--text-muted)' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Title & Pitch */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#ffffff' }}>
        {idea.title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1rem', fontStyle: 'italic' }}>
        "{idea.pitch}"
      </p>

      {/* Problem & Solution Preview */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '0.85rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.25rem',
          fontSize: '0.8125rem',
        }}
      >
        <p style={{ marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: '#ffffff' }}>Problem:</strong> {idea.problem}
        </p>
        <p style={{ color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--cyan)' }}>Solution:</strong> {idea.solution}
        </p>
      </div>

      {/* Metric Bars */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <MetricMeter label="Feasibility" score={idea.feasibilityScore} color="emerald" size="sm" />
        <MetricMeter label="Skill Match" score={idea.skillFitScore} color="indigo" size="sm" />
        <MetricMeter label="Impact" score={idea.impactScore} color="purple" size="sm" />
        <MetricMeter label="Novelty" score={idea.noveltyScore} color="cyan" size="sm" />
      </div>

      {/* Tech Stack Pills */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          RECOMMENDED TECH STACK:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {idea.techStackSummary.map((tech) => (
            <span key={tech} className="tag-pill">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Risks Callout */}
      {idea.risks.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.45rem',
            padding: '0.65rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            marginBottom: '1.25rem',
            fontSize: '0.75rem',
            color: '#fca5a5',
          }}
        >
          <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--danger)' }} />
          <span><strong>Evaluation Risk:</strong> {idea.risks[0]}</span>
        </div>
      )}

      {/* Footer CTA */}
      <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onToggleCompare(idea)}
            title={isCompared ? 'Remove from Comparison Matrix' : 'Add to Comparison Matrix'}
          >
            {isCompared ? 'Selected' : 'Compare'}
          </button>

          {onAnalyzeIdea && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onAnalyzeIdea(idea)}
              title="Critique this project in AI Mentor Lab"
              style={{ color: 'var(--cyan)' }}
            >
              <BrainCircuit size={14} />
              <span>Analyze</span>
            </button>
          )}
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => onSelectPlan(idea)}
        >
          <Sparkles size={14} />
          <span>Architect Blueprint</span>
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
};
