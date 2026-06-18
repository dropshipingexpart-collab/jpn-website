import React from 'react';

interface JpnLogoProps {
  className?: string;
  height?: number | string;
}

export const JpnLogo: React.FC<JpnLogoProps> = ({ 
  className = "h-10 md:h-12 w-auto", 
  height 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 310 95" 
      className={className}
      style={height ? { height } : undefined}
    >
      {/* Dynamic Background Speed-lines (Orange) */}
      <g fill="#F97316">
        {/* Top small speed bar */}
        <rect x="18" y="36" width="95" height="4.5" rx="2.25" />
        {/* Second bar */}
        <rect x="36" y="45.5" width="80" height="4.5" rx="2.25" />
        {/* Third longer trail passing behind circle */}
        <rect x="10" y="55" width="105" height="4.5" rx="2.25" />
        {/* Bottom thickest foundation bar */}
        <rect x="25" y="64.5" width="125" height="6" rx="3" />
      </g>
      
      {/* Vibrant Pink Sun Overlay */}
      <circle cx="102" cy="50" r="25" fill="#FF1493" className="drop-shadow-sm" />
      
      {/* Thick Modern Bold JPN Brandmark */}
      <text 
        x="142" 
        y="72" 
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" 
        fontWeight="900" 
        fontSize="67" 
        fill="#7C3AED" 
        letterSpacing="-2px"
      >
        JPN
      </text>
      
      {/* Registered / Trademark Icon in top right */}
      <text 
        x="280" 
        y="28" 
        fontFamily="system-ui, -apple-system, sans-serif" 
        fontWeight="bold" 
        fontSize="11" 
        fill="#9CA3AF"
      >
        ™
      </text>
    </svg>
  );
};
