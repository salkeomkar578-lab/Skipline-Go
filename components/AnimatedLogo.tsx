/**
 * Animated Logo Component - Skipline Go
 * Clean, professional logo with shopping cart + speed concept
 */

import React from 'react';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animate?: boolean;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  size = 'lg', 
  showText = true,
  animate = true 
}) => {
  const sizeMap = {
    sm: { container: 64, text: 'text-xl' },
    md: { container: 80, text: 'text-2xl' },
    lg: { container: 96, text: 'text-3xl' },
    xl: { container: 120, text: 'text-4xl' }
  };

  const { container, text } = sizeMap[size];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Logo Container */}
      <div 
        className="relative"
        style={{ width: container, height: container }}
      >
        {/* Animated glow ring */}
        {animate && (
          <div 
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 opacity-60 blur-xl"
            style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
          />
        )}
        
        {/* Main SVG Logo */}
        <svg 
          width={container} 
          height={container} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* Background rounded square */}
          <rect 
            x="5" y="5" 
            width="90" height="90" 
            rx="24" 
            fill="url(#bgGradient)"
          />
          
          {/* Inner shine */}
          <rect 
            x="8" y="8" 
            width="84" height="40" 
            rx="20" 
            fill="white" 
            fillOpacity="0.15"
          />
          
          {/* Shopping Cart Icon */}
          <g style={animate ? { animation: 'cart-bounce 2s ease-in-out infinite' } : {}}>
            {/* Cart body */}
            <path 
              d="M28 35L32 32H72L66 52H38L28 35Z" 
              fill="white"
              fillOpacity="0.95"
            />
            {/* Cart handle */}
            <path 
              d="M24 32H32" 
              stroke="white" 
              strokeWidth="4" 
              strokeLinecap="round"
            />
            {/* Cart basket lines */}
            <path 
              d="M40 40H62M42 46H60" 
              stroke="url(#bgGradient)" 
              strokeWidth="2.5" 
              strokeLinecap="round"
              strokeOpacity="0.6"
            />
            {/* Cart wheels */}
            <circle cx="42" cy="60" r="5" fill="white" />
            <circle cx="62" cy="60" r="5" fill="white" />
            <circle cx="42" cy="60" r="2" fill="url(#bgGradient)" />
            <circle cx="62" cy="60" r="2" fill="url(#bgGradient)" />
          </g>
          
          {/* Speed lines - showing motion */}
          <g style={animate ? { animation: 'speed-dash 1s ease-in-out infinite' } : {}} opacity="0.9">
            <path d="M14 38H22" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <path d="M10 46H20" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <path d="M14 54H22" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </g>
          
          {/* Forward arrow indicator */}
          <g style={animate ? { animation: 'arrow-pulse 1.5s ease-in-out infinite' } : {}}>
            <path 
              d="M76 46L84 46M84 46L80 42M84 46L80 50" 
              stroke="white" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </g>
          
          {/* Gradients */}
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Sparkle dots */}
        {animate && (
          <>
            <div 
              className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
              style={{ animation: 'sparkle 2s ease-in-out infinite' }}
            />
            <div 
              className="absolute -bottom-1 right-4 w-2 h-2 bg-orange-400 rounded-full"
              style={{ animation: 'sparkle 2s ease-in-out infinite 0.5s' }}
            />
          </>
        )}
      </div>

      {/* Text Logo */}
      {showText && (
        <div className="text-center">
          <h1 
            className={`${text} font-black`}
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 50%, #DC2626 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Skipline Go
          </h1>
          <p className="text-amber-600 font-bold text-sm mt-1 tracking-wider">
            "Just Skip the Line and Go!"
          </p>
        </div>
      )}

      {/* CSS Keyframes */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        
        @keyframes cart-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        
        @keyframes speed-dash {
          0%, 100% { opacity: 0.9; transform: translateX(0); }
          50% { opacity: 0.5; transform: translateX(-3px); }
        }
        
        @keyframes arrow-pulse {
          0%, 100% { opacity: 1; transform: translateX(0); }
          50% { opacity: 0.7; transform: translateX(2px); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedLogo;
