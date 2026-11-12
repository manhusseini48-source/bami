import React, { useState } from 'react';
import {
  Brain,
  BrainCircuit,
  Database,
  Eye,
  Workflow,
  Sparkles,
  Shield,
  Layers,
  ChevronDown,
  ChevronUp,
  Download,
  Mail,
  Send,
  HelpCircle,
  BarChart3,
  Globe2,
  Activity,
  Zap,
  Network
} from 'lucide-react';
import { BamiSettings } from '../types';

interface BamiProductIntroProps {
  settings: BamiSettings;
}

export const BamiProductIntro: React.FC<BamiProductIntroProps> = ({
  settings,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeNeuralLayer, setActiveNeuralLayer] = useState<number>(1);

  const neuralLayers = [
    {
      id: 1,
      name: 'لایه ۱: ورودی چندوجهی و پیش‌پردازش سیناپسی',
      desc: 'دریافت همزمان اسناد، متون، داده‌های مالی و استریم‌های تصویری و تبدیل به بردار‌های تعبیه چندبعدی (Embeddings).',
      metric: '۵۱۲ بعد ادراکی',
      throughput: '۲۵۰,۰۰۰ توکن در ثانیه',
    },
    {
      id: 2,
      name: 'لایه ۲: موتور خودتوجهی عصبی بومی (Self-Attention)',
      desc: 'تخصیص وزن به ارتباطات معنایی در متون فارسی و اسناد شرکتی با کمترین میزان توهم و بیشترین دقت مفهومی.',
      metric: '۹۹.۴٪ دقت ادراکی',
      throughput: '۴۰ لایه ترنسفورمر بهینه‌شده',
    },
    {
      id: 3,
      name: 'لایه ۳: تصمیم‌گیری شناختی و استنتاج ایجنت‌ها',
      desc: 'اجرای وظایف خودکار کسب‌وکار، تحلیل ریسک اعتباری و فراخوانی ای‌پی‌آی‌های سازمانی به صورت خودمختار.',
      metric: 'پاسخگویی زیر ۴۲ میلی‌ثانیه',
      throughput: 'ارتباط مستقیم با دیتابیس‌ها',
    },
  ];

  const defaultPillars = [
    {
      icon: <BrainCircuit className="w-6 h-6 text-cyan-400" />,
      title: 'موتور شناختی و پردازش زبان طبیعی بومی',
      desc: 'مدل زبانی بومی‌سازی شده با درک عمیق اصطلاحات تجاری، حقوقی و مالی فارسی و انگلیسی، بدون وابستگی مستقیم به سرورهای مسدودشونده خارجی.',
      tag: 'هسته انحصاری بامی'
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-teal-400" />,
      title: 'پیش‌بینی هوشمند بازار و تحلیل داده‌های کسب‌وکار',
      desc: 'تحلیل سری‌های زمانی، تخمین رفتار مشتریان و بهینه‌سازی زنجیره فروش برای سازمان‌های خرده‌فروشی، صنعتی و هلدینگ‌های مالی.',
      tag: 'نرخ سودآوری بالا'
    },
    {
      icon: <Eye className="w-6 h-6 text-indigo-400" />,
      title: 'بینایی ماشین و پردازش ساختاریافته اسناد (OCR)',
      desc: 'استخراج هوشمند فاکتورها، احراز هویت تصویری و بازرسی خطوط تولید با دقت بالاتر از ۹۸ درصد و انطباق کامل با قوانین محلی.',
      tag: 'کاربرد گسترده صنعتی'
    },
    {
      icon: <Workflow className="w-6 h-6 text-emerald-400" />,
      title: 'ایجنت‌های خودکار و اتوماسیون فرایندهای سازمانی',
      desc: 'دستیاران چندوجهی که وظایف پرتکرار پشتیبانی، ثبت اسناد حسابداری و نامه‌نگاری اداری را به صورت ۲۴ ساعته مدیریت می‌کنند.',
      tag: 'کاهش ۷۰٪ هزینه‌های اداری'
    },
  ];

  const pillarIcons = [
    <BrainCircuit className="w-6 h-6 text-cyan-400" />,
    <BarChart3 className="w-6 h-6 text-teal-400" />,
    <Eye className="w-6 h-6 text-indigo-400" />,
    <Workflow className="w-6 h-6 text-emerald-400" />
  ];

  const activePillars = settings.pillars && settings.pillars.length > 0
    ? settings.pillars.map((p, idx) => ({ ...p, icon: pillarIcons[idx % pillarIcons.length] }))
    : defaultPillars;

  const defaultFaqs = [
    {
      q: 'سهام هوش مصنوعی بامی به چه صورت ثبت و تضمین می‌شود؟',
      a: 'کلیه سرمایه‌گذاران پس از تایید و پرداخت، قرارداد رسمی انتقال سهام با شناسه یکتای پیگیری حقوقی، گواهی دیجیتال سهامداری و درج در دفتر رسمی سهامداران بامی دریافت می‌کنند.'
    },
    {
      q: 'حداقل مبلغ و تعداد سهام قابل خرید در فاز فعلی چقدر است؟',
      a: 'در فاز فعلی، حداقل سفارش ۵,۰۰۰ سهم معادل ۵۰ دلار ($50 USD) است تا فرصت مشارکت برای سرمایه‌گذاران خرد و فعالان زیست‌بوم نوآوری نیز فراهم باشد.'
    },
    {
      q: 'ارزش‌گذاری فازهای آینده چگونه تحقق می‌یابد؟',
      a: 'افزایش ارزش در هر فاز مستقیماً وابسته به تحقق نقاط عطف تجاری (مانند جذب مشتریان سازمانی، راه‌اندازی نسخه ابری، افزایش درآمد تکرارشونده و توسعه منطقه‌ای) است و پشتوانه عملیاتی مستحکم دارد.'
    },
    {
      q: 'امکان نقدشوندگی یا فروش مجدد سهام در فازهای بعدی وجود دارد؟',
      a: 'بله، از فاز ۴ به بعد با راه‌اندازی بازار ثانویه بامی و همچنین در راندهای بعدی سرمایه‌گذاری، سهام‌داران فازهای اولیه می‌توانند بخشی از سهام خود را با ارزش روز به سرمایه‌گذاران جدید یا خود شرکت بفروشند.'
    },
    {
      q: 'چگونه می‌توانم قبل از خرید سهام با تیم مدیریتی جلسه داشته باشم؟',
      a: 'شما می‌توانید از طریق پیام مستقیم در تلگرام یا واتساپ رسمی با مدیریت سرمایه‌گذاری بامی در ارتباط باشید تا پرزنت اختصاصی پیچ‌دک و صورت‌های مالی برای شما ارسال شود.'
    },
  ];

  const activeFaqs = settings.faqs && settings.faqs.length > 0
    ? settings.faqs
    : defaultFaqs;

  const businessModelStreams = [
    {
      title: '۱. اشتراک ماهیانه و سالانه B2B SaaS',
      desc: 'پلن‌های ویژه استارتاپ‌ها، شرکت‌های متوسط و سازمان‌های بزرگ با مبالغ ۱۰۰ تا ۳,۵۰۰ دلار ماهانه.',
      share: '۴۵٪ از درآمد کل',
    },
    {
      title: '۲. توکن‌های مصرفی و سرویس ابری Bami Cloud API',
      desc: 'هزینه بر اساس حجم درخواست‌ها و مصرف توکن محاسباتی برای توسعه‌دهندگان نرم‌افزار.',
      share: '۳۰٪ از درآمد کل',
    },
    {
      title: '۳. نصب درون‌سازمانی (On-Premise) و شخصی‌سازی',
      desc: 'قراردادهای کلان سالانه با بانک‌ها، هلدینگ‌ها و نهادهای دولتی با حاشیه سود بالای ۸۰٪.',
      share: '۱۵٪ از درآمد کل',
    },
    {
      title: '۴. مارکت‌پلیس راهکارهای تخصصی هوش مصنوعی',
      desc: 'کمیسیون ۲۰ درصدی از افزونه‌ها و مدل‌های توسعه داده شده توسط پارتنرهای مستقل بامی.',
      share: '۱۰٪ از درآمد کل',
    },
  ];

  const faqs = [
    {
      q: 'سهام هوش مصنوعی بامی به چه صورت ثبت و تضمین می‌شود؟',
      a: 'کلیه سرمایه‌گذاران پس از تایید و پرداخت، قرارداد رسمی انتقال سهام با شناسه یکتای پیگیری حقوقی، گواهی دیجیتال سهامداری و درج در دفتر رسمی سهامداران بامی دریافت می‌کنند.'
    },
    {
      q: 'حداقل مبلغ و تعداد سهام قابل خرید در فاز ۱ چقدر است؟',
      a: 'در فاز ۱، حداقل سفارش ۵,۰۰۰ سهم معادل ۵۰ دلار ($50 USD) است تا فرصت مشارکت برای سرمایه‌گذاران خرد و فعالان زیست‌بوم نوآوری نیز فراهم باشد.'
    },
    {
      q: 'ارزش‌گذاری فازهای آینده چگونه تحقق می‌یابد؟',
      a: 'افزایش ارزش در هر فاز مستقیماً وابسته به تحقق نقاط عطف تجاری (مانند جذب مشتریان سازمانی، راه‌اندازی نسخه ابری، افزایش درآمد تکرارشونده و توسعه منطقه‌ای) است و پشتوانه عملیاتی مستحکم دارد.'
    },
    {
      q: 'امکان نقدشوندگی یا فروش مجدد سهام در فازهای بعدی وجود دارد؟',
      a: 'بله، از فاز ۴ به بعد با راه‌اندازی بازار ثانویه بامی و همچنین در راندهای بعدی سرمایه‌گذاری، سهام‌داران فازهای اولیه می‌توانند بخشی از سهام خود را با ارزش روز به سرمایه‌گذاران جدید یا خود شرکت بفروشند.'
    },
    {
      q: 'چگونه می‌توانم قبل از خرید سهام با تیم مدیریتی جلسه داشته باشم؟',
      a: 'شما می‌توانید از طریق پیام مستقیم در تلگرام یا واتساپ رسمی با مدیریت سرمایه‌گذاری بامی در ارتباط باشید تا پرزنت اختصاصی پیچ‌دک و صورت‌های مالی برای شما ارسال شود.'
    },
  ];

  return (
    <section id="about-bami" className="py-20 relative bg-slate-950/80">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Intro Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-xs font-semibold text-cyan-300 mb-4 shadow-lg shadow-cyan-950/30">
            <Brain className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{settings.aboutBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-5">
            {settings.aboutTitle}
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            {settings.aboutBamiSummary}
          </p>
        </div>

        {/* Neural Brain Multi-layer Architecture Interactive Showcase */}
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl mb-16 relative overflow-hidden backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono mb-1">
                <Network className="w-4 h-4" />
                <span>BAMI SYNAPTIC NEURAL MESH</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                {settings.neuralArchitectureTitle}
              </h3>
            </div>

            {/* Layer selector */}
            <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold w-full sm:w-auto">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setActiveNeuralLayer(num)}
                  className={`text-center px-2 sm:px-4 py-2 rounded-xl transition-all ${
                    activeNeuralLayer === num
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  لایه عصبی {num}
                </button>
              ))}
            </div>
          </div>

          {/* Active Layer Insight Card */}
          {(() => {
            const current = neuralLayers.find(l => l.id === activeNeuralLayer) || neuralLayers[0];
            return (
              <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 p-0.5 shrink-0">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-mono font-bold text-cyan-300 text-lg">
                      0{current.id}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">{current.name}</h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">{current.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 font-medium">شاخص پردازشی</div>
                    <div className="text-sm font-bold text-cyan-300 font-mono">{current.metric}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 font-medium">توان خروجی سیناپس</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono">{current.throughput}</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {activePillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-xl hover:-translate-y-1 duration-300"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-cyan-500/40 transition-all">
                  {pillar.icon}
                </div>
                <div className="text-[11px] font-bold text-cyan-400 mb-2 font-mono">
                  {pillar.tag}
                </div>
                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* High-Tech Interface Mockup Showcase */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 shadow-2xl mb-16 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-cyan-400 font-mono tracking-wider flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                <span>داشبورد عملیاتی هوش مصنوعی بامی</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {settings.interfaceTitle}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {settings.interfaceDescription}
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>پاسخگویی زیر ۵۰ میلی‌ثانیه با الگوریتم‌های بهینه‌شده بامی</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>انطباق کامل با استاندارد حریم خصوصی داده‌های سازمانی</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>قابلیت استقرار هیبریدی ابری و محلی (Private Cloud)</span>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href={`https://t.me/${settings.contactTelegram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 transition-all shadow-lg shadow-cyan-500/25 active:scale-95 text-center"
                >
                  <span>ارتباط مستقیم در تلگرام با مدیریت</span>
                  <Send className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group">
                <img
                  src="/src/assets/images/bami_ai_interface_mock_1794022502511.jpg"
                  alt="داشبورد پیشرفته هوش مصنوعی بامی"
                  className="w-full h-auto object-cover rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 right-4 left-4 flex justify-between items-center text-xs text-slate-300 backdrop-blur-md bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="font-semibold text-white">پلتفرم تحلیلی Bami Enterprise</span>
                  <span className="text-cyan-400 font-mono">Status: Active & Deployed</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Business Model & Revenue Streams */}
        <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 mb-16">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-cyan-400 font-mono">
              مدل کسب‌وکار و درآمدزایی پایدار
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {settings.businessModelTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              {settings.businessModelDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {businessModelStreams.map((stream, sIdx) => (
              <div
                key={sIdx}
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-emerald-400 font-mono mb-2">
                    {stream.share}
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">
                    {stream.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {stream.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="max-w-4xl mx-auto pt-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-xs font-semibold text-cyan-300 mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>پاسخ به سوالات پرتکرار</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {settings.faqTitle}
            </h3>
          </div>

          <div className="space-y-3">
            {activeFaqs.map((faq, fIdx) => {
              const isOpen = openFaqIndex === fIdx;
              return (
                <div
                  key={fIdx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                    className="w-full p-5 text-right flex items-center justify-between gap-4 text-white font-bold text-sm sm:text-base hover:text-cyan-300 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 bg-slate-950/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
