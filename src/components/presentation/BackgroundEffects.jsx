import React from 'react';

/**
 * BackgroundEffects Component
 * 
 * Renders the dark futuristic neon background with ambient glowing orbs,
 * scanlines, and subtle cybernetic grid overlay.
 */
export function BackgroundEffects() {
  return (
    <div className="futuristic-background" aria-hidden="true">
      <div className="futuristic-grid"></div>
      <div className="scanline-overlay"></div>
      <div className="glow-orb glow-cyan"></div>
      <div className="glow-orb glow-magenta"></div>
      <div className="glow-orb glow-violet"></div>
    </div>
  );
}

export default BackgroundEffects;
