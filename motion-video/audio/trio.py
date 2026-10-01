#!/usr/bin/env python3
"""Score for trio3d.html (boxing, volleyball, table tennis), from real recordings.

Twelve bars at 96 bpm (2.5 s each, 30 s) in B minor, resolving to D major on
the logo: Bm G D A twice, then Em G A D. A piano melody over quiet broken
chords, strings from the second photo, horns as a warm pad at the end, soft
whooshes on every photo change and a harp into the logo.

The same elegant B minor piece as audio/photos.py, plus the props' sounds:
leather punches with a rattle of chain, the spike, and the table-tennis rally.

    node render.mjs --page trio3d.html --cues audio/trio-cues.json
    python3 audio/trio.py audio/trio-cues.json output/trio-sfx.wav
"""
import json
import sys
import wave

import numpy as np
from scipy import signal

from sport3d import (BAR, BEAT, SR, bandpass, bass, boom, cello, hall_ir, harp, highpass, horn, lowpass, midi,
                     piano, rng, secs, swell, violin)

# chord per bar: ostinato root (unused), minor?, left-hand root, bass note, violins
BARS = [
    ('B3', True, 'B1', 'B1', ['B4', 'F#5']),  # a soft string chord under the opening
    ('G3', False, 'G1', 'G1', ['B4', 'D5']),
    ('D4', False, 'D2', 'D2', ['A4', 'D5', 'F#5']),
    ('A3', False, 'A1', 'A1', ['A4', 'C#5', 'E5']),
    ('B3', True, 'B1', 'B1', ['B4', 'D5', 'F#5']),
    ('G3', False, 'G1', 'G1', ['B4', 'D5', 'G5']),
    ('D4', False, 'D2', 'D2', ['A4', 'D5', 'F#5', 'A5']),
    ('A3', False, 'A1', 'A1', ['A4', 'C#5', 'E5', 'A5']),
    ('E4', True, 'E2', 'E2', ['G4', 'B4', 'E5', 'G5']),
    ('G3', False, 'G1', 'G1', ['B4', 'D5', 'F#5', 'B5']),
    ('A3', False, 'A1', 'A1', ['A4', 'C#5', 'E5', 'A5']),
    ('D4', False, 'D2', 'D2', ['A4', 'D5', 'F#5', 'A5']),
]
CELLO = {3: 'F#3', 4: 'E3', 5: 'D3', 6: 'D3', 7: 'F#3', 8: 'E3', 9: 'E3', 10: 'D3', 11: 'C#3', 12: 'D3'}
# horns only as a warm pad in the last bars
HORN = [(9, 0, 'G3', 4), (9, 0, 'B3', 4), (10, 0, 'G3', 4), (10, 0, 'D4', 4), (11, 0, 'A3', 4), (11, 0, 'E4', 4),
        (12, 0, 'F#3', 4), (12, 0, 'A3', 4), (12, 0, 'D4', 4)]
# the piano melody: (bar, beat, note, beats)
MELODY = [(2, 0, 'B4', 2), (2, 2, 'D5', 2), (3, 0, 'F#5', 3), (3, 3, 'E5', 1), (4, 0, 'E5', 2), (4, 2, 'C#5', 2),
          (5, 0, 'D5', 2), (5, 2, 'F#5', 1), (5, 3, 'B5', 1), (6, 0, 'B5', 2), (6, 2, 'A5', 1), (6, 3, 'G5', 1),
          (7, 0, 'F#5', 3), (7, 3, 'A5', 1), (8, 0, 'E5', 2), (8, 2, 'C#5', 2), (9, 0, 'G5', 2), (9, 2, 'B5', 1),
          (9, 3, 'G5', 1), (10, 0, 'F#5', 2), (10, 2, 'D5', 2), (11, 0, 'E5', 2), (11, 2, 'A5', 2)]


def punch():
    """A glove on a heavy bag: a deep thump, the leather slap and the chain."""
    t = secs(0.6)
    thump = np.sin(2 * np.pi * np.cumsum(55 + 70 * np.exp(-t / 0.03)) / SR) * np.exp(-t / 0.09)
    slap = bandpass(rng.standard_normal(len(t)), 500, 3000) * np.exp(-t / 0.018)
    chain = bandpass(rng.standard_normal(len(t)), 4000, 9000) * np.exp(-np.maximum(t - 0.05, 0) / 0.12) * (t > 0.05)
    x = np.tanh(1.5 * thump) + 0.55 * slap / np.abs(slap).max() + 0.12 * chain / np.abs(chain).max()
    return np.stack([x, x], axis=1)


def pok(freq, decay=0.025):
    """A table-tennis ball on a bat or the table: a short, hollow click."""
    t = secs(0.12)
    x = np.sin(2 * np.pi * freq * t) * np.exp(-t / decay) + 0.4 * np.sin(2 * np.pi * freq * 2.3 * t) * np.exp(-t / (decay / 2))
    x += 0.3 * bandpass(rng.standard_normal(len(t)), 2000, 8000) * np.exp(-t / 0.004)
    return np.stack([x, x], axis=1)


def hand():
    """A hand spiking a volleyball, and the same ball hitting the floor."""
    t = secs(0.25)
    body = np.sin(2 * np.pi * np.cumsum(180 * (0.7 + 0.3 * np.exp(-t / 0.01))) / SR) * np.exp(-t / 0.04)
    snap = bandpass(rng.standard_normal(len(t)), 1200, 6000) * np.exp(-t / 0.015)
    x = body + 0.7 * snap / np.abs(snap).max()
    return np.stack([x, x], axis=1)


def air(dur, lo, hi):
    """Soft rushing air (the ball's flight, the net's swish)."""
    t = secs(dur)
    n = bandpass(rng.standard_normal((len(t), 2)), lo, hi)
    return n / np.abs(n).max() * np.sin(np.pi * t / dur)[:, None] ** 2


def main(cue_path, out_path):
    cues = json.load(open(cue_path))
    dur = cues['duration']
    n = int(SR * dur)
    stems = {k: np.zeros((n, 2)) for k in ('piano', 'strings', 'brass', 'bass', 'perc', 'fx')}
    bar_t = lambda b, beat=0.0: (b - 1) * BAR + beat * BEAT

    def put(stem, x, at, gain=1.0, pan=0.0):
        i = int(round(at * SR))
        if i >= n:
            return
        if i < 0:
            x, i = x[-i:], 0
        x = x[:n - i] * gain
        l, r = np.cos((pan + 1) * np.pi / 4) * np.sqrt(2), np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)
        stems[stem][i:i + len(x), 0] += x[:, 0] * l
        stems[stem][i:i + len(x), 1] += x[:, 1] * r

    human = lambda: rng.normal(0, 0.006)

    # piano: quiet broken chords (root, fifth, tenth, fifth) and a lyrical melody
    for b, (root, minor, lh, _, _) in enumerate(BARS, start=1):
        if b == 12:
            break
        base = midi(lh) + 12
        third = 15 if minor else 16
        vel = 5 if b <= 2 else 9
        for k, step in enumerate([0, 7, third, 12]):
            put('piano', piano[vel].play(base + step, dur=BEAT * 1.6, release=1.2), bar_t(b, k) + human(),
                0.34 if k else 0.42, -0.25)
    for b, beat, nm, length in MELODY:
        put('piano', piano[9].play(nm, dur=length * BEAT * 0.95, release=1.4), bar_t(b, beat) + human(), 0.5, 0.15)
    for nm in ('D2', 'A2', 'D3', 'F#4', 'A4', 'D5', 'F#5'):
        put('piano', piano[9].play(nm, dur=2.2, release=1.5), bar_t(12) + abs(human()), 0.36)
    put('piano', piano[5].play('A5', dur=1.0, release=1.2), bar_t(12, 2), 0.3, 0.25)
    put('piano', piano[5].play('D6', dur=1.0, release=1.3), bar_t(12, 3), 0.28, 0.3)

    # strings: three detuned players per note; contrabass under everything from bar 2
    for b, (_, _, _, bs, vn) in enumerate(BARS, start=1):
        for j, nm in enumerate(vn or []):
            for det, dly, pan in [(-6, 0.0, -0.45), (5, 0.018, 0.1), (0, 0.034, 0.5)]:
                x = violin.play(nm, dur=BAR + 0.15, attack=0.7 if b > 3 else 1.1, release=0.9, detune=det)
                put('strings', x, bar_t(b) + dly - 0.05, 0.12 * (0.8 if b == 3 else 1.0), pan - 0.1 * j)
        if b >= 2:
            put('bass', bass.play(bs, dur=BAR + 0.1, attack=0.3, release=0.6), bar_t(b) - 0.03, 0.55 if b > 2 else 0.35, -0.1)
    for b, nm in CELLO.items():
        for det, dly, pan in [(-4, 0.0, -0.3), (4, 0.022, 0.2)]:
            put('strings', cello.play(nm, dur=min(2.4, BAR), attack=0.25, release=0.5, detune=det), bar_t(b) + dly, 0.2, pan)
    for b, beat, nm, length in HORN:
        for det, dly, pan in [(-5, 0.0, -0.25), (5, 0.025, 0.25)]:
            put('brass', horn.play(nm, dur=length * BEAT, attack=0.6, release=0.8, detune=det), bar_t(b, beat) + dly - 0.04, 0.11, pan)


    # percussion kept to a few soft, deep hits
    for at, size, g in [(bar_t(5), 0.8, 0.22), (bar_t(9), 0.9, 0.28), (cues['wipe'], 1.2, 0.45), (bar_t(12), 1.0, 0.3)]:
        put('perc', boom(size), at, g)

    # transitions: a soft whoosh into every scene change and under every text reveal
    for c in cues['cuts']:
        put('fx', air(0.9, 250, 3500), c - 0.5, 0.2, 0.3)
    for p in cues['phrases']:
        put('fx', air(0.6, 1200, 7000), p - 0.15, 0.07, -0.2)
    put('fx', swell(2.4), cues['wipe'] - 2.4, 0.16)
    rev = sum(piano[12].play(nm, dur=2.2, release=0.2) for nm in ('E2', 'B2', 'G3', 'D4'))[::-1]
    put('fx', rev, cues['wipe'] - len(rev) / SR, 0.24)
    gl = ['D4', 'E4', 'F#4', 'A4', 'B4', 'D5', 'E5', 'F#5', 'A5', 'D6']
    for k, nm in enumerate(gl):
        put('fx', harp.play(nm, dur=1.5, release=1.0), cues['logo'] - 0.34 + k * 0.034, 0.17, -0.5 + k / 9)

    # the props
    for i, p in enumerate(cues['punches']):
        put('fx', punch(), p, 0.42 - 0.04 * i, -0.15)
    put('fx', hand(), cues['spike'], 0.3, -0.2)
    put('fx', hand(), cues['spikeLand'], 0.26, 0.3)
    for i, h in enumerate(cues['ppHits']):
        put('fx', pok(1300 + 60 * (i % 2), 0.03), h, 0.24, -0.3 if i % 2 == 0 else 0.25)
    for b in cues['ppBounces']:
        put('fx', pok(2300, 0.018), b, 0.18, 0.0)
    for p in cues['pedestals']:
        t0 = secs(0.3)
        x = np.sin(2 * np.pi * np.cumsum(70 + 40 * np.exp(-t0 / 0.03)) / SR) * np.exp(-t0 / 0.07)
        put('fx', np.stack([x, x], axis=1), p, 0.22)

    # ---------------------------------------------------------------- mix
    ir = hall_ir()
    sends = {'piano': 0.28, 'strings': 0.5, 'brass': 0.45, 'bass': 0.12, 'perc': 0.18, 'fx': 0.35}
    levels = {'piano': 1.0, 'strings': 0.9, 'brass': 0.75, 'bass': 0.8, 'perc': 0.85, 'fx': 0.75}
    dry = np.zeros((n, 2))
    send = np.zeros((n, 2))
    for k, x in stems.items():
        dry += x * levels[k]
        send += x * levels[k] * sends[k]
    wet = np.stack([signal.fftconvolve(send[:, c], ir[:, c])[:n] for c in range(2)], axis=1)
    mix = highpass(dry + wet * 1.1, 30)
    env = np.sqrt(lowpass(np.mean(mix ** 2, axis=1), 8, 2).clip(1e-12))
    ref = np.percentile(env, 90)
    mix *= np.where(env > ref * 0.5, (env / (ref * 0.5)) ** (-0.5), 1.0)[:, None]
    t = secs(dur)[:n]
    mix *= (np.clip(t / 0.03, 0, 1) * np.clip((dur - t) / (dur - cues['outro']), 0, 1) ** 1.2)[:, None]
    mix = np.tanh(1.1 * mix / np.max(np.abs(mix))) / np.tanh(1.1) * 10 ** (-1 / 20)
    with wave.open(out_path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(mix, -1, 1) * 32767).astype('<i2').tobytes())
    print(f'wrote {out_path}: {dur}s, rms {20 * np.log10(np.sqrt(np.mean(mix ** 2))):.1f} dBFS')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'audio/trio-cues.json',
         sys.argv[2] if len(sys.argv) > 2 else 'output/trio-sfx.wav')
