# PhoneBook (Android) — offline contacts vault

اپ دفترچه تلفن **کاملاً آفلاین** برای اندروید (بدون مجوز اینترنت). جزئیات کامل در [PRD.md](PRD.md).

## نصب روی گوشی
1. در GitHub بخش **Releases** همین repo → release با نام `phonebook-latest` → فایل **PhoneBook.apk** را دانلود کنید.
2. فایل را باز کنید و اگر خواست، «Install unknown apps» را برای مرورگر/فایل‌منیجر روشن کنید.
3. بار اول PIN بسازید (اثرانگشت اختیاری).

## پشتیبان
- خودکار: `Documents/PhoneBook/PhoneBook-auto-YYYY-MM-DD.json` (با حذف اپ پاک نمی‌شود).
- دستی: Settings → Backup & export (JSON, TXT, CSV, VCF, PDF, JPG).
- بازیابی: Settings → Restore / import → فایل JSON را انتخاب کنید.

## توسعه
```
npm ci
npm run check            # syntax check
cd www && python3 -m http.server 8123   # preview in a browser
PW_PATH=<playwright> node tests/e2e.mjs # browser smoke test
npx cap sync android     # copy www/ into the Android project
```
APK با GitHub Actions ساخته می‌شود (`.github/workflows/phonebook-apk.yml`).
