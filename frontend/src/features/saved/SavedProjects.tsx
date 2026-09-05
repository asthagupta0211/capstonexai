import React from 'react';
import { Bookmark, Sparkles, ArrowRight, Trash2 } from 'lucide-react';
import { ProjectIdea } from '../../types/index.js';
import { IdeaCard } from '../ideas/IdeaCard.js';

interface SavedProjectsProps {
  ideas: ProjectIdea[];
  onSelectPlan: (idea: ProjectIdea) => void;
  onToggleSave: (id: string) => void;
  onDelete: (id: string) => void;
  comparedIdeas: ProjectIdea[];
  onToggleCompare: (idea: ProjectIdea) => void;
  onGoToGenerator: () => void;
}

export const SavedProjects: React.FC<SavedProjectsProps> = ({
  ideas,
  onSelectPlan,
  onToggleSave,
  onDelete,
  comparedIdeas,
  onToggleCompare,
  onGoToGenerator,
}) => {
  const savedIdeas = ideas.filter((i) => i.isSaved);

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bookmark size={22} color="var(--warning)" fill="var(--warning)" />
            <span>Saved Capstone Portfolio</span>
            <span className="badge badge-indigo">{savedIdeas.length}</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Your bookmarked project ideas, ready for in-depth architecture generation and mentor review.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={onGoToGenerator}>
          + Discover More Ideas
        </button>
      </div>

      {savedIdeas.length > 0 ? (
        <div className="grid-2" style={{ gap: '1.5rem' }}>
          {savedIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onSelectPlan={onSelectPlan}
              onToggleSave={onToggleSave}
              onDelete={onDelete}
              isCompared={comparedIdeas.some((i) => i.id === idea.id)}
              onToggleCompare={onToggleCompare}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Bookmark size={48} color="var(--warning)" style={{ marginBottom: '1rem', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.5rem' }}>
            No Bookmarked Projects Yet
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            Bookmark promising project ideas from the generator by clicking the bookmark icon on any card.
          </p>
          <button className="btn btn-primary" onClick={onGoToGenerator}>
            <Sparkles size={16} />
            <span>Explore Project Ideas</span>
          </button>
        </div>
      )}
    </div>
  );
};
