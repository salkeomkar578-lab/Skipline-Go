/**
 * AnimatedLogo3D - Skipline Go
 * Ultra Premium 3D Holographic Logo with advanced animations
 */

import React from 'react';
import { ShoppingCart } from 'lucide-react';

export const AnimatedLogo3D: React.FC = () => {
  return (
    <div className="hologram-container">
      {/* Holographic base ring */}
      <div className="holo-base-ring">
        <div className="holo-ring-segment" />
        <div className="holo-ring-segment" />
        <div className="holo-ring-segment" />
      </div>
      
      {/* Energy field layers */}
      <div className="energy-field">
        <div className="energy-wave wave-1" />
        <div className="energy-wave wave-2" />
        <div className="energy-wave wave-3" />
      </div>
      
      {/* DNA-style helix orbits */}
      <div className="dna-orbit">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`dna-particle dna-p-${i + 1}`} />
        ))}
      </div>
      
      {/* Main logo core */}
      <div className="logo-core">
        {/* Pulsing core background */}
        <div className="core-pulse" />
        <div className="core-pulse core-pulse-2" />
        
        {/* Glass morphism card */}
        <div className="logo-glass-card">
          {/* Gradient border animation */}
          <div className="border-gradient" />
          
          {/* Inner content */}
          <div className="logo-inner">
            <ShoppingCart className="w-14 h-14 text-white drop-shadow-2xl" strokeWidth={2} />
          </div>
          
          {/* Shine sweep */}
          <div className="shine-sweep" />
        </div>
      </div>
      
      {/* Floating icons orbit */}
      <div className="icon-orbit">
        <span className="orbit-icon icon-1">💳</span>
        <span className="orbit-icon icon-2">📱</span>
        <span className="orbit-icon icon-3">✨</span>
        <span className="orbit-icon icon-4">🛍️</span>
      </div>
      
      {/* Scan line effect */}
      <div className="scan-line" />
      
      {/* Corner accents */}
      <div className="corner-accent corner-tl" />
      <div className="corner-accent corner-tr" />
      <div className="corner-accent corner-bl" />
      <div className="corner-accent corner-br" />
    </div>
  );
};

export default AnimatedLogo3D;
