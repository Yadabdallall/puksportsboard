# بۆردی وەرزشی یەکێتیی نیشتمانیی کوردستان — Motion Video

A 14-second motion-graphics clip (1920×1080, 60 fps, MP4/H.264 with AAC audio)
for the PUK Sports Board.

**Output:** [`output/puk-sports-board-motion.mp4`](output/puk-sports-board-motion.mp4)

## What happens in the clip

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
├── index.html          # the whole animation: canvas, drawn as a pure function of time
├── render.mjs          # renders index.html frame by frame and encodes it with ffmpeg
├── audio/
│   ├── audio.py        # generates every sound effect and the music bed (no samples)
│   └── cues.json       # sound cue times exported from the animation timeline
├── assets/
│   ├── logo.png        # the Sports Board logo (transparent background)
│   └── fonts/          # Zain (SIL Open Font License, see OFL.txt)
└── output/
    └── puk-sports-board-motion.mp4   # sfx.wav is also written here but not committed
```

## Preview and editing

Serve the folder and open `index.html` to watch the animation live in a browser
(`npx serve motion-video`, or `python3 -m http.server` inside the folder).

These are the easy things to change, all near the top of `index.html`:

- **Text:** `TEXT_TITLE_1`, `TEXT_TITLE_2`, `TEXT_TAGLINE`
- **Timing:** the `T` object (run-up, kick, logo, title, slogan and outro times) and `DURATION`
- **Player kit colours:** `KIT`

## Rendering again

Requirements: Node 18+ with Playwright (`npm i playwright`), ffmpeg, and Python 3 with numpy and scipy.

```bash
cd motion-video
node render.mjs --cues audio/cues.json            # 1. export sound cue times
python3 audio/audio.py audio/cues.json output/sfx.wav   # 2. build the audio
node render.mjs --audio output/sfx.wav            # 3. render the video with sound
```

Other options:

- `node render.mjs --fps 30`: 30 fps
- `node render.mjs --out other.mp4`: a different output file
- `node render.mjs --stills 3,9`: PNG stills of chosen moments
- `FFMPEG=/path/to/ffmpeg node render.mjs`: use an ffmpeg that is not on your PATH

## Credits

- Font: [Zain](https://fonts.google.com/specimen/Zain), SIL Open Font License 1.1 (`assets/fonts/OFL.txt`)
- The player, ball, effects and all sounds are drawn or generated in code for this project.
