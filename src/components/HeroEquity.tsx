import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Layers,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Brain,
  Activity,
  Calendar,
  Timer
} from 'lucide-react';
import { BamiSettings, BamiPhase } from '../types';
import { formatNumber, formatUSD, formatSharePrice, formatPercent, getRemainingTime } from '../lib/formatters';
import { NeuralBrainCanvas } from './NeuralBrainCanvas';

interface HeroEquityProps {
  settings: BamiSettings;
  phases: BamiPhase[];
  onScrollToCalculator: () => void;
}

export const HeroEquity: React.FC<HeroEquityProps> = ({
  settings,
  phases,
  onScrollToCalculator,
}) => {
  const [selectedPhasePreview, setSelectedPhasePreview] = useState<number>(1);

  const availableShares = Math.max(0, settings.totalShares - settings.soldShares);
  const soldPercent = Math.min(100, (settings.soldShares / settings.totalShares) * 100);

  const previewPhase = phases.find(p => p.id === selectedPhasePreview) || phases[0];
  const growthMultiplier = previewPhase.sharePrice / (settings.currentSharePrice || 0.01);

  return (
    <section id="equity-overview" className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden bg-neural-grid">
      
      {/* 1. Interactive 60fps Neural Brain Synapse Canvas in Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none sm:pointer-events-auto">
        <NeuralBrainCanvas />
      </div>

      {/* 2. Ambient neural lighting gradients */}
      <div className="absolute top-0 right-1/4 -translate-y-1/2 w-[650px] h-[650px] bg-cyan-500/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-teal-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* High-tech scanline */}
      <div className="neural-scanline" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Badges & Notice */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-xs font-medium text-cyan-300 backdrop-blur-md shadow-lg shadow-cyan-950/40">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold">{settings.heroBadge}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 flex items-center gap-1.5 font-mono">
              <Brain className="w-3.5 h-3.5 text-teal-400" />
              <span>هسته عصبی بامی فعال</span>
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>واحد رسمی مبادلات: USD ($) دلار</span>
          </div>
        </div>

        {/* Hero Headline & Interactive Neural Brain Lockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight lg:leading-[1.22] mb-5">
              {settings.heroTitle}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl font-light">
              {settings.heroSubtitle}
            </p>
          </div>

          {/* Interactive Neural Synapse Status Capsule */}
          <div className="lg:col-span-4 p-5 rounded-3xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-500/30 transition-colors pointer-events-none" />
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <Brain className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{settings.neuralStatusTitle || 'شبکه نرونی شناختی بامی'}</div>
                  <div className="text-[10px] text-teal-400 font-mono">{settings.neuralStatusSubtitle || 'Bami Neural Engine v2.4'}</div>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
              <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-400">تاخیر پردازش سیناپسی</div>
                <div className="text-sm font-bold text-cyan-300 font-mono tabular-nums">42 ms</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-400">نرخ رشد ارزش فازها</div>
                <div className="text-sm font-bold text-emerald-400 font-mono tabular-nums">×۱,۵۰۰</div>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>مکان‌نمای ماوس را برای برانگیختن نرون‌ها حرکت دهید</span>
            </div>
          </div>

        </div>

        {/* 5 Real-time Key Stock Metric Cards with Neural Glow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          
          {/* Card 1: Total Valuation */}
          <div className="relative p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/40 shadow-xl group hover:border-cyan-400 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">ارزش کل بامی AI</span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums mb-1 font-mono">
              {formatUSD(settings.totalValuation)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>فاز ۱ تکمیل شده ($100K)</span>
            </div>
          </div>

          {/* Card 2: Price Per Share */}
          <div className="relative p-5 rounded-3xl bg-slate-900/90 border border-teal-500/30 shadow-xl group hover:border-teal-400 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">قیمت هر سهم</span>
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-300 tracking-tight tabular-nums mb-1 font-mono">
              {formatSharePrice(settings.currentSharePrice)}
            </div>
            <div className="text-xs text-slate-400">
              ارزش مبنای فاز فعال
            </div>
          </div>

          {/* Card 3: Total Shares */}
          <div className="relative p-5 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-xl group hover:border-indigo-400 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">تعداد کل سهام</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums mb-1 font-mono">
              {formatNumber(settings.totalShares)}
            </div>
            <div className="text-xs text-slate-400">
              سقف ثابت انتشار بدون رقیق‌سازی بیجا
            </div>
          </div>

          {/* Card 4: Sold Shares */}
          <div className="relative p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-xl group hover:border-emerald-400 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">سهام واگذار شده</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                <PieChart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight tabular-nums mb-1 font-mono">
              {formatNumber(settings.soldShares)}
            </div>
            <div className="text-xs text-slate-400">
              {formatPercent(soldPercent, 1)} واگذار شده تاکنون
            </div>
          </div>

          {/* Card 5: Available Shares */}
          <div className="relative p-5 rounded-3xl bg-slate-900/90 border border-amber-500/35 shadow-xl group hover:border-amber-400 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">سهام باقیمانده</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-tight tabular-nums mb-1 font-mono">
              {formatNumber(availableShares)}
            </div>
            <div className="text-xs text-slate-400">
              {formatPercent(100 - soldPercent, 1)} باقیمانده
            </div>
          </div>

        </div>

        {/* Equity Progress Bar & Phase Trajectory */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/85 border border-slate-800/90 shadow-2xl backdrop-blur-xl mb-12">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  <span>{settings.progressTitle}</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  فاز ۱ تکمیل شده
                </span>
              </div>
              <p className="text-sm text-slate-400">
                {settings.progressDescription}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={onScrollToCalculator}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 rounded-xl hover:bg-cyan-900/60 transition-all shadow-sm text-center"
              >
                {settings.progressButtonText}
              </button>
            </div>
          </div>

          {/* Progress bar visual */}
          <div className="relative w-full bg-slate-950 rounded-2xl p-2 border border-slate-800/80 mb-6">
            <div className="h-4 w-full bg-slate-900 rounded-xl overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-xl transition-all duration-1000 shadow-lg shadow-cyan-500/50"
                style={{ width: `${soldPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400 mt-2 px-1 font-mono">
              <span>تکمیل دور سرمایه‌گذاری: {formatPercent(soldPercent, 1)}</span>
              <span>سهام واگذار شده: {formatNumber(settings.soldShares)} از {formatNumber(settings.totalShares)}</span>
            </div>
          </div>

          {/* Interactive Phase Growth Simulator */}
          <div className="pt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-white">شبیه‌ساز رشد ارزش و قیمت سهم در فازهای ۱۰گانه:</span>
              </div>
              <span className="text-xs text-slate-400">روی فازها کلیک کنید</span>
            </div>

            {/* Phase Tabs */}
            <div className="grid grid-cols-5 sm:grid-cols-5 lg:grid-cols-10 gap-1.5 sm:gap-2 mb-6">
              {phases.map((ph) => {
                const isSelected = ph.id === selectedPhasePreview;
                const isCompleted = ph.status === 'completed';
                const isInProgress = ph.status === 'in_progress';

                return (
                  <button
                    key={ph.id}
                    onClick={() => setSelectedPhasePreview(ph.id)}
                    className={`relative p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl text-center border transition-all duration-200 ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/25 scale-[1.02] sm:scale-105'
                        : isCompleted
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 hover:border-emerald-400'
                        : isInProgress
                        ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300 hover:border-cyan-400'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-[10px] sm:text-[11px] font-mono font-bold">فاز {ph.id}</div>
                    <div className="text-[9px] sm:text-[10px] tabular-nums mt-0.5 truncate font-semibold font-mono">
                      {formatUSD(ph.valuation)}
                    </div>
                    {isCompleted && (
                      <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Phase Detail Insight */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3 w-full md:w-auto">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 font-bold font-mono text-sm sm:text-base">
                  {previewPhase.id}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span>{previewPhase.title}</span>
                    <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full ${
                      previewPhase.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : previewPhase.status === 'in_progress'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {previewPhase.status === 'completed' ? 'تکمیل شده' : previewPhase.status === 'in_progress' ? 'درحال انجام' : 'در لیست انتظار'}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-cyan-300 font-mono">
                      <Timer className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{getRemainingTime(previewPhase.targetCompletionDate, previewPhase.status).text}</span>
                      <span className="text-slate-500 hidden sm:inline">({getRemainingTime(previewPhase.targetCompletionDate, previewPhase.status).formattedDate})</span>
                    </span>
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-1 line-clamp-2 sm:line-clamp-1">
                    {previewPhase.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:flex items-center gap-2 sm:gap-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-800 text-center sm:text-left">
                <div className="text-center sm:text-left">
                  <div className="text-[10px] sm:text-[11px] text-slate-400">ارزش در فاز</div>
                  <div className="text-xs sm:text-base font-bold text-white font-mono tabular-nums">
                    {formatUSD(previewPhase.valuation)}
                  </div>
                </div>

                <div className="text-center sm:text-left">
                  <div className="text-[10px] sm:text-[11px] text-slate-400">قیمت سهم</div>
                  <div className="text-xs sm:text-base font-bold text-teal-400 font-mono tabular-nums">
                    {formatSharePrice(previewPhase.sharePrice)}
                  </div>
                </div>

                <div className="text-center sm:text-left">
                  <div className="text-[10px] sm:text-[11px] text-slate-400">ضریب رشد</div>
                  <div className="text-xs sm:text-base font-bold text-emerald-400 font-mono tabular-nums">
                    {growthMultiplier >= 1 ? `×${growthMultiplier.toFixed(1)}` : 'مبنا'}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
