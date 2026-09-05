import React from 'react';
import { Bookmark, Sparkles, AlertTriangle, ArrowRight, CheckSquare, Square, Trash2, BrainCircuit, Zap, Rocket, Microscope, Clock, Star, GraduationCap } from 'lucide-react';
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
  onVivaPrep?: (idea: ProjectIdea) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  onSelectPlan,
  onToggleSave,
  onDelete,
  isCompared,
  onToggleCompare,
  onAnalyzeIdea,
  onVivaPrep,
}) => {
  const getDifficultyBadge = () => {
    switch (idea.difficulty) {
      case 'Beginner':
        return (
          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Zap size={12} />
            <span>Beginner Friendly</span>
          </span>
        );
      case 'Advanced':
        return (
          <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Microscope size={12} />
            <span>Advanced Research</span>
          </span>
        );
      case 'Intermediate':
      default:
        return (
          <span className="badge badge-indigo" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Rocket size={12} />
            <span>Intermediate</span>
          </span>
        );
    }
  };

  return (
    <div
      className={`glass-card ${isCompared ? 'glass-card-active' : ''}`}
      style={{
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderTop: isCompared ? '3px solid var(--cyan)' : '3px solid rgba(99, 102, 241, 0.4)',
        transition: 'all 0.25s ease',
      }}
    >
      {/* Header: Difficulty, Timeline & Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {getDifficultyBadge()}
          <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={12} />
            <span>{idea.estimatedScopeWeeks}w Scope</span>
          </span>
          <span className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Star size={12} />
            <span>{idea.demoValueScore}% Demo Appeal</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onToggleCompare(idea)}
            title={isCompared ? 'Remove from Comparison Matrix' : 'Add to Comparison Matrix'}
            style={{
              color: isCompared ? 'var(--cyan)' : 'var(--text-muted)',
              padding: '0.35rem',
            }}
          >
            {isCompared ? <CheckSquare size={17} /> : <Square size={17} />}
          </button>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onToggleSave(idea.id)}
            title={idea.isSaved ? 'Remove from Saved' : 'Save to Portfolio'}
            style={{
              color: idea.isSaved ? 'var(--warning)' : 'var(--text-muted)',
              padding: '0.35rem',
            }}
          >
            <Bookmark size={17} fill={idea.isSaved ? 'var(--warning)' : 'none'} />
          </button>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onDelete(idea.id)}
            title="Dismiss Idea"
            style={{ color: 'var(--text-muted)', padding: '0.35rem' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Title & Pitch */}
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          marginBottom: '0.5rem',
          color: '#ffffff',
          lineHeight: 1.3,
          letterSpacing: '-0.015em',
        }}
      >
        {idea.title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.55, marginBottom: '1.25rem', fontStyle: 'italic' }}>
        "{idea.pitch}"
      </p>

      {/* Problem & Solution Preview */}
      <div
        style={{
          background: 'rgba(5, 8, 22, 0.65)',
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.25rem',
          fontSize: '0.8125rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'flex-start' }}>
          <span style={{ color: '#f87171', fontWeight: 700, flexShrink: 0 }}>Problem:</span>
          <span style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>{idea.problem}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--cyan)', fontWeight: 700, flexShrink: 0 }}>Solution:</span>
          <span style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>{idea.solution}</span>
        </div>
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
        <p style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
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
            gap: '0.5rem',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            marginBottom: '1.25rem',
            fontSize: '0.775rem',
            color: '#fca5a5',
          }}
        >
          <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '1px', color: 'var(--danger)' }} />
          <span><strong>Evaluation Risk:</strong> {idea.risks[0]}</span>
        </div>
      )}

      {/* Footer CTA Actions */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <button
            className={`btn btn-sm ${isCompared ? 'btn-outline' : 'btn-secondary'}`}
            onClick={() => onToggleCompare(idea)}
            title={isCompared ? 'Remove from Comparison Matrix' : 'Add to Comparison Matrix'}
            style={{ fontSize: '0.75rem' }}
          >
            {isCompared ? 'Selected' : 'Compare'}
          </button>

          {onAnalyzeIdea && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onAnalyzeIdea(idea)}
              title="Critique this project in AI Mentor Lab"
              style={{ color: 'var(--cyan)', fontSize: '0.75rem' }}
            >
              <BrainCircuit size={13} />
              <span>Critique</span>
            </button>
          )}

          {onVivaPrep && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onVivaPrep(idea)}
              title="Rehearse External Committee Project Defense Questions"
              style={{ color: 'var(--primary-light)', fontSize: '0.75rem' }}
            >
              <GraduationCap size={13} />
              <span>Viva Prep</span>
            </button>
          )}
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => onSelectPlan(idea)}
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            boxShadow: '0 0 16px var(--primary-glow)',
          }}
        >
          <Sparkles size={14} />
          <span>Architect Blueprint</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
