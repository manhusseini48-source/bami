import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  TrendingUp,
  Award,
  DollarSign,
  PieChart,
  Search,
  CheckCircle2,
  FileCheck,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { BamiShareholder, BamiSettings } from '../types';
import { formatNumber, formatUSD, formatSharePrice, formatPercent } from '../lib/formatters';

interface ShareholdersSectionProps {
  shareholders: BamiShareholder[];
  settings: BamiSettings;
}

export const ShareholdersSection: React.FC<ShareholdersSectionProps> = ({
  shareholders,
  settings,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const totalCompanyShares = settings.totalShares || 10000000;
  const currentPrice = settings.currentSharePrice || 0.010;

  // Calculate overall portfolio metrics
  const totalAllocatedShares = shareholders.reduce((acc, sh) => acc + sh.sharesCount, 0);
  const totalOriginalInvestmentUSD = shareholders.reduce(
    (acc, sh) => acc + sh.sharesCount * sh.purchaseSharePrice,
    0
  );
  const totalCurrentValueUSD = totalAllocatedShares * currentPrice;
  const overallProfitUSD = totalCurrentValueUSD - totalOriginalInvestmentUSD;
  const overallRoiPercent = totalOriginalInvestmentUSD > 0
    ? (overallProfitUSD / totalOriginalInvestmentUSD) * 100
    : 0;

  // Filtering
  const filteredShareholders = shareholders.filter((sh) => {
    const matchesSearch = sh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sh.roleOrType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sh.certificateId.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'founding') return matchesSearch && sh.roleOrType.includes('موسس');
    if (selectedFilter === 'angel') return matchesSearch && sh.roleOrType.includes('فرشته');
    if (selectedFilter === 'strategic') return matchesSearch && (sh.roleOrType.includes('استراتژیک') || sh.roleOrType.includes('شتاب‌دهنده'));
    return matchesSearch;
  });

  return (
    <section id="shareholders" className="py-20 relative bg-slate-950/80 border-t border-slate-900 overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-xs font-semibold text-cyan-300 mb-4 shadow-lg shadow-cyan-950/30">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>{settings.shareholdersBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            {settings.shareholdersTitle}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {settings.shareholdersDescription}
          </p>
        </div>

        {/* Highlight Summary Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          
          {/* Card 1: Total Shareholders */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-400">تعداد کل سهامداران</span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-mono tabular-nums">
              {shareholders.length} شخصیت حقیقی و حقوقی
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>دارای گواهی معتبر ثبتی</span>
            </div>
          </div>

          {/* Card 2: Total Allocated Shares */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-400">مجموع سهام واگذار شده</span>
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <PieChart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-teal-300 font-mono tabular-nums">
              {formatNumber(totalAllocatedShares)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              معادل {formatPercent((totalAllocatedShares / totalCompanyShares) * 100, 2)} کل شرکت
            </div>
          </div>

          {/* Card 3: Value At Purchase */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-400">ارزش اولیه در زمان خرید</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-200 font-mono tabular-nums">
              {formatUSD(totalOriginalInvestmentUSD)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              مجموع مبالغ واریزی دلاری
            </div>
          </div>

          {/* Card 4: Current Value & Overall Gain */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/40 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-semibold text-cyan-300">ارزش روز سبد سهامداران</span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-cyan-300 font-mono tabular-nums">
              {formatUSD(totalCurrentValueUSD)}
            </div>
            <div className="text-[11px] text-emerald-400 font-bold mt-1 flex items-center gap-1 font-mono">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{formatPercent(overallRoiPercent, 1)} رشد میانگین</span>
            </div>
          </div>

        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجوی نام یا شناسه سهامدار..."
              className="w-full pl-4 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-medium w-full sm:w-auto">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all text-center ${
                selectedFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              همه ({shareholders.length})
            </button>
            <button
              onClick={() => setSelectedFilter('founding')}
              className={`px-3 py-1.5 rounded-lg transition-all text-center ${
                selectedFilter === 'founding'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              بنیان‌گذاران
            </button>
            <button
              onClick={() => setSelectedFilter('angel')}
              className={`px-3 py-1.5 rounded-lg transition-all text-center ${
                selectedFilter === 'angel'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              فرشته
            </button>
            <button
              onClick={() => setSelectedFilter('strategic')}
              className={`px-3 py-1.5 rounded-lg transition-all text-center ${
                selectedFilter === 'strategic'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              استراتژیک
            </button>
          </div>

        </div>

        {/* Desktop & Tablet Table View (hidden on small mobile) */}
        <div className="hidden md:block rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl overflow-hidden shadow-2xl">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4 font-semibold">سهامدار و شناسه</th>
                <th className="p-4 font-semibold">تعداد سهام</th>
                <th className="p-4 font-semibold">درصد مالکیت</th>
                <th className="p-4 font-semibold">فاز و تاریخ ورود</th>
                <th className="p-4 font-semibold">قیمت خرید سهم</th>
                <th className="p-4 font-semibold text-slate-200">ارزش در زمان خرید (USD)</th>
                <th className="p-4 font-semibold text-cyan-300">ارزش فعلی سهام (USD)</th>
                <th className="p-4 font-semibold text-emerald-400">سود / بازدهی</th>
                <th className="p-4 font-semibold text-center">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredShareholders.map((sh) => {
                const ownershipPercent = (sh.sharesCount / totalCompanyShares) * 100;
                const originalValueUSD = sh.sharesCount * sh.purchaseSharePrice;
                const currentValueUSD = sh.sharesCount * currentPrice;
                const profitUSD = currentValueUSD - originalValueUSD;
                const profitPercent = originalValueUSD > 0
                  ? (profitUSD / originalValueUSD) * 100
                  : 0;

                return (
                  <tr key={sh.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Shareholder Name & Role */}
                    <td className="p-4">
                      <div className="font-bold text-white text-sm mb-0.5">{sh.name}</div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                          {sh.roleOrType}
                        </span>
                        <span className="font-mono text-cyan-400">{sh.certificateId}</span>
                      </div>
                    </td>

                    {/* Shares Count */}
                    <td className="p-4 font-mono font-bold text-white text-sm tabular-nums">
                      {formatNumber(sh.sharesCount)}
                    </td>

                    {/* Ownership Percentage */}
                    <td className="p-4">
                      <span className="font-mono font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-1 rounded-lg tabular-nums">
                        {formatPercent(ownershipPercent, 3)}
                      </span>
                    </td>

                    {/* Entry Phase & Date */}
                    <td className="p-4 text-slate-300 text-xs">
                      <div>{sh.entryPhase}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{sh.purchaseDate}</div>
                    </td>

                    {/* Purchase Price */}
                    <td className="p-4 font-mono text-slate-400 tabular-nums">
                      {formatSharePrice(sh.purchaseSharePrice)}
                    </td>

                    {/* Value at Purchase */}
                    <td className="p-4 font-mono font-bold text-slate-200 text-sm tabular-nums">
                      {formatUSD(originalValueUSD)}
                    </td>

                    {/* Current Value */}
                    <td className="p-4 font-mono font-extrabold text-cyan-300 text-sm tabular-nums">
                      {formatUSD(currentValueUSD)}
                    </td>

                    {/* Profit / Growth */}
                    <td className="p-4 font-mono font-bold text-sm tabular-nums">
                      <div className="text-emerald-400 flex items-center gap-0.5">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                        <span>+{formatPercent(profitPercent, 1)}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        +{formatUSD(profitUSD)} سود
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>تایید شده</span>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View (Visible on screens < 768px) */}
        <div className="md:hidden space-y-3.5">
          {filteredShareholders.map((sh) => {
            const ownershipPercent = (sh.sharesCount / totalCompanyShares) * 100;
            const originalValueUSD = sh.sharesCount * sh.purchaseSharePrice;
            const currentValueUSD = sh.sharesCount * currentPrice;
            const profitUSD = currentValueUSD - originalValueUSD;
            const profitPercent = originalValueUSD > 0
              ? (profitUSD / originalValueUSD) * 100
              : 0;

            return (
              <div
                key={sh.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">{sh.name}</h3>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                        {sh.roleOrType}
                      </span>
                      <span className="font-mono text-cyan-400">{sh.certificateId}</span>
                    </div>
                  </div>
                  
                  <span className="font-mono font-extrabold text-xs text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-1 rounded-lg shrink-0">
                    {formatPercent(ownershipPercent, 2)}
                  </span>
                </div>

                {/* Shares count and entry info */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">تعداد سهام: </span>
                    <span className="font-mono font-bold text-white">{formatNumber(sh.sharesCount)} سهم</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {sh.entryPhase} ({sh.purchaseDate})
                  </div>
                </div>

                {/* Purchase Value vs Current Value comparison */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-right">
                    <div className="text-[10px] text-slate-400">ارزش در زمان خرید</div>
                    <div className="text-sm font-bold text-slate-300 font-mono tabular-nums">
                      {formatUSD(originalValueUSD)}
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono">
                      @{formatSharePrice(sh.purchaseSharePrice)}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-right">
                    <div className="text-[10px] text-cyan-300">ارزش روز سهام</div>
                    <div className="text-sm font-extrabold text-cyan-300 font-mono tabular-nums">
                      {formatUSD(currentValueUSD)}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-bold font-mono">
                      +{formatPercent(profitPercent, 1)} رشد
                    </div>
                  </div>
                </div>

                {/* Footer status */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>گواهی سهامداری تایید شده</span>
                  </div>
                  <span className="font-mono text-slate-500">سود: +{formatUSD(profitUSD)}</span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Security & Registry Guarantee */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>تمامی سهامداران دارای شماره ثبت رسمی و گواهی الکترونیک انتقال سهام با شناسه پیگیری هستند.</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>محاسبه ارزش روز سهام با نرخ رسمی هر سهم ({formatSharePrice(currentPrice)}) به دلار (USD)</span>
          </div>
        </div>

      </div>
    </section>
  );
};
