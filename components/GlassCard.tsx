
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', dark = false }) => {
  return (
    <div className={`${dark ? 'glass-dark text-white' : 'glass text-slate-800'} rounded-3xl p-6 shadow-xl ${className}`}>
      {children}
    </div>
  );
};
