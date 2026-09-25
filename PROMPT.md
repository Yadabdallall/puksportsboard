# پڕۆمتی نوێ — بۆردی وەرزش (لە جیاتی SpaceEdu)

ئەمە پڕۆمتی SpaceEdu-یە کە گۆڕدراوە بۆ بۆردی وەرزش. لە جیاتی هەسارەکان وەرزشەکان هاتوون، ماڵپەڕەکە بە سێ زمانە، ڕەنگەکانی ڕەش و سەوزی نیۆنن و هەواڵەکانیشی داینامیکن.
ماڵپەڕەکە بەپێی ئەم پڕۆمتە دروستکراوە: `index.html`.

---

```text
Build the official website of the PUK SPORTS BOARD (بۆردی وەرزش — Patriotic Union of Kurdistan,
President Mam Jalal Secretary Office, Sulaymaniyah). Framework-free: one index.html with all CSS in one
<style> in <head> and all JS in one <script> before </body>. No build step, no external JS on the public
site. Content comes from JSON files so the media team can publish news and photos every day, and the site
must be installable as an app and packageable for the App Store / Google Play.

════════════════════════════════════════════════════════════════════════
1. CONCEPT
════════════════════════════════════════════════════════════════════════
A cinematic full-viewport hero on a black / deep-green neon stadium. Centred: an eyebrow ("وەرزش" /
"رياضة" / "SPORT"), a huge glowing gradient sport name, a short neon rule, a paragraph, and a glossy neon
pill button ("هەواڵەکان ببینە" → the news). Flanking the pill, cropped by the left and right screen edges,
sit two glowing neon ORBS (a ring with the sport's line icon in the visible half) with labels.

Instead of 3 planets there are 14 sports popular in Kurdistan and Sulaymaniyah, in this order:
football (تۆپی پێ), futsal (فوتسال), volleyball (تۆپی باڵە), basketball (تۆپی سەبەتە),
handball (تۆپی دەست), running (ڕاکردن), swimming (مەلەکردن), table tennis (تێنسی سەر مێز),
tennis (تێنسی سەر زەوی), wrestling (زۆرانبازی), boxing (بۆکسێن), mountaineering (شاخەوانی),
cycling (پاسکیلسواری), taekwondo (تایکواندۆ). Each has a name and a 1–2 sentence intro in Kurdish,
Arabic and English. Exactly one is featured; the side orbs show its neighbours in a ring
(previous / next — mirrored in RTL). Clicking an orb, pressing ←/→ or swiping the hero features that
sport. Football is featured on load. The rotation is fully reversible.

The backdrop of each sport is NOT a video: it is that sport's field drawn as neon lines in inline SVG
(pitch, futsal/handball court, volleyball/basketball/tennis court, running track, pool lanes, table,
wrestling mat, boxing ring, topographic mountain contours, velodrome, taekwondo octagon), laid on the floor
in 3D perspective (rotateX ≈ 63°), glowing with drop-shadows and fading towards the horizon. Behind it:
radial green gradient, two slowly drifting aurora blobs, two faint stadium light beams, rising sparks,
a vignette. Optional per-sport photo (from data/site.json) is shown under the lines with a green duotone
filter. Featured field cross-fades (.35s); the others are visibility:hidden so they skip paint.

At the bottom of the hero, glowing: "ئامادەکراوە لە لایەن ڕاگەیاندنی بۆردی وەرزش"
(ar: "إعداد: إعلام مجلس الرياضة", en: "Prepared by the Sports Board Media"). The same credit closes the
page footer, large and neon, with all three languages listed under it.

Below the hero the page scrolls: News → Sports → Photos → About + Contact → Footer. The nav is fixed
and turns into a blurred solid bar once the page scrolls; a scroll-spy moves the neon underline.

════════════════════════════════════════════════════════════════════════
2. ASSETS
════════════════════════════════════════════════════════════════════════
· Logo: the round green PUK Sports Board emblem (transparent PNG) → assets/img/logo.png (512),
  logo-160.png (nav/footer), icons 192/512, maskable 512 (dark-green glow background),
  apple-touch-icon 180, favicons 32/48, og-image 1200x630.
· All sport artwork = one inline SVG sprite of 48x48 stroke icons (<symbol id="i-<sport>">) + the
  per-sport field drawings generated from compact JS. Both orbs contain ALL 14 icons as sibling <svg>s;
  switching only toggles .is-shown — never re-create or re-point an image, so the swap is same-frame.

════════════════════════════════════════════════════════════════════════
3. FONT (Google Fonts)
════════════════════════════════════════════════════════════════════════
ALL text uses one typeface: Zain (weights 300/400/700/800/900). It covers Arabic, every Kurdish
Sorani letter (ڕ ڵ ێ ۆ ە ڤ) and Latin. Zain draws small for its size, so type is set ~15–20% larger
than usual (hero title 140u, lede 21–22u, body copy 17.5–20px). :root:lang(ckb), :root:lang(ar) set
--ls:0 — Arabic script is never letter-spaced (every tracking value is calc(N * var(--u) * var(--ls))).

════════════════════════════════════════════════════════════════════════
4. DESIGN SYSTEM
════════════════════════════════════════════════════════════════════════
Keep the SpaceEdu unit system for the hero: one design pixel --u measured from a 1353 x 1163 reference,
every hero length is calc(N * var(--u)), the same --u / --dh-px / --vshift formulas (use 100svh inside
@supports so the scrolling page doesn't resize with the mobile URL bar). --gutter is 0.
Colours: --black #010403, deep greens #03140b → #0e6a36, --neon #39ff8f, --neon-hi #9dffc8,
ink #effff5, button ink #02140a. Neon = layered text-shadow / drop-shadow in rgba(57,255,143,…).
Gradient text: headline and section titles use background-clip:text (white → mint → neon) with the
glow as a filter on the PARENT so the entrance mask never clips it.
Sections below the hero use normal responsive units (clamp / px) on a faint neon grid background.

════════════════════════════════════════════════════════════════════════
5. RESPONSIVE — the same six tiers, same order
════════════════════════════════════════════════════════════════════════
A nav collapse (≤1030px or ≤620px tall; the same links + the language switch re-compose into a panel)
· B tablet (re-proportioned, orb / pill / orb row survives) · C phone (hero flows as a flex column)
· D no scroll button under 660px tall · E short landscape · F narrow phone (labels drop to a band under
the pill). The headline auto-fits (JS sets --fit when a long name like "تێنسی سەر زەوی" or
"MOUNTAINEERING" would overflow). The stage uses overflow:clip so focusing a half-hidden orb can never
scroll it sideways. The page never scrolls horizontally from 320px to 2560px.

════════════════════════════════════════════════════════════════════════
6. ENTRANCE — as SpaceEdu (runs once, then deletes itself)
════════════════════════════════════════════════════════════════════════
Blocking head script adds .anim (unless prefers-reduced-motion) and also picks the language before first
paint. Same DRAW / REVEAL / RISE / SETTLE / FADE sequence; orbs settle at .98s/1.02s; the hero credit
flickers on like a neon tube at 1.5s. After 2150ms <html> carries neither .anim nor .play.

════════════════════════════════════════════════════════════════════════
7. THREE LANGUAGES
════════════════════════════════════════════════════════════════════════
Kurdish (Sorani, lang="ckb", RTL, default), Arabic (ar, RTL), English (en, LTR). Segmented switch
"کوردی · عربي · EN" in the nav (and inside the mobile panel). All UI strings live in one table
T = { key: [ku, ar, en] }; sports in SPORTS = [{k, n:[ku,ar,en], d:[ku,ar,en]}]. Switching updates
lang/dir, title, meta description, every [data-i18n] node, the hero, news, dates and numbers, and is
remembered in localStorage; ?lang=ckb|ar|en overrides. Kurdish dates/numbers are formatted by hand
(Kurdish month names, Arabic-Indic digits) because many browsers ship no ckb locale data.

════════════════════════════════════════════════════════════════════════
8. DYNAMIC CONTENT (no server)
════════════════════════════════════════════════════════════════════════
data/news.json  { "items": [ { id, date "YYYY-MM-DD", sport (key or "general"), featured, draft,
                  image, gallery[], title_ku, summary_ku, body_ku, title_ar, …, body_en } ] }
data/site.json  { founded, about_ku/ar/en, address_ku/ar/en, phone, email, facebook, instagram,
                  youtube, tiktok, telegram, x, whatsapp, hero_photos: [ { sport, image } ] }
Each story belongs to ONE section: one of the 14 sports, "هەمەڕەنگ" (misc — festivals, work and
activities) or "گشتی" (general — board announcements). Missing translations fall back to Kurdish.
Sorted newest first; a "featured" story leads.
News: filter chips (only sports that have stories), lead card spanning the row, cards with photo or a
neon placeholder, sport tag, photo count, "more" button. Reader = <dialog> deep-linked as #news/<id>
(Back closes it), photo viewer with thumbnails and arrows, share (Web Share / copy link).
Sections grid (16 tiles: 8+8 on desktop, 4 on tablets, 3 on phones) filters the news; tapping a
sport also features it in the hero. Photos section = latest photos from the news.
About = emblem with a spinning neon ring, text, stats (14 sports · founded · stories · 3 languages),
contacts and social links (only the ones filled in).
Editing: a 🔒 "بەڕێوەبردن" button in the footer opens /admin/, a lock screen in the same neon style.
Only whoever knows the lock code can publish. No server: at one-time setup a fine-grained GitHub token
(Contents: read/write, this repository only) is encrypted in the browser with the code
(PBKDF2-SHA256, 600,000 iterations → AES-256-GCM) and committed as data/admin.json. The code itself is
never stored. Unlocking decrypts the token in memory, and the panel auto-locks after 30 minutes idle;
wrong codes back off exponentially.
Panel tabs: New story (1. pick the section from 16 icon tiles — required; 2. photos with camera
support, first = main, ★ to promote, resized in-browser to JPEG ≤1600px; 3. Kurdish text + optional
Arabic / English; pin to top; draft) · Stories (edit / delete; photos no longer used are removed) ·
Settings (about, address, phone, email, 7 social links, per-sport hero photos, change code).
Every save is ONE atomic commit through the Git Data API (blobs → tree → commit → move branch),
re-reading the JSON at the new head and retrying if someone else committed in between.
All text is rendered with textContent / escaped; URLs are sanitised (no javascript: / data:).

════════════════════════════════════════════════════════════════════════
9. APP
════════════════════════════════════════════════════════════════════════
manifest.webmanifest (name, RTL, standalone, theme #020805, any + maskable icons, wide + narrow
screenshots, news shortcut) and sw.js (app-shell precache; network-first for pages and data/*.json so
news is always fresh; stale-while-revalidate for images and fonts; never caches /admin/). iOS meta tags,
viewport-fit=cover and env(safe-area-inset-*) padding. "Install app" button on beforeinstallprompt.
Package with PWABuilder (Android + iOS) or Capacitor.

════════════════════════════════════════════════════════════════════════
10. ACCESSIBILITY
════════════════════════════════════════════════════════════════════════
Orbs are real <button>s with "پیشاندانی <sport>" / "عرض …" / "Show …" labels and a neon focus ring.
Skip link to the news. Burger: aria-expanded / aria-label, closes on outside click, Escape (focus
returns) and link click. Reduced motion: no entrance, no drift / sparks / spinning rings, no hover
transforms, instant scrolling.

════════════════════════════════════════════════════════════════════════
11. ACCEPTANCE CHECKS
════════════════════════════════════════════════════════════════════════
· Loads with FOOTBALL featured; exactly one icon visible in each orb.
· Clicking an orb swaps the orb icon in the same frame (<2ms), no flash of the previous sport.
· 14 steps forward (or back-and-forth) returns to the exact initial state.
· Field, headline, lede, both orbs and both labels update together; language switch keeps the sport.
· body never scrolls horizontally from 320px to 2560px, in all three languages.
· Entrance runs once; afterwards <html> carries neither .anim nor .play.
· Adding a story in /admin/ (code required) shows it on the site and in the installed app, in its
  section, without changing any code. A wrong code never unlocks the panel.
```
