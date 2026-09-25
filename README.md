# بۆردی وەرزش — ماڵپەڕ و ئەپی فەرمی
**PUK Sports Board — official website & app**

ماڵپەڕێکی نیۆنی ڕەش و سەوز بە سێ زمان (کوردی، عەرەبی، ئینگلیزی) و بە فۆنتی **Zain**. هەواڵ و وێنەکان ڕۆژانە لە پانێڵێکی قفڵکراوەوە زیاد دەکرێن، و ماڵپەڕەکە دەتوانرێت بکرێت بە ئەپ.

> ئامادەکراوە لە لایەن ڕاگەیاندنی بۆردی وەرزش

---

## پێکهاتە · What's inside

| فایل | چییە |
|---|---|
| `index.html` | هەموو ماڵپەڕەکە: بەشی سەرەوەی وەرزشەکان، هەواڵ، بەشەکان، وێنەکان، دەربارە، پەیوەندی |
| `admin/` | **پانێڵی بەڕێوەبردن بە قفڵ** — زیادکردن / دەستکاری / سڕینەوەی هەواڵ و وێنە |
| `data/news.json` | هەواڵەکان |
| `data/site.json` | دەربارە، ناونیشان، تەلەفۆن، ئیمەیڵ، سۆشیاڵ میدیا، وێنەی پاشبنەمای وەرزشەکان |
| `data/admin.json` | کلیلی GitHub، بە کۆدی قفڵەکە شفرەکراوە (دوای ڕێکخستنی یەکەمجار دروست دەبێت) |
| `uploads/` | وێنەکان |
| `manifest.webmanifest`, `sw.js`, `assets/icons/` | ئەپ (PWA) و کارکردن بێ ئینتەرنێت |

**بەشەکانی هەواڵ (١٦):** دووگۆڵی، فوتسال، تۆپی باڵە، تۆپی سەبەتە، تۆپی دەست، ڕاکردن، مەلەکردن، تێنسی سەر مێز، تێنسی سەر زەوی، زۆرانبازی، بۆکسێن، شاخەوانی، پاسکیلسواری، تایکواندۆ، **هەمەڕەنگ** (فیستیڤاڵ، کار و چالاکی) و **گشتی** (ڕاگەیاندنی بۆرد).

---

## ١. بڵاوکردنەوە · Publish (GitHub Pages — بەخۆڕایی)

1. ئەم لقە (branch) تێکەڵی `main` بکە.
2. لە GitHub: **Settings → Pages → Deploy from a branch → `main` / `(root)` → Save**.
3. دوای یەک دوو خولەک ماڵپەڕەکە لێرە دەبێت: `https://yadabdallall.github.io/puksportsboard/`

---

## ٢. قفڵ و زیادکردنی هەواڵ · The lock & daily news

لە خوارەوەی ماڵپەڕەکە دوگمەی **🔒 بەڕێوەبردن** هەیە (یان ڕاستەوخۆ `…/puksportsboard/admin/`).

### ڕێکخستنی یەکەمجار (تەنها یەکجار، ٢ خولەک)
ماڵپەڕەکە سێرڤەری نییە، بۆیە کلیلێکی GitHub پێویستە بۆ ئەوەی هەواڵەکان پاشەکەوت بکات. ئەم کلیلە بە کۆدی قفڵەکە شفرە دەکرێت.

1. لە پانێڵەکە کلیک لە **«ڕێکخستنی قفڵ (یەکەمجار)»** بکە.
2. بە هەژماری GitHubـی خاوەنی ماڵپەڕەکە بڕۆ بۆ [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new):
   - **Expiration**: ماوەیەکی درێژ (بۆ نموونە ساڵێک)
   - **Repository access** → **Only select repositories** → `puksportsboard`
   - **Permissions** → **Contents** → **Read and write**
   - **Generate token** → کۆپی بکە.
3. تۆکنەکە لە پانێڵەکە دابنێ، و **کۆدی قفڵ** بنووسە (دووجار) → **پاشەکەوتکردن و کردنەوە**.

### هەموو ڕۆژێک
1. **🔒 بەڕێوەبردن** ← کۆدەکە بنووسە ← **کردنەوە**
2. **١. بەش هەڵبژێرە** (بۆ نموونە دووگۆڵی، هەمەڕەنگ…) ← هەواڵەکە لەو بەشەدا دەردەکەوێت.
3. **٢. وێنە زیاد بکە** (لە مۆبایل ڕاستەوخۆ کامێراش دەکرێتەوە). یەکەم وێنە دەبێتە وێنەی سەرەکی، و وێنەکان خۆکار بچووک دەکرێنەوە.
4. **٣. دەق** بە کوردی بنووسە. عەرەبی و ئینگلیزی ئارەزوومەندانەن.
5. **بڵاوکردنەوە** — لە ماوەی نزیکەی یەک خولەکدا لە ماڵپەڕ و ئەپەکەدا دەردەکەوێت.

- **هەواڵەکان**: دەستکاری یان سڕینەوەی هەواڵە کۆنەکان.
- **ڕێکخستنەکان**: دەربارە، تەلەفۆن، ئیمەیڵ، سۆشیاڵ میدیا، وێنەی پاشبنەمای وەرزشەکان، **گۆڕینی کۆد**.
- پانێڵەکە دوای ٣٠ خولەک بێ جوڵە خۆی قفڵ دەکات.

### ئاسایش · Security notes
- کۆدەکە خۆی لە هیچ شوێنێک هەڵناگیرێت. تەنها کلیلی GitHub، شفرەکراو بە AES-256 (PBKDF2، 600,000 خول)، لە `data/admin.json`دا هەیە.
- ئەم فایلە گشتییە، بۆیە هێزی قفڵەکە بەندە بە **درێژی و نەزانراوی کۆدەکە**. بە کەس مەیدە و کاتێک پێویست بوو بیگۆڕە (ڕێکخستنەکان ← گۆڕینی کۆد).
- ئەگەر گومانت هەبوو کۆدەکە ئاشکرا بووە، تۆکنەکە لە GitHub بسڕەوە (Settings → Developer settings → Personal access tokens) و ڕێکخستنی یەکەمجار دووبارە بکەرەوە. هەر گۆڕانکارییەک لە GitHubدا مێژووی هەیە و دەگەڕێنرێتەوە.
- کاتێک تۆکنەکە بەسەردەچێت، پانێڵەکە ئاگادارت دەکاتەوە. تۆکنێکی نوێ دروست بکە و «ڕێکخستنی قفڵ» دووبارە بکەرەوە.

---

## ٣. کردن بە ئەپ · Turn it into an App — بەخۆڕایی؟

| ڕێگا | نرخ | تێبینی |
|---|---|---|
| **ئەپی وێب (PWA)**: لە iPhone و Android، ماڵپەڕەکە بکەرەوە ← **Add to Home Screen** | **بەخۆڕایی** | ئایکۆنی خۆی هەیە، وەک ئەپ دەکرێتەوە و بێ ئینتەرنێتیش کار دەکات. پێویستی بە ستۆر نییە. |
| **APK بۆ Android** لە [pwabuilder.com](https://www.pwabuilder.com) | **بەخۆڕایی** | دروستکردنی بەخۆڕاییە. دەتوانیت فایلەکە ڕاستەوخۆ بڵاو بکەیتەوە (بێ Google Play). |
| **Google Play** | ٢٥ دۆلار، یەکجار | هەمان فایلی PWABuilder. |
| **App Store (iPhone)** | ٩٩ دۆلار، ساڵانە | پێویستی بە کۆمپیوتەری **Mac** و Xcode هەیە. ڕێگای بەخۆڕایی نییە، تەنها ئەپڵ بۆ هەندێک ڕێکخراوی ناقازانج و دامەزراوەی حکومی لە وڵاتانی دیاریکراو **لێخۆشبوون** دەدات (Apple Developer fee waiver). |

> Apple may reject apps that are only a website (guideline 4.2). Daily news, photo galleries and offline support help. [Capacitor](https://capacitorjs.com) is an alternative wrapper that uses the same files.

هەواڵە نوێکان **بێ نوێکردنەوەی ئەپەکە** تێیدا دەردەکەون.

---

## ٤. گۆڕینی دەق · Editing texts in code

- **ناوی وەرزشەکان و دەقی کورتیان** → `index.html` → لیستی `SPORTS` (و ناوەکان لە `admin/index.html` → `CATS`).
- **دەقەکانی ماڵپەڕ** → `index.html` → لیستی `T` (هەر دێڕێک: `[کوردی, عەرەبی, ئینگلیزی]`).
- ئەگەر `index.html` دەگۆڕیت، لە `sw.js` ژمارەی `VERSION` زیاد بکە (بۆ نموونە `psb-v3`) بۆ ئەوەی ئەپەکە لەسەر مۆبایلەکان نوێ ببێتەوە.

## Local preview

```bash
npx serve .      # then open http://localhost:3000
```

---

## English summary

Framework-free site (`index.html`, Zain font throughout) with a neon hero whose "planets" are 14 sports popular in Kurdistan and Sulaymaniyah. News sections are the 14 sports plus Miscellaneous (festivals, work, activities) and General. Content lives in `data/*.json` and is edited in `/admin/`, a code-locked panel: a fine-grained GitHub token (Contents: read/write on this repo only) is encrypted in the browser with the lock code (PBKDF2-SHA256 600k → AES-GCM) and stored as `data/admin.json`. Entering the code decrypts it, and each publish is one atomic commit (photos resized to JPEG ≤1600px + JSON), retried on concurrent edits. The manifest and service worker make it installable and offline-capable, ready for PWABuilder/Capacitor. See `PROMPT.md` for the full brief.
