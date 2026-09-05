import React, { useState } from 'react';
import { Sparkles, Filter, Layers, CheckCircle2 } from 'lucide-react';
import { ProjectIdea } from '../../types/index.js';
import { IdeaCard } from './IdeaCard.js';

interface IdeaGridProps {
  ideas: ProjectIdea[];
  onSelectPlan: (idea: ProjectIdea) => void;
  onToggleSave: (id: string) => void;
  onDelete: (id: string) => void;
  comparedIdeas: ProjectIdea[];
  onToggleCompare: (idea: ProjectIdea) => void;
  onGoToComparison: () => void;
  onAnalyzeIdea?: (idea: ProjectIdea) => void;
  onVivaPrep?: (idea: ProjectIdea) => void;
}

export const IdeaGrid: React.FC<IdeaGridProps> = ({
  ideas,
  onSelectPlan,
  onToggleSave,
  onDelete,
  comparedIdeas,
  onToggleCompare,
  onGoToComparison,
  onAnalyzeIdea,
  onVivaPrep,
}) => {

  const [filter, setFilter] = useState<'all' | 'feasibility' | 'impact' | 'saved'>('all');

  const filteredIdeas = ideas.filter((idea) => {
    if (filter === 'saved') return idea.isSaved;
    if (filter === 'feasibility') return idea.feasibilityScore >= 85;
    if (filter === 'impact') return idea.impactScore >= 85;
    return true;
  });

  return (
    <div style={{ marginTop: '2rem' }}>
      {/* Header & Filter Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="var(--primary)" />
            <span>Generated Capstone Proposals</span>
            <span className="badge badge-indigo">{filteredIdeas.length}</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Evaluated against your technical skills, timeline, and academic feasibility criteria.
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.04)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter('all')}
          >
            All Proposals
          </button>
          <button
            className={`btn btn-sm ${filter === 'feasibility' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter('feasibility')}
          >
            High Feasibility (85%+)
          </button>
          <button
            className={`btn btn-sm ${filter === 'impact' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter('impact')}
          >
            High Impact (85%+)
          </button>
          <button
            className={`btn btn-sm ${filter === 'saved' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter('saved')}
          >
            Bookmarked
          </button>
        </div>
      </div>

      {/* Comparison Drawer Banner */}
      {comparedIdeas.length > 0 && (
        <div
          className="glass-card"
          style={{
            padding: '1rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderColor: 'var(--cyan)',
            background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.12), rgba(99, 102, 241, 0.12))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Layers size={20} color="var(--cyan)" />
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>
                {comparedIdeas.length} {comparedIdeas.length === 1 ? 'idea' : 'ideas'} selected for side-by-side comparison
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {comparedIdeas.map((i) => i.title.substring(0, 30) + '...').join(' • ')}
              </p>
            </div>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={onGoToComparison}
            style={{ background: 'linear-gradient(135deg, var(--cyan), var(--primary))' }}
          >
            <CheckCircle2 size={15} />
            <span>Open Comparison Matrix</span>
          </button>
        </div>
      )}

      {/* Grid of Cards */}
      {filteredIdeas.length > 0 ? (
        <div className="grid-2" style={{ gap: '1.5rem' }}>
          {filteredIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onSelectPlan={onSelectPlan}
              onToggleSave={onToggleSave}
              onDelete={onDelete}
              isCompared={comparedIdeas.some((i) => i.id === idea.id)}
              onToggleCompare={onToggleCompare}
              onAnalyzeIdea={onAnalyzeIdea}
              onVivaPrep={onVivaPrep}
            />
          ))}
        </div>
      ) : (
        <div
          className="glass-card"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
            }}
          >
            <Filter size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>No matching project proposals found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '450px' }}>
            Adjust your skill profile, domain interests, or clear current filters to discover new capstone ideas.
          </p>
          <button className="btn btn-secondary btn-sm" onClick={() => setFilter('all')}>
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
