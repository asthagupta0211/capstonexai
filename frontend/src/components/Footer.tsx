import React from 'react';
import { ShieldCheck, Cpu, Database, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(7, 9, 19, 0.95)',
        padding: '2.5rem 0 1.5rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
              Capstonex AI — Intelligent Capstone Architect
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: '560px' }}>
              Built for final-year engineering students to bridge the gap between academic interests and practical,
              differentiated, high-scoring graduation capstone projects.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Cpu size={15} color="var(--primary)" />
              <span>Groq LLM Engine</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Database size={15} color="var(--cyan)" />
              <span>MongoDB Atlas Relational Store</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={15} color="var(--success)" />
              <span>Anti-Hallucination Fallback</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Award size={15} color="var(--warning)" />
              <span>Competition Ready</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <p>© {new Date().getFullYear()} Capstonex AI. Production Prototype for Final-Year Evaluation.</p>
          <p style={{ fontFamily: 'var(--font-mono)' }}>Strict Zod Schema Validation • Modular Monolith Architecture</p>
        </div>
      </div>
    </footer>
  );
};
