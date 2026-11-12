# 🚀 راهنمای جامع اتصال پایگاه داده Supabase و استقرار روی VPS
### دامنه اختصاصی: `bami.modesk.org` | پروژه هوش مصنوعی بامی (Bami AI)

این راهنما توسط تیم مهندسی نرم‌افزار جهت استقرار بدون نقص وبسایت سهام و پنل مدیریت Bami AI آماده شده است.

---

## 📌 بخش اول: راه‌اندازی و اجرای کدها در Supabase

پایگاه داده سوپابیس (Supabase) به عنوان بک‌اند ابری امن بر پایه PostgreSQL برای ذخیره تنظیمات، شاخص‌های سهام، ۱۰ فاز نقشه راه و درخواست‌های سرمایه‌گذاران استفاده می‌شود.

### مراحل گام‌به‌گام:
1. وارد سایت [supabase.com](https://supabase.com) شوید و لاگین کنید (یا با گیت‌هاب اکانت رایگان بسازید).
2. روی دکمه **"New Project"** کلیک کنید.
3. یک نام دلخواه (مثلاً `bami-ai-equity`) و یک رمز عبور قوی برای دیتابیس انتخاب کرده و ریجن (Region) نزدیک (مانند Frankfurt یا Singapore) را انتخاب نمایید.
4. پس از ساخت پروژه، از منوی سمت چپ به بخش **SQL Editor** بروید.
5. روی **New Query** کلیک کنید.
6. تمامی محتویات فایل `supabase-schema.sql` (که در ریشه پروژه قرار داده‌ایم) را کپی کرده و در این کادر قرار دهید.
7. دکمه **Run** را بزنید تا جداول:
   - `bami_settings` (تنظیمات، مبالغ، قیمت سهام و متن‌ها)
   - `bami_phases` (۱۰ فاز کامل نقشه راه)
   - `investment_leads` (درخواست‌های رزرو سهام سرمایه‌گذاران)
   و سیاست‌های امنیتی RLS با موفقیت ساخته شوند.

### دریافت کلیدها جهت اتصال به برنامه:
- از منوی سمت چپ به **Project Settings** و سپس **API** بروید.
- دو مقدار زیر را کپی کنید:
  - **Project URL**: (مثلاً `https://abcdefghijklm.supabase.co`)
  - **Project API Keys -> `anon` `public`**: (یک رشته بلند با فرمت JWT)

> 💡 **نکته هوشمند**: شما می‌توانید این دو مقدار را مستقیماً در **پنل مدیریت بامی AI** در تب **تنظیمات پایگاه داده سوپابیس** وارد کرده و دکمه ذخیره را بزنید تا برنامه فوراً همگام شود. همچنین می‌توانید در فایل `.env` سرور این مقادیر را قرار دهید:
> ```env
> VITE_SUPABASE_URL="https://abcdefghijklm.supabase.co"
> VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
> ```

---

## 📌 بخش دوم: ارسال پروژه به گیت‌هاب (GitHub)

برای ارسال پروژه به ریپازیتوری گیت‌هاب شخصی خود:

```bash
# ۱. راه‌اندازی گیت در پوشه پروژه
git init

# ۲. اضافه کردن فایل‌ها
git add .

# ۳. کامیت اولیه
git commit -m "feat: complete Bami AI investor equity portal and admin panel"

# ۴. تعیین شاخه اصلی
git branch -M main

# ۵. متصل کردن به مخزن گیت‌هاب شما (آدرس ریپازیتوری خود را جایگزین کنید)
git remote add origin https://github.com/YOUR_USERNAME/bami-ai-equity.git

# ۶. پوش کردن کدها
git push -u origin main
```

---

## 📌 بخش سوم: استقرار و اجرای برنامه روی سرور مجازی (VPS)

### ۱. اتصال به سرور و نصب پیش‌نیازها (Node.js 20, Nginx, Git):
```bash
# به‌روزرسانی پکیج‌ها
sudo apt update && sudo apt upgrade -y

# نصب ابزارهای مورد نیاز
sudo apt install -y curl git nginx ufw certbot python3-certbot-nginx

# نصب Node.js نسخه 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# بررسی نسخه
node -v
npm -v
```

### ۲. کلون کردن مخزن و بیلد پروژه:
```bash
# رفتن به دایرکتوری وب
cd /var/www

# دریافت کدها از گیت‌هاب
git clone https://github.com/YOUR_USERNAME/bami-ai-equity.git bami-ai

cd bami-ai

# نصب وابستگی‌ها
npm install

# ساخت نسخه پروداکشن
npm run build
```
*(فایل‌های کامپایل شده نهایی در پوشه `/var/www/bami-ai/dist` قرار می‌گیرند).*

---

## 📌 بخش چهارم: پیکربندی دامنه `bami.modesk.org` در Nginx

### ۱. تنظیم DNS دامنه:
در کنترل پنل دامنه خود (کلودفلر یا ارائه‌دهنده هاست)، یک رکورد **A Record** بسازید:
- **Type**: `A`
- **Name**: `bami` (برای ساب‌دامنه `bami.modesk.org`)
- **IP Address**: `IP_سرور_مجازی_شما`
- **Proxy**: در صورت استفاده از کلودفلر، ابتدا DNS Only بگذارید تا سرتیفیکیت SSL نصب شود.

### ۲. ساخت فایل تنظیمات Nginx:
```bash
sudo nano /etc/nginx/sites-available/bami.modesk.org
```

کدهای زیر را داخل آن قرار دهید:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name bami.modesk.org;

    root /var/www/bami-ai/dist;
    index index.html;

    # بهینه‌سازی فشرده‌سازی Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # کشینگ فایل‌های استاتیک جهت سرعت بالا
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    access_log /var/log/nginx/bami_access.log;
    error_log /var/log/nginx/bami_error.log;
}
```

### ۳. فعال‌سازی سایت و تست Nginx:
```bash
# ایجاد لینک به sites-enabled
sudo ln -s /etc/nginx/sites-available/bami.modesk.org /etc/nginx/sites-enabled/

# تست تنظیمات
sudo nginx -t

# ریستارت انجین‌ایکس
sudo systemctl restart nginx
```

---

## 📌 بخش پنجم: فعال‌سازی رایگان SSL (HTTPS) با Let's Encrypt

برای اینکه وبسایت با قفل سبز `https://bami.modesk.org` باز شود:

```bash
sudo certbot --nginx -d bami.modesk.org
```
ایمیل خود را وارد کرده و قوانین را تایید کنید. سرتیفیکیت SSL به طور خودکار نصب و تمدید خودکار آن فعال می‌گردد.

---

## 🔐 راهنمای ورود به پنل مدیریت اختصاصی:

1. وارد وبسایت شوید (`https://bami.modesk.org`).
2. به انتهای صفحه (فوتر) اسکرول کنید.
3. در لیبل:
   > **تمامی حقوق مادی و معنوی Bami ai محفوظ است**
4. روی کلمه **Bami** دقیقاً **۴ بار پشت سر هم** کلیک کنید.
5. پنجره لاگین مدیریت باز می‌شود:
   - **نام کاربری**: `bamianai777`
   - **رمز عبور**: `Bai$$$nx`
6. با ورود به پنل، می‌توانید تمامی فازها، قیمت هر سهم، ارزش برنامه و لیدهای سرمایه‌گذاران را مدیریت نموده و با زدن دکمه **"ذخیره تغییرات"** بلافاصله در وبسایت اعمال نمایید.
