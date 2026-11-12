import React, { useState } from 'react';
import {
  Settings,
  Layers,
  FileText,
  Database,
  Save,
  RotateCcw,
  LogOut,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  DollarSign,
  TrendingUp,
  Cpu,
  RefreshCw,
  Users,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Timer,
  ShieldCheck,
  HelpCircle,
  Brain,
  MessageSquare,
  Award,
  Copy,
  Check
} from 'lucide-react';
import { BamiSettings, BamiPhase, BamiShareholder, PhaseStatus, BamiFaq, BamiPillar } from '../types';
import { formatUSD, formatSharePrice, formatNumber, formatPercent, getRemainingTime } from '../lib/formatters';
import {
  syncValuationWithCompletedPhases,
  syncToSupabase,
  syncFromSupabase,
  getActiveSupabaseCredentials,
  saveActiveSupabaseCredentials
} from '../lib/storage';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BamiSettings;
  phases: BamiPhase[];
  shareholders: BamiShareholder[];
  onSave: (
    updatedSettings: BamiSettings,
    updatedPhases: BamiPhase[],
    updatedShareholders: BamiShareholder[]
  ) => void;
  onReset: () => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  settings: initialSettings,
  phases: initialPhases,
  shareholders: initialShareholders,
  onSave,
  onReset,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'stock' | 'phases' | 'shareholders' | 'content' | 'supabase'>('stock');
  
  // Local editable draft state
  const [settingsDraft, setSettingsDraft] = useState<BamiSettings>(() => {
    const creds = getActiveSupabaseCredentials();
    return {
      ...initialSettings,
      supabaseUrl: initialSettings.supabaseUrl || creds.url,
      supabaseAnonKey: initialSettings.supabaseAnonKey || creds.key,
    };
  });
  const [phasesDraft, setPhasesDraft] = useState<BamiPhase[]>(JSON.parse(JSON.stringify(initialPhases)));
  const [shareholdersDraft, setShareholdersDraft] = useState<BamiShareholder[]>(JSON.parse(JSON.stringify(initialShareholders)));
  
  const [autoSyncValuation, setAutoSyncValuation] = useState<boolean>(true);
  const [autoSyncSoldShares, setAutoSyncSoldShares] = useState<boolean>(true);

  // Status feedback
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [supabaseSyncStatus, setSupabaseSyncStatus] = useState<{ loading: boolean; msg?: string; isError?: boolean } | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // Shareholders edit / new modal state
  const [editingShareholder, setEditingShareholder] = useState<BamiShareholder | null>(null);
  const [isShareholderModalOpen, setIsShareholderModalOpen] = useState<boolean>(false);

  // Content sub-navigation state
  const [contentCategory, setContentCategory] = useState<'hero' | 'calculator' | 'roadmap' | 'shareholders' | 'product' | 'faqs' | 'footer'>('hero');

  if (!isOpen) return null;

  // Handle phase status toggle
  const handlePhaseStatusChange = (phaseId: number, newStatus: PhaseStatus) => {
    const updatedPhases = phasesDraft.map((p) => {
      if (p.id === phaseId) {
        return { ...p, status: newStatus };
      }
      return p;
    });

    setPhasesDraft(updatedPhases);

    if (autoSyncValuation) {
      const syncedSettings = syncValuationWithCompletedPhases(updatedPhases, settingsDraft);
      setSettingsDraft(syncedSettings);
    }
  };

  const handlePhaseFieldChange = (phaseId: number, field: keyof BamiPhase, value: any) => {
    const updatedPhases = phasesDraft.map((p) => {
      if (p.id === phaseId) {
        return { ...p, [field]: value };
      }
      return p;
    });
    setPhasesDraft(updatedPhases);

    if (autoSyncValuation && (field === 'valuation' || field === 'sharePrice')) {
      const syncedSettings = syncValuationWithCompletedPhases(updatedPhases, settingsDraft);
      setSettingsDraft(syncedSettings);
    }
  };

  // Shareholders CRUD
  const handleSaveShareholderModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShareholder) return;

    let updatedList: BamiShareholder[];
    const exists = shareholdersDraft.some(s => s.id === editingShareholder.id);

    if (exists) {
      updatedList = shareholdersDraft.map(s => s.id === editingShareholder.id ? editingShareholder : s);
    } else {
      updatedList = [...shareholdersDraft, editingShareholder];
    }

    setShareholdersDraft(updatedList);
    setIsShareholderModalOpen(false);
    setEditingShareholder(null);

    if (autoSyncSoldShares) {
      const totalSold = updatedList.reduce((acc, s) => acc + s.sharesCount, 0);
      setSettingsDraft(prev => ({ ...prev, soldShares: totalSold }));
    }
  };

  const handleDeleteShareholder = (id: string) => {
    if (!window.confirm('آیا از حذف این سهامدار اطمینان دارید؟')) return;
    const updated = shareholdersDraft.filter(s => s.id !== id);
    setShareholdersDraft(updated);

    if (autoSyncSoldShares) {
      const totalSold = updated.reduce((acc, s) => acc + s.sharesCount, 0);
      setSettingsDraft(prev => ({ ...prev, soldShares: totalSold }));
    }
  };

  const handleOpenNewShareholder = () => {
    const nextNum = shareholdersDraft.length + 1;
    setEditingShareholder({
      id: `sh-${Date.now()}`,
      name: '',
      roleOrType: 'سرمایه‌گذار فرشته',
      sharesCount: 50000,
      purchaseSharePrice: settingsDraft.currentSharePrice || 0.010,
      purchaseDate: '۱۴۰۴/۰۱',
      entryPhase: 'فاز ۱ (پایه)',
      certificateId: `BM-SH-${String(nextNum).padStart(3, '0')}`,
      verified: true,
    });
    setIsShareholderModalOpen(true);
  };

  // FAQs management
  const handleAddFaq = () => {
    const currentFaqs = settingsDraft.faqs ? [...settingsDraft.faqs] : [];
    const newFaq: BamiFaq = {
      q: 'پرسش جدید سرمایه‌گذاران',
      a: 'پاسخ شفاف و رسمی به این پرسش...',
    };
    setSettingsDraft({ ...settingsDraft, faqs: [...currentFaqs, newFaq] });
  };

  const handleFaqChange = (idx: number, field: 'q' | 'a', value: string) => {
    if (!settingsDraft.faqs) return;
    const updated = [...settingsDraft.faqs];
    updated[idx] = { ...updated[idx], [field]: value };
    setSettingsDraft({ ...settingsDraft, faqs: updated });
  };

  const handleDeleteFaq = (idx: number) => {
    if (!settingsDraft.faqs) return;
    const updated = settingsDraft.faqs.filter((_, i) => i !== idx);
    setSettingsDraft({ ...settingsDraft, faqs: updated });
  };

  // Save All
  const handleSaveAll = async () => {
    let finalSettings = { ...settingsDraft };
    if (autoSyncValuation) {
      finalSettings = syncValuationWithCompletedPhases(phasesDraft, finalSettings);
    }
    if (autoSyncSoldShares) {
      const totalSold = shareholdersDraft.reduce((acc, s) => acc + s.sharesCount, 0);
      finalSettings.soldShares = totalSold;
    }
    setSettingsDraft(finalSettings);

    const creds = getActiveSupabaseCredentials();
    const targetUrl = (finalSettings.supabaseUrl || creds.url).trim();
    const targetKey = (finalSettings.supabaseAnonKey || creds.key).trim();

    if (targetUrl && targetKey) {
      saveActiveSupabaseCredentials(targetUrl, targetKey);
      setSupabaseSyncStatus({ loading: true, msg: 'در حال ارسال و ذخیره داده‌ها در پایگاه داده سوپابیس...' });
      const res = await syncToSupabase(finalSettings, phasesDraft, shareholdersDraft, targetUrl, targetKey);
      if (res.success) {
        onSave(finalSettings, phasesDraft, shareholdersDraft);
        setSupabaseSyncStatus({ loading: false, msg: 'همگام‌سازی کامل با سوپابیس با موفقیت انجام شد ✓' });
        setSaveSuccessMessage('تمامی تغییرات، زمان‌بندی فازها، سهامداران و متون صفحه با موفقیت در دیتابیس سوپابیس ذخیره شدند.');
      } else {
        onSave(finalSettings, phasesDraft, shareholdersDraft);
        setSupabaseSyncStatus({ loading: false, isError: true, msg: res.error });
        setSaveSuccessMessage(`تغییرات به صورت محلی ذخیره شد، اما در ارسال به سوپابیس خطا رخ داد: ${res.error}`);
      }
    } else {
      onSave(finalSettings, phasesDraft, shareholdersDraft);
      setSaveSuccessMessage('تغییرات در مرورگر ذخیره شدند. (برای ذخیره دائمی ابری، آدرس و کلید سوپابیس را در تب سوپابیس وارد نمایید)');
    }

    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 4500);
  };

  const handleTestSupabaseSync = async () => {
    const creds = getActiveSupabaseCredentials();
    const targetUrl = (settingsDraft.supabaseUrl || creds.url).trim();
    const targetKey = (settingsDraft.supabaseAnonKey || creds.key).trim();

    if (!targetUrl || !targetKey) {
      setSupabaseSyncStatus({ isError: true, loading: false, msg: 'لطفاً ابتدا آدرس و کلید Anon سوپابیس را در فیلدهای زیر وارد کنید.' });
      return;
    }

    saveActiveSupabaseCredentials(targetUrl, targetKey);
    setSupabaseSyncStatus({ loading: true, msg: 'در حال ارسال و ذخیره داده‌ها در سوپابیس...' });
    const res = await syncToSupabase(settingsDraft, phasesDraft, shareholdersDraft, targetUrl, targetKey);
    if (res.success) {
      setSupabaseSyncStatus({ loading: false, msg: 'اتصال برقرار شد و داده‌ها با موفقیت در سوپابیس ذخیره شدند ✓' });
    } else {
      setSupabaseSyncStatus({ loading: false, isError: true, msg: `خطا در اتصال: ${res.error}` });
    }
  };

  const handleFetchFromSupabase = async () => {
    const creds = getActiveSupabaseCredentials();
    const targetUrl = (settingsDraft.supabaseUrl || creds.url).trim();
    const targetKey = (settingsDraft.supabaseAnonKey || creds.key).trim();

    if (!targetUrl || !targetKey) {
      setSupabaseSyncStatus({ isError: true, loading: false, msg: 'لطفاً ابتدا آدرس و کلید Anon سوپابیس را وارد کنید.' });
      return;
    }

    setSupabaseSyncStatus({ loading: true, msg: 'در حال دریافت اطلاعات از سوپابیس...' });
    const res = await syncFromSupabase(targetUrl, targetKey);
    if (res.error) {
      setSupabaseSyncStatus({ loading: false, isError: true, msg: res.error });
    } else {
      if (res.settings) setSettingsDraft(res.settings);
      if (res.phases) setPhasesDraft(res.phases);
      if (res.shareholders) setShareholdersDraft(res.shareholders);
      setSupabaseSyncStatus({ loading: false, msg: 'اطلاعات با موفقیت از سوپابیس دریافت و در پنل بارگذاری شد ✓' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-150">
      <div className="relative w-full max-w-6xl h-[94vh] sm:h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Admin Header */}
        <div className="px-3.5 sm:px-6 py-3 sm:py-4 border-b border-slate-800 flex items-center justify-between gap-2 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>پنل جامع مدیریت هوش مصنوعی بامی</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {settingsDraft.targetDomain}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                ویرایش آنلاین متغیرها، نقشه راه با شمارش معکوس زمان، سهامداران و متن‌های تمام بخش‌ها
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAll}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره تغییرات</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="بستن پنل"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Save Success Banner */}
        {saveSuccessMessage && (
          <div className="px-6 py-2.5 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{saveSuccessMessage}</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono">اعمال آنی در تمام بخش‌ها</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-3 sm:px-6 pt-2 sm:pt-3 border-b border-slate-800 bg-slate-950/40 overflow-x-auto shrink-0 scrollbar-none">
          
          <button
            onClick={() => setActiveTab('stock')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'stock'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>شاخص‌های سهام و قیمت‌ها (USD)</span>
          </button>

          <button
            onClick={() => setActiveTab('phases')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'phases'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>نقشه راه و زمان‌بندی فازها</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 font-mono">
              ۱۰ فاز
            </span>
          </button>

          <button
            onClick={() => setActiveTab('shareholders')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'shareholders'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>مدیریت سهامداران</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
              {shareholdersDraft.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'content'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>ویرایش متون تمامی بخش‌ها</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'supabase'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>دیتابیس سوپابیس</span>
          </button>

        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: Stock Variables */}
          {activeTab === 'stock' && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>همگام‌سازی خودکار ارزش‌گذاری و قیمت سهم با فازهای تکمیل شده</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    در صورت فعال بودن، با علامت زدن هر فاز به عنوان «تکمیل شده»، ارزش کل شرکت و قیمت هر سهم به طور خودکار به تارگت همان فاز ارتقا می‌یابد.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={autoSyncValuation}
                    onChange={(e) => setAutoSyncValuation(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    ارزش کل فعلی برنامه (USD $)
                  </label>
                  <input
                    type="number"
                    value={settingsDraft.totalValuation}
                    onChange={(e) =>
                      setSettingsDraft({ ...settingsDraft, totalValuation: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    ارزش‌گذاری مبنا: {formatUSD(settingsDraft.totalValuation)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    قیمت هر سهم (USD $)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={settingsDraft.currentSharePrice}
                    onChange={(e) =>
                      setSettingsDraft({ ...settingsDraft, currentSharePrice: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-teal-300 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    مثلاً 0.010 معادل ۱ سنت به ازای ۱۰ میلیون سهم
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    تعداد کل سهام شرکت (Total Shares)
                  </label>
                  <input
                    type="number"
                    value={settingsDraft.totalShares}
                    onChange={(e) =>
                      setSettingsDraft({ ...settingsDraft, totalShares: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    پیش‌فرض: ۱۰,۰۰۰,۰۰۰ سهم
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    تعداد سهام واگذار شده / فروخته شده
                  </label>
                  <input
                    type="number"
                    value={settingsDraft.soldShares}
                    onChange={(e) =>
                      setSettingsDraft({ ...settingsDraft, soldShares: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-emerald-300 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    سهام باقی‌مانده: {formatNumber(Math.max(0, settingsDraft.totalShares - settingsDraft.soldShares))} سهم
                  </span>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    دامنه رسمی پروژه
                  </label>
                  <input
                    type="text"
                    value={settingsDraft.targetDomain}
                    onChange={(e) =>
                      setSettingsDraft({ ...settingsDraft, targetDomain: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    دامنه مقصد: bami.modesk.org
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: 10 Phases Management with Target Completion Date */}
          {activeTab === 'phases' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span>
                  شما می‌توانید برای هر فاز تاریخ تکمیل را تعیین کنید تا سیستم تعداد سال، ماه و روز باقی‌مانده را محاسبه و به کاربران نمایش دهد.
                </span>
                <span className="font-mono text-cyan-300 font-bold px-2 py-1 rounded bg-slate-950 shrink-0">
                  ۱۰ فاز استراتژیک
                </span>
              </div>

              <div className="space-y-4">
                {phasesDraft.map((phase) => {
                  const remaining = getRemainingTime(phase.targetCompletionDate, phase.status);
                  return (
                    <div
                      key={phase.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        phase.status === 'completed'
                          ? 'bg-slate-950 border-emerald-500/40'
                          : phase.status === 'in_progress'
                          ? 'bg-slate-950 border-cyan-500/40'
                          : 'bg-slate-950/70 border-slate-800'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                        
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-cyan-400">
                            {phase.id}
                          </span>
                          <input
                            type="text"
                            value={phase.title}
                            onChange={(e) => handlePhaseFieldChange(phase.id, 'title', e.target.value)}
                            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-sm w-full sm:w-96 focus:border-cyan-400 focus:outline-none"
                          />
                        </div>

                        {/* Status Selector and live countdown indicator */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          <div className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 ${
                            phase.status === 'completed'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-cyan-500/15 text-cyan-300'
                          }`}>
                            <Timer className="w-3.5 h-3.5" />
                            <span>{remaining.text}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">وضعیت فاز:</span>
                            <select
                              value={phase.status}
                              onChange={(e) => handlePhaseStatusChange(phase.id, e.target.value as PhaseStatus)}
                              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white focus:border-cyan-400 focus:outline-none"
                            >
                              <option value="completed">✓ تکمیل شده (Completed)</option>
                              <option value="in_progress">⏳ درحال انجام (In Progress)</option>
                              <option value="pending">⏸ در لیست انتظار (Pending)</option>
                            </select>
                          </div>
                        </div>

                      </div>

                      {/* Phase Variables Grid including Date */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                        <div>
                          <label className="text-slate-400 block mb-1">ارزش کل در فاز (USD $)</label>
                          <input
                            type="number"
                            value={phase.valuation}
                            onChange={(e) => handlePhaseFieldChange(phase.id, 'valuation', Number(e.target.value))}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-slate-400 block mb-1">قیمت هر سهم (USD $)</label>
                          <input
                            type="number"
                            step="0.001"
                            value={phase.sharePrice}
                            onChange={(e) => handlePhaseFieldChange(phase.id, 'sharePrice', Number(e.target.value))}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-teal-300 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-slate-400 block mb-1">سهمیه سهام این فاز</label>
                          <input
                            type="number"
                            value={phase.sharesOffered}
                            onChange={(e) => handlePhaseFieldChange(phase.id, 'sharesOffered', Number(e.target.value))}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-slate-400 block mb-1">عنوان متنی تارگت</label>
                          <input
                            type="text"
                            value={phase.targetDate}
                            onChange={(e) => handlePhaseFieldChange(phase.id, 'targetDate', e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-cyan-400 font-semibold block mb-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>تاریخ تکمیل (میلادی)</span>
                          </label>
                          <input
                            type="date"
                            value={phase.targetCompletionDate || ''}
                            onChange={(e) => handlePhaseFieldChange(phase.id, 'targetCompletionDate', e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-cyan-500/40 rounded-lg text-cyan-300 font-mono text-xs focus:border-cyan-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Phase Description */}
                      <div className="mt-3">
                        <label className="text-slate-400 block text-xs mb-1">توضیحات فاز:</label>
                        <textarea
                          rows={2}
                          value={phase.description}
                          onChange={(e) => handlePhaseFieldChange(phase.id, 'description', e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs"
                        />
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 3: Shareholders Management */}
          {activeTab === 'shareholders' && (
            <div className="space-y-6">
              
              {/* Header Bar */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>فهرست رسمی سهامداران هوش مصنوعی بامی</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    شما می‌توانید سهامداران جدید ثبت کنید، درصد مالکیت و قیمت خرید هرکدام را تغییر داده یا حذف نمایید.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleOpenNewShareholder}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 shadow-md active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ثبت سهامدار جدید</span>
                  </button>
                </div>
              </div>

              {/* Quick Summary Pill */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                <div className="flex items-center gap-4">
                  <span className="text-slate-400">تعداد سهامداران: <b className="text-white font-mono">{shareholdersDraft.length}</b></span>
                  <span className="text-slate-400">مجموع سهام: <b className="text-teal-300 font-mono">{formatNumber(shareholdersDraft.reduce((acc, s) => acc + s.sharesCount, 0))}</b></span>
                  <span className="text-slate-400">درصد واگذار شده: <b className="text-amber-400 font-mono">{formatPercent((shareholdersDraft.reduce((acc, s) => acc + s.sharesCount, 0) / (settingsDraft.totalShares || 10000000)) * 100, 2)}</b></span>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSyncSoldShares}
                    onChange={(e) => setAutoSyncSoldShares(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>همگام‌سازی خودکار تعداد سهام واگذار شده شرکت با مجموع این جدول</span>
                </label>
              </div>

              {/* Shareholders List */}
              <div className="space-y-3">
                {shareholdersDraft.map((sh) => {
                  const ownership = (sh.sharesCount / (settingsDraft.totalShares || 10000000)) * 100;
                  const purchaseVal = sh.sharesCount * sh.purchaseSharePrice;
                  const currentVal = sh.sharesCount * (settingsDraft.currentSharePrice || 0.010);
                  const gain = currentVal - purchaseVal;
                  const gainPercent = purchaseVal > 0 ? (gain / purchaseVal) * 100 : 0;

                  return (
                    <div
                      key={sh.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 font-bold font-mono">
                          {sh.certificateId.slice(-3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{sh.name}</h4>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                              {sh.roleOrType}
                            </span>
                            <span className="text-[10px] text-cyan-400 font-mono">{sh.certificateId}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                            <span>{formatNumber(sh.sharesCount)} سهم ({formatPercent(ownership, 3)})</span>
                            <span>•</span>
                            <span>خرید: {formatUSD(purchaseVal)} (@{formatSharePrice(sh.purchaseSharePrice)})</span>
                            <span>•</span>
                            <span className="text-cyan-300 font-bold">ارزش روز: {formatUSD(currentVal)}</span>
                            <span>•</span>
                            <span className="text-emerald-400">+{formatPercent(gainPercent, 1)} رشد</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        <button
                          onClick={() => {
                            setEditingShareholder({ ...sh });
                            setIsShareholderModalOpen(true);
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-colors"
                          title="ویرایش سهامدار"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteShareholder(sh.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="حذف سهامدار"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 4: Comprehensive Text Editor for ALL sections */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              
              {/* Category sub-tabs */}
              <div className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold overflow-x-auto">
                <button
                  onClick={() => setContentCategory('hero')}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    contentCategory === 'hero' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  هیرو و سربرگ
                </button>
                <button
                  onClick={() => setContentCategory('calculator')}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    contentCategory === 'calculator' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ماشین حساب
                </button>
                <button
                  onClick={() => setContentCategory('roadmap')}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    contentCategory === 'roadmap' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  نقشه راه ۱۰ فاز
                </button>
                <button
                  onClick={() => setContentCategory('shareholders')}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    contentCategory === 'shareholders' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  بخش سهامداران
                </button>
                <button
                  onClick={() => setContentCategory('product')}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    contentCategory === 'product' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  فناوری و محصول
                </button>
                <button
                  onClick={() => setContentCategory('faqs')}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    contentCategory === 'faqs' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  سوالات متداول (FAQ)
                </button>
                <button
                  onClick={() => setContentCategory('footer')}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    contentCategory === 'footer' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  فوتر و تماس
                </button>
              </div>

              {/* Sub-Category: Hero & Header */}
              {contentCategory === 'hero' && (
                <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-cyan-400 mb-2">متن‌های بخش هیرو و وضعیت شبکه عصبی:</h4>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">نام رسمی پروژه</label>
                    <input
                      type="text"
                      value={settingsDraft.projectName}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, projectName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">شعار برند (Tagline)</label>
                    <input
                      type="text"
                      value={settingsDraft.brandTagline}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, brandTagline: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">نشان بالای هیرو (Badge)</label>
                    <input
                      type="text"
                      value={settingsDraft.heroBadge}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, heroBadge: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">تیتر اصلی هیرو (Hero Title)</label>
                    <input
                      type="text"
                      value={settingsDraft.heroTitle}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, heroTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">زیرنویس توضیحی هیرو (Hero Subtitle)</label>
                    <textarea
                      rows={2}
                      value={settingsDraft.heroSubtitle}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, heroSubtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">عنوان کارت وضعیت شبکه عصبی</label>
                      <input
                        type="text"
                        value={settingsDraft.neuralStatusTitle}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, neuralStatusTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">نسخه موتور عصبی بامی</label>
                      <input
                        type="text"
                        value={settingsDraft.neuralStatusSubtitle}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, neuralStatusSubtitle: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">عنوان باکس پیشرفت ارزش‌گذاری دور جاری</label>
                      <input
                        type="text"
                        value={settingsDraft.progressTitle}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, progressTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">متن توضیحات پیشرفت ارزش‌گذاری</label>
                      <textarea
                        rows={2}
                        value={settingsDraft.progressDescription}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, progressDescription: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">متن دکمه ماشین حساب در هیرو</label>
                      <input
                        type="text"
                        value={settingsDraft.progressButtonText}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, progressButtonText: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Category: Calculator */}
              {contentCategory === 'calculator' && (
                <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-cyan-400 mb-2">متن‌های بخش ماشین حساب سهام:</h4>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">نشان بالای ماشین حساب (Badge)</label>
                    <input
                      type="text"
                      value={settingsDraft.calculatorBadge}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, calculatorBadge: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">تیتر ماشین حساب (Title)</label>
                    <input
                      type="text"
                      value={settingsDraft.calculatorTitle}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, calculatorTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">توضیحات راهنمای ماشین حساب</label>
                    <textarea
                      rows={3}
                      value={settingsDraft.calculatorDescription}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, calculatorDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">متن دکمه تماس با مدیریت</label>
                    <input
                      type="text"
                      value={settingsDraft.calculatorCtaText}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, calculatorCtaText: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Sub-Category: Roadmap */}
              {contentCategory === 'roadmap' && (
                <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-cyan-400 mb-2">متن‌های بخش نقشه راه ۱۰ فاز:</h4>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">نشان بالای نقشه راه</label>
                    <input
                      type="text"
                      value={settingsDraft.roadmapBadge}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, roadmapBadge: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">تیتر اصلی نقشه راه</label>
                    <input
                      type="text"
                      value={settingsDraft.roadmapTitle}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, roadmapTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">توضیحات نقشه راه</label>
                    <textarea
                      rows={3}
                      value={settingsDraft.roadmapDescription}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, roadmapDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Sub-Category: Shareholders Texts */}
              {contentCategory === 'shareholders' && (
                <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-cyan-400 mb-2">متن‌های بخش ترکیب سهامداران:</h4>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">نشان بخش سهامداران</label>
                    <input
                      type="text"
                      value={settingsDraft.shareholdersBadge}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, shareholdersBadge: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">تیتر بخش سهامداران</label>
                    <input
                      type="text"
                      value={settingsDraft.shareholdersTitle}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, shareholdersTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">توضیحات بخش سهامداران</label>
                    <textarea
                      rows={3}
                      value={settingsDraft.shareholdersDescription}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, shareholdersDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Sub-Category: Product & Tech */}
              {contentCategory === 'product' && (
                <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-cyan-400 mb-2">متن‌های بخش معرفی محصول و فناوری:</h4>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">نشان بخش محصول</label>
                    <input
                      type="text"
                      value={settingsDraft.aboutBadge}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, aboutBadge: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">تیتر معرفی هوش مصنوعی بامی</label>
                    <input
                      type="text"
                      value={settingsDraft.aboutTitle}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, aboutTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">خلاصه پاراگراف معرفی بامی</label>
                    <textarea
                      rows={3}
                      value={settingsDraft.aboutBamiSummary}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, aboutBamiSummary: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">تیتر معماری ۳ لایه سیناپسی</label>
                    <input
                      type="text"
                      value={settingsDraft.neuralArchitectureTitle}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, neuralArchitectureTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">تیتر داشبورد رابط کاربری</label>
                      <input
                        type="text"
                        value={settingsDraft.interfaceTitle}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, interfaceTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">توضیحات داشبورد رابط کاربری</label>
                      <textarea
                        rows={2}
                        value={settingsDraft.interfaceDescription}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, interfaceDescription: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">تیتر مدل درآمدی ۴ ستون</label>
                      <input
                        type="text"
                        value={settingsDraft.businessModelTitle}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, businessModelTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">توضیحات مدل تجاری و جریان نقدی</label>
                      <textarea
                        rows={2}
                        value={settingsDraft.businessModelDescription}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, businessModelDescription: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Category: FAQs Editor */}
              {contentCategory === 'faqs' && (
                <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-xs font-bold text-cyan-400">مدیریت پرسش‌ها و پاسخ‌های متداول (FAQ):</h4>
                      <p className="text-[11px] text-slate-400">می‌توانید هر تعداد سوال و جواب اضافه کرده یا ویرایش کنید.</p>
                    </div>
                    <button
                      onClick={handleAddFaq}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>افزودن سوال جدید</span>
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">تیتر کلی بخش سوالات متداول</label>
                    <input
                      type="text"
                      value={settingsDraft.faqTitle}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, faqTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div className="space-y-3">
                    {(settingsDraft.faqs || []).map((faq, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-mono font-bold text-cyan-400">پرسش {idx + 1}:</span>
                          <button
                            onClick={() => handleDeleteFaq(idx)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="حذف این سوال"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={faq.q}
                          onChange={(e) => handleFaqChange(idx, 'q', e.target.value)}
                          placeholder="متن سوال..."
                          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                        />
                        <textarea
                          rows={2}
                          value={faq.a}
                          onChange={(e) => handleFaqChange(idx, 'a', e.target.value)}
                          placeholder="متن پاسخ..."
                          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-300 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Category: Footer & Contacts */}
              {contentCategory === 'footer' && (
                <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-cyan-400 mb-2">متن‌های فوتر و اطلاعات تماس رسمی:</h4>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">متن بیوگرافی کوتاه در فوتر</label>
                    <textarea
                      rows={2}
                      value={settingsDraft.footerBio}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, footerBio: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">عنوان باکس امنیت و شفافیت</label>
                      <input
                        type="text"
                        value={settingsDraft.footerTrustTitle}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, footerTrustTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">متن توضیحات امنیت و شفافیت</label>
                      <input
                        type="text"
                        value={settingsDraft.footerTrustDesc}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, footerTrustDesc: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">متن حقوقی کپی‌رایت انتهای فوتر</label>
                    <input
                      type="text"
                      value={settingsDraft.footerText}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, footerText: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">آیدی تلگرام پشتیبانی سرمایه‌گذاری</label>
                      <input
                        type="text"
                        value={settingsDraft.contactTelegram}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, contactTelegram: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">شماره واتساپ ارتباط مستقیم</label>
                      <input
                        type="text"
                        value={settingsDraft.contactWhatsapp}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, contactWhatsapp: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">ایمیل رسمی سرمایه‌گذاران</label>
                      <input
                        type="email"
                        value={settingsDraft.contactEmail}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, contactEmail: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">شماره تماس دفتر مرکزی</label>
                      <input
                        type="text"
                        value={settingsDraft.contactPhone}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, contactPhone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 5: Supabase Database Sync */}
          {activeTab === 'supabase' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span>همگام‌سازی ابری و ذخیره دائم با سوپابیس (Supabase Cloud Database)</span>
                  </h4>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-mono flex items-center gap-1.5 ${
                    settingsDraft.supabaseUrl && settingsDraft.supabaseAnonKey
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${settingsDraft.supabaseUrl && settingsDraft.supabaseAnonKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                    {settingsDraft.supabaseUrl && settingsDraft.supabaseAnonKey ? 'آماده همگام‌سازی ابری' : 'نیاز به کلید و آدرس'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  با اتصال سوپابیس، هر زمان در این پنل روی دکمه <strong className="text-cyan-300">«ذخیره نهایی تغییرات»</strong> کلیک کنید، تمام فازها، زمان‌بندی‌ها، لیست سهامداران و متون سایت به صورت مستقیم در سرور و پایگاه داده سوپابیس آپدیت می‌شوند تا برای تمام کاربران در سراسر دنیا در دسترس باشند.
                </p>
              </div>

              {supabaseSyncStatus && (
                <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  supabaseSyncStatus.isError ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30' : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                }`}>
                  <RefreshCw className={`w-4 h-4 ${supabaseSyncStatus.loading ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>{supabaseSyncStatus.msg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    آدرس پروژه سوپابیس (Supabase URL)
                  </label>
                  <input
                    type="text"
                    placeholder="https://xyzcompany.supabase.co"
                    value={settingsDraft.supabaseUrl || ''}
                    onChange={(e) => setSettingsDraft({ ...settingsDraft, supabaseUrl: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">از تنظیمات پروژه سوپابیس: Settings {'>'} API {'>'} Project URL</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    کلید عمومی سوپابیس (Supabase Anon Public Key)
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5c..."
                    value={settingsDraft.supabaseAnonKey || ''}
                    onChange={(e) => setSettingsDraft({ ...settingsDraft, supabaseAnonKey: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">از تنظیمات پروژه سوپابیس: Settings {'>'} API {'>'} anon / public key</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleTestSupabaseSync}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-2 transition-all active:scale-95"
                >
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  <span>تست اتصال و ذخیره تمام داده‌های جاری در سوپابیس</span>
                </button>

                <button
                  type="button"
                  onClick={handleFetchFromSupabase}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all active:scale-95"
                >
                  <Database className="w-4 h-4 text-teal-400" />
                  <span>دریافت آخرین اطلاعات از سوپابیس و بارگذاری در پنل</span>
                </button>
              </div>

              {/* SQL Script Section */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">اسکریپت SQL خودکار و امن سوپابیس (Idempotent Migration)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const sqlText = `-- اسکریپت جامع و چندباره‌پذیر (Idempotent) راه‌اندازی پایگاه داده سوپابیس
-- پروژه: هوش مصنوعی بامی (Bami AI) | دامنه: bami.modesk.org

CREATE TABLE IF NOT EXISTS public.bami_settings (
    id INT PRIMARY KEY,
    project_name TEXT DEFAULT 'هوش مصنوعی بامی | Bami AI',
    brand_tagline TEXT DEFAULT 'اکوسیستم پیشرفته هوش مصنوعی شناختی، پردازش داده و اتوماسیون سازمانی',
    total_valuation NUMERIC DEFAULT 100000,
    total_shares NUMERIC DEFAULT 10000000,
    sold_shares NUMERIC DEFAULT 1850000,
    current_share_price NUMERIC DEFAULT 0.010,
    currency TEXT DEFAULT 'USD',
    data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.bami_settings ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.bami_settings ADD COLUMN IF NOT EXISTS total_valuation NUMERIC DEFAULT 100000;
ALTER TABLE public.bami_settings ADD COLUMN IF NOT EXISTS current_share_price NUMERIC DEFAULT 0.010;
ALTER TABLE public.bami_settings ADD COLUMN IF NOT EXISTS total_shares NUMERIC DEFAULT 10000000;
ALTER TABLE public.bami_settings ADD COLUMN IF NOT EXISTS sold_shares NUMERIC DEFAULT 1850000;
ALTER TABLE public.bami_settings ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
ALTER TABLE public.bami_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

INSERT INTO public.bami_settings (id, total_valuation, current_share_price, total_shares, sold_shares, currency)
VALUES (1, 100000, 0.010, 10000000, 1850000, 'USD')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.bami_phases (
    id INT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT NOT NULL,
    valuation NUMERIC NOT NULL,
    share_price NUMERIC NOT NULL,
    target_date TEXT,
    target_completion_date TEXT,
    description TEXT,
    key_milestones JSONB DEFAULT '[]'::jsonb,
    shares_offered NUMERIC DEFAULT 1000000,
    data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.bami_phases ADD COLUMN IF NOT EXISTS target_completion_date TEXT;
ALTER TABLE public.bami_phases ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.bami_phases ADD COLUMN IF NOT EXISTS shares_offered NUMERIC DEFAULT 1000000;
ALTER TABLE public.bami_phases ADD COLUMN IF NOT EXISTS key_milestones JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.bami_phases ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

CREATE TABLE IF NOT EXISTS public.bami_shareholders (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role_or_type TEXT,
    shares_count NUMERIC NOT NULL DEFAULT 0,
    purchase_share_price NUMERIC NOT NULL DEFAULT 0.010,
    purchase_date TEXT,
    entry_phase TEXT,
    certificate_id TEXT,
    verified BOOLEAN DEFAULT true,
    data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.bami_shareholders ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.bami_shareholders ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT true;
ALTER TABLE public.bami_shareholders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

ALTER TABLE public.bami_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bami_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bami_shareholders ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public Read Settings" ON public.bami_settings;
    DROP POLICY IF EXISTS "Public Update Settings" ON public.bami_settings;
    DROP POLICY IF EXISTS "Public Insert Settings" ON public.bami_settings;

    DROP POLICY IF EXISTS "Public Read Phases" ON public.bami_phases;
    DROP POLICY IF EXISTS "Public Update Phases" ON public.bami_phases;
    DROP POLICY IF EXISTS "Public Insert Phases" ON public.bami_phases;

    DROP POLICY IF EXISTS "Public Read Shareholders" ON public.bami_shareholders;
    DROP POLICY IF EXISTS "Public Update Shareholders" ON public.bami_shareholders;
    DROP POLICY IF EXISTS "Public Insert Shareholders" ON public.bami_shareholders;
    DROP POLICY IF EXISTS "Public Delete Shareholders" ON public.bami_shareholders;
END $$;

CREATE POLICY "Public Read Settings" ON public.bami_settings FOR SELECT USING (true);
CREATE POLICY "Public Update Settings" ON public.bami_settings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Insert Settings" ON public.bami_settings FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Phases" ON public.bami_phases FOR SELECT USING (true);
CREATE POLICY "Public Update Phases" ON public.bami_phases FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Insert Phases" ON public.bami_phases FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Shareholders" ON public.bami_shareholders FOR SELECT USING (true);
CREATE POLICY "Public Update Shareholders" ON public.bami_shareholders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Insert Shareholders" ON public.bami_shareholders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Delete Shareholders" ON public.bami_shareholders FOR DELETE USING (true);

GRANT ALL ON TABLE public.bami_settings TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.bami_phases TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.bami_shareholders TO anon, authenticated, service_role;`;
                      navigator.clipboard.writeText(sqlText);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 3000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">کپی شد!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>کپی اسکریپت SQL سوپابیس</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  این اسکریپت کاملاً ایمن و چندباره‌پذیر است: اگر جداول یا داده‌ها قبلاً وجود داشته باشند، هیچ خطایی ایجاد نمی‌شود و ویرایش‌های قبلی شما حفظ می‌گردد. کافیست آن را در بخش <strong className="text-cyan-300">SQL Editor</strong> در پنل سوپابیس پیست و <strong className="text-emerald-400">Run</strong> نمایید.
                </p>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-[10px] text-slate-300 max-h-36 overflow-y-auto ltr text-left">
                  <code>{`CREATE TABLE IF NOT EXISTS public.bami_settings (...)
CREATE TABLE IF NOT EXISTS public.bami_phases (...)
CREATE TABLE IF NOT EXISTS public.bami_shareholders (...)
-- RLS Policies & Grants enabled for seamless browser + VPS persistence`}</code>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Admin Footer Bar */}
        <div className="px-3.5 sm:px-6 py-3 sm:py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('آیا مطمئن هستید که می‌خواهید تمامی داده‌ها، زمان‌بندی‌ها و سهامداران را به مقادیر اولیه بازگردانید؟')) {
                  onReset();
                }
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-[11px] sm:text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">بازنشانی به مقادیر اولیه</span>
              <span className="sm:hidden">بازنشانی</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-[11px] sm:text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>

            <button
              onClick={handleSaveAll}
              className="flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره نهایی تغییرات</span>
            </button>
          </div>
        </div>

      </div>

      {/* Shareholder Add/Edit Modal */}
      {isShareholderModalOpen && editingShareholder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative w-full max-w-lg p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>{editingShareholder.name ? `ویرایش سهامدار: ${editingShareholder.name}` : 'ثبت سهامدار جدید'}</span>
              </h3>
              <button
                onClick={() => setIsShareholderModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveShareholderModal} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">نام یا عنوان سهامدار</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: دکتر م. حسینی یا صندوق فرشته..."
                  value={editingShareholder.name}
                  onChange={(e) => setEditingShareholder({ ...editingShareholder, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">نقش / نوع سهامدار</label>
                  <select
                    value={editingShareholder.roleOrType}
                    onChange={(e) => setEditingShareholder({ ...editingShareholder, roleOrType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="تیم موسس و فناوری">تیم موسس و فناوری</option>
                    <option value="سرمایه‌گذار فرشته">سرمایه‌گذار فرشته</option>
                    <option value="سرمایه‌گذار نهادی فرشته">سرمایه‌گذار نهادی فرشته</option>
                    <option value="سرمایه‌گذار استراتژیک">سرمایه‌گذار استراتژیک</option>
                    <option value="شتاب‌دهنده اکوسیستم">شتاب‌دهنده اکوسیستم</option>
                    <option value="سرمایه‌گذار حقیقی">سرمایه‌گذار حقیقی</option>
                    <option value="پارتنر تجاری">پارتنر تجاری</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">شناسه یکتای گواهی</label>
                  <input
                    type="text"
                    required
                    value={editingShareholder.certificateId}
                    onChange={(e) => setEditingShareholder({ ...editingShareholder, certificateId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 font-mono text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">تعداد سهام</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={editingShareholder.sharesCount}
                    onChange={(e) => setEditingShareholder({ ...editingShareholder, sharesCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-amber-400 mt-0.5 block font-mono">
                    درصد مالکیت: {formatPercent((editingShareholder.sharesCount / (settingsDraft.totalShares || 10000000)) * 100, 3)}
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">قیمت خرید هر سهم ($)</label>
                  <input
                    type="number"
                    min="0.001"
                    step="0.001"
                    required
                    value={editingShareholder.purchaseSharePrice}
                    onChange={(e) => setEditingShareholder({ ...editingShareholder, purchaseSharePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-teal-300 font-mono text-xs focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                    ارزش در زمان خرید: {formatUSD(editingShareholder.sharesCount * editingShareholder.purchaseSharePrice)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">تاریخ ورود / خرید</label>
                  <input
                    type="text"
                    placeholder="مثال: ۱۴۰۳/۱۱"
                    value={editingShareholder.purchaseDate}
                    onChange={(e) => setEditingShareholder({ ...editingShareholder, purchaseDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">فاز ورود</label>
                  <input
                    type="text"
                    placeholder="مثال: فاز ۱ (پایه)"
                    value={editingShareholder.entryPhase}
                    onChange={(e) => setEditingShareholder({ ...editingShareholder, entryPhase: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>ارزش روز با قیمت فعلی ({formatSharePrice(settingsDraft.currentSharePrice)}):</span>
                  <span className="font-mono font-bold text-cyan-300">{formatUSD(editingShareholder.sharesCount * (settingsDraft.currentSharePrice || 0.01))}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>میزان سود / رشد محقق‌شده:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    +{formatUSD((editingShareholder.sharesCount * (settingsDraft.currentSharePrice || 0.01)) - (editingShareholder.sharesCount * editingShareholder.purchaseSharePrice))}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsShareholderModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-md"
                >
                  ثبت و تایید سهامدار
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
