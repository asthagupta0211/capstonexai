import React from 'react';
import {
  Sparkles,
  Compass,
  Layers,
  BrainCircuit,
  Bookmark,
  LogOut,
  X,
  Globe
} from 'lucide-react';
import { AuthUser } from '../types/index.js';

interface SidebarProps {
  activeTab: 'generator' | 'comparison' | 'mentor' | 'saved';
  setActiveTab: (tab: 'generator' | 'comparison' | 'mentor' | 'saved') => void;
  user: AuthUser | null;
  onLogout: () => void;
  savedCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onGoToLanding?: () => void;
}

interface NavItem {
  id: 'generator' | 'comparison' | 'mentor' | 'saved';
  label: string;
  icon: any;
  description: string;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  savedCount,
  isOpenMobile,
  onCloseMobile,
  onGoToLanding,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'generator',
      label: 'Idea Generator',
      icon: Compass,
      description: 'Profile & AI Proposals',
    },
    {
      id: 'comparison',
      label: 'Comparison Matrix',
      icon: Layers,
      description: 'Multi-criteria Tradeoffs',
    },
    {
      id: 'mentor',
      label: 'AI Mentor Lab',
      icon: BrainCircuit,
      description: 'Faculty-grade Critique',
    },
    {
      id: 'saved',
      label: 'Saved Portfolio',
      icon: Bookmark,
      badge: savedCount > 0 ? savedCount : undefined,
      description: 'Bookmarked Capstones',
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
          }}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        style={{
          width: '260px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-card)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.25rem 1rem',
          zIndex: 100,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          flexShrink: 0,
        }}
        className={`app-sidebar ${isOpenMobile ? 'open-mobile' : ''}`}
      >
        {/* Top: Brand Header */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.75rem',
              padding: '0 0.5rem',
            }}
          >
            <div
              onClick={() => {
                setActiveTab('generator');
                onCloseMobile();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={18} color="#ffffff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '1.2rem',
                      letterSpacing: '-0.02em',
                      color: '#ffffff',
                    }}
                  >
                    Capstonex<span style={{ color: 'var(--cyan)' }}>.AI</span>
                  </span>
                </div>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', lineHeight: 1 }}>
                  Final-Year Project Architect
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              className="mobile-close-btn"
              onClick={onCloseMobile}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'none',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Project Overview Link */}
          {onGoToLanding && (
            <button
              onClick={() => {
                onGoToLanding();
                onCloseMobile();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                width: '100%',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                background: 'rgba(99, 102, 241, 0.08)',
                color: 'var(--cyan)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
                transition: 'all 0.2s',
              }}
              className="sidebar-overview-btn"
            >
              <Globe size={16} />
              <span>Project Overview Page</span>
            </button>
          )}

          {/* Nav Section Label */}
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              padding: '0 0.65rem',
              marginBottom: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Capstone Studio</span>
            <span style={{ fontSize: '0.625rem', color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>v2.6 LIVE</span>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onCloseMobile();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.75rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: isActive ? '1px solid var(--border-glow)' : '1px solid transparent',
                    borderLeft: isActive ? '3px solid var(--cyan)' : '1px solid transparent',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(6, 182, 212, 0.12))'
                      : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    boxShadow: isActive ? '0 0 15px rgba(99, 102, 241, 0.2)' : 'none',
                  }}
                  className="sidebar-nav-item"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        color: isActive ? 'var(--cyan)' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        filter: isActive ? 'drop-shadow(0 0 6px var(--cyan))' : 'none',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? '#ffffff' : 'var(--text-primary)',
                          lineHeight: 1.2,
                        }}
                      >
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      style={{
                        padding: '0.15rem 0.45rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--primary)',
                        color: '#ffffff',
                        boxShadow: '0 0 10px var(--primary-glow)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: System Specs & Real User Profile */}
        <div>
          {/* Live System Specs Card */}
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              marginBottom: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem' }}>
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--emerald)',
                  boxShadow: '0 0 6px var(--emerald)',
                }}
              />
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.04em', color: '#6ee7b7' }}>
                ARCHITECTURE TELEMETRY
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Inference:</span>
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>Groq LLaMA-3.3</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Store:</span>
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>MongoDB Atlas M0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Integrity:</span>
                <span style={{ color: '#a7f3d0', fontWeight: 600 }}>Zero Mock Data</span>
              </div>
            </div>
          </div>

          {/* User Profile Card */}
          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    flexShrink: 0,
                    boxShadow: '0 0 10px var(--primary-glow)',
                  }}
                >
                  {getInitials(user.name || 'User')}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {user.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.6875rem',
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {user.email}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s',
                  flexShrink: 0,
                }}
                title="Sign Out"
                className="sidebar-logout-btn"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>

      <style>{`
        .sidebar-nav-item:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          color: #ffffff !important;
        }
        .sidebar-logout-btn:hover {
          color: #fca5a5 !important;
        }
        @media (max-width: 900px) {
          .app-sidebar {
            position: fixed !important;
            left: 0;
            top: 0;
            transform: translateX(-100%);
          }
          .app-sidebar.open-mobile {
            transform: translateX(0);
          }
          .mobile-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};
