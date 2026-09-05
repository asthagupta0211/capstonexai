import React from 'react';
import {
  Sparkles,
  Compass,
  Layers,
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Database,
  Cpu,
  Terminal,
  Award,
  TrendingUp,
  Target,
  Calendar,
  Layers3,
  LogIn,
  Zap,
  ExternalLink
} from 'lucide-react';
import { AuthUser } from '../../types/index.js';

interface LandingPageProps {
  user: AuthUser | null;
  onEnterStudio: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  user,
  onEnterStudio,
  onOpenAuth,
}) => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      {/* Top Navigation Bar */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(7, 9, 19, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-subtle)',
          height: '4.5rem',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={onEnterStudio}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 18px var(--primary-glow)',
              }}
            >
              <Sparkles size={22} color="#ffffff" />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                }}
              >
                Capstonex<span style={{ color: 'var(--cyan)' }}>.AI</span>
              </span>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1 }}>
                Final-Year Project Architect
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="landing-nav-links">
            <a href="#problem" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
              The Problem
            </a>
            <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
              Capabilities
            </a>
            <a href="#architecture" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
              Architecture
            </a>
            <a href="#workflow" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
              Roadmap
            </a>
          </div>

          {/* CTA Action */}
          <div>
            {user ? (
              <button className="btn btn-primary" onClick={onEnterStudio}>
                <span>Enter Studio</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-ghost btn-sm" onClick={onOpenAuth}>
                  <LogIn size={15} />
                  <span>Sign In</span>
                </button>
                <button className="btn btn-primary btn-sm" onClick={onOpenAuth}>
                  <span>Get Started Free</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        style={{
          position: 'relative',
          padding: '6rem 1rem 5rem',
          textAlign: 'center',
          background: 'radial-gradient(circle at 50% 15%, rgba(99, 102, 241, 0.18), transparent 50%), radial-gradient(circle at 85% 70%, rgba(139, 92, 246, 0.12), transparent 45%)',
        }}
      >
        <div className="container" style={{ maxWidth: '960px' }}>
          {/* Hero Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.4rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid var(--border-glow)',
              marginBottom: '1.75rem',
            }}
          >
            <Sparkles size={15} color="var(--cyan)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#a5b4fc' }}>
              Real-World Capstone Architect & AI Faculty Mentor
            </span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.15,
              marginBottom: '1.5rem',
              color: '#ffffff',
            }}
          >
            Turn Your Skills & Interests Into a <br />
            <span className="text-gradient">Winning Final-Year Project</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              maxWidth: '750px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.65,
            }}
          >
            Say goodbye to committee-rejected cliché ideas. Capstonex synthesizes personalized, high-novelty project proposals based on your technical skills, timeline, and constraints. Get 3-tier feature scope, justified tech stacks, and a faculty-grade 10-phase roadmap.
          </p>

          {/* Hero Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={user ? onEnterStudio : onOpenAuth}
              style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
            >
              <Compass size={20} />
              <span>Launch Capstone Studio</span>
              <ArrowRight size={18} />
            </button>

            <button
              className="btn btn-secondary btn-lg"
              onClick={user ? onEnterStudio : onOpenAuth}
              style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
            >
              <BrainCircuit size={20} color="var(--cyan)" />
              <span>AI Mentor Lab Critique</span>
            </button>
          </div>

          {/* Live System Pillars */}
          <div
            className="grid-4"
            style={{
              gap: '1rem',
              textAlign: 'left',
              marginTop: '1rem',
            }}
          >
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <Cpu size={18} color="var(--primary)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>Live Groq Cloud AI</span>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0 }}>
                High-throughput inference synthesizing structured JSON proposals on demand.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <Database size={18} color="var(--emerald)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>MongoDB Atlas</span>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0 }}>
                Fully persistent cloud document database saving your profiles, proposals, and roadmaps.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <ShieldCheck size={18} color="var(--cyan)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>Zero Mock Data</span>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0 }}>
                100% real LLM output validated against strict Zod schema contracts with encrypted auth.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <Calendar size={18} color="var(--secondary)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>10-Phase Roadmap</span>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0 }}>
                From requirements analysis to final thesis writing and viva demonstration.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 1: THE PROBLEM STATEMENT */}
      <section id="problem" style={{ padding: '5rem 1rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0, 0, 0, 0.2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
              Why Do Most Final-Year Projects Struggle?
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Final-year students encounter recurring roadblocks that lead to committee rejections, scope creep, and incomplete prototypes.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {/* Roadblock 1 */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <XCircle size={22} color="#f87171" />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.75rem' }}>
                1. Cliché & Outdated Concepts
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Students submit overused ideas (generic e-commerce, movie recommenders, basic chat apps) that faculty committees reject for lack of originality and research value.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald)', fontSize: '0.8rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} />
                <span>Capstonex: High-novelty, domain-specific ideas</span>
              </div>
            </div>

            {/* Roadblock 2 */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <XCircle size={22} color="#fbbf24" />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.75rem' }}>
                2. Scope Creep & Tech Mismatch
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Picking technologies beyond the team's skillset or trying to build too much without tiering features leads to panic and unfinished demos before graduation.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald)', fontSize: '0.8rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} />
                <span>Capstonex: 3-tier MVP scope with justified tech</span>
              </div>
            </div>

            {/* Roadblock 3 */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <XCircle size={22} color="#a5b4fc" />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.75rem' }}>
                3. Lack of Objective Faculty Feedback
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                University guides often have dozens of student teams and cannot provide line-by-line architectural critique until late midterm reviews.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald)', fontSize: '0.8rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} />
                <span>Capstonex: On-demand AI Mentor stress-testing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CAPSTONEX CAPABILITIES */}
      <section id="features" style={{ padding: '5.5rem 1rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
              Comprehensive Platform Capabilities
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Everything a final-year engineering student needs from initial ideation to thesis defense.
            </p>
          </div>

          <div className="grid-2" style={{ gap: '2rem' }}>
            {/* Feature 1 */}
            <div className="glass-card" style={{ padding: '2.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)' }}>
                  <Compass size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>Student Profile Wizard</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--cyan)' }}>Input Skills & Constraints</span>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Input your existing programming languages, frameworks, interest domains (e.g. Healthcare, Edge AI, CleanTech), timeline, and budget constraints ($0 cloud budget, laptop only). The AI builds proposals matching your real abilities.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card" style={{ padding: '2.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--secondary)' }}>
                  <Layers size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>Multi-Criteria Comparison Matrix</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--cyan)' }}>Objective Tradeoff Evaluation</span>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Compare candidate ideas side-by-side across 5 quantitative dimensions: Technical Feasibility, Real-World Impact, Academic Novelty, Skill Fit, and Live Demo Value to make confident decisions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card" style={{ padding: '2.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'rgba(6, 182, 212, 0.2)', color: 'var(--cyan)' }}>
                  <Terminal size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>3-Tier Scope & Justified Tech Stack</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--cyan)' }}>Concrete Architectural Rationale</span>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Clearly categorizes Must-Have MVP features, Good-to-Have additions, and Future scope. Every technology (Frontend, Backend, Database, AI framework) is accompanied by an architectural justification.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card" style={{ padding: '2.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald)' }}>
                  <BrainCircuit size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>AI Faculty Mentor Lab</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--cyan)' }}>Stress-Test Any Proposed Concept</span>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Have an existing idea you thought of yourself? Submit the title and pitch to our AI Mentor Lab for immediate faculty critique: uncover hidden pitfalls, missing features, and advice on making it stand out from typical projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: 10-PHASE ROADMAP */}
      <section id="workflow" style={{ padding: '5rem 1rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0, 0, 0, 0.25)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
              The 10-Phase Capstone Execution Roadmap
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Every generated blueprint comes with an explicit timeline, phase milestones, and deliverables.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { num: '01', title: 'Requirements & Survey', deliverable: 'Literature review & SRS' },
              { num: '02', title: 'Architecture & Design', deliverable: 'System design & ERD' },
              { num: '03', title: 'Database & Setup', deliverable: 'Schema migrations & config' },
              { num: '04', title: 'Backend API Development', deliverable: 'REST endpoints & Auth' },
              { num: '05', title: 'Frontend UI Implementation', deliverable: 'Responsive client views' },
              { num: '06', title: 'AI & Algorithm Integration', deliverable: 'Trained model inference' },
              { num: '07', title: 'Testing & Security Audit', deliverable: 'Unit tests & vulnerability scan' },
              { num: '08', title: 'Deployment & CI/CD', deliverable: 'Docker image & live URL' },
              { num: '09', title: 'Thesis & Documentation', deliverable: 'Formatted final report' },
              { num: '10', title: 'Final Demo & Presentation', deliverable: 'Slide deck & live viva demo' },
            ].map((p, i) => (
              <div
                key={i}
                className="glass-card"
                style={{ padding: '1.25rem', borderLeft: '3px solid var(--primary)' }}
              >
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cyan)', marginBottom: '0.35rem' }}>
                  Phase {p.num}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.4rem' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Deliverable: <span style={{ color: 'var(--text-secondary)' }}>{p.deliverable}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: REAL-WORLD ARCHITECTURE & ZERO MOCK DATA */}
      <section id="architecture" style={{ padding: '5rem 1rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="glass-card" style={{ padding: '2.75rem', textAlign: 'center', background: 'radial-gradient(circle at 50% 10%, rgba(99, 102, 241, 0.15), transparent 60%), var(--bg-card)' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Database size={24} color="#ffffff" />
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
              Built for Production — Zero Mock Data
            </h2>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto 2rem' }}>
              Unlike generic student demos that rely on hardcoded JSON mocks, Capstonex is wired directly to production infrastructure:
            </p>

            <div className="grid-3" style={{ gap: '1rem', textAlign: 'left', marginBottom: '2rem' }}>
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Frontend
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                  React 19 + TypeScript + Vite with custom dark glassmorphic tokens.
                </div>
              </div>

              <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Backend API
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                  Node.js 24 + Express + TypeScript with BCrypt & JWT authentication.
                </div>
              </div>

              <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Cloud AI & DB
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                  Groq Cloud inference engine + MongoDB Atlas cloud cluster.
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg"
              onClick={user ? onEnterStudio : onOpenAuth}
            >
              <span>Launch Capstone Studio</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 1rem 2rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(4, 7, 16, 0.95)', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 0.5rem' }}>
            Capstonex.AI — AI-Powered Project Idea Generator & Mentor for Final-Year Students
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            Powered by Groq Cloud SDK & MongoDB Atlas • Production-Grade Engineering
          </p>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .landing-nav-links {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
