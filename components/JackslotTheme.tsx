import React, { useState, useEffect } from 'react';
import { FLOWER_THEMES } from '../constants';
import { Theme } from '../types';
import { Sparkles, RefreshCw } from 'lucide-react';

interface JackslotProps {
  currentTheme: Theme;
  onThemeSelect: (theme: Theme) => void;
  isDark: boolean;
}

const JackslotTheme: React.FC<JackslotProps> = ({ currentTheme, onThemeSelect, isDark }) => {
  const [spinning, setSpinning] = useState(false);
  const [displayedTheme, setDisplayedTheme] = useState(currentTheme);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    
    let counter = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * FLOWER_THEMES.length);
      setDisplayedTheme(FLOWER_THEMES[randomIndex]);
      counter++;
      
      if (counter >= maxSpins) {
        clearInterval(interval);
        const finalIndex = Math.floor(Math.random() * FLOWER_THEMES.length);
        const finalTheme = FLOWER_THEMES[finalIndex];
        setDisplayedTheme(finalTheme);
        onThemeSelect(finalTheme);
        setSpinning(false);
      }
    }, 100);
  };

  return (
    <div className={`
      relative p-4 rounded-xl border border-white/10 shadow-xl overflow-hidden
      bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md
      flex flex-col items-center justify-center gap-3
      transition-all duration-300
    `}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50"></div>
      
      <h3 className="text-sm font-semibold uppercase tracking-widest opacity-70">Style Jackslot</h3>
      
      <div className="relative w-full h-24 bg-black/20 rounded-lg flex items-center justify-center overflow-hidden border border-white/5">
        <div className={`transition-all duration-100 transform ${spinning ? 'blur-sm scale-110' : 'scale-100'}`}>
          <span 
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
            style={{ textShadow: spinning ? '0 0 10px var(--color-primary)' : 'none' }}
          >
            {displayedTheme.name}
          </span>
        </div>
        
        {/* Decorative lines */}
        <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/20 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning}
        className={`
          w-full py-2 px-4 rounded-lg font-bold text-white shadow-lg
          flex items-center justify-center gap-2
          transition-all duration-300 active:scale-95
          ${spinning 
            ? 'bg-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:brightness-110 hover:shadow-[var(--color-primary)]/50'
          }
        `}
      >
        {spinning ? (
          <RefreshCw className="w-5 h-5 animate-spin" />
        ) : (
          <Sparkles className="w-5 h-5" />
        )}
        {spinning ? "Spinning..." : "SPIN STYLE"}
      </button>
    </div>
  );
};

export default JackslotTheme;