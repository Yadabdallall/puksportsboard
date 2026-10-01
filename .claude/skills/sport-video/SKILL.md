---
name: sport-video
description: Make the PUK Sports Board's 45-second 2D motion film, with its own music, about one sport (motion-video/make_sport.sh, data in motion-video/sports/sports.json). Use when asked for a video about a sport (ڤیدیۆ بۆ وەرزشی ...), or when the prompt from motion-video/sports/PROMPT.md is pasted.
---

# One sport, one film

Each film is 45 s, vertical 9:16, 4K at 60 fps, in the board's colours (logo
green #129901, beige, petrol blue, a little ink), with music arranged for the
sport and sounds timed to the play. One template makes them all:
`motion-video/sportfilm.html` draws the picture, `motion-video/audio/sportfilm.py`
writes the music, and `motion-video/make_sport.sh` does both and the encode.

## Steps

1. **Get the generator.** Stay on the branch this session was given. If
   `motion-video/make_sport.sh` is missing, bring it in:
   `git fetch origin claude/motion-video-logo-player-p300dt && git merge --no-edit origin/claude/motion-video-logo-player-p300dt`.
2. **Find the sport** in `motion-video/sports/sports.json` by its Kurdish name,
   English name or id (`motion-video/sports/SPORTS.md` lists all of them).
   If it is not there, add an entry modelled on a similar sport (see
   *Fields of an entry*), then run `python3 motion-video/sports/make_list.py`.
3. **Write its texts** if it has none (`tagline`, `about`, `facts`, `phrase`,
   `accent`); see *Writing the texts*. Never invent a fact: if you can't vouch
   for a number, pick a different fact.
4. **Check the layout:** `cd motion-video && ./make_sport.sh <id> stills`, then
   look at every PNG in `output/stills/<id>/`. Texts must fit and not overlap,
   numbers must show correctly, the field and play must make sense. Fix and repeat.
5. **Build:** `./make_sport.sh <id>` (about 10–12 minutes on 4 cores). It
   installs what is missing (npm, pip), renders in parallel, writes the music
   and leaves `output/sports/<id>.mp4`, under 29 MiB so it can be sent.
6. **Deliver:** send the mp4 to the user (SendUserFile), then commit
   `sports/sports.json`, `sports/SPORTS.md` (if changed) and the mp4, and push.
   Reply in Kurdish (Sorani), briefly.

Draft quickly with `SCALE=0.5 FPS=30 ./make_sport.sh <id>` when trying changes.
`sportfilm.html?sport=<id>&draft` previews a sport that has no texts yet.

## Writing the texts

Kurdish Sorani in Arabic script, with Kurdish letters (ی ک ە ۆ ێ ڵ ڕ ڤ), never
Arabic ي ك ى. Digits inside texts in Kurdish digits (٠١٢٣٤٥٦٧٨٩). Dignified and
warm, the voice of an official sports body; no politics, no people's names.

- `tagline`: 2–5 words that say what the sport is about («یاریی یەکەمی جیهان»).
- `about`: two short lines (up to ~32 letters each) on how it is played; the
  first usually ends with a comma.
- `facts`: three `[number, label]` pairs. True, checkable numbers: players per
  side, match length, a field size, the year the rules were set, the Olympic
  debut. The number is written as a plain number (`3.05`, `1891`); the label
  starts with its unit when there is one («مەتر، بەرزیی سەبەتە»).
- `phrase`: two short lines, the first ending with a comma («تۆپێک،» /
  «هەزاران خەون»): inspiring, not a cliché.
- `accent`: one word of the phrase (without punctuation); it gets a blue tag.

## Fields of an entry

```json
{"id": "football", "ku": "تۆپی پێ", "en": "FOOTBALL", "cat": "ball", "kurdistan": true,
 "field": "pitch", "play": "pass", "gear": "football", "sfx": "ball", "mood": "energetic",
 "scoreWord": "گۆڵ!", "start": "whistle", ...texts}
```

- `kurdistan`: true if it is played in Kurdistan today; false shows «بەم زووانە
  لە کوردستان / لە داهاتوودا دێت».
- `field` (`name/variant`): pitch[/futsal|handball|beach|rugby|american|hockey|polo],
  court[/netball], net/volleyball|beach|tennis|badminton|squash|padel|pickleball|sitting,
  table[/billiard], diamond, oval, ring[/cage], mat/wrestling|judo|karate|taekwondo|sumo|gym|kabaddi,
  piste, track[/hurdles|velodrome|ice|turf], road[/rally|circuit|map|ice],
  pool[/diving|waterpolo], water[/surf], mountain[/snow|sky], wall, park[/dirt], arena,
  target/archery|shooting|darts, golf, lane[/curling|boules], stage, rink[/figure],
  sector[/jump], board[/checkers|go], bracket.
- `play` and the fields it works on: pass[/hoop|try] (pitch, court, rink,
  pool/waterpolo), rally[/bounce|high|shuttle] (net, table, pitch/handball),
  diamond (diamond), duel[/throw|fence] (ring, mat, piste), race (track, road,
  pool, water), shoot (target), arc[/golf|jump|cricket] (sector, golf, oval),
  roll/bowling|curling|boules|billiard (lane, table/billiard), board[/checkers|go]
  (board), flip (mat/gym, pool, rink/figure), lift (stage), climb (mountain,
  wall), course[/ski|fly] (water/surf, park, arena, mountain/snow|sky), bracket (bracket).
- `gear`, the icon (`sportfilm/glyphs.js`): football basketball volleyball
  handball baseball bat rugby hockey racket paddle shuttle glove belt laurel
  swords shoe stopwatch javelin shot barbell dumbbell rings swim oars sail bike
  flag mountain wing compass target golf eight pin boules stone ski skate
  horseshoe knight checker skateboard gamepad medal.
- `sfx`, the sounds of the play: ball hand bounce stick water racket pingpong
  shuttle bat glove body blade foot wheel motor hoof ice air metal mat wood
  digital arrow gun golf pins stone balls thud rock.
- `mood`, the music: energetic (team games, racing), heroic (combat,
  strength), elegant (precision, mind, water, gymnastics), adventure (outdoor,
  cycling, winter). Optional `"key": "D"` forces the key.
- Optional: `scoreWord` (pops up at the big moment), `start` (whistle, bell,
  gun, beep), `side` (players per side in a rally).

A sport that needs a new icon, field or play gets one in `sportfilm/*.js`, in
the same flat style; check it with the stills before the full build.
