# بۆردی وەرزش — ماڵپەڕ و ئەپی فەرمی
**PUK Sports Board — official website & app**

ماڵپەڕێکی نیۆنی ڕەش و سەوز بە سێ زمان (کوردی، عەرەبی، ئینگلیزی). هەواڵ و وێنەکان ڕۆژانە زیاد دەکرێن و ماڵپەڕەکە دەتوانرێت بکرێت بە ئەپ بۆ App Store و Google Play.

> ئامادەکراوە لە لایەن ڕاگەیاندنی بۆردی وەرزش

---

## پێکهاتە · What's inside

| فایل | چییە |
|---|---|
| `index.html` | هەموو ماڵپەڕەکە (بەشی سەرەوەی وەرزشەکان، هەواڵ، وەرزشەکان، وێنەکان، دەربارە، پەیوەندی) |
| `data/news.json` | **هەواڵەکان** — ڕۆژانە لێرە زیاد دەکرێن |
| `data/site.json` | دەربارە، ناونیشان، تەلەفۆن، ئیمەیڵ، سۆشیاڵ میدیا، وێنەی پاشبنەمای وەرزشەکان |
| `uploads/news/` | وێنەی هەواڵەکان |
| `uploads/sports/` | وێنەی پاشبنەمای وەرزشەکان (ئارەزوومەندانە) |
| `admin/` | پانێڵی نووسینی هەواڵ (Sveltia CMS) |
| `manifest.webmanifest`, `sw.js`, `assets/icons/` | ئەوانەی ماڵپەڕەکە دەکەن بە ئەپ (PWA) و بێ ئینتەرنێتیش کار دەکات |

وەرزشەکان (١٤): تۆپی پێ، فوتسال، تۆپی باڵە، تۆپی سەبەتە، تۆپی دەست، ڕاکردن، مەلەکردن، تێنسی سەر مێز، تێنسی سەر زەوی، زۆرانبازی، بۆکسێن، شاخەوانی، پاسکیلسواری، تایکواندۆ.

---

## ١. بڵاوکردنەوە · Publish (GitHub Pages — free)

1. ئەم لقە (branch) تێکەڵی `main` بکە.
2. لە GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save**.
3. دوای یەک دوو خولەک ماڵپەڕەکە لێرە دەبێت: `https://yadabdallall.github.io/puksportsboard/`

> Custom domain? Add it in **Settings → Pages → Custom domain**, then update `site_url` and `logo.src` in `admin/config.yml`.

---

## ٢. زیادکردنی هەواڵ و وێنە ڕۆژانە · Add news every day

### ڕێگای ئاسان: پانێڵی نووسین · The admin panel (recommended)

**یەکجار (One-time setup) — دروستکردنی تۆکن:**
1. GitHub → وێنەی پرۆفایل → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**
2. *Repository access*: **Only select repositories → `puksportsboard`**
3. *Permissions → Repository permissions → **Contents: Read and write***
4. **Generate token** و کۆپی بکە (لە شوێنێکی پارێزراو هەڵیبگرە).

**هەموو ڕۆژێک (Every day):**
1. بکەرەوە: `https://yadabdallall.github.io/puksportsboard/admin/`
2. **Sign In Using Access Token** → تۆکنەکە دابنێ.
3. **هەواڵەکان · News → هەواڵ · Story → Add** (هەواڵی نوێ لە سەرەوە زیاد دەبێت).
4. بەروار، وەرزش، وێنەی سەرەکی، وێنەی زیاتر، و سەردێڕ/پوختە/دەق بە کوردی (عەرەبی و ئینگلیزی ئارەزوومەندانەن — ئەگەر بەتاڵ بن کوردییەکە پیشان دەدرێت).
5. **Save** — ماڵپەڕ و ئەپەکە لە ماوەی یەک خولەکدا نوێ دەبنەوە.

- وێنە گەورەکانی مۆبایل خۆکار بچووک دەکرێنەوە و دەکرێن بە WebP.
- **لە سەرەوە بێت؟ (Pin to top)** — هەواڵەکە لە سەرووی لیستەکە دەمێنێتەوە.
- **ڕەشنووس (Draft)** — هەڵدەگیرێت بەڵام پیشان نادرێت.
- بۆ پەرەگرافی نوێ لە دەقی هەواڵدا، دێڕێکی بەتاڵ دابنێ.

### ڕێگای دووەم: ڕاستەوخۆ لە GitHub · Directly on GitHub
1. وێنەکان بار بکە بۆ `uploads/news/` (**Add file → Upload files**).
2. `data/news.json` بکەرەوە → ✏️ → هەواڵێکی نوێ لە سەرەتای لیستی `items` زیاد بکە:

```json
{
  "id": "2026-09-26-futsal-final",
  "date": "2026-09-26",
  "sport": "futsal",
  "image": "uploads/news/final-1.jpg",
  "gallery": ["uploads/news/final-2.jpg", "uploads/news/final-3.jpg"],
  "title_ku": "…", "summary_ku": "…", "body_ku": "…",
  "title_ar": "…", "summary_ar": "…", "body_ar": "…",
  "title_en": "…", "summary_en": "…", "body_en": "…"
}
```

`sport` values: `general`, `football`, `futsal`, `volleyball`, `basketball`, `handball`, `running`, `swimming`, `tabletennis`, `tennis`, `wrestling`, `boxing`, `mountain`, `cycling`, `taekwondo`.

---

## ٣. کردن بە ئەپ · Turn it into an App

**ئێستا:** ماڵپەڕەکە PWAـیە — لە مۆبایل بیکەرەوە و **Add to Home Screen** (iPhone: Share → Add to Home Screen) بکە، وەک ئەپ دەکرێتەوە و بێ ئینتەرنێتیش دوایین هەواڵە هەڵگیراوەکان پیشان دەدات.

**بۆ App Store و Google Play:**
1. بڕۆ بۆ **[pwabuilder.com](https://www.pwabuilder.com)** و لینکی ماڵپەڕەکە دابنێ.
2. **Package For Stores**:
   - **Android** → فایلێک بۆ Google Play Console (هەژماری گەشەپێدەر: ٢٥ دۆلار، یەکجار).
   - **iOS** → پرۆژەیەکی Xcode. پێویستی بە **Apple Developer Program** (٩٩ دۆلار ساڵانە) و کۆمپیوتەری **Mac** بە Xcode هەیە بۆ ناردن بۆ App Store.
3. ئایکۆن و وێنەی شاشەکان ئامادەن: `assets/icons/`، `assets/screenshots/`.

> Apple sometimes rejects apps that are "just a website" (guideline 4.2). Daily news, photo galleries, offline support and the installable app shell help — keep publishing regularly. An alternative wrapper is [Capacitor](https://capacitorjs.com) (`npx cap add ios`), which uses the same files.

هەر هەواڵێک لە پانێڵەکەوە زیاد بکەیت، **بێ نوێکردنەوەی ئەپەکە** لە ئەپیش دەردەکەوێت.

---

## ٤. گۆڕینی دەق و ڕێکخستنەکان · Editing texts & settings

- **دەربارە، ناونیشان، تەلەفۆن، ئیمەیڵ، فەیسبووک، ئینستاگرام، یوتیوب، تیکتۆک، تێلێگرام، X، واتسئەپ** → پانێڵ: **ڕێکخستنەکان · Settings** (یان `data/site.json`). ئەوانەی بەتاڵن پیشان نادرێن.
- **وێنەی پاشبنەمای وەرزشەکان** لە بەشی سەرەوە → **Settings → Hero background photos** (بە ڕەنگی سەوزی نیۆن پیشان دەدرێن).
- **ناوی وەرزشەکان و دەقی کورتیان** → `index.html` → لیستی `SPORTS`.
- **دەقەکانی ماڵپەڕ (مینیو، دوگمەکان، …)** → `index.html` → لیستی `T` (هەر دێڕێک: `[کوردی, عەرەبی, ئینگلیزی]`).
- ئەگەر `index.html` دەگۆڕیت، لە `sw.js` ژمارەی `VERSION` زیاد بکە (نموونە `psb-v2`) بۆ ئەوەی ئەپی سەر مۆبایلەکان نوێ ببێتەوە.

## Local preview

```bash
npx serve .      # then open http://localhost:3000
```
(Opening `index.html` directly from disk works for the design, but news loads only when served over http.)

---

## English summary

Single-page, framework-free site (`index.html`) with a full-viewport neon hero whose "planets" are 14 sports popular in Kurdistan and Sulaymaniyah. Each sport has a glowing field/court drawing, trilingual name and intro; the side orbs rotate through them (click, arrow keys or swipe). News, photos, contacts and optional hero photos are loaded from `data/*.json`, edited daily through the Sveltia CMS panel at `/admin/` (GitHub token sign-in, no server). A manifest + service worker make it installable, offline-capable, and ready for PWABuilder/Capacitor packaging for the App Store and Google Play. See `PROMPT.md` for the full design brief.
