import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  Percent,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Coins,
  Send
} from 'lucide-react';
import { BamiSettings, BamiPhase } from '../types';
import { formatNumber, formatUSD, formatSharePrice, formatPercent } from '../lib/formatters';

interface StockCalculatorProps {
  settings: BamiSettings;
  phases: BamiPhase[];
}

export const StockCalculator: React.FC<StockCalculatorProps> = ({
  settings,
  phases,
}) => {
  // Default to 50,000 shares ($500 at $0.010)
  const [sharesInput, setSharesInput] = useState<number>(50000);
  const [calculationMode, setCalculationMode] = useState<'SHARES' | 'USD'>('SHARES');
  const [usdInput, setUsdInput] = useState<number>(500);

  const pricePerShare = settings.currentSharePrice || 0.01;
  const currentShares = calculationMode === 'SHARES' ? sharesInput : Math.floor(usdInput / pricePerShare);
  const totalAmountUSD = calculationMode === 'SHARES' ? sharesInput * pricePerShare : usdInput;
  const ownershipPercentage = (currentShares / (settings.totalShares || 10000000)) * 100;

  // Milestone phases for projected ROI
  const phase2 = phases.find(p => p.id === 2) || phases[1];
  const phase5 = phases.find(p => p.id === 5) || phases[4];
  const phase10 = phases.find(p => p.id === 10) || phases[9];

  const valueInPhase2 = currentShares * (phase2?.sharePrice || 0.025);
  const valueInPhase5 = currentShares * (phase5?.sharePrice || 0.350);
  const valueInPhase10 = currentShares * (phase10?.sharePrice || 15.00);

  const handleShareChange = (val: number) => {
    const cleanVal = Math.max(1000, Math.min(settings.totalShares - settings.soldShares, val));
    setSharesInput(cleanVal);
    setUsdInput(Math.round(cleanVal * pricePerShare));
  };

  const handleUsdChange = (val: number) => {
    const cleanUsd = Math.max(10, val);
    setUsdInput(cleanUsd);
    setSharesInput(Math.floor(cleanUsd / pricePerShare));
  };

  const quickPresets = [
    { label: 'سرمایه‌گذاری اولیه (۱۰,۰۰۰ سهم)', shares: 10000 },
    { label: 'سرمایه‌گذار فرشته برنزی (۵۰,۰۰۰ سهم)', shares: 50000 },
    { label: 'سرمایه‌گذار نقره‌ای (۱۰۰,۰۰۰ سهم)', shares: 100000 },
    { label: 'سرمایه‌گذار طلایی شریک (۲۵۰,۰۰۰ سهم)', shares: 250000 },
    { label: 'سرمایه‌گذار استراتژیک (۵۰۰,۰۰۰ سهم)', shares: 500000 },
  ];

  return (
    <section id="calculator" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs font-semibold text-cyan-300 mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>{settings.calculatorBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-4">
            {settings.calculatorTitle}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {settings.calculatorDescription}
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 p-4 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl w-full max-w-full overflow-hidden">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-cyan-400" />
                <span>تعیین ورودی سهام</span>
              </h3>
              
              <div className="grid grid-cols-2 sm:flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-medium w-full sm:w-auto">
                <button
                  onClick={() => setCalculationMode('SHARES')}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-lg transition-all text-center ${
                    calculationMode === 'SHARES'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  تعداد سهام
                </button>
                <button
                  onClick={() => setCalculationMode('USD')}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-lg transition-all text-center ${
                    calculationMode === 'USD'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  مبلغ دلاری ($)
                </button>
              </div>
            </div>

            {/* Input by Shares */}
            {calculationMode === 'SHARES' ? (
              <div className="mb-6">
                <div className="flex justify-between items-center text-sm font-medium text-slate-300 mb-2">
                  <span>تعداد سهام:</span>
                  <span className="font-bold text-cyan-300 text-base font-mono tabular-nums">
                    {formatNumber(sharesInput)} سهم
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="5000"
                    min="1000"
                    max={settings.totalShares}
                    value={sharesInput}
                    onChange={(e) => handleShareChange(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-lg font-bold focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    سهم Bami AI
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="5000"
                  max="1000000"
                  step="5000"
                  value={sharesInput}
                  onChange={(e) => handleShareChange(Number(e.target.value))}
                  className="w-full mt-4 accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>حداقل: ۵,۰۰۰ سهم</span>
                  <span>۱,۰۰۰,۰۰۰ سهم</span>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="flex justify-between items-center text-sm font-medium text-slate-300 mb-2">
                  <span>مبلغ کل سرمایه‌گذاری (USD $):</span>
                  <span className="font-bold text-cyan-300 text-base font-mono tabular-nums">
                    {formatUSD(usdInput)}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="100"
                    min="50"
                    value={usdInput}
                    onChange={(e) => handleUsdChange(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-lg font-bold focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                    USD ($)
                  </div>
                </div>

                <input
                  type="range"
                  min="50"
                  max="15000"
                  step="50"
                  value={usdInput}
                  onChange={(e) => handleUsdChange(Number(e.target.value))}
                  className="w-full mt-4 accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>حداقل: ۵۰ دلار</span>
                  <span>۱۵,۰۰۰ دلار</span>
                </div>
              </div>
            )}

            {/* Quick Presets */}
            <div className="mb-6">
              <span className="text-xs font-semibold text-slate-400 block mb-2.5">
                بسته‌های پیش‌فرض سرمایه‌گذاری:
              </span>
              <div className="flex flex-col gap-1.5">
                {quickPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCalculationMode('SHARES');
                      handleShareChange(preset.shares);
                    }}
                    className={`w-full text-right px-2.5 sm:px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center justify-between gap-2 max-w-full ${
                      sharesInput === preset.shares
                        ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate">{preset.label}</span>
                    <span className="font-mono tabular-nums text-slate-300 shrink-0">
                      {formatUSD(preset.shares * pricePerShare)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Box (Purely USD) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">قیمت فعلی هر سهم:</span>
                <span className="text-white font-mono font-bold">{formatSharePrice(pricePerShare)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">مبلغ کل دلاری:</span>
                <span className="text-cyan-300 font-mono font-bold text-base">{formatUSD(totalAmountUSD)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">سهم مالکیت شما از شرکت:</span>
                <span className="text-amber-400 font-mono font-extrabold text-sm">{formatPercent(ownershipPercentage, 3)}</span>
              </div>
            </div>

            {/* Contact Action */}
            <a
              href={`https://t.me/${settings.contactTelegram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full mt-6 py-3.5 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-xl shadow-cyan-500/20 active:scale-95 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 text-center"
            >
              <span>{settings.calculatorCtaText}</span>
              <Send className="w-4 h-4 shrink-0" />
            </a>

          </div>

          {/* ROI Projections Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6 w-full max-w-full">
            
            <div className="p-4 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl w-full max-w-full overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">
                    پیش‌بینی ارزش سهام شما در فازهای توسعه هوش مصنوعی
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">بر مبنای {formatNumber(currentShares)} سهم</span>
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                ارزش‌گذاری هوش مصنوعی بامی متناسب با دستیابی به نقاط عطف تجاری و مدل‌های درآمدی در هر فاز افزایش می‌یابد (تمام ارقام به دلار محاسبه شده‌اند):
              </p>

              {/* Milestone Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                
                {/* Phase 2 ROI */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 relative overflow-hidden group">
                  <div className="text-[11px] font-semibold text-cyan-400 mb-1">فاز ۲ (درحال انجام)</div>
                  <div className="text-xs text-slate-400 mb-2">ارزش‌گذاری $250K</div>
                  <div className="text-xl font-bold text-white font-mono tabular-nums mb-1">
                    {formatUSD(valueInPhase2)}
                  </div>
                  <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <span>+۱۵۰٪ رشد</span>
                    <span className="text-slate-500 font-mono">(×۲.۵)</span>
                  </div>
                </div>

                {/* Phase 5 ROI */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-teal-500/30 relative overflow-hidden group">
                  <div className="text-[11px] font-semibold text-teal-400 mb-1">فاز ۵ (بازار خاورمیانه)</div>
                  <div className="text-xs text-slate-400 mb-2">ارزش‌گذاری $3.5M</div>
                  <div className="text-xl font-bold text-teal-300 font-mono tabular-nums mb-1">
                    {formatUSD(valueInPhase5)}
                  </div>
                  <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <span>+۳,۴۰۰٪ رشد</span>
                    <span className="text-slate-500 font-mono">(×۳۵)</span>
                  </div>
                </div>

                {/* Phase 10 ROI */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-950/20 to-slate-950 border border-amber-500/40 relative overflow-hidden group">
                  <div className="text-[11px] font-semibold text-amber-400 mb-1">فاز ۱۰ (عرضه بین‌المللی)</div>
                  <div className="text-xs text-slate-400 mb-2">ارزش‌گذاری $150M</div>
                  <div className="text-xl font-bold text-amber-300 font-mono tabular-nums mb-1">
                    {formatUSD(valueInPhase10)}
                  </div>
                  <div className="text-xs text-amber-400 font-bold flex items-center gap-1">
                    <span>+۱۴۹,۹۰۰٪ رشد</span>
                    <span className="text-slate-400 font-mono">(×۱,۵۰۰)</span>
                  </div>
                </div>

              </div>

              {/* Value comparison table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3 font-semibold">فاز توسعه</th>
                      <th className="p-3 font-semibold">قیمت هر سهم</th>
                      <th className="p-3 font-semibold">ارزش سبد سهام شما (USD)</th>
                      <th className="p-3 font-semibold">ضریب رشد ارزش</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300 font-mono">
                    <tr className="bg-cyan-950/20">
                      <td className="p-3 font-sans font-medium text-cyan-300">فاز ۱ (فعلی - پایه)</td>
                      <td className="p-3 font-bold">{formatSharePrice(pricePerShare)}</td>
                      <td className="p-3 font-bold text-white">{formatUSD(totalAmountUSD)}</td>
                      <td className="p-3 font-sans text-slate-400">نقطه ورود</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans">فاز ۲: عرضه تجاری</td>
                      <td className="p-3">{formatSharePrice(0.025)}</td>
                      <td className="p-3 text-emerald-400 font-bold">{formatUSD(currentShares * 0.025)}</td>
                      <td className="p-3 text-emerald-400 font-sans">۲.۵ برابر</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans">فاز ۴: پلتفرم ابری API</td>
                      <td className="p-3">{formatSharePrice(0.150)}</td>
                      <td className="p-3 text-emerald-400 font-bold">{formatUSD(currentShares * 0.150)}</td>
                      <td className="p-3 text-emerald-400 font-sans">۱۵ برابر</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans">فاز ۷: دیتاسنتر اختصاصی GPU</td>
                      <td className="p-3">{formatSharePrice(1.800)}</td>
                      <td className="p-3 text-emerald-400 font-bold">{formatUSD(currentShares * 1.800)}</td>
                      <td className="p-3 text-emerald-400 font-sans">۱۸۰ برابر</td>
                    </tr>
                    <tr className="bg-amber-950/15">
                      <td className="p-3 font-sans font-bold text-amber-400">فاز ۱۰: عرضه عمومی IPO</td>
                      <td className="p-3 font-bold text-amber-300">{formatSharePrice(15.00)}</td>
                      <td className="p-3 font-bold text-amber-300">{formatUSD(currentShares * 15.00)}</td>
                      <td className="p-3 font-bold text-amber-400 font-sans">۱,۵۰۰ برابر</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Guarantees & Investor Rights notes */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ثبت رسمی قرارداد الکترونیک با شناسه یکتا و گواهی سهامداری</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>اولویت در راندهای بعدی با تخفیف ویژه سرمایه‌گذاران فاز ۱</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
