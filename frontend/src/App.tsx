import React, { useState, Suspense, lazy, useCallback } from 'react';
import { Sparkles, Compass, BrainCircuit } from 'lucide-react';
import { Sidebar } from './components/Sidebar.js';
import { TopHeader } from './components/TopHeader.js';
import { Footer } from './components/Footer.js';
import { ProfileWizard } from './features/profile/ProfileWizard.js';
import { IdeaGrid } from './features/ideas/IdeaGrid.js';
import { ProjectIdea } from './types/index.js';
import { useAuthSession } from './hooks/useAuthSession.js';
import { useIdeaStudio } from './hooks/useIdeaStudio.js';

// High-Efficiency Code-Splitting: Lazy load non-immediate route modules
const LandingPage = lazy(() => import('./features/landing/LandingPage.js').then((m) => ({ default: m.LandingPage })));
const AuthPortal = lazy(() => import('./features/auth/AuthPortal.js').then((m) => ({ default: m.AuthPortal })));
const ComparisonMatrix = lazy(() => import('./features/comparison/ComparisonMatrix.js').then((m) => ({ default: m.ComparisonMatrix })));
const PlanView = lazy(() => import('./features/plan/PlanView.js').then((m) => ({ default: m.PlanView })));
const MentorLab = lazy(() => import('./features/mentor/MentorLab.js').then((m) => ({ default: m.MentorLab })));
const SavedProjects = lazy(() => import('./features/saved/SavedProjects.js').then((m) => ({ default: m.SavedProjects })));

const SuspenseLoader: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', flexDirection: 'column', gap: '0.75rem' }} role="status" aria-live="polite">
    <div style={{ width: '32px', height: '32px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--cyan)', borderRadius: '50%', animation: 'spinSlow 0.8s linear infinite' }} />
    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loading Capstonex engine module...</span>
  </div>
);

export const App: React.FC = () => {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'generator' | 'comparison' | 'mentor' | 'saved'>('generator');
  const [returnToTab, setReturnToTab] = useState<'generator' | 'comparison' | 'mentor' | 'saved'>('generator');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [mentorPreFillIdea, setMentorPreFillIdea] = useState<{
    title: string;
    pitch: string;
    intendedTech?: string;
    targetAudience?: string;
  } | null>(null);

  // Business Domain Hooks
  const {
    ideas,
    setIdeas,
    comparedIdeas,
    setComparedIdeas,
    isGenerating,
    selectedPlanIdea,
    currentPlan,
    errorMessage,
    setSelectedPlanIdea,
    setCurrentPlan,
    loadIdeas,
    handleGenerateIdeas,
    handleToggleSaveIdea,
    handleDeleteIdea,
    handleToggleCompare,
    handleSelectPlan,
    resetStudio,
  } = useIdeaStudio();

  const handleUserLoaded = useCallback(() => {
    loadIdeas();
  }, [loadIdeas]);

  const {
    user,
    profile,
    isAuthenticating,
    viewMode,
    setViewMode,
    handleAuthenticated,
    handleLogout: authLogout,
    handleSaveProfile,
  } = useAuthSession(handleUserLoaded);

  const handleLogout = () => {
    authLogout();
    resetStudio();
    setActiveTab('generator');
  };

  const handleAnalyzeIdeaInMentor = (idea: ProjectIdea) => {
    setMentorPreFillIdea({
      title: idea.title,
      pitch: idea.pitch,
      intendedTech: idea.techStackSummary?.join(', ') || '',
      targetAudience: idea.targetUsers?.join(', ') || '',
    });
    setSelectedPlanIdea(null);
    setCurrentPlan(null);
    setActiveTab('mentor');
  };

  // While checking existing session
  if (isAuthenticating) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid rgba(99, 102, 241, 0.2)',
            borderTopColor: 'var(--primary)',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span>Initializing Capstonex Studio...</span>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // 1. Public Landing Page: Explains Project Purpose, Architecture & Capabilities
  if (viewMode === 'landing') {
    return (
      <Suspense fallback={<SuspenseLoader />}>
        <LandingPage
          user={user}
          onEnterStudio={() => {
            if (user) {
              setViewMode('studio');
            } else {
              setViewMode('auth');
            }
          }}
          onOpenAuth={() => setViewMode('auth')}
        />
      </Suspense>
    );
  }

  // 2. Real Authentication Portal: Sign In & Registration with MongoDB Atlas
  if (viewMode === 'auth') {
    return (
      <Suspense fallback={<SuspenseLoader />}>
        <AuthPortal
          onAuthenticated={handleAuthenticated}
          onBackToLanding={() => setViewMode('landing')}
        />
      </Suspense>
    );
  }

  // 3. Logged In: Render Real-World SaaS Layout with Left Sidebar
  return (
    <div className="app-shell" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedPlanIdea(null);
          setCurrentPlan(null);
        }}
        user={user}
        onLogout={handleLogout}
        savedCount={ideas.filter((i) => i.isSaved).length}
        isOpenMobile={isSidebarOpenMobile}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
        onGoToLanding={() => setViewMode('landing')}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopHeader
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedPlanIdea(null);
            setCurrentPlan(null);
          }}
          user={user}
          onOpenMobileSidebar={() => setIsSidebarOpenMobile(true)}
        />

        <main id="main-content" tabIndex={-1} style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: '1350px', width: '100%', margin: '0 auto', outline: 'none' }}>
          {/* System Note Banner if detected */}
          {errorMessage && (
            <div
              className="glass-card"
              style={{
                padding: '1rem 1.5rem',
                marginBottom: '1.5rem',
                borderLeft: '4px solid var(--danger)',
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong style={{ color: '#fca5a5' }}>System Notice: </strong>
                <span style={{ fontSize: '0.85rem', color: '#ffffff' }}>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* RENDER PLAN VIEW (Accessible from any tab!) */}
          <Suspense fallback={<SuspenseLoader />}>
            {selectedPlanIdea && currentPlan ? (
              <PlanView
                idea={selectedPlanIdea}
                plan={currentPlan}
                onGoBack={() => {
                  setSelectedPlanIdea(null);
                  setCurrentPlan(null);
                  setActiveTab(returnToTab);
                }}
                onAnalyzeInMentor={handleAnalyzeIdeaInMentor}
              />
            ) : (
              <>
                {/* TAB 1: IDEA GENERATOR (Showcase + Grid) */}
                {activeTab === 'generator' && (
                  <>
                    {/* Hero Showcase */}
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem', paddingTop: '0.5rem' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.35rem 0.9rem',
                          borderRadius: 'var(--radius-full)',
                          background: 'rgba(99, 102, 241, 0.12)',
                          border: '1px solid var(--border-glow)',
                          marginBottom: '1.25rem',
                        }}
                      >
                        <Sparkles size={14} color="var(--primary)" />
                        <span style={{ fontSize: '0.8125rem', color: '#a5b4fc', fontWeight: 600 }}>
                          Production Capstone Architect & AI Mentor
                        </span>
                      </div>

                      <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                        Architect Your <span className="text-gradient">Final-Year Project</span> With AI
                      </h1>

                      <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
                        Zero mock data. Powered live by <strong>Groq Cloud LLM</strong> and persisted in your <strong>MongoDB Atlas</strong> database.
                        Generate personalized proposals, tiered MVP features, justified tech stacks, and practical 10-phase roadmaps.
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-primary btn-lg"
                          onClick={() => {
                            const el = document.getElementById('profile-wizard-section');
                            el?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          <Compass size={18} />
                          <span>Launch Project Wizard</span>
                        </button>

                        <button
                          className="btn btn-secondary btn-lg"
                          onClick={() => setActiveTab('mentor')}
                        >
                          <BrainCircuit size={18} color="var(--cyan)" />
                          <span>Critique Existing Idea</span>
                        </button>
                      </div>
                    </div>

                    {/* Profile Onboarding Wizard */}
                    <div id="profile-wizard-section">
                      <ProfileWizard
                        profile={profile}
                        onSaveProfile={handleSaveProfile}
                        onGenerateIdeas={(targetProfile) =>
                          handleGenerateIdeas(targetProfile, () => {
                            setSelectedPlanIdea(null);
                            setCurrentPlan(null);
                            setActiveTab('generator');
                          })
                        }
                        isGenerating={isGenerating}
                      />
                    </div>

                    {/* Generated Proposals Showcase */}
                    {ideas.length > 0 && (
                      <IdeaGrid
                        ideas={ideas}
                        onSelectPlan={(idea) =>
                          handleSelectPlan(idea, () => setReturnToTab(activeTab))
                        }
                        onToggleSave={handleToggleSaveIdea}
                        onDelete={handleDeleteIdea}
                        comparedIdeas={comparedIdeas}
                        onToggleCompare={handleToggleCompare}
                        onGoToComparison={() => setActiveTab('comparison')}
                        onAnalyzeIdea={handleAnalyzeIdeaInMentor}
                      />
                    )}
                  </>
                )}

                {/* TAB 2: MULTI-IDEA COMPARISON MATRIX */}
                {activeTab === 'comparison' && (
                  <ComparisonMatrix
                    ideas={comparedIdeas.length > 0 ? comparedIdeas : ideas.slice(0, 3)}
                    onRemoveFromCompare={(id) =>
                      setComparedIdeas((prev) => prev.filter((i) => i.id !== id))
                    }
                    onSelectPlan={(idea) =>
                      handleSelectPlan(idea, () => setReturnToTab(activeTab))
                    }
                    onGoBack={() => setActiveTab('generator')}
                  />
                )}

                {/* TAB 3: AI MENTOR LAB */}
                {activeTab === 'mentor' && (
                  <MentorLab
                    initialIdea={mentorPreFillIdea}
                    onClearInitialIdea={() => setMentorPreFillIdea(null)}
                  />
                )}

                {/* TAB 4: SAVED PORTFOLIO */}
                {activeTab === 'saved' && (
                  <SavedProjects
                    ideas={ideas}
                    onSelectPlan={(idea) =>
                      handleSelectPlan(idea, () => setReturnToTab(activeTab))
                    }
                    onToggleSave={handleToggleSaveIdea}
                    onDelete={handleDeleteIdea}
                    comparedIdeas={comparedIdeas}
                    onToggleCompare={handleToggleCompare}
                    onGoToGenerator={() => setActiveTab('generator')}
                    onAnalyzeIdea={handleAnalyzeIdeaInMentor}
                  />
                )}
              </>
            )}
          </Suspense>
        </main>

        <Footer />
      </div>
    </div>
  );
};
