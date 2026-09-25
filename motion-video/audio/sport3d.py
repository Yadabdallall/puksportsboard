#!/usr/bin/env python3
"""Music and sound for sport3d.html: a warm 96 bpm piece in C major.

Eight bars of 2.5 s: the ball's bounces play a rising marimba line, a bell
melody enters with the football, soft drums carry the middle, a breakdown
follows the wipe and the last bar resolves on the logo.

    node render.mjs --page sport3d.html --cues audio/sport3d-cues.json
    python3 audio/sport3d.py audio/sport3d-cues.json output/sport3d-sfx.wav
"""
import json
import sys
import wave

import numpy as np
from scipy import signal

from audio import SR, click, highpass, lowpass, norm, note, pad_chord, rng, secs, sparkle, svf_band, thump, whoosh
from minimal import keys

BPM = 96
BEAT = 60 / BPM
BAR = 4 * BEAT


def marimba(freq, dur=0.9):
    t = secs(dur)
    x = np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.35)
    x += 0.25 * np.sin(2 * np.pi * freq * 3.93 * t) * np.exp(-t / 0.06)
    x += 0.1 * np.sin(2 * np.pi * freq * 9.2 * t) * np.exp(-t / 0.02)
    return x * np.minimum(1, t / 0.002)


def bell(freq, dur=2.2):
    """Soft bell-like lead: a sine pair with a gentle inharmonic shimmer."""
    t = secs(dur)
    x = np.sin(2 * np.pi * freq * t) + 0.5 * np.sin(2 * np.pi * freq * 1.003 * t + 1)
    x += 0.22 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t / 0.5)
    x += 0.08 * np.sin(2 * np.pi * freq * 3.01 * t) * np.exp(-t / 0.25)
    return x * np.exp(-t / 0.9) * np.minimum(1, t / 0.004) / 1.6


def bass(freq, dur):
    t = secs(dur)
    x = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(4 * np.pi * freq * t)
    env = np.minimum(1, t / 0.01) * np.exp(-t / 0.8) * np.clip((dur - t) / 0.05, 0, 1)
    return np.tanh(1.5 * x) * env


def snap():
    t = secs(0.18)
    body = norm(svf_band(rng.standard_normal(len(t)), 1900, 0.7)) * np.exp(-t / 0.035)
    return body + 0.3 * np.pad(click(0.01, 4000), (0, len(t) - int(SR * 0.01)))


def shaker():
    t = secs(0.07)
    return norm(highpass(rng.standard_normal(len(t)), 7000)) * np.sin(np.pi * t / 0.07) ** 2


# chord symbols per bar: pad voicing, keys voicing, bass root
BARS = [
    (['C3', 'G3', 'B3', 'E4'], ['E4', 'G4', 'B4'], 'C2'),
    (['A2', 'E3', 'G3', 'C4'], ['C4', 'E4', 'G4'], 'A1'),
    (['F2', 'C3', 'E3', 'A3'], ['A4', 'C5', 'E5'], 'F2'),
    (['G2', 'D3', 'B3', 'E4'], ['B4', 'D5', 'E5'], 'G2'),
    (['E2', 'B2', 'G3', 'D4'], ['G4', 'B4', 'D5'], 'E2'),
    (['F2', 'C3', 'E3', 'A3'], ['A4', 'C5', 'E5'], 'F2'),
    (['G2', 'D3', 'C4', 'F4'], ['C5', 'D5', 'G5'], 'G2'),
    (['C3', 'G3', 'D4', 'E4'], ['E4', 'G4', 'D5'], 'C2'),
]

# melody as (bar, beat, note, length in beats)
MELODY = [
    (3, 0, 'A5', 1.5), (3, 1.5, 'G5', 0.5), (3, 2, 'E5', 1), (3, 3, 'C5', 1),
    (4, 0, 'D5', 1.5), (4, 1.5, 'E5', 0.5), (4, 2, 'G5', 2),
    (5, 0, 'B4', 1), (5, 1, 'E5', 1), (5, 2, 'G5', 1), (5, 3, 'A5', 1),
    (6, 0, 'A5', 1.5), (6, 1.5, 'G5', 0.5), (6, 2, 'E5', 1), (6, 3, 'D5', 0.5), (6, 3.5, 'E5', 0.5),
    (7, 0, 'D5', 2), (7, 2, 'G5', 2),
    (8, 0, 'E5', 1), (8, 1, 'G5', 1), (8, 2, 'C6', 2),
]


def main(cue_path, out_path):
    cues = json.load(open(cue_path))
    dur = cues['duration']
    n = int(SR * dur)
    dry = np.zeros((n, 2))
    send = np.zeros((n, 2))
    duck = np.ones(n)

    def place(x, at, gain=1.0, pan=0.0, verb=0.3, ducked=False):
        i = int(round(at * SR))
        if i >= n or i < 0:
            return
        x = x[:n - i] * gain
        st = np.stack([x * np.cos((pan + 1) * np.pi / 4), x * np.sin((pan + 1) * np.pi / 4)], axis=1) * np.sqrt(2)
        if ducked:
            st *= duck[i:i + len(x), None]
        dry[i:i + len(x)] += st
        send[i:i + len(x)] += st * verb

    bar_t = lambda b, beat=0: (b - 1) * BAR + beat * BEAT

    # --- drums first, so the kick can duck the pad and bass
    drum_bars = [2, 3, 4, 5, 6, 8]
    kick = thump(115, 44, 0.45, 0.12)
    for b in drum_bars:
        for beat in (0, 2):
            if b == 2 and beat == 0:
                continue
            at = bar_t(b, beat)
            place(kick, at, 0.55, 0.0, 0.05)
            i = int(at * SR)
            m = min(n - i, int(SR * BEAT))
            duck[i:i + m] = np.minimum(duck[i:i + m], 1 - 0.35 * np.exp(-np.arange(m) / (SR * 0.12)))
        if b >= 3:
            for beat in (1, 3):
                place(snap(), bar_t(b, beat), 0.2, 0.15, 0.35)
        for k in range(8):
            place(shaker(), bar_t(b, k / 2 + 0.5 * (k % 2) * 0.08), 0.06 if k % 2 else 0.035, 0.35, 0.15)
    place(kick, bar_t(8, 0), 0.6, 0.0, 0.1)

    # --- pad and bass
    t = secs(dur)
    bed = np.zeros(n)
    xf = 0.3
    for i, (pad, _, _) in enumerate(BARS):
        a, b = i * BAR, (i + 1) * BAR
        i0, i1 = int(max(0, a - xf) * SR), min(n, int((b + xf) * SR))
        tt = t[i0:i1]
        env = np.clip((tt - a) / xf + 1, 0, 1) * np.clip((b - tt) / xf + 1, 0, 1)
        bed[i0:i1] += pad_chord(pad, tt, 1300 if i < 2 else 1700) * env
    bed *= np.clip(t / 1.2, 0, 1) * 0.42 * duck
    dry += np.stack([bed, bed], axis=1)
    send += np.stack([bed, bed], axis=1) * 0.3

    for i, (_, _, root) in enumerate(BARS):
        b = i + 1
        if b == 1:
            continue
        f = note(root)
        pattern = [(0, 1.4, f), (1.5, 0.45, f), (2, 1.4, f * 1.5), (3.5, 0.45, f * 2)] if b not in (7,) else [(0, 3.8, f)]
        for beat, length, fr in pattern:
            place(bass(fr, length * BEAT), bar_t(b, beat), 0.32, 0.0, 0.03, ducked=True)

    # --- keys comping (from the football shot on) and the melody
    for i, (_, voicing, _) in enumerate(BARS):
        b = i + 1
        if b < 3:
            continue
        hits = [0, 1.5, 2.5] if b != 7 else [0]
        for beat in hits:
            for j, nm in enumerate(voicing):
                place(keys(note(nm), 1.6, 0.7), bar_t(b, beat) + j * 0.012, 0.075, -0.25 + 0.25 * j, 0.45)
    for b, beat, nm, length in MELODY:
        place(bell(note(nm), max(1.2, length * BEAT + 0.8)), bar_t(b, beat), 0.2, 0.2, 0.55)

    # --- the ball: a rising marimba line on every bounce
    for i, bt in enumerate(cues['bounces']):
        nm = ['C5', 'D5', 'E5', 'G5', 'A5', 'C6', 'D6'][i % 7]
        place(marimba(note(nm)), bt, 0.3, -0.35 + 0.12 * i, 0.4)
        place(thump(180, 90, 0.12, 0.02), bt, 0.12, 0.0, 0.1)
    for i, h in enumerate(cues['hurdlesUp']):
        place(marimba(note(['G4', 'C5', 'E5', 'G5'][i]), 0.5), h, 0.1, -0.4 + 0.25 * i, 0.5)

    # --- transitions and details
    for c in cues['cuts']:
        place(whoosh(0.7, 400, 5000, 0.85, 0.8), c - 0.35, 0.14, 0.3, 0.5)
    for i, p in enumerate(cues['podiumUp']):
        place(thump(90, 50, 0.3, 0.07), p + 0.25, 0.22, [-0.1, -0.5, 0.5][i], 0.2)
    drop = cues['orbDrop']
    for k, g in enumerate([1.0, 0.55, 0.3]):
        place(marimba(note('C6'), 0.7), drop + k * np.pi / 7.2, 0.26 * g, 0.0, 0.5)
    place(sparkle(1.6), drop, 0.08, 0.2, 0.7)
    place(whoosh(1.0, 300, 7000, 0.55, 0.7), cues['wipe'] - 0.1, 0.2, 0.0, 0.5)
    place(sparkle(2.0), cues['logo'] + 0.15, 0.12, 0.0, 0.8)
    place(thump(70, 35, 1.5, 0.35), cues['logo'] + 0.15, 0.35, 0.0, 0.3)

    # --- reverb and master
    ir_t = secs(2.6)
    ir = rng.standard_normal((len(ir_t), 2)) * np.exp(-ir_t / 0.42)[:, None]
    ir = lowpass(ir, 5500)
    ir[:int(SR * 0.018)] = 0
    wet = np.stack([signal.fftconvolve(send[:, c], ir[:, c])[:n] for c in range(2)], axis=1)
    wet *= 0.9 / (np.max(np.abs(wet)) + 1e-9) * np.max(np.abs(send))
    mix = dry + 0.55 * wet
    fade = np.clip(t / 0.03, 0, 1) * np.clip((dur - t) / (dur - cues['outro']), 0, 1) ** 1.3
    mix *= fade[:, None]
    mix = highpass(mix, 28)
    mix = np.tanh(1.3 * mix / np.max(np.abs(mix))) / np.tanh(1.3)
    mix *= 10 ** (-1 / 20)
    with wave.open(out_path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(mix, -1, 1) * 32767).astype('<i2').tobytes())
    print(f'wrote {out_path}: {dur}s, rms {20 * np.log10(np.sqrt(np.mean(mix ** 2))):.1f} dBFS')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'audio/sport3d-cues.json',
         sys.argv[2] if len(sys.argv) > 2 else 'output/sport3d-sfx.wav')
