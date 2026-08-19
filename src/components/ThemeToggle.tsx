import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'icon' | 'pill' | 'expanded';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'icon', className = '' }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none ${
          isDark
            ? 'bg-[#0D2B1D] text-[#D4AF37] border border-white/10 hover:border-[#D4AF37]/50 shadow-md'
            : 'bg-white text-[#164E33] border border-[#164E33]/20 hover:border-[#164E33]/40 shadow-sm'
        } ${className}`}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        aria-label={`Toggle to ${isDark ? 'Light' : 'Dark'} Mode`}
      >
        {isDark ? (
          <>
            <Moon className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] font-mono uppercase tracking-wider">Dark</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#164E33]">Light</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'expanded') {
    return (
      <button
        onClick={toggleTheme}
        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          isDark
            ? 'bg-white/5 text-[#FDFBF5] hover:bg-white/10 border border-white/10'
            : 'bg-[#EBF3ED] text-[#0F2419] hover:bg-[#DEEBE1] border border-[#CDE0D2]'
        } ${className}`}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      >
        <div className="flex items-center gap-2.5">
          {isDark ? (
            <div className="p-1.5 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37]">
              <Moon className="w-4 h-4" />
            </div>
          ) : (
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600">
              <Sun className="w-4 h-4" />
            </div>
          )}
          <span>Theme Mode</span>
        </div>
        <span
          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
            isDark ? 'bg-black/40 text-[#D4AF37]' : 'bg-white text-[#164E33] border border-[#164E33]/20'
          }`}
        >
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      </button>
    );
  }

  // Default: Icon-only button with smooth rotation
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center relative overflow-hidden group ${
        isDark
          ? 'bg-white/5 hover:bg-white/10 text-[#D4AF37] border border-white/10 hover:border-[#D4AF37]/40 shadow-sm'
          : 'bg-[#F0F5F1] hover:bg-[#E2ECE4] text-amber-600 border border-[#D5E3D8] hover:border-amber-500/40 shadow-sm'
      } ${className}`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
        {isDark ? (
          <Moon className="w-4 h-4 text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
        ) : (
          <Sun className="w-4 h-4 text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.3)]" />
        )}
      </div>
    </button>
  );
};
