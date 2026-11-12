-- ====================================================================
-- اسکریپت جامع و چندباره‌پذیر (Idempotent) راه‌اندازی پایگاه داده سوپابیس
-- پروژه: هوش مصنوعی بامی (Bami AI) | دامنه: bami.modesk.org
-- واحد پولی انحصاری: USD ($) دلار
-- ویژگی: بدون خطا در صورت اجرای مجدد (Skip if exists, Create if not)
-- ====================================================================

-- ۱. ساخت یا تکمیل جدول تنظیمات و متون جامع سایت (bami_settings)
CREATE TABLE IF NOT EXISTS public.bami_settings (
    id INT PRIMARY KEY,
    project_name TEXT DEFAULT 'هوش مصنوعی بامی | Bami AI',
    brand_tagline TEXT DEFAULT 'اکوسیستم پیشرفته هوش مصنوعی شناختی، پردازش داده و اتوماسیون سازمانی',
    hero_badge TEXT DEFAULT 'راند سرمایه‌گذاری اولیه فرشته (Angel Round)',
    hero_title TEXT DEFAULT 'فرصت استثنایی مشارکت در ارزش‌آفرینی سهام هوش مصنوعی بامی',
    hero_subtitle TEXT DEFAULT 'ورود به جمع سهام‌داران اولیه نسل جدید هوش مصنوعی یکپارچه تجاری و سازمانی با پتانسیل رشد تصاعدی در ۱۰ فاز استراتژیک.',
    total_valuation NUMERIC DEFAULT 100000,
    total_shares NUMERIC DEFAULT 10000000,
    sold_shares NUMERIC DEFAULT 1850000,
    current_share_price NUMERIC DEFAULT 0.010,
    currency TEXT DEFAULT 'USD',
    min_investment_shares NUMERIC DEFAULT 5000,
    target_domain TEXT DEFAULT 'bami.modesk.org',
    contact_telegram TEXT DEFAULT '@BamiAI_invest',
    contact_whatsapp TEXT DEFAULT '+989120000000',
    contact_email TEXT DEFAULT 'invest@bami.modesk.org',
    contact_phone TEXT DEFAULT '+982191000000',
    footer_text TEXT DEFAULT 'تمامی حقوق مادی و معنوی Bami محفوظ است',
    company_vision TEXT DEFAULT 'تبدیل شدن به برترین قطب هوش مصنوعی چندزبانه و راهکارهای هوشمند تجاری با ارائه ابزارهای تحلیلی، بینایی ماشین و دستیاران هوشمند سازمانی در سطح منطقه و بازارهای جهانی.',
    about_bami_summary TEXT DEFAULT 'هوش مصنوعی بامی (Bami AI) یک پلتفرم نسل جدید بر پایه یادگیری عمیق و مدل‌های زبانی بومی‌سازی شده است که تحلیل داده‌های تجاری، اتوماسیون فرایندهای پیچیده سازمانی و تصمیم‌گیری‌های لحظه‌ای را با دقت بالا فراهم می‌سازد.',
    data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- اطمینان از وجود ستون‌های ضروری در صورت ساخته شدن قبلی جدول
ALTER TABLE public.bami_settings ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.bami_settings ADD COLUMN IF NOT EXISTS total_valuation NUMERIC DEFAULT 100000;
ALTER TABLE public.bami_settings ADD COLUMN IF NOT EXISTS current_share_price NUMERIC DEFAULT 0.010;
ALTER TABLE public.bami_settings ADD COLUMN IF NOT EXISTS total_shares NUMERIC DEFAULT 10000000;
ALTER TABLE public.bami_settings ADD COLUMN IF NOT EXISTS sold_shares NUMERIC DEFAULT 1850000;
ALTER TABLE public.bami_settings ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
ALTER TABLE public.bami_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- درج رکورد اولیه تنظیمات (در صورت وجود، رها می‌شود و ویرایش‌های قبلی شما پاک نمی‌شوند)
INSERT INTO public.bami_settings (id, total_valuation, current_share_price, total_shares, sold_shares, currency)
VALUES (1, 100000, 0.010, 10000000, 1850000, 'USD')
ON CONFLICT (id) DO NOTHING;


-- ۲. ساخت یا تکمیل جدول ۱۰ فاز نقشه راه (bami_phases)
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

-- اطمینان از وجود ستون‌های اضافه در جدول فازها
ALTER TABLE public.bami_phases ADD COLUMN IF NOT EXISTS target_completion_date TEXT;
ALTER TABLE public.bami_phases ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.bami_phases ADD COLUMN IF NOT EXISTS shares_offered NUMERIC DEFAULT 1000000;
ALTER TABLE public.bami_phases ADD COLUMN IF NOT EXISTS key_milestones JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.bami_phases ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- درج فازهای اولیه (در صورت وجود، دست‌نخورده باقی می‌مانند)
INSERT INTO public.bami_phases (id, title, status, valuation, share_price, target_date, target_completion_date, description, key_milestones, shares_offered)
VALUES
(1, 'فاز ۱: توسعه هسته الگوریتمی و راه‌اندازی MVP', 'completed', 100000, 0.010, 'تکمیل شده (Q1)', '2024-03-20', 'تحقیق و توسعه معماری پایه هوش مصنوعی بامی و ساخت MVP.', '["پیاده‌سازی هسته پردازش زبان طبیعی و شناختی بامی", "طراحی معماری میکروسرویس ابری مقیاس‌پذیر", "جذب اولین سرمایه‌گذاران فرشته و تثبیت ارزش ۱۰۰ هزار دلار"]'::jsonb, 1850000),
(2, 'فاز ۲: عرضه نسخه سازمانی تجاری و موتور تحلیل داده', 'in_progress', 250000, 0.025, 'درحال انجام (Q2)', '2025-06-30', 'توسعه داشبورد هوشمند سازمانی، اتصال به پایگاه داده‌ها و آغاز درآمدزایی B2B.', '["راه‌اندازی پنل سازمانی چندکاربره", "قرارداد پایلوت با ۵ شرکت برتر", "افزایش ارزش به ۲۵۰ هزار دلار"]'::jsonb, 1500000),
(3, 'فاز ۳: ماژول تخصصی بینایی ماشین و پردازش اسناد', 'pending', 600000, 0.060, 'لیست انتظار (Q3)', '2025-11-30', 'افزودن OCR هوشمند، تحلیل تصاویر صنعتی و بازشناسی اسناد.', '["موتور بینایی ماشین اختصاصی با دقت بالای ۹۸٪", "ورود به حوزه بیمه و لجستیک"]'::jsonb, 1200000),
(4, 'فاز ۴: عرضه عمومی پلتفرم ابری Bami Cloud API', 'pending', 1500000, 0.150, 'لیست انتظار (Q4)', '2026-04-30', 'ارائه API پرسرعت به توسعه‌دهندگان و شرکت‌های نرم‌افزاری.', '["زیرساخت سرورلس ابری", "مدل اعتباری Pay-as-you-go"]'::jsonb, 1000000),
(5, 'فاز ۵: ورود به بازارهای خلیج فارس و خاورمیانه (MENA)', 'pending', 3500000, 0.350, 'لیست انتظار', '2026-10-31', 'عرضه نسخه چندزبانه و ثبت شعبه منطقه‌ای و جذب مشتریان بین‌المللی.', '["افتتاح دفتر منطقه‌ای", "درآمد سالانه بالای ۵۰۰ هزار دلار"]'::jsonb, 900000),
(6, 'فاز ۶: هوش مصنوعی چندوجهی و دستیاران شناختی اختصاصی', 'pending', 8000000, 0.800, 'لیست انتظار', '2027-04-30', 'نسل جدید ایجنت‌های چندوجهی با قابلیت اجرای تراکنش‌ها و پشتیبانی صوتی پیشرفته.', '["تولید سناریوهای صوتی طبیعی", "قراردادهای بانکی"]'::jsonb, 800000),
(7, 'فاز ۷: ایجاد مزرعه پردازشی اختصاصی (Dedicated GPU Farm)', 'pending', 18000000, 1.800, 'لیست انتظار', '2027-11-30', 'تامین کلاسترهای محاسباتی مستقل و کاهش ۷۰ درصدی هزینه‌های پردازش ابری.', '["راه‌اندازی دیتاسنتر مستقل", "آموزش مدل‌های ۳۰B+"]'::jsonb, 700000),
(8, 'فاز ۸: ورود به زنجیره تامین شرکت‌های چندملیتی و هم‌افزایی', 'pending', 40000000, 4.000, 'لیست انتظار', '2028-06-30', 'یکپارچه‌سازی سامانه‌ها با ERP‌های جهانی نظیر SAP و Oracle.', '["ادغام با سیستم‌های جهانی", "تاسیس صندوق شتاب‌دهنده بامی"]'::jsonb, 600000),
(9, 'فاز ۹: پیش‌عرضه بورس و شراکت‌های استراتژیک بین‌المللی', 'pending', 80000000, 8.000, 'لیست انتظار', '2028-12-31', 'حسابرسی رسمی بین‌المللی (Big 4) و آماده‌سازی نقدشوندگی ثانویه.', '["انطباق کامل با استانداردهای SOX", "درآمد بالای ۱۰ میلیون دلار"]'::jsonb, 500000),
(10, 'فاز ۱۰: عرضه عمومی بین‌المللی (IPO / Global Exit) و بلوغ کامل', 'pending', 150000000, 15.000, 'لیست انتظار نهایی', '2029-12-31', 'عرضه اولیه سهام در بورس‌های فناوری یا ادغام کلان با بازگشت سرمایه تا ۱۵۰۰ برابر.', '["عرضه IPO با نقدشوندگی کامل", "ارزش‌گذاری نهایی ۱۵۰ میلیون دلار"]'::jsonb, 900000)
ON CONFLICT (id) DO NOTHING;


-- ۳. ساخت یا تکمیل جدول سهامداران (bami_shareholders)
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

-- اطمینان از وجود ستون‌های اضافه در جدول سهامداران
ALTER TABLE public.bami_shareholders ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.bami_shareholders ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT true;
ALTER TABLE public.bami_shareholders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- درج سهامداران پیش‌فرض (در صورت وجود شناسه‌ها، رها می‌شوند)
INSERT INTO public.bami_shareholders (id, name, role_or_type, shares_count, purchase_share_price, purchase_date, entry_phase, certificate_id, verified)
VALUES
('sh-1', 'دکتر علیرضا رستمی', 'سرمایه‌گذار فرشته (صنعتی)', 500000, 0.010, '۱۴۰۳/۰۹', 'فاز ۱ (پایه)', 'BM-SH-001', true),
('sh-2', 'مهندس سارا نیک‌پی', 'سرمایه‌گذار فرشته (فناوری)', 350000, 0.010, '۱۴۰۳/۱۰', 'فاز ۱ (پایه)', 'BM-SH-002', true),
('sh-3', 'گروه سرمایه‌گذاری اروند تک', 'سرمایه‌گذار نهادی', 600000, 0.010, '۱۴۰۳/۱۱', 'فاز ۱ (پایه)', 'BM-SH-003', true),
('sh-4', 'دکتر کامران شریفی', 'مشاور ارشد فناوری و شریک استراتژیک', 250000, 0.010, '۱۴۰۳/۱۱', 'فاز ۱ (پایه)', 'BM-SH-004', true),
('sh-5', 'مهندس نیلوفر قادری', 'سرمایه‌گذار فردی اولیه', 150000, 0.010, '۱۴۰۳/۱۲', 'فاز ۱ (پایه)', 'BM-SH-005', true)
ON CONFLICT (id) DO NOTHING;


-- ۴. اعمال تنظیمات امنیت RLS و دسترسی‌های بدون خطا (Idempotent Policies)
ALTER TABLE public.bami_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bami_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bami_shareholders ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- حذف سیاست‌های قبلی در صورت وجود، برای جلوگیری از خطای policy already exists
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

-- تعریف سیاست‌های دسترسی عمومی (خوانش و ثبت از طریق مرورگر و سرور با anon key)
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

-- اعطای دسترسی‌های لازم به نقش‌های عمومی و احراز شده
GRANT ALL ON TABLE public.bami_settings TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.bami_phases TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.bami_shareholders TO anon, authenticated, service_role;
