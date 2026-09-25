# بۆردی وەرزشی یەکێتیی نیشتمانیی کوردستان — Motion Videos

Motion-graphics clips for the PUK Sports Board, all MP4/H.264 with AAC audio.

| Video | Format | Length | Source |
| --- | --- | --- | --- |
| [`output/puk-sports-board-3d.mp4`](output/puk-sports-board-3d.mp4): soft 3D sports objects, vertical for Reels and Stories | 1080×1920, 30 fps | 20 s | `sport3d.html`, `audio/sport3d.py` |
| [`output/puk-sports-board-motion.mp4`](output/puk-sports-board-motion.mp4): footballer kicks the ball into the logo | 1920×1080, 60 fps | 14 s | `index.html`, `audio/audio.py` |
| [`output/puk-sports-board-minimal.mp4`](output/puk-sports-board-minimal.mp4): minimal line art, no people | 1920×1080, 60 fps | 20 s | `minimal.html`, `audio/minimal.py` |

## 3D vertical video (20 s)

Soft, clay-like 3D objects in cream on deep green, rendered with three.js. It has
depth of field, soft shadows and a single glowing green accent. There are no
people in it. Each shot is two bars of the music (96 bpm):

| Time | Shot | Phrase |
| --- | --- | --- |
| 0 – 5 s | A row of hurdles rises from the floor, and a green ball bounces over them on the beat | هەر بەربەستێک، دەرفەتێکی نوێیە |
| 5 – 10 s | A football turns slowly while a small green light orbits it | وەرزش، زمانی هەموومانە |
| 10 – 15 s | Podium blocks 1-2-3 rise, and the green ball drops onto the top step | هەموو سەرکەوتنێک بە خەونێک دەست پێدەکات |
| 15 – 20 s | A cream circle wipe, then the logo inside gently turning rings | بۆردی وەرزشی · یەکێتیی نیشتمانیی کوردستان · پێکەوە بەرەو لووتکە |

The music is a warm eight-bar piece in C major with pad, bass, keys, a bell melody
and soft drums. Each ball bounce plays a rising marimba note, and the logo lands
on a chime.

## Minimal video (20 s)

Thin white line art on black and dark green, with one green accent. There are no
people in it, only sports objects. Each phrase has its own object:

| Time | Object | Phrase |
| --- | --- | --- |
| 0 – 4 s | A football pitch draws itself and a ball rolls to the centre spot | وەرزش ژیانە |
| 4 – 8.5 s | The camera dives into the centre circle, which becomes a stopwatch whose hand sweeps once | هەر هەنگاوێک سەرەتای سەرکەوتنێکە |
| 8.5 – 12.7 s | Five points fly in and join into a ball | پێکەوە بەهێزترین |
| 12.7 – 16.6 s | A trophy draws on, a star appears inside it, and a light sweeps across | ڕۆحی وەرزشی، ڕۆحی ئێمەیە |
| 16.6 – 20 s | A ring draws and the logo appears | بۆردی وەرزشی یەکێتیی نیشتمانیی کوردستان, then وەرزش بۆ هەمووان |

The sound is a calm pad and a soft arpeggio, with light effects: the ball rolling,
the stopwatch ticking, and the logo chime.

## Footballer video (14 s)

| Time | What you see |
| --- | --- |
| 0.0 – 0.9 s | Fade in from black on a black and dark-green background: stadium light beams, a honeycomb pattern, and green light streaks. The pitch lines draw in and a ball drops onto the pitch. |
| 0.9 – 2.9 s | A footballer in a green kit with a neon rim light runs in from the left and winds up to kick. |
| 2.9 s | The player strikes the ball. The ball flies off with a glowing trail. |
| 3.6 s | The ball bursts into the **logo**: a flash, shockwave rings and sparks. The logo spins in, orbit rings draw around it, and a shine passes over it. |
| 4.5 – 5.9 s | The title builds with a green bar wipe from right to left: **بۆردی وەرزشی**, then **یەکێتیی نیشتمانیی کوردستان**. |
| 5.9 – 7.0 s | The slogan **ئێمە بۆ خزمەت لێرەین** appears word by word in a green pill. |
| 7.0 – 14 s | Hold: the player points up at the logo and everything keeps moving gently. The clip then fades to black. |

All text uses the **Zain** font. It covers every Kurdish (Sorani) letter used here, including ێ ۆ ە.

## Files

```
motion-video/
├── index.html          # footballer video: canvas, drawn as a pure function of time
├── minimal.html        # minimal line-art video
├── sport3d.html        # 3D vertical video (three.js)
├── package.json        # three.js + Playwright (npm install)
├── render.mjs          # renders a page frame by frame and encodes it with ffmpeg
├── audio/
│   ├── audio.py        # sound for the footballer video (every sound generated, no samples)
│   ├── minimal.py      # sound for the minimal video
│   ├── sport3d.py      # music for the 3D video
│   └── *cues.json      # sound cue times exported from each animation timeline
├── assets/
│   ├── logo.png        # the Sports Board logo (transparent background)
│   └── fonts/          # Zain (SIL Open Font License, see OFL.txt)
└── output/
    ├── puk-sports-board-3d.mp4
    ├── puk-sports-board-motion.mp4
    └── puk-sports-board-minimal.mp4  # the .wav tracks are also written here but not committed
```

## Preview and editing

Serve the folder and open `index.html`, `minimal.html` or `sport3d.html` to watch an animation live in a browser
(`npx serve motion-video`, or `python3 -m http.server` inside the folder).

The same live preview works for `minimal.html`. There you edit the phrases in
`PHRASES`, `NAME` and `SUBLINE`, and the timing in `S`, `TXT` and `T`.

In `index.html`:

- **Text:** `TEXT_TITLE_1`, `TEXT_TITLE_2`, `TEXT_TAGLINE`
- **Timing:** the `T` object (run-up, kick, logo, title, slogan and outro times) and `DURATION`
- **Player kit colours:** `KIT`

## Rendering again

Requirements: Node 18+, ffmpeg, and Python 3 with numpy and scipy. Run `npm install`
in `motion-video/` to get three.js and Playwright.

```bash
cd motion-video
# 3D vertical video
node render.mjs --page sport3d.html --cues audio/sport3d-cues.json
python3 audio/sport3d.py audio/sport3d-cues.json output/sport3d-sfx.wav
node render.mjs --page sport3d.html --fps 30 --audio output/sport3d-sfx.wav --out output/puk-sports-board-3d.mp4

# footballer video
node render.mjs --cues audio/cues.json            # 1. export sound cue times
python3 audio/audio.py audio/cues.json output/sfx.wav   # 2. build the audio
node render.mjs --audio output/sfx.wav            # 3. render the video with sound

# minimal video
node render.mjs --page minimal.html --cues audio/minimal-cues.json
python3 audio/minimal.py audio/minimal-cues.json output/minimal-sfx.wav
node render.mjs --page minimal.html --audio output/minimal-sfx.wav --out output/puk-sports-board-minimal.mp4
```

Other options:

- `node render.mjs --fps 30`: 30 fps
- `node render.mjs --out other.mp4`: a different output file
- `node render.mjs --stills 3,9`: PNG stills of chosen moments
- `FFMPEG=/path/to/ffmpeg node render.mjs`: use an ffmpeg that is not on your PATH

## Credits

- Font: [Zain](https://fonts.google.com/specimen/Zain), SIL Open Font License 1.1 (`assets/fonts/OFL.txt`)
- The player, ball, effects and all sounds are drawn or generated in code for this project.
