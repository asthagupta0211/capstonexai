import React from 'react';
import { Menu, Activity, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
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
          subtitle: 'Synthesize custom project proposals tailored to your skills & constraints',
          tag: 'Studio Engine',
        };
      case 'comparison':
        return {
          title: 'Multi-Criteria Tradeoff Matrix',
          subtitle: 'Side-by-side evaluation of feasibility, impact, novelty, and complexity',
          tag: 'Decision Lab',
        };
      case 'mentor':
        return {
          title: 'AI Faculty Mentor Lab',
          subtitle: 'Stress-test your project concept with objective faculty-grade feedback',
          tag: 'Defense Advisor',
        };
      case 'saved':
        return {
          title: 'Saved Capstone Portfolio',
          subtitle: 'Review bookmarked project ideas, full blueprints, and 10-phase roadmaps',
          tag: 'Portfolio Store',
        };
    }
  };

  const { title, subtitle, tag } = getTabDetails();

  return (
    <header
      style={{
        height: '4.25rem',
        borderBottom: '1px solid var(--border-card)',
        background: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: 'var(--shadow-sm)',
      }}
      className="top-header"
    >
      {/* Left: Mobile Toggle & Page Title with Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onOpenMobileSidebar}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: 'var(--radius-xs)',
            display: 'none',
          }}
          className="mobile-menu-toggle"
          title="Open Menu"
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.15rem' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
              Studio
            </span>
            <ChevronRight size={12} color="var(--text-muted)" />
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cyan)', fontWeight: 700 }}>
              {tag}
            </span>
          </div>

          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              margin: '0.15rem 0 0',
              display: 'none',
            }}
            className="header-subtitle"
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Live Telemetry Status & User Greeting */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Live Groq + Atlas Pulse Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.35rem 0.85rem',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 0 12px rgba(16, 185, 129, 0.15)',
          }}
          className="telemetry-pill"
          title="Connected directly to Groq Cloud LLM and MongoDB Atlas Database"
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--emerald)',
              boxShadow: '0 0 8px var(--emerald)',
              animation: 'pulseDot 2s infinite',
            }}
          />
          <span style={{ fontSize: '0.725rem', fontWeight: 600, color: '#6ee7b7', letterSpacing: '0.02em' }}>
            Groq AI Live • Atlas Connected
          </span>
        </div>

        {/* User Pill */}
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.3rem 0.75rem',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
            }}
            className="user-greeting"
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#ffffff',
              }}
            >
              {(user.name || 'U')[0].toUpperCase()}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              {user.name}
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }
        @media (max-width: 900px) {
          .mobile-menu-toggle {
            display: block !important;
          }
        }
        @media (min-width: 768px) {
          .header-subtitle {
            display: block !important;
          }
        }
        @media (max-width: 768px) {
          .top-header {
            padding: 0 1rem !important;
            height: 4.25rem !important;
          }
          .telemetry-pill {
            display: none !important;
          }
          .user-greeting {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
