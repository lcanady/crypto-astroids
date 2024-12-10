import React from 'react';

// Base container SVG
const containerSVG = `
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 0L35.3553 4.64466L40 20L35.3553 35.3553L20 40L4.64466 35.3553L0 20L4.64466 4.64466L20 0Z" stroke="#00ff00" stroke-width="1" fill="none"/>
  <path d="M20 8L32 20L20 32L8 20L20 8Z" stroke="#00ff00" stroke-width="1" fill="none"/>
  <path d="M20 0L20 8M40 20L32 20M20 40L20 32M0 20L8 20" stroke="#00ff00" stroke-width="1"/>
  <path d="M20 12L28 20L20 28L12 20L20 12Z" stroke="#00ff00" stroke-width="1" fill="none"/>
</svg>
`;

// Multi-shot powerup SVG (three arrows)
const multiShotSVG = `
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 15L20 10L25 15M10 20L20 10L30 20M15 25L20 30L25 25" stroke="#00ff00" stroke-width="1" fill="none"/>
</svg>
`;

// Power shot powerup SVG (lightning bolt)
const powerShotSVG = `
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 10L12 20H20L16 30L28 20H20L24 10Z" stroke="#ff0000" stroke-width="1" fill="none"/>
</svg>
`;

// Rapid fire powerup SVG (clock with arrow)
const rapidFireSVG = `
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="20" r="10" stroke="#ffff00" stroke-width="1" fill="none"/>
  <path d="M20 14L20 20L26 20" stroke="#ffff00" stroke-width="1"/>
  <path d="M28 12L32 16L28 20" stroke="#ffff00" stroke-width="1" fill="none"/>
</svg>
`;

// Shield powerup SVG (shield shape)
const shieldSVG = `
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 10L28 14V22C28 26 20 30 20 30C20 30 12 26 12 22V14L20 10Z" stroke="#00ffff" stroke-width="1" fill="none"/>
  <path d="M16 20L19 23L24 17" stroke="#00ffff" stroke-width="1" fill="none"/>
</svg>
`;

export const PowerupSVGs = {
  MULTI_SHOT: multiShotSVG,
  POWER_SHOT: powerShotSVG,
  RAPID_FIRE: rapidFireSVG,
  SHIELD: shieldSVG,
  container: containerSVG
};

export const PowerupContainer = () => {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer octagon */}
      <path
        d="M20 0L35.3553 4.64466L40 20L35.3553 35.3553L20 40L4.64466 35.3553L0 20L4.64466 4.64466L20 0Z"
        stroke="#00ff00"
        strokeWidth="1"
        fill="none"
      />
      
      {/* Inner rotating square */}
      <path
        d="M20 8L32 20L20 32L8 20L20 8Z"
        stroke="#00ff00"
        strokeWidth="1"
        fill="none"
      />
      
      {/* Connecting lines */}
      <path
        d="M20 0L20 8M40 20L32 20M20 40L20 32M0 20L8 20"
        stroke="#00ff00"
        strokeWidth="1"
      />
      
      {/* Inner cross */}
      <path
        d="M20 12L28 20L20 28L12 20L20 12Z"
        stroke="#00ff00"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
};
