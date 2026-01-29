/**
 * 3D UI Components - Skipline Go
 * Modern glassmorphism and 3D effects
 */

import React from 'react';

// ==================== 3D CARD ====================
interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'solid' | 'gradient' | 'neon';
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({ 
  children, 
  className = '', 
  variant = 'glass',
  hover = true,
  glow = false,
  onClick 
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300 transform-gpu';
  
  const variantStyles = {
    glass: 'glass-card bg-white/10 backdrop-blur-xl border border-white/20',
    solid: 'bg-slate-800 border border-slate-700',
    gradient: 'bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-purple-500/30',
    neon: 'bg-slate-900/80 border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
  };
  
  const hoverStyles = hover ? 'hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl cursor-pointer' : '';
  const glowStyles = glow ? 'card-glow' : '';
  
  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${glowStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// ==================== GLASS BUTTON ====================
interface Button3DProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export const Button3D: React.FC<Button3DProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick
}) => {
  const baseStyles = 'relative overflow-hidden font-bold rounded-xl transition-all duration-300 transform-gpu btn-shine btn-ripple flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/30',
    secondary: 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/30',
    danger: 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 shadow-lg shadow-red-500/30',
    glass: 'glass-button bg-white/10 text-white border border-white/30 hover:bg-white/20'
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const widthStyles = fullWidth ? 'w-full' : '';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]';
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : children}
    </button>
  );
};

// ==================== FLOATING PARTICLES ====================
export const FloatingParticles: React.FC<{ count?: number }> = ({ count = 20 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 20,
    duration: 15 + Math.random() * 10,
    size: 4 + Math.random() * 8
  }));
  
  return (
    <div className="particles">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`
          }}
        />
      ))}
    </div>
  );
};

// ==================== MORPHING BLOB ====================
interface MorphBlobProps {
  className?: string;
  color?: string;
  size?: number;
}

export const MorphBlob: React.FC<MorphBlobProps> = ({ 
  className = '', 
  color = 'from-purple-500 to-blue-500',
  size = 300 
}) => {
  return (
    <div 
      className={`morph-blob bg-gradient-to-br ${color} opacity-30 blur-3xl ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

// ==================== STAT CARD ====================
interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'red';
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  trend = 'neutral',
  color = 'blue'
}) => {
  const colorStyles = {
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    green: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
    amber: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    red: 'from-red-500/20 to-rose-500/20 border-red-500/30'
  };
  
  const iconColorStyles = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/20 text-amber-400',
    purple: 'bg-purple-500/20 text-purple-400',
    red: 'bg-red-500/20 text-red-400'
  };
  
  const valueColorStyles = {
    blue: 'text-blue-400',
    green: 'text-emerald-400',
    amber: 'text-amber-400',
    purple: 'text-purple-400',
    red: 'text-red-400'
  };
  
  return (
    <Card3D variant="glass" className={`p-4 bg-gradient-to-br ${colorStyles[color]} border`}>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl ${iconColorStyles[color]} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className={`text-2xl font-black ${valueColorStyles[color]}`}>{value}</p>
          <p className="text-slate-400 text-sm">{label}</p>
        </div>
      </div>
    </Card3D>
  );
};

// ==================== ANIMATED BADGE ====================
interface AnimatedBadgeProps {
  children: React.ReactNode;
  color?: 'green' | 'amber' | 'red' | 'blue' | 'purple';
  pulse?: boolean;
}

export const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  children,
  color = 'green',
  pulse = false
}) => {
  const colorStyles = {
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${colorStyles[color]} ${pulse ? 'animate-pulse' : ''}`}>
      {pulse && (
        <span className={`w-2 h-2 rounded-full ${color === 'green' ? 'bg-emerald-400' : color === 'amber' ? 'bg-amber-400' : color === 'red' ? 'bg-red-400' : color === 'blue' ? 'bg-blue-400' : 'bg-purple-400'}`} />
      )}
      {children}
    </span>
  );
};

// ==================== SKELETON LOADER ====================
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height
}) => {
  const baseStyles = 'bg-slate-700/50 animate-pulse';
  
  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };
  
  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};

// ==================== ANIMATED ICON WRAPPER ====================
interface AnimatedIconProps {
  children: React.ReactNode;
  animation?: 'bounce' | 'pulse' | 'spin' | 'ping';
  className?: string;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  children,
  animation = 'pulse',
  className = ''
}) => {
  const animationStyles = {
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    ping: 'animate-ping'
  };
  
  return (
    <div className={`${animationStyles[animation]} ${className}`}>
      {children}
    </div>
  );
};

// ==================== GRADIENT TEXT ====================
interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
  gradient = 'from-purple-400 via-pink-500 to-red-500'
}) => {
  return (
    <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
};

// ==================== NOTIFICATION TOAST ====================
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  show: boolean;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  show,
  onClose
}) => {
  if (!show) return null;
  
  const typeStyles = {
    success: 'bg-emerald-500/90 border-emerald-400',
    error: 'bg-red-500/90 border-red-400',
    info: 'bg-blue-500/90 border-blue-400',
    warning: 'bg-amber-500/90 border-amber-400'
  };
  
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };
  
  return (
    <div className={`fixed top-4 right-4 z-50 animate-slide-left`}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl text-white shadow-2xl ${typeStyles[type]}`}>
        <span className="text-lg">{icons[type]}</span>
        <span className="font-medium">{message}</span>
        {onClose && (
          <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">✕</button>
        )}
      </div>
    </div>
  );
};

// ==================== PROGRESS RING ====================
interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  children?: React.ReactNode;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 100,
  strokeWidth = 8,
  color = '#8b5cf6',
  bgColor = 'rgba(255,255,255,0.1)',
  children
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default {
  Card3D,
  Button3D,
  FloatingParticles,
  MorphBlob,
  StatCard,
  AnimatedBadge,
  Skeleton,
  AnimatedIcon,
  GradientText,
  Toast,
  ProgressRing
};
