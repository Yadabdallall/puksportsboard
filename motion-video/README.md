# بۆردی وەرزشی یەکێتیی نیشتمانیی کوردستان — Motion Videos

Motion-graphics clips for the PUK Sports Board, all MP4/H.264 with AAC audio.

| Video | Format | Length | Source |
| --- | --- | --- | --- |
| [`output/puk-sports-board-kurdistan.mp4`](output/puk-sports-board-kurdistan.mp4): the sports of Kurdistan (football, volleyball, basketball, and more) in soft 3D | 1080×1920, 30 fps | 30 s | `kurdistan3d.html`, `audio/kurdistan.py` |
| [`output/puk-sports-board-3d-cinematic.mp4`](output/puk-sports-board-3d-cinematic.mp4): soft 3D sports objects, vertical for Reels and Stories, with the cinematic score | 1080×1920, 30 fps | 20 s | `sport3d.html`, `audio/sport3d.py` |
| [`output/puk-sports-board-3d-warm.mp4`](output/puk-sports-board-3d-warm.mp4): the same picture with the warm, lighter music | 1080×1920, 30 fps | 20 s | `sport3d.html`, `audio/sport3d_warm.py` |
| [`output/puk-sports-board-motion.mp4`](output/puk-sports-board-motion.mp4): footballer kicks the ball into the logo | 1920×1080, 60 fps | 14 s | `index.html`, `audio/audio.py` |
| [`output/puk-sports-board-minimal.mp4`](output/puk-sports-board-minimal.mp4): minimal line art, no people | 1920×1080, 60 fps | 20 s | `minimal.html`, `audio/minimal.py` |

## Sports of Kurdistan (30 s)

This film uses the same 3D style as the video below, sharp with a softer glow. Each sport
gets two bars of a 96 bpm cinematic score made from the same instrument recordings
(A minor, resolving to C major on the logo). Every ball lands on the beat.

| Time | Shot | Label and phrase |
| --- | --- | --- |
| 0 – 5 s | A football, a volleyball and a basketball drop onto the floor, one per beat | وەرزش لە کوردستان · چیرۆکی هێز و یەکڕیزی |
| 5 – 10 s | A football is kicked into the goal and the net gives | دووگۆڵی · خەونێک کە لە هەموو کۆڵانێکدا دەژی |
| 10 – 15 s | A volleyball rallies over the net | بالە · پێکەوە، بەرزتر دەفڕین |
| 15 – 20 s | A basketball swishes through the hoop | باسکە · هەر هەوڵێک، خاڵێکی نوێیە |
| 20 – 25 s | Football, volleyball, basketball and tennis balls rise on pedestals | هەموو وەرزشێک، یەک ڕۆح |
| 25 – 30 s | A cream circle wipe, then the logo with the four balls drifting around it | بۆردی وەرزشی · یەکێتیی نیشتمانیی کوردستان · لە پاڵ هەموو وەرزشوانێکین |

It is rendered the same way as the 3D video below (`--page kurdistan3d.html --dof 0`,
four parts of 225 frames), with `audio/kurdistan.py` for the music.

## 3D vertical video (20 s)

Soft, clay-like 3D objects in cream on deep green, rendered with three.js. It has
soft shadows and a single glowing green accent. There are no people in it. It is
rendered sharp, with the depth-of-field blur turned off (`--dof 0`). The 3D is
antialiased (4× multisampling), the video is encoded at very high quality (CRF 10)
and the audio is 320 kbps. `--scale 2` renders it in 4K (2160×3840),
at about four times the render time. Each shot is two bars of the music (96 bpm):

| Time | Shot | Phrase |
| --- | --- | --- |
| 0 – 5 s | A row of hurdles rises from the floor, and a green ball bounces over them on the beat | هەر بەربەستێک، دەرفەتێکی نوێیە |
| 5 – 10 s | A football turns slowly while a small green light orbits it | وەرزش، زمانی هەموومانە |
| 10 – 15 s | Podium blocks 1-2-3 rise, and the green ball drops onto the top step | هەموو سەرکەوتنێک بەدیهێنانی خەونێکە، then, as the ball lands: و بۆردی وەرزشی هاوکار دەبێت لە بەدیهێنانی خەونەکانتان |
| 15 – 20 s | A cream circle wipe, then the logo inside gently turning rings | بۆردی وەرزشی · یەکێتیی نیشتمانیی کوردستان · پێکەوە بەرەو لووتکە |

There are two versions with the same picture and different music.

The main version has a cinematic score made from **real instrument recordings**: a Salamander
grand piano, violins, cello, contrabass and French horns. It is in D minor and resolves
to F major when the logo appears:

- **Hurdles:** a soft piano ostinato over a low contrabass.
- **Football:** the strings enter.
- **Podium:** horns and cello, with a heartbeat pulse building up.
- **Wipe:** a deep cinematic hit with a reversed piano swell.
- **Logo:** a harp glissando into the final chord.

Every bar was checked to land on its intended chord.

The warm version (`audio/sport3d_warm.py`) is a lighter, synthesised piece in C major.
Its ball bounces play marimba notes, and a bell melody runs over soft drums.

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
├── kurdistan3d.html    # 30 s sports-of-Kurdistan film (same 3D engine)
├── package.json        # three.js + Playwright (npm install)
├── render.mjs          # renders a page frame by frame and encodes it with ffmpeg
├── patch_video.py      # splices a re-rendered keyframe interval into a finished video
├── audio/
│   ├── audio.py        # sound for the footballer video (every sound generated, no samples)
│   ├── minimal.py      # sound for the minimal video
│   ├── sport3d.py      # cinematic score for the 3D video
│   ├── sport3d_warm.py # warm alternative music for the 3D video
│   ├── kurdistan.py    # score for the sports-of-Kurdistan film
│   └── *cues.json      # sound cue times exported from each animation timeline
├── assets/
│   ├── logo.png        # the Sports Board logo (transparent background)
│   └── fonts/          # Zain (SIL OFL, see OFL.txt) and DejaVu Sans Bold for the podium digits
└── output/
    ├── puk-sports-board-kurdistan.mp4
    ├── puk-sports-board-3d-cinematic.mp4
    ├── puk-sports-board-3d-warm.mp4
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

Requirements: Node 18+, ffmpeg, and Python 3 with numpy, scipy and imageio-ffmpeg.
`patch_video.py` also needs PyAV. Run `npm install` in `motion-video/` to get three.js,
Playwright and the instrument samples.

```bash
cd motion-video
# 3D vertical video: render the picture once, then add each score
node render.mjs --page sport3d.html --cues audio/sport3d-cues.json
python3 audio/sport3d.py audio/sport3d-cues.json output/sport3d-sfx.wav
python3 audio/sport3d_warm.py audio/sport3d-cues.json output/sport3d-warm-sfx.wav
# four processes render 150 lossless frames each (~12 min; add --scale 2 for 4K, ~75 min)
for k in 0 1 2 3; do
  node render.mjs --page sport3d.html --dof 0 --fps 30 --frames $((k*150)):$((k*150+150)) --lossless --out part$k.mkv &
done; wait
printf "file 'part%d.mkv'\n" 0 1 2 3 > parts.txt
ffmpeg -f concat -i parts.txt -c:v libx264 -preset slow -crf 10 -pix_fmt yuv420p -profile:v high \
  -x264-params aq-mode=3 picture.mp4
for v in cinematic:sport3d-sfx warm:sport3d-warm-sfx; do
  ffmpeg -i picture.mp4 -i output/${v#*:}.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k \
    -shortest -movflags +faststart output/puk-sports-board-3d-${v%%:*}.mp4
done
# If only one shot changed (e.g. its text): render just the keyframe interval around it with
# --lossless, encode it with the same x264 settings as picture.mp4, and splice it in
# (patch_video.py lists the keyframes if the range doesn't line up):
#   python3 patch_video.py output/puk-sports-board-3d-cinematic.mp4 part.mp4 FIRST_FRAME picture.mp4
# ...then run the audio loop above again

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
- Podium digits ١ ٢ ٣: DejaVu Sans Bold, Bitstream Vera licence (`assets/fonts/DejaVu-LICENSE.txt`). Zain draws Arabic-Indic digits in Western shapes.
- Piano (3D video): Salamander Grand Piano V3 by Alexander Holm, CC-BY 3.0, via the `@audio-samples/piano-mp3-*` npm packages
- Strings, horn and harp (3D video): [tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments) by Nicholaus Brosowsky, CC-BY 3.0, via the `tonejs-instrument-*-mp3` npm packages
- Everything else (the player, ball, 3D objects, effects and the other videos' sounds) is drawn or generated in code for this project.
