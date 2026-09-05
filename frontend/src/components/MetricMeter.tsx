import React from 'react';

interface MetricMeterProps {
  label: string;
  score: number; // 1-100
  color?: 'indigo' | 'purple' | 'cyan' | 'emerald' | 'amber';
  size?: 'sm' | 'md';
}

export const MetricMeter: React.FC<MetricMeterProps> = ({
  label,
  score,
  color = 'indigo',
  size = 'md',
}) => {
  const getColorGradient = () => {
    switch (color) {
      case 'emerald':
        return 'linear-gradient(90deg, #10b981, #34d399)';
      case 'purple':
        return 'linear-gradient(90deg, #8b5cf6, #a78bfa)';
      case 'cyan':
        return 'linear-gradient(90deg, #06b6d4, #38bdf8)';
      case 'amber':
        return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
      case 'indigo':
      default:
        return 'linear-gradient(90deg, #6366f1, #818cf8)';
    }
  };

  const getScoreColor = () => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#60a5fa';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize: size === 'sm' ? '0.75rem' : '0.8125rem',
            color: 'var(--text-secondary)',
            fontWeight: 500,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: size === 'sm' ? '0.75rem' : '0.875rem',
            fontWeight: 700,
            color: getScoreColor(),
          }}
        >
          {score}%
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: size === 'sm' ? '5px' : '7px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.min(Math.max(score, 0), 100)}%`,
            background: getColorGradient(),
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: `0 0 10px ${color === 'emerald' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
          }}
        />
      </div>
    </div>
  );
};
