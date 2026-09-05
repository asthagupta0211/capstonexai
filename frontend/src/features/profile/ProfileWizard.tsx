import React, { useState, useEffect } from 'react';
import { UserCheck, Clock, Layers, Sliders, CheckCircle2, Plus, X, Sparkles, Zap, RotateCcw } from 'lucide-react';
import { StudentProfile } from '../../types/index.js';

interface ProfileWizardProps {
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
  onGenerateIdeas: (profile: StudentProfile) => void;
  isGenerating: boolean;
}

const COMMON_SKILLS = [
  'Python', 'React', 'TypeScript', 'FastAPI', 'PyTorch', 'Node.js',
  'Docker', 'MongoDB', 'PostgreSQL', 'Computer Vision', 'NLP', 'Flutter'
];

const COMMON_INTERESTS = [
  'Healthcare AI', 'Explainable AI (XAI)', 'Cybersecurity & SAST',
  'Smart Campus IoT', 'FinTech & Fraud Detection', 'Edge Computing', 'CleanTech'
];

const COMMON_CONSTRAINTS = [
  'No cloud hosting budget ($0)', 'Must run locally on laptop', 'Public datasets only', 'Strict open-source stack'
];

const DEMO_PERSONAS = [
  {
    name: 'AI & Vision',
    icon: '🤖',
    skills: ['Python', 'PyTorch', 'FastAPI', 'OpenCV', 'Docker'],
    interests: ['Healthcare AI', 'Explainable AI (XAI)'],
    preferredDomain: 'Artificial Intelligence & Machine Learning',
    difficultyLevel: 'Intermediate' as const,
    availableWeeks: 12,
  },
  {
    name: 'Cybersecurity',
    icon: '🛡️',
    skills: ['Python', 'Docker', 'Linux', 'Node.js', 'FastAPI'],
    interests: ['Cybersecurity & SAST'],
    preferredDomain: 'Cybersecurity & Software Assurance',
    difficultyLevel: 'Advanced' as const,
    availableWeeks: 14,
  },
  {
    name: 'HealthTech',
    icon: '🏥',
    skills: ['React', 'Python', 'FastAPI', 'MongoDB', 'Computer Vision'],
    interests: ['Healthcare AI'],
    preferredDomain: 'Healthcare Informatics & Bio-AI',
    difficultyLevel: 'Intermediate' as const,
    availableWeeks: 12,
  },
  {
    name: 'Cloud & Full-Stack',
    icon: '⚡',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    interests: ['Edge Computing'],
    preferredDomain: 'Cloud, DevOps & Distributed Systems',
    difficultyLevel: 'Intermediate' as const,
    availableWeeks: 10,
  },
];

export const ProfileWizard: React.FC<ProfileWizardProps> = ({
  profile,
  onSaveProfile,
  onGenerateIdeas,
  isGenerating,
}) => {
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    'Synthesizing capstone concepts with Groq AI...',
    'Evaluating feasibility & committee grading criteria...',
    'Drafting 3-tier MVP scope & architecture stack...',
    'Validating JSON schema & persisting to MongoDB Atlas...',
  ];

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleApplyPersona = (p: typeof DEMO_PERSONAS[0]) => {
    const updated: StudentProfile = {
      ...formData,
      skills: [...p.skills],
      interests: [...p.interests],
      preferredDomain: p.preferredDomain,
      difficultyLevel: p.difficultyLevel,
      availableWeeks: p.availableWeeks,
    };
    setFormData(updated);
    onSaveProfile(updated);
  };

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      const updated = { ...formData, skills: [...formData.skills, trimmed] };
      setFormData(updated);
      onSaveProfile(updated);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    const updated = { ...formData, skills: formData.skills.filter((s) => s !== skill) };
    setFormData(updated);
    onSaveProfile(updated);
  };

  const handleAddInterest = (interest: string) => {
    const trimmed = interest.trim();
    if (trimmed && !formData.interests.includes(trimmed)) {
      const updated = { ...formData, interests: [...formData.interests, trimmed] };
      setFormData(updated);
      onSaveProfile(updated);
    }
    setInterestInput('');
  };

  const handleRemoveInterest = (interest: string) => {
    const updated = { ...formData, interests: formData.interests.filter((i) => i !== interest) };
    setFormData(updated);
    onSaveProfile(updated);
  };

  const toggleConstraint = (constraint: string) => {
    const exists = formData.projectConstraints.includes(constraint);
    const updatedConstraints = exists
      ? formData.projectConstraints.filter((c) => c !== constraint)
      : [...formData.projectConstraints, constraint];
    const updated = { ...formData, projectConstraints: updatedConstraints };
    setFormData(updated);
    onSaveProfile(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.skills.length === 0) {
      alert('Please add at least one technical skill.');
      return;
    }
    onGenerateIdeas(formData);
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', borderTop: '3px solid var(--primary)' }}>
      {/* Header & 1-Click Persona Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <UserCheck size={22} color="var(--primary)" />
            <span>Student Profile & Project Constraints</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Tailor high-scoring capstone proposals aligned with your actual coding skills, semester timeline, and hardware constraints.
          </p>
        </div>

        {/* 1-Click Hackathon Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Zap size={13} color="var(--warning)" />
            <span>1-Click Presets:</span>
          </span>
          {DEMO_PERSONAS.map((p) => (
            <button
              key={p.name}
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleApplyPersona(p)}
              style={{ fontSize: '0.725rem', padding: '0.3rem 0.6rem' }}
              title={`Load ${p.name} preset`}
            >
              <span>{p.icon}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Skills Collection */}
          <div>
            <label htmlFor="profile-skill-input" className="form-label">
              <span>Your Current Technical Skills *</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({formData.skills.length} selected)</span>
            </label>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                id="profile-skill-input"
                name="skillInput"
                type="text"
                className="form-input"
                placeholder="Type skill & press Enter (e.g. Python, Docker)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(skillInput);
                  }
                }}
                aria-label="Type technical skill"
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleAddSkill(skillInput)}
                aria-label="Add technical skill"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Selected Skills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', minHeight: '34px', marginBottom: '0.75rem' }}>
              {formData.skills.map((skill) => (
                <span key={skill} className="tag-pill tag-pill-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  {skill}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleRemoveSkill(skill)} aria-label={`Remove skill ${skill}`} />
                </span>
              ))}
              {formData.skills.length === 0 && (
                <span style={{ fontSize: '0.8rem', color: 'var(--danger)', fontStyle: 'italic' }}>
                  No skills added yet. Select from suggestions below:
                </span>
              )}
            </div>

            {/* Suggestions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {COMMON_SKILLS.filter((s) => !formData.skills.includes(s)).map((skill) => (
                <button
                  type="button"
                  key={skill}
                  className="tag-pill tag-pill-clickable"
                  onClick={() => handleAddSkill(skill)}
                  aria-label={`Add suggested skill ${skill}`}
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Interests Collection */}
          <div>
            <label htmlFor="profile-interest-input" className="form-label">
              <span>Domain Interests & Research Areas</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({formData.interests.length} selected)</span>
            </label>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                id="profile-interest-input"
                name="interestInput"
                type="text"
                className="form-input"
                placeholder="Type interest & press Enter (e.g. Healthcare, NLP)"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInterest(interestInput);
                  }
                }}
                aria-label="Type domain interest"
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleAddInterest(interestInput)}
                aria-label="Add domain interest"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Selected Interests */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', minHeight: '34px', marginBottom: '0.75rem' }}>
              {formData.interests.map((interest) => (
                <span key={interest} className="tag-pill" style={{ background: 'rgba(139, 92, 246, 0.25)', borderColor: 'var(--secondary)', color: '#ffffff' }}>
                  {interest}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleRemoveInterest(interest)} />
                </span>
              ))}
            </div>

            {/* Suggestions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {COMMON_INTERESTS.filter((i) => !formData.interests.includes(i)).map((interest) => (
                <button
                  type="button"
                  key={interest}
                  className="tag-pill tag-pill-clickable"
                  onClick={() => handleAddInterest(interest)}
                >
                  + {interest}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Domain, Difficulty, and Timeline Controls */}
        <div className="grid-3" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Domain Dropdown */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="profile-domain-select" className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Layers size={15} color="var(--cyan)" />
                Preferred Domain
              </span>
            </label>
            <select
              id="profile-domain-select"
              name="preferredDomain"
              aria-label="Preferred project domain"
              className="form-select"
              value={formData.preferredDomain}
              onChange={(e) => {
                const updated = { ...formData, preferredDomain: e.target.value };
                setFormData(updated);
                onSaveProfile(updated);
              }}
            >
              <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & ML</option>
              <option value="Healthcare Informatics & Bio-AI">Healthcare Informatics & Bio-AI</option>
              <option value="Cybersecurity & Software Assurance">Cybersecurity & Software Assurance</option>
              <option value="Smart Campus & IoT Systems">Smart Campus & IoT Systems</option>
              <option value="FinTech & Algorithmic Systems">FinTech & Algorithmic Systems</option>
              <option value="Cloud, DevOps & Distributed Systems">Cloud, DevOps & Distributed Systems</option>
            </select>
          </div>

          {/* Difficulty Level */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sliders size={15} color="var(--primary)" />
                Target Difficulty
              </span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.35rem' }}>
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  aria-pressed={formData.difficultyLevel === diff}
                  className={`btn btn-sm ${formData.difficultyLevel === diff ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => {
                    const updated = { ...formData, difficultyLevel: diff };
                    setFormData(updated);
                    onSaveProfile(updated);
                  }}
                  style={{ padding: '0.55rem 0.2rem' }}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Sliders */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="profile-timeline-range" className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={15} color="var(--warning)" />
                Available Timeline
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--warning)' }}>
                {formData.availableWeeks} wks ({formData.hoursPerWeek}h/wk)
              </span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                id="profile-timeline-range"
                name="availableWeeks"
                aria-label="Project duration in weeks"
                type="range"
                className="form-range"
                min="4"
                max="24"
                step="1"
                value={formData.availableWeeks}
                onChange={(e) => {
                  const updated = { ...formData, availableWeeks: Number(e.target.value) };
                  setFormData(updated);
                  onSaveProfile(updated);
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span>4 wks (Mini project)</span>
                <span>12 wks (Semester)</span>
                <span>24 wks (Year-long)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Constraints */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label className="form-label" style={{ marginBottom: '0.5rem' }}>
            <span>Project Constraints & Resource Boundaries</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {COMMON_CONSTRAINTS.map((c) => {
              const active = formData.projectConstraints.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleConstraint(c)}
                  className={`tag-pill ${active ? 'tag-pill-active' : 'tag-pill-clickable'}`}
                  style={{
                    padding: '0.35rem 0.75rem',
                    background: active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    borderColor: active ? 'var(--success)' : 'var(--border-subtle)',
                    color: active ? '#6ee7b7' : '#cbd5e1',
                  }}
                >
                  <CheckCircle2 size={13} style={{ opacity: active ? 1 : 0.4 }} />
                  <span>{c}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button & Live Generation Telemetry */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {isGenerating ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--cyan)', fontSize: '0.85rem', fontWeight: 600 }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'var(--cyan)',
                    boxShadow: '0 0 10px var(--cyan)',
                    animation: 'spin 1.2s linear infinite',
                  }}
                />
                <span>{loadingMessages[loadingStep]}</span>
              </div>
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Powered live by Groq Cloud LLaMA-3.3 • 100% Real JSON Schema Synthesis
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isGenerating || formData.skills.length === 0}
            style={{
              minWidth: '260px',
              boxShadow: isGenerating ? '0 0 25px var(--primary-glow)' : 'var(--shadow-card-hover)',
            }}
          >
            {isGenerating ? (
              <>
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTopColor: '#ffffff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                <span>Synthesizing Proposals...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate Capstone Proposals</span>
              </>
            )}
          </button>
        </div>
      </form>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
