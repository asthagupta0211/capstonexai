import React from 'react';
import { Menu } from 'lucide-react';
import { AuthUser } from '../types/index.js';

interface TopHeaderProps {
  activeTab: 'generator' | 'comparison' | 'mentor' | 'saved';
  setActiveTab: (tab: 'generator' | 'comparison' | 'mentor' | 'saved') => void;
  user: AuthUser | null;
  onOpenMobileSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  user,
  onOpenMobileSidebar,
}) => {
  const getTabDetails = () => {
    switch (activeTab) {
      case 'generator':
        return {
          title: 'Capstone Idea Generator',
          subtitle: 'Synthesize custom project proposals tailored to your skills & interests',
        };
      case 'comparison':
        return {
          title: 'Multi-Criteria Tradeoff Matrix',
          subtitle: 'Side-by-side evaluation of feasibility, impact, novelty, and complexity',
        };
      case 'mentor':
        return {
          title: 'AI Faculty Mentor Lab',
          subtitle: 'Stress-test your project concept with objective faculty-grade feedback',
        };
      case 'saved':
        return {
          title: 'Saved Capstone Portfolio',
          subtitle: 'Review bookmarked project ideas, full blueprints, and 10-phase roadmaps',
        };
    }
  };

  const { title, subtitle } = getTabDetails();

  return (
    <header
      style={{
        height: '4.5rem',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(7, 9, 19, 0.75)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
      className="top-header"
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onOpenMobileSidebar}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '0.4rem',
            borderRadius: 'var(--radius-xs)',
            display: 'none',
          }}
          className="mobile-menu-toggle"
          title="Open Menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              margin: 0,
              display: 'none',
            }}
            className="header-subtitle"
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: User Welcome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
            }}
            className="user-greeting"
          >
            <span>Welcome, <strong style={{ color: '#ffffff' }}>{user.name}</strong></span>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .mobile-menu-toggle {
            display: block !important;
          }
        }
        @media (min-width: 640px) {
          .header-subtitle {
            display: block !important;
          }
        }
        @media (max-width: 768px) {
          .top-header {
            padding: 0 1rem !important;
          }
          .user-greeting {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
