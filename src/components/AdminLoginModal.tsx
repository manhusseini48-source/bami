import React, { useState } from 'react';
import { Lock, User, KeyRound, Eye, EyeOff, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials as specified by user:
      // Username: bamianai777
      // Password: Bai$$$nx
      if (username.trim() === 'bamianai777' && password === 'Bai$$$nx') {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('نام کاربری یا رمز عبور اشتباه است.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl shadow-cyan-950/50">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Lock className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">
            ورود به پنل مدیریت هوش مصنوعی بامی
          </h3>
          <p className="text-xs text-slate-400">
            جهت ویرایش فازها، قیمت سهام و تنظیمات Bami AI وارد شوید
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              نام کاربری مدیر (Username)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              رمز عبور (Password)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <KeyRound className="w-4 h-4" />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                aria-label="تغییر نمایش رمز"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 transition-all text-sm shadow-lg shadow-cyan-500/25 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>در حال اعتبارسنجی...</span>
            ) : (
              <span>ورود به پنل مدیریت</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 font-mono">
            مجوز دسترسی انحصاری مدیریت هوش مصنوعی بامی
          </p>
        </div>

      </div>
    </div>
  );
};
