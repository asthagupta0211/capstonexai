import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, BrainCircuit } from 'lucide-react';
import { Sidebar } from './components/Sidebar.js';
import { TopHeader } from './components/TopHeader.js';
import { Footer } from './components/Footer.js';
import { LandingPage } from './features/landing/LandingPage.js';
import { AuthPortal } from './features/auth/AuthPortal.js';
import { ProfileWizard } from './features/profile/ProfileWizard.js';
import { IdeaGrid } from './features/ideas/IdeaGrid.js';
import { ComparisonMatrix } from './features/comparison/ComparisonMatrix.js';
import { PlanView } from './features/plan/PlanView.js';
import { MentorLab } from './features/mentor/MentorLab.js';
import { SavedProjects } from './features/saved/SavedProjects.js';
import { StudentProfile, ProjectIdea, ProjectPlan, AuthUser } from './types/index.js';
import { api } from './services/api.js';

export const App: React.FC = () => {
  // Navigation & View State
  const [viewMode, setViewMode] = useState<'landing' | 'studio' | 'auth'>('landing');
  const [activeTab, setActiveTab] = useState<'generator' | 'comparison' | 'mentor' | 'saved'>('generator');
  const [returnToTab, setReturnToTab] = useState<'generator' | 'comparison' | 'mentor' | 'saved'>('generator');
  const [selectedPlanIdea, setSelectedPlanIdea] = useState<ProjectIdea | null>(null);
  const [currentPlan, setCurrentPlan] = useState<ProjectPlan | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [mentorPreFillIdea, setMentorPreFillIdea] = useState<{
    title: string;
    pitch: string;
    intendedTech?: string;
    targetAudience?: string;
  } | null>(null);

  // User & Data State
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [profile, setProfile] = useState<StudentProfile>({
    skills: [],
    interests: [],
    preferredDomain: '',
    difficultyLevel: 'Intermediate',
    availableWeeks: 12,
    hoursPerWeek: 15,
    preferredTech: [],
    projectConstraints: [],
  });
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [comparedIdeas, setComparedIdeas] = useState<ProjectIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize Session on Load
  useEffect(() => {
    initSession();
  }, []);

  const initSession = async () => {
    try {
      if (api.getToken()) {
        const me = await api.getMe();
        if (me.user && me.user.email === 'student@demo.edu') {
          // Clear legacy demo session
          api.logout();
          setUser(null);
          setViewMode('landing');
        } else {
          setUser(me.user);
          await loadUserData();
          setViewMode('studio');
        }
      } else {
        setUser(null);
        setViewMode('landing');
      }
    } catch {
      api.logout();
      setUser(null);
      setViewMode('landing');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const loadUserData = async () => {
    try {
      const p = await api.getProfile();
      if (p.profile && p.profile.skills?.length > 0) {
        setProfile(p.profile);
      }
      const ideaList = await api.listIdeas();
      if (ideaList.ideas) {
        setIdeas(ideaList.ideas);
      }
    } catch {
      // Non-blocking
    }
  };

  const handleAuthenticated = async (authenticatedUser: AuthUser) => {
    setUser(authenticatedUser);
    setViewMode('studio');
    await loadUserData();
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setIdeas([]);
    setSelectedPlanIdea(null);
    setCurrentPlan(null);
    setActiveTab('generator');
    setViewMode('landing');
  };

  const handleSaveProfile = async (newProfile: StudentProfile) => {
    setProfile(newProfile);
    try {
      await api.saveProfile(newProfile);
    } catch {
      // Background save
    }
  };

  const handleGenerateIdeas = async (targetProfile: StudentProfile) => {
    try {
      setErrorMessage(null);
      setIsGenerating(true);
      const res = await api.generateIdeas(targetProfile);
      setIdeas(res.ideas);
      setSelectedPlanIdea(null);
      setCurrentPlan(null);
      setActiveTab('generator');
    } catch (err: any) {
      setErrorMessage(err.message);
      alert('Error generating ideas: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleSaveIdea = async (id: string) => {
    try {
      const res = await api.toggleSaveIdea(id);
      setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, isSaved: res.idea.isSaved } : i)));
      if (selectedPlanIdea?.id === id) {
        setSelectedPlanIdea((prev) => (prev ? { ...prev, isSaved: res.idea.isSaved } : null));
      }
    } catch (err: any) {
      alert('Failed to save idea: ' + err.message);
    }
  };

  const handleDeleteIdea = async (id: string) => {
    try {
      await api.deleteIdea(id);
      setIdeas((prev) => prev.filter((i) => i.id !== id));
      setComparedIdeas((prev) => prev.filter((i) => i.id !== id));
      if (selectedPlanIdea?.id === id) {
        setSelectedPlanIdea(null);
        setCurrentPlan(null);
      }
    } catch (err: any) {
      alert('Failed to delete idea: ' + err.message);
    }
  };

  const handleToggleCompare = (idea: ProjectIdea) => {
    setComparedIdeas((prev) => {
      const exists = prev.some((i) => i.id === idea.id);
      if (exists) {
        return prev.filter((i) => i.id !== idea.id);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 project ideas simultaneously.');
        return prev;
      }
      return [...prev, idea];
    });
  };

  const handleSelectPlan = async (idea: ProjectIdea) => {
    setReturnToTab(activeTab);
    setSelectedPlanIdea(idea);
    try {
      const res = await api.getPlan(idea.id);
      setCurrentPlan(res.plan);
    } catch (err: any) {
      alert('Failed to load blueprint: ' + err.message);
      setSelectedPlanIdea(null);
    }
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
    );
  }

  // 2. Real Authentication Portal: Sign In & Registration with MongoDB Atlas
  if (viewMode === 'auth') {
    return (
      <AuthPortal
        onAuthenticated={handleAuthenticated}
        onBackToLanding={() => setViewMode('landing')}
      />
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

        <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: '1350px', width: '100%', margin: '0 auto' }}>
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
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setErrorMessage(null)}
                style={{ fontSize: '0.75rem' }}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* RENDER PLAN VIEW (Accessible from any tab!) */}
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
                      onGenerateIdeas={handleGenerateIdeas}
                      isGenerating={isGenerating}
                    />
                  </div>

                  {/* Generated Proposals Showcase */}
                  {ideas.length > 0 && (
                    <IdeaGrid
                      ideas={ideas}
                      onSelectPlan={handleSelectPlan}
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
                  onRemoveFromCompare={(id) => setComparedIdeas((prev) => prev.filter((i) => i.id !== id))}
                  onSelectPlan={handleSelectPlan}
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
                  onSelectPlan={handleSelectPlan}
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
        </main>

        <Footer />
      </div>
    </div>
  );
};
