import React, { useRef, useState } from 'react';
import { Cpu, Send, Mail, Phone, Globe, Shield, Lock } from 'lucide-react';
import { BamiSettings } from '../types';

interface FooterProps {
  settings: BamiSettings;
  onOpenLogin: () => void;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenLogin,
  isAdminLoggedIn,
  onOpenAdmin,
}) => {
  const [clickCount, setClickCount] = useState<number>(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Secret trigger: 4 consecutive clicks on the word "Bami"
   * Completely indistinguishable from normal static text
   */
  const handleBamiClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    const nextCount = clickCount + 1;

    if (nextCount >= 4) {
      setClickCount(0);
      if (isAdminLoggedIn) {
        onOpenAdmin();
      } else {
        onOpenLogin();
      }
    } else {
      setClickCount(nextCount);
      // Reset after 3 seconds of inactivity
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 3000);
    }
  };

  return (
    <footer className="border-t border-slate-900 bg-slate-950 pt-16 pb-12 relative overflow-hidden">
      
      {/* Background ambient light */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-900">
          
          {/* Col 1: Brand Wordmark */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-xl font-bold text-white font-mono">Bami AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {settings.footerBio}
            </p>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 font-mono">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{settings.targetDomain}</span>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">بخش‌های صفحه</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#equity-overview" className="hover:text-cyan-400 transition-colors">
                  ارزش‌گذاری و آمار سهام
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-cyan-400 transition-colors">
                  ماشین حساب سرمایه‌گذاری
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-cyan-400 transition-colors">
                  نقشه راه ۱۰ فاز بامی AI
                </a>
              </li>
              <li>
                <a href="#shareholders" className="hover:text-cyan-400 transition-colors">
                  ترکیب سهامداران و درصدها
                </a>
              </li>
              <li>
                <a href="#about-bami" className="hover:text-cyan-400 transition-colors">
                  معرفی محصول و فناوری
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-cyan-400 transition-colors">
                  سوالات متداول سرمایه‌گذاران
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Investor Channels */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">ارتباط با مدیریت سرمایه‌گذاری</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <a
                href={`https://t.me/${settings.contactTelegram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-mono">{settings.contactTelegram}</span>
              </a>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="font-mono">{settings.contactEmail}</span>
              </a>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="font-mono">{settings.contactPhone}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Trust & Transparency */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">{settings.footerTrustTitle}</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              {settings.footerTrustDesc}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>پایگاه داده امن و اعتبارسنجی شده</span>
            </div>
          </div>

        </div>

        {/* Bottom Legal Notice with Secret 4-Clicks Trigger */}
        <div className="pt-8 flex flex-col items-center justify-center text-center">
          
          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md backdrop-blur-md max-w-xl mx-auto flex flex-wrap items-center justify-center gap-1.5 select-none px-4">
            <span className="text-xs sm:text-sm text-slate-300 font-medium">
              تمامی حقوق مادی و معنوی
            </span>
            
            {/* The hidden clickable "Bami" secret trigger - completely blends in as normal text */}
            <span
              onClick={handleBamiClick}
              className="font-mono font-bold text-cyan-400 cursor-default"
            >
              Bami
            </span>

            <span className="text-xs sm:text-sm text-slate-300 font-medium">
              محفوظ است.
            </span>
          </div>

          <div className="text-[11px] text-slate-500 mt-3 font-mono">
            {settings.targetDomain} · Version 1.0.0 · Production Ready
          </div>

        </div>

      </div>
    </footer>
  );
};
