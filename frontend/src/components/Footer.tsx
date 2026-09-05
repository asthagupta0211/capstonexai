import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(7, 9, 19, 0.95)',
        padding: '1.25rem 0',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} Capstonex AI. All rights reserved.</p>
          <p style={{ margin: 0 }}>Intelligent Capstone Architect</p>
        </div>
      </div>
    </footer>
  );
};
