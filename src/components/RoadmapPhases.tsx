import React, { useState } from 'react';
import {
  Milestone,
  CheckCircle2,
  Clock,
  Hourglass,
  TrendingUp,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  ArrowUpRight,
  Calendar,
  Timer
} from 'lucide-react';
import { BamiPhase, BamiSettings } from '../types';
import { formatUSD, formatSharePrice, formatNumber, getRemainingTime } from '../lib/formatters';

interface RoadmapPhasesProps {
  phases: BamiPhase[];
  settings: BamiSettings;
}

export const RoadmapPhases: React.FC<RoadmapPhasesProps> = ({
  phases,
  settings,
}) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'in_progress' | 'pending'>('all');
  const [expandedPhaseId, setExpandedPhaseId] = useState<number | null>(1);

  const filteredPhases = phases.filter((phase) => {
    if (filter === 'all') return true;
    return phase.status === filter;
  });

  const getStatusBadge = (status: BamiPhase['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>تکمیل شده</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>درحال انجام</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <Hourglass className="w-3.5 h-3.5" />
            <span>در لیست انتظار</span>
          </span>
        );
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedPhaseId(expandedPhaseId === id ? null : id);
  };

  return (
    <section id="roadmap" className="py-20 relative bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs font-semibold text-cyan-300 mb-4">
              <Milestone className="w-3.5 h-3.5" />
              <span>{settings.roadmapBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-4">
              {settings.roadmapTitle}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {settings.roadmapDescription}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 w-full sm:w-auto text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`text-center px-2.5 sm:px-3 py-2 rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              همه ۱۰ فاز
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`text-center px-2.5 sm:px-3 py-2 rounded-lg transition-all ${
                filter === 'completed'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              تکمیل شده
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`text-center px-2.5 sm:px-3 py-2 rounded-lg transition-all ${
                filter === 'in_progress'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              درحال انجام
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`text-center px-2.5 sm:px-3 py-2 rounded-lg transition-all ${
                filter === 'pending'
                  ? 'bg-slate-700 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              لیست انتظار
            </button>
          </div>
        </div>

        {/* 10 Phases Grid / Timeline */}
        <div className="space-y-4">
          {filteredPhases.map((phase) => {
            const isExpanded = expandedPhaseId === phase.id;
            const growthVsPhase1 = phase.sharePrice / (phases[0]?.sharePrice || 0.01);
            const isCurrentActive = phase.id === 1;
            const remaining = getRemainingTime(phase.targetCompletionDate, phase.status);

            return (
              <div
                key={phase.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  phase.status === 'completed'
                    ? 'bg-gradient-to-r from-emerald-950/20 via-slate-900/90 to-slate-950 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                    : phase.status === 'in_progress'
                    ? 'bg-gradient-to-r from-cyan-950/25 via-slate-900/90 to-slate-950 border-cyan-500/50 shadow-xl shadow-cyan-950/20'
                    : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {/* Main Row / Header */}
                <div
                  onClick={() => toggleExpand(phase.id)}
                  className="p-5 sm:p-6 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 select-none"
                >
                  {/* Left: Phase Title and Badge */}
                  <div className="flex items-start sm:items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg font-mono shrink-0 border ${
                        phase.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : phase.status === 'in_progress'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {phase.id < 10 ? `۰${phase.id}` : phase.id}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          {phase.title}
                        </h3>
                        {getStatusBadge(phase.status)}
                        
                        {/* Target Completion Date */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono">
                          <Calendar className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span className="text-slate-300">موعد: {remaining.formattedDate}</span>
                        </div>

                        {/* Remaining Time Countdown */}
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold ${
                          phase.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                            : phase.status === 'in_progress'
                            ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/25'
                        }`}>
                          <Timer className="w-3 h-3 shrink-0" />
                          <span>{remaining.text}</span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 line-clamp-1 max-w-2xl">
                        {phase.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Key Valuation & Share Price in that Phase */}
                  <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-8 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800/80 w-full lg:w-auto">
                    
                    {/* Valuation in Phase */}
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 justify-end">
                        <DollarSign className="w-3 h-3 text-cyan-400" />
                        <span>ارزش کل بامی در فاز</span>
                      </div>
                      <div className="text-base sm:text-lg font-extrabold text-white font-mono tabular-nums">
                        {formatUSD(phase.valuation)}
                      </div>
                    </div>

                    {/* Share Price in Phase */}
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 justify-end">
                        <TrendingUp className="w-3 h-3 text-teal-400" />
                        <span>قیمت هر سهم</span>
                      </div>
                      <div className="text-base sm:text-lg font-extrabold text-teal-300 font-mono tabular-nums">
                        {formatSharePrice(phase.sharePrice)}
                      </div>
                    </div>

                    {/* Growth Multiplier */}
                    <div className="text-right hidden sm:block">
                      <div className="text-[11px] text-slate-400 font-medium">رشد نسبت به فاز ۱</div>
                      <div className="text-base sm:text-lg font-extrabold text-emerald-400 font-mono tabular-nums">
                        {growthVsPhase1 > 1 ? `×${growthVsPhase1.toFixed(1)}` : 'مبنا ($100K)'}
                      </div>
                    </div>

                    {/* Expand icon */}
                    <button
                      className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-950/50 border border-slate-800"
                      aria-label="نمایش جزئیات"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-slate-800/80 bg-slate-950/50">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
                      
                      <div className="md:col-span-7">
                        <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>اهداف و دستاوردهای کلیدی این فاز:</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {phase.keyMilestones.map((milestone, mIdx) => (
                            <div
                              key={mIdx}
                              className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                              <span>{milestone}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="md:col-span-5 flex flex-col justify-between p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                        <div>
                          <div className="text-xs font-semibold text-slate-400 mb-1">
                            سهمیه تخصیص یافته سهام این فاز:
                          </div>
                          <div className="text-xl font-bold text-white font-mono tabular-nums mb-2">
                            {formatNumber(phase.sharesOffered)} سهم
                          </div>
                          <div className="text-xs text-slate-400 leading-relaxed">
                            با تکمیل الزامات این فاز، ارزش سهام به طور رسمی در سامانه و مستندات مالی به روزرسانی می‌گردد.
                          </div>
                        </div>

                        {/* Timing status card */}
                        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">تاریخ برآورد تکمیل:</span>
                            <span className="font-mono text-white font-semibold">{remaining.formattedDate}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">مهلت باقی‌مانده:</span>
                            <span className="font-mono font-bold text-cyan-300">{remaining.text}</span>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
