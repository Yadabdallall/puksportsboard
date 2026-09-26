# بۆردی وەرزش — ماڵپەڕ و ئەپی فەرمی
**PUK Sports Board — official website & app**

ماڵپەڕێکی نیۆنی سپی و سەوزی کاڵ بە سێ زمان (کوردی، عەرەبی، ئینگلیزی) و بە فۆنتی **Zain**. هەواڵ و وێنەکان ڕۆژانە لە پانێڵێکی قفڵکراوەوە زیاد دەکرێن، و ماڵپەڕەکە دەتوانرێت بکرێت بە ئەپ.

> ئامادەکراوە لە لایەن ڕاگەیاندنی بۆردی وەرزش

---

## پێکهاتە · What's inside

| فایل | چییە |
|---|---|
| `index.html` | هەموو ماڵپەڕەکە: بەشی سەرەوەی وەرزشەکان، دوگمەی **جۆرەکانی وەرزش** لە سەرەوە، هەواڵ، وێنەکان، دەربارە، پەیوەندی |
| `admin/` | **پانێڵی بەڕێوەبردن بە قفڵ** — زیادکردن / دەستکاری / سڕینەوەی هەواڵ و وێنە |
| `cloudflare/worker.js` | **Workerـی Cloudflare** — کۆدەکە دەپشکنێت و هەواڵ، ڕێکخستن و وێنەکان لە بنکەدراوەی **D1**ـی Cloudflare هەڵدەگرێت |
| `data/news.json`, `data/site.json` | کۆپیی سەرەتایی (پێش ئەوەی یەکەم هەواڵ لە پانێڵەکەوە بڵاو بکەیتەوە) |
| `manifest.webmanifest`, `sw.js`, `assets/icons/` | ئەپ (PWA) و کارکردن بێ ئینتەرنێت |

**بەشەکانی هەواڵ (١٦):** تۆپی پێ، فوتسال، تۆپی باڵە، تۆپی سەبەتە، تۆپی دەست، ڕاکردن، مەلەکردن، تێنسی سەر مێز، تێنسی سەر زەوی، زۆرانبازی، بۆکسێن، شاخەوانی، پاسکیلسواری، تایکواندۆ، **هەمەڕەنگ** (فیستیڤاڵ، کار و چالاکی) و **گشتی** (ڕاگەیاندنی بۆرد).

---

## ١. ڕێکخستنی Cloudflare · Setup (بەخۆڕایی، تەنها یەکجار)

هەموو شتێک لە ناو Cloudflareـدایە، **GitHub پێویست نییە**:
- **Pages** — فایلەکانی ماڵپەڕەکە (زیپەکە).
- **Worker** — ناونیشانی سەرەکیی ماڵپەڕەکە. کۆدی قفڵ دەپشکنێت و هەواڵەکان هەڵدەگرێت.
- **D1** — بنکەدراوە بۆ هەواڵ، ڕێکخستن و وێنەکان.

هەموو هەنگاوەکان لە [dash.cloudflare.com](https://dash.cloudflare.com) دەکرێن، لە مۆبایلیش.

### ١) ماڵپەڕەکە (Pages)
**Workers & Pages → Create → Pages → Upload assets** ← ناوێک ← زیپەکە باربکە ← **Deploy**.
ناونیشانەکەی بنووسە، بۆ نموونە `https://oukils.pages.dev`.

### ٢) بنکەدراوە (D1)
**Storage & Databases → D1 SQL Database → Create** ← ناو: `puk-db` ← **Create**.

### ٣) Worker
1. **Workers & Pages → Create → Worker** (Start with Hello World) ← ناو: `puk-sports` ← **Deploy**.
2. **Edit code** ← هەموو کۆدەکە بسڕەوە.
3. لە مۆبایلەکەت بکەرەوە: `https://<ماڵپەڕەکەت>.pages.dev/cloudflare/worker.js` ← هەمووی کۆپی بکە ← بیخە ناو ئێدیتەرەکە ← **Deploy**.
4. **Settings → Bindings → Add → D1 database** ← Variable name: `DB` ← `puk-db` ← **Save**.
5. **Settings → Variables and Secrets → Add**:
   - Type **Secret** ← Name: `ADMIN_CODE` ← Value: کۆدی قفڵ (بۆ نموونە `sport2026`)
   - Type **Text** ← Name: `SITE_ORIGIN` ← Value: ناونیشانی Pages (بۆ نموونە `https://oukils.pages.dev`)
   - **Deploy**
6. ئێستا ناونیشانی Workerـەکە **ماڵپەڕە سەرەکییەکەتە**: `https://puk-sports.<ناوی-هەژمار>.workers.dev`
   - ئەم ناونیشانە بە خەڵک بدە و بۆ ئەپەکە بەکاری بهێنە.
   - دۆمەینی خۆت: **Worker → Settings → Domains & Routes → Add → Custom domain**.

> ناونیشانی `pages.dev` ڕاستەوخۆ تەنها کۆپیی سەرەتایی پیشان دەدات. هەواڵە نوێکان لە ڕێگەی ناونیشانی Workerـەکەوە دەردەکەون.

### نوێکردنەوەی ماڵپەڕەکە دواتر
زیپی نوێ لە هەمان پرۆژەی Pages بار بکە (**Create new deployment**). هەواڵەکان لە D1دان، بۆیە هیچیان ناسڕێنەوە.

---

## ٢. قفڵ و زیادکردنی هەواڵ · The lock & daily news

لە خوارەوەی ماڵپەڕەکە دوگمەی **🔒 بەڕێوەبردن** هەیە (`https://puk-sports.….workers.dev/admin/`). کۆدەکە لە ناو Workerـەکەدا دەپشکنرێت، نەک لە پەڕەکەدا.

### هەموو ڕۆژێک
1. **🔒 بەڕێوەبردن** ← کۆدەکە بنووسە ← **کردنەوە**
2. **١. بەش هەڵبژێرە** (بۆ نموونە تۆپی پێ، هەمەڕەنگ…) ← هەواڵەکە لەو بەشەدا دەردەکەوێت.
3. **٢. وێنە زیاد بکە** (لە مۆبایل ڕاستەوخۆ کامێراش دەکرێتەوە). یەکەم وێنە دەبێتە وێنەی سەرەکی، و وێنەکان خۆکار بچووک دەکرێنەوە.
4. **٣. دەق** بە کوردی بنووسە. عەرەبی و ئینگلیزی ئارەزوومەندانەن.
5. **بڵاوکردنەوە** — لە ماوەی نزیکەی یەک خولەکدا لە ماڵپەڕ و ئەپەکەدا دەردەکەوێت.

- **هەواڵەکان**: دەستکاری یان سڕینەوەی هەواڵە کۆنەکان.
- **ڕێکخستنەکان**: دەربارە، تەلەفۆن، ئیمەیڵ، سۆشیاڵ میدیا، **ڤیدیۆ یان وێنەی ڕاستەقینەی هەر وەرزشێک**، **گۆڕینی کۆد**.

### ڤیدیۆی ڕاستەقینە بۆ هەر وەرزشێک
وێنەی ئامادەکراو بۆ هەر ١٤ وەرزشەکە لە `assets/sports/`دان (بۆکسێن دوو وێنەی هەیە و بە نۆرە پیشان دەدرێن). هەر وێنە یان ڤیدیۆیەک لە پانێڵەکەوە بۆ هەمان وەرزش دابنێیت، جێگەی دەگرێتەوە.
لە **ڕێکخستنەکان ← ڤیدیۆ یان وێنەی ڕاستەقینەی هەر وەرزشێک**: وەرزشەکە هەڵبژێرە ← **+ ڤیدیۆ یان وێنە** ← **پاشەکەوتکردن**.
- ڤیدیۆی کورت (٥–١٥ چرکە)، MP4، کەمتر لە ٢٤ مێگابایت. بێدەنگ و بەردەوام لە بەشی سەرەوە دەجووڵێت.
- ڤیدیۆی بەخۆڕایی و یاسایی: [pexels.com/videos](https://www.pexels.com/videos/)، [pixabay.com/videos](https://pixabay.com/videos/)، [mixkit.co](https://mixkit.co/free-stock-video/) — یان ڤیدیۆی خۆتان لە یارییەکان.
- تەنها ڤیدیۆی ئەو وەرزشەی دیارە باردەکرێت، بۆیە لە مۆبایلیش سووکە.
- پانێڵەکە دوای ٣٠ خولەک بێ جوڵە خۆی قفڵ دەکات.

### ئاسایش · Security notes
- کۆدەکە تەنها لە ناو Workerـەکەدا (Secret) و بە شێوەی شفرەکراو هەڵدەگیرێت و لە ماڵپەڕەکەدا دیار نییە.
- دوای ٨ جار کۆدی هەڵە، ئەو ئامێرە بۆ ١٥ خولەک ڕێگری لێدەکرێت.
- چوونەژوورەوە ١٢ کاتژمێر دەمێنێت. گۆڕینی کۆد هەموو چوونەژوورەوە کۆنەکان هەڵدەوەشێنێتەوە.
- `sport2026` کۆدێکی کورتە. باشترە کۆدێکی درێژتر بەکاربهێنیت: **ڕێکخستنەکان ← گۆڕینی کۆد**، یان لە Cloudflare `ADMIN_CODE` بگۆڕە.
- پاشەکەوتکردنێک کە لەسەر کۆپییەکی کۆن بێت ڕەت دەکرێتەوە و پانێڵەکە خۆی دووبارە هەوڵ دەداتەوە، بۆیە دوو کەس پێکەوە دەتوانن کار بکەن.

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

Framework-free site (`index.html`, Zain font) with a hero of 14 sports popular in Kurdistan, each on a real photo. News sections are the 14 sports plus Miscellaneous and General. Storage is Cloudflare only: the static site is a Pages project; `cloudflare/worker.js` is a Worker (bindings: D1 `DB`; vars: secret `ADMIN_CODE`, text `SITE_ORIGIN`) that proxies the Pages site, checks the admin code server-side (rate-limited, HMAC session tokens), stores news/settings as revisioned JSON (409 on stale writes) and photos/videos in 1 MB D1 chunks served with Range support. The site reads `/api/news` and `/api/site`, falling back to `data/*.json`. Manifest + service worker make it installable and offline-capable.
