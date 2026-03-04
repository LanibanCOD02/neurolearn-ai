import React, { useMemo } from 'react';

// Types for the component props
export interface ParallaxStarsBackgroundProps {
  /**
   * Title text to display in the center
   */
  title?: string;
  /**
   * Subtitle or additional content
   */
  children?: React.ReactNode;
  /**
   * Class name for the container
   */
  className?: string;
  /**
   * Speed multiplier for the animation
   * @default 1
   */
  speed?: number;
}

// Helper to generate random box shadows
const generateBoxShadows = (n: number) => {
  let value = `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
  for (let i = 2; i <= n; i++) {
    value += `, ${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
  }
  return value;
};

export function ParallaxStarsBackground({
  title,
  children,
  className = "",
  speed = 1
}: ParallaxStarsBackgroundProps) {
  // Memoize shadows so they don't regenerate on re-renders
  const shadowsSmall = useMemo(() => generateBoxShadows(700), []);
  const shadowsMedium = useMemo(() => generateBoxShadows(200), []);
  const shadowsBig = useMemo(() => generateBoxShadows(100), []);

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-[#090A0F] font-sans">
      {/* Inline styles for the gradient and animations */}
      <style>{`
        .bg-radial-space {
          background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
        }
        @keyframes animStar {
          from { transform: translateY(0px); }
          to { transform: translateY(-2000px); }
        }
        .text-gradient-clip {
          background: linear-gradient(to bottom, white 0%, #38495a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-radial-space z-0" />

      {/* Stars Layer 1 (Small) */}
      <div 
        className="absolute left-0 top-0 w-[1px] h-[1px] bg-transparent z-0 animate-[animStar_50s_linear_infinite]"
        style={{ 
          boxShadow: shadowsSmall,
          animationDuration: `${50 / speed}s`
        }}
      >
        <div 
          className="absolute top-[2000px] w-[1px] h-[1px] bg-transparent"
          style={{ boxShadow: shadowsSmall }}
        />
      </div>

      {/* Stars Layer 2 (Medium) */}
      <div 
        className="absolute left-0 top-0 w-[2px] h-[2px] bg-transparent z-0 animate-[animStar_100s_linear_infinite]"
        style={{ 
          boxShadow: shadowsMedium,
          animationDuration: `${100 / speed}s`
        }}
      >
        <div 
          className="absolute top-[2000px] w-[2px] h-[2px] bg-transparent"
          style={{ boxShadow: shadowsMedium }}
        />
      </div>

      {/* Stars Layer 3 (Big) */}
      <div 
        className="absolute left-0 top-0 w-[3px] h-[3px] bg-transparent z-0 animate-[animStar_150s_linear_infinite]"
        style={{ 
          boxShadow: shadowsBig,
          animationDuration: `${150 / speed}s`
        }}
      >
        <div 
          className="absolute top-[2000px] w-[3px] h-[3px] bg-transparent"
          style={{ boxShadow: shadowsBig }}
        />
      </div>

      {/* Content */}
      <div className={`relative z-10 w-full h-full ${className}`}>
        {title && (
          <div className="absolute top-1/2 left-0 right-0 -mt-[60px] text-center pointer-events-none">
            <h1 className="font-light text-[30px] md:text-[50px] tracking-[10px] text-white leading-tight">
              {title.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  <span className="text-gradient-clip">
                    {line}
                  </span>
                  {i < title.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default ParallaxStarsBackground;
