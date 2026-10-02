#!/usr/bin/env bash
# Make the 45 s film for one sport, picture, music and sound, in one go.
#
#   ./make_sport.sh football             -> output/sports/football.mp4 (4K, 60 fps)
#   ./make_sport.sh football stills      -> output/stills/football/*.png, to check the texts
#   SCALE=1.5 ./make_sport.sh judo       -> 3K
#   SCALE=0.5 FPS=30 ./make_sport.sh judo -> a quick 540p draft
#
# The sport must be in sports/sports.json with its texts (tagline, about,
# facts, phrase, accent). The film stays under MAXMB (29 MiB by default) so
# it can be sent straight from a chat.
set -euo pipefail
cd "$(dirname "$0")"
ID=${1:?usage: ./make_sport.sh <sport-id> [stills]}
SCALE=${SCALE:-2}
FPS=${FPS:-60}
PARTS=${PARTS:-$(nproc)}
MAXMB=${MAXMB:-29}
OUT=output/sports
TMP=$OUT/.work-$ID
mkdir -p "$OUT" "$TMP"

# Playwright and the instrument recordings from npm; numpy, scipy and ffmpeg from pip
if [ ! -d node_modules/playwright ] || [ ! -d node_modules/tonejs-instrument-violin-mp3 ]; then
  npm install --no-audit --no-fund --silent
fi
python3 -c 'import numpy, scipy, imageio_ffmpeg' 2>/dev/null || pip install -q numpy scipy imageio-ffmpeg
export FFMPEG=${FFMPEG:-$(python3 -c 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())')}

# 1. read the sport and write its sound cues; this stops with a clear message if anything is missing
node render.mjs --page sportfilm.html --query "sport=$ID" --cues "$TMP/cues.json"

if [ "${2:-}" = stills ]; then
  node render.mjs --page sportfilm.html --query "sport=$ID" --scale 0.5 --dir "output/stills/$ID" \
    --stills 2.6,9.5,14.2,18.2,23.5,29.0,35.5,41.5
  rm -rf "$TMP"
  exit
fi

# 2. the music, while the picture renders
python3 audio/sportfilm.py "$TMP/cues.json" "$TMP/audio.wav" > "$TMP/audio.log" 2>&1 &
AUDIO=$!

# 3. the picture, in parts rendered side by side and encoded as they go, with
# the bitrate capped so the film stays under MAXMB; the parts are then joined
# without encoding again
KBPS=$((MAXMB * 8 * 1024 * 1024 / 45 / 1000 * 92 / 100 - 320))
TOTAL=$((45 * FPS))
STEP=$(((TOTAL + PARTS - 1) / PARTS))
PIDS=()
: > "$TMP/parts.txt"
for ((i = 0; i < PARTS; i++)); do
  a=$((i * STEP))
  b=$(((i + 1) * STEP < TOTAL ? (i + 1) * STEP : TOTAL))
  node render.mjs --page sportfilm.html --query "sport=$ID" --scale "$SCALE" --fps "$FPS" --frames "$a:$b" \
    --jpeg 0.95 --cpu-canvas --preset medium --crf 14 --maxrate "${KBPS}k" --bufsize "$((KBPS * 2))k" --x264 aq-mode=3 \
    --out "$TMP/part$i.mp4" > "$TMP/part$i.log" 2>&1 &
  PIDS+=($!)
  echo "file 'part$i.mp4'" >> "$TMP/parts.txt"
done
echo "rendering $TOTAL frames of $ID in $PARTS parts..."
for p in "${PIDS[@]}"; do
  wait "$p" || { cat "$TMP"/part*.log; exit 1; }
done
wait $AUDIO || { cat "$TMP/audio.log"; exit 1; }
cat "$TMP/audio.log"

# 4. join the parts and add the music
"$FFMPEG" -y -loglevel error -f concat -safe 0 -i "$TMP/parts.txt" -i "$TMP/audio.wav" \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -movflags +faststart -shortest "$OUT/$ID.mp4"
rm -rf "$TMP"
echo "wrote $OUT/$ID.mp4 ($(du -m "$OUT/$ID.mp4" | cut -f1) MB)"
