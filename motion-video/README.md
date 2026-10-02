# بۆردی وەرزشی یەکێتیی نیشتمانیی کوردستان — Motion Videos

Motion-graphics clips for the PUK Sports Board, all MP4/H.264 with AAC audio.

| Video | Format | Length | Source |
| --- | --- | --- | --- |
| `output/sports/<sport>.mp4` (not in git; sent in the chat): one film per sport, made from one template (`./make_sport.sh <sport>`) | 2160×3840 (4K), 60 fps | 45 s | `sportfilm.html`, `audio/sportfilm.py` |
| [`output/puk-sports-board-editorial-4k.mp4`](output/puk-sports-board-editorial-4k.mp4): boxing, volleyball and table tennis as an editorial poster (paper, ink, red and the board's green) | 2160×3840 (4K), 30 fps | 30 s | `editorial.html`, `audio/trio.py` |
| [`output/puk-sports-board-trio-3k.mp4`](output/puk-sports-board-trio-3k.mp4): boxing, volleyball and table tennis in soft 3D | 1620×2880 (3K), 30 fps | 30 s | `trio3d.html`, `audio/trio.py` |
| [`output/puk-sports-board-kurdistan.mp4`](output/puk-sports-board-kurdistan.mp4): the sports of Kurdistan (football, volleyball, basketball, and more) in soft 3D | 1080×1920, 30 fps | 30 s | `kurdistan3d.html`, `audio/kurdistan.py` |
| [`output/puk-sports-board-kurdistan-3k.mp4`](output/puk-sports-board-kurdistan-3k.mp4): the same film in 3K (`--scale 1.5`) | 1620×2880, 30 fps | 30 s | `kurdistan3d.html`, `audio/kurdistan.py` |
| [`output/puk-sports-board-3d-cinematic.mp4`](output/puk-sports-board-3d-cinematic.mp4): soft 3D sports objects, vertical for Reels and Stories, with the cinematic score | 1080×1920, 30 fps | 20 s | `sport3d.html`, `audio/sport3d.py` |
| [`output/puk-sports-board-3d-warm.mp4`](output/puk-sports-board-3d-warm.mp4): the same picture with the warm, lighter music | 1080×1920, 30 fps | 20 s | `sport3d.html`, `audio/sport3d_warm.py` |
| [`output/puk-sports-board-motion.mp4`](output/puk-sports-board-motion.mp4): footballer kicks the ball into the logo | 1920×1080, 60 fps | 14 s | `index.html`, `audio/audio.py` |
| [`output/puk-sports-board-minimal.mp4`](output/puk-sports-board-minimal.mp4): minimal line art, no people | 1920×1080, 60 fps | 20 s | `minimal.html`, `audio/minimal.py` |

## Sport films (45 s, 4K): one template for every sport

`./make_sport.sh football` makes a 45 s vertical film about one sport, picture, music and
sound, with nothing to edit by hand. Every sport in [`sports/sports.json`](sports/sports.json)
can have one; [`sports/SPORTS.md`](sports/SPORTS.md) lists all 113 of them in 17 categories,
marked ✅ played in Kurdistan or 🔜 coming. [`sports/PROMPT.md`](sports/PROMPT.md) is a
ready prompt to paste into a new Claude Code session to get the film for any sport; the steps
behind it are in `.claude/skills/sport-video/SKILL.md` at the root of the repository.

- **Look:** flat 2D motion graphics in the logo's green (#129901), beige, petrol blue and a
  little ink, with a fine paper grain, quiet shapes drifting behind, and a blue sheet with a
  green edge sweeping across on every cut. Every number is in Latin digits.
- **Story, on the bars of the music (96 bpm):**
  - 0–5 s: the sport's icon drops into a green disc; its Kurdish and English names, a tagline
    and its category.
  - 5–15 s: «چۆن یاری دەکرێت؟», the field drawn out from the centre and a play on the beat:
    passes and a goal, a rally over the net, a run round the bases, a duel, a race, arrows on a
    target, a lift, a climb, a chess game... with the score word («گۆڵ!») at the big moment and
    two lines on how it is played.
  - 15–25 s: «بە ژمارە», three facts counted up in Latin digits, and the sport's names
    running along a blue band.
  - 25–32.5 s: a two-line phrase on the green, word by word, the key word in a blue tag.
  - 32.5–37.5 s: a turning globe, «وەرزش بۆ هەمووان», «بیناسە و تاقی بکەرەوە» and «بۆ
    ناساندنی یارییەکانی جیهان بە هەموو تاکێک»: the films introduce the world's games to everyone.
  - 37.5–45 s: the logo with rings on the beat, the sport's icon orbiting, and «هەمیشە پشتیوانتانین».
- **Music:** arranged per sport from the same real instruments as the other films. The
  sport's mood sets the harmony and the instruments: energetic (driving piano,
  four-on-the-floor), heroic (minor, low strings, horns, taiko-like drums, a major ending),
  elegant (piano, harp, strings) or adventure (lydian lift, horn melody, harp). The key comes
  from the sport, so two sports never sound alike. The play's own sounds land on its moments:
  kicks, bounces, racket hits, punches, splashes, clanks, a whistle or the ring bell at the start.
- **Data:** each sport in `sports.json` names its field, play, icon, sound family and mood, and
  carries its texts. The drawings are in `sportfilm/glyphs.js` (44 icons), `sportfilm/fields.js`
  (25 fields, courts, tracks and boards) and `sportfilm/plays.js` (14 plays).
- **Build:** `make_sport.sh` renders four parts side by side while the music is written (about
  7 minutes for 4K at 60 fps on 4 cores). Each part grabs JPEG frames from a software canvas,
  which reads back far faster than PNG at 4K, and is encoded as it renders with a bitrate cap,
  so the parts are simply joined and the film stays under 29 MiB. The films are delivered in the
  chat and kept out of git. `./make_sport.sh <sport> stills` renders check stills only, and
  `sportfilm.html?sport=<id>&draft` previews a sport whose texts aren't written yet.

## Editorial poster film (30 s, 4K)

This film tells the boxing, volleyball and table tennis story in a completely different style
from the others:
- **Look:** warm paper with a fine grain, ink black, red and the board's own green (#129901) on a
  quiet six-column grid.
- **Pictures:** flat graphic illustrations with print-style offset shadows.
- **Type:** giant outlined chapter words drifting behind, outlined chapter numbers 01–05 with
  solid sport tags, and phrases that slide in word by word. The key word gets a green tag swept
  in behind it, turning it white with a soft glow.
- **Transitions:** colour-block wipes (the next colour, ink, then green) on every bar line.
- **End card:** the logo inside a ring of turning lettering (PUK SPORTS BOARD • BOXING • VOLLEYBALL •
  TABLE TENNIS), with the three sport badges orbiting it.

It runs on the same timeline as `trio3d.html`, so `audio/trio.py` (score, punches, spike and
rally) fits it exactly. Because the film is 2D it renders fast: 4K (`--scale 2`) takes about two minutes.

## Boxing, volleyball and table tennis (30 s, 3K)

This film uses the 3D engine of the other films. The props are soft cream leather with deep
green trim, and the phrases have a soft glow. Since the stock-photo sites are blocked in this
environment, the photo film below was made in 3D instead, with the same text.

| Time | Shot | Label and phrase |
| --- | --- | --- |
| 0 – 5 s | A pair of boxing gloves hangs from a peg, swaying | بۆکسێن · هێز لە دڵەوە دەست پێدەکات |
| 5 – 10 s | A glove strikes a heavy bag on the beat, three times | ڕاهێنان · ئارەقەی ئەمڕۆ، سەرکەوتنی سبەینێیە |
| 10 – 15 s | A volleyball is set and spiked over the net | بالە · هەر خاڵێک، بە یەکڕیزی دەبرێتەوە |
| 15 – 20 s | A table-tennis rally down the length of the table, a hit on every beat | تێنسی سەر مێز · خێرایی و هێمنی، لە یەک کاتدا |
| 20 – 25 s | A glove, a volleyball and a bat rise on pedestals | یەکڕیزی · وەرزش، شانازیی کوردستانە |
| 25 – 30 s | A cream wipe, then the logo with the props drifting around it | بۆردی وەرزشی · یەکێتیی نیشتمانیی کوردستان · هەمیشە لە پاڵتانین |

`audio/trio.py` is the elegant B minor score from `audio/photos.py`, with the props' sounds
added: leather punches with the chain, the spike, and the table-tennis clicks.

## Photo film (30 s, waiting for photos)

`photos.html` is a vertical photo film with five stock photos from Unsplash or Pexels in
`assets/photos/01.jpg` to `05.jpg`. Each photo gets a slow camera move, a dark-green
grade, a light sweep at the cut and a glowing Kurdish phrase, and the film ends on the
logo. It renders in 3K with `--scale 1.5`. `audio/photos.py` is its score (B minor to
D major, from the same instrument recordings). Until the photos are added, it shows
placeholders.

| Photo | Label | Phrase |
| --- | --- | --- |
| 1 boxing | بۆکسێن | هێز لە دڵەوە دەست پێدەکات |
| 2 volleyball | بالە | هەر خاڵێک، بە یەکڕیزی دەبرێتەوە |
| 3 table tennis | تێنسی سەر مێز | خێرایی و هێمنی، لە یەک کاتدا |
| 4 training (boxing) | ڕاهێنان | ئارەقەی ئەمڕۆ، سەرکەوتنی سبەینێیە |
| 5 team (volleyball) | یەکڕیزی | وەرزش، شانازیی کوردستانە |
| end | | بۆردی وەرزشی · یەکێتیی نیشتمانیی کوردستان · هەمیشە لە پاڵتانین |

## Sports of Kurdistan (30 s)

This film uses the same 3D style as the video below, sharp with a softer glow. Each sport
gets two bars of a 96 bpm score made from the same instrument recordings
(A minor, resolving to C major on the logo). The score is restrained: a lyrical piano melody
over broken chords, long strings, and horns only at the end. Every scene change and text
reveal has a soft whoosh, and every ball lands on the beat.

| Time | Shot | Label and phrase |
| --- | --- | --- |
| 0 – 5 s | A football, a volleyball and a basketball drop onto the floor, one per beat | وەرزش لە کوردستان · چیرۆکی هێز و یەکڕیزی |
| 5 – 10 s | A football is kicked into the goal; the net stops it and it drops to rest | تۆپی پێ · خەونێک کە لە هەموو کۆڵانێکدا دەژی |
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
├── trio3d.html         # 30 s boxing / volleyball / table tennis film (same 3D engine)
├── editorial.html      # the same story as an editorial poster (2D)
├── photos.html         # 30 s photo film template (needs assets/photos/)
├── sportfilm.html      # 45 s 2D film for any sport (?sport=<id>)
├── sportfilm/          # its icons (glyphs.js), fields (fields.js) and plays (plays.js)
├── sports/
│   ├── sports.json     # every sport: names, category, Kurdistan or coming, look, sound, texts
│   ├── SPORTS.md       # the list in Kurdish, made by make_list.py
│   └── PROMPT.md       # the prompt to paste for a new sport film
├── make_sport.sh       # one command: picture, music and encode for one sport
├── package.json        # three.js + Playwright (npm install)
├── render.mjs          # renders a page frame by frame and encodes it with ffmpeg
├── patch_video.py      # splices a re-rendered keyframe interval into a finished video
├── audio/
│   ├── audio.py        # sound for the footballer video (every sound generated, no samples)
│   ├── minimal.py      # sound for the minimal video
│   ├── sport3d.py      # cinematic score for the 3D video
│   ├── sport3d_warm.py # warm alternative music for the 3D video
│   ├── kurdistan.py    # score for the sports-of-Kurdistan film
│   ├── photos.py       # score for the photo film
│   ├── trio.py         # score and prop sounds for the boxing / volleyball / table tennis film
│   ├── sportfilm.py    # music and play sounds for the sport films, arranged per sport
│   └── *cues.json      # sound cue times exported from each animation timeline
├── assets/
│   ├── logo.png        # the Sports Board logo (transparent background)
│   └── fonts/          # Zain (SIL OFL, see OFL.txt) and DejaVu Sans Bold for the podium digits and chess pieces
└── output/
    ├── sports/         # one film per sport, e.g. football.mp4 (not in git)
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
# a sport film: everything in one command (see sports/SPORTS.md for the ids)
./make_sport.sh football

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
- The chess pieces and the podium digits ١ ٢ ٣ of the 3D video: DejaVu Sans Bold, Bitstream Vera licence (`assets/fonts/DejaVu-LICENSE.txt`). Zain draws Arabic-Indic digits in Western shapes.
- Piano (3D, Kurdistan, trio and sport films): Salamander Grand Piano V3 by Alexander Holm, CC-BY 3.0, via the `@audio-samples/piano-mp3-*` npm packages
- Strings, horn and harp (the same films): [tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments) by Nicholaus Brosowsky, CC-BY 3.0, via the `tonejs-instrument-*-mp3` npm packages
- Everything else (the player, ball, 3D objects, effects and the other videos' sounds) is drawn or generated in code for this project.
