import React from 'react';
import { Brain, Lock, Send } from 'lucide-react';
import { BamiSettings } from '../types';

interface HeaderProps {
  settings: BamiSettings;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  isAdminLoggedIn,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/90 border-b border-cyan-500/20 transition-all">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-8">
        
        {/* Zone 1: Brand Wordmark & Neural Brain Emblem */}
        <a href="#" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-indigo-500 p-0.5 shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/50 transition-shadow">
            <div className="w-full h-full bg-slate-950 rounded-[10px] sm:rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 font-mono tracking-tight">
                Bami AI
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-300 font-sans hidden min-[400px]:inline">
                هوش مصنوعی بامی
              </span>
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a
            href="#equity-overview"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            سهام و شاخص‌ها
          </a>
          <a
            href="#calculator"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            ماشین حساب سهام
          </a>
          <a
            href="#roadmap"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            نقشه راه ۱۰ فاز
          </a>
          <a
            href="#shareholders"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            سهامداران بامی
          </a>
          <a
            href="#about-bami"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            شبکه عصبی و فناوری
          </a>
          <a
            href="#faq"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            پرسش‌های متداول
          </a>
        </nav>

        {/* Zone 3: Primary Action & Admin Quick-Access */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {isAdminLoggedIn && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-semibold text-cyan-300 bg-cyan-950/70 border border-cyan-500/30 rounded-xl hover:bg-cyan-900/60 transition-colors whitespace-nowrap"
              title="ورود به پنل مدیریت"
            >
              <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">پنل مدیریت</span>
              <span className="sm:hidden">مدیریت</span>
            </button>
          )}

          <a
            href={`https://t.me/${settings.contactTelegram.replace('@', '')}`}
            target="_blank"
            rel="noreferrer"
            className="relative group inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 active:scale-95 whitespace-nowrap shrink-0"
          >
            <span>ارتباط با مدیریت</span>
            <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </header>
  );
};
