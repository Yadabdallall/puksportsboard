#!/usr/bin/env python3
"""Sound for minimal.html: a calm pad, a soft arpeggio and light effects.

    node render.mjs --page minimal.html --cues audio/minimal-cues.json
    python3 audio/minimal.py audio/minimal-cues.json output/minimal-sfx.wav
"""
import json
import sys
import wave

import numpy as np
from scipy import signal

from audio import SR, click, highpass, impact, lowpass, norm, note, pad_chord, secs, sparkle, svf_band, thump, whoosh, rng


def keys(freq, dur=1.6, bright=1.0):
    """Soft electric-piano-like note: decaying partials with a gentle attack."""
    t = secs(dur)
    x = np.zeros_like(t)
    for k, (a, d) in enumerate([(1, 1.1), (0.45 * bright, 0.5), (0.18 * bright, 0.25), (0.08 * bright, 0.12)], start=1):
        x += a * np.sin(2 * np.pi * freq * k * t) * np.exp(-t / d)
    return x * np.minimum(1, t / 0.006) * 0.6


def roll(dur):
    t = secs(dur)
    u = t / dur
    x = norm(svf_band(rng.standard_normal(len(t)), 180 + 140 * np.sin(2 * np.pi * 9 * t * (1 - u)), 1.4))
    return x * (1 - u) ** 1.6 * np.minimum(1, t / 0.08)


def main(cue_path, out_path):
    cues = json.load(open(cue_path))
    dur = cues['duration']
    n = int(SR * dur)
    dry = np.zeros((n, 2))
    send = np.zeros((n, 2))

    def place(x, at, gain=1.0, pan=0.0, verb=0.35):
        i = int(at * SR)
        if i >= n:
            return
        x = x[:n - i] * gain
        st = np.stack([x * np.cos((pan + 1) * np.pi / 4), x * np.sin((pan + 1) * np.pi / 4)], axis=1) * np.sqrt(2)
        dry[i:i + len(x)] += st
        send[i:i + len(x)] += st * verb

    # --- music: one chord per scene, soft arpeggio on top
    t = secs(dur)
    chords = [
        (0.0, 4.3, ['C3', 'E3', 'G3', 'B3'], ['C5', 'G4', 'E5', 'B4']),
        (4.3, 8.5, ['A2', 'E3', 'G3', 'C4'], ['A4', 'E5', 'C5', 'B4']),
        (8.5, 12.7, ['F2', 'C3', 'E3', 'A3'], ['F4', 'C5', 'A4', 'E5']),
        (12.7, 16.6, ['G2', 'D3', 'G3', 'B3'], ['G4', 'D5', 'B4', 'E5']),
        (16.6, dur, ['C3', 'G3', 'D4', 'E4'], ['C5', 'G4', 'D5', 'E5']),
    ]
    xf = 0.5
    bed = np.zeros(n)
    for a, b, pad, _ in chords:
        i0, i1 = int(max(0, a - xf) * SR), min(n, int((b + xf) * SR))
        tt = t[i0:i1]
        env = np.clip((tt - a) / xf + 1, 0, 1) * np.clip((b - tt) / xf + 1, 0, 1) if a > 0 else np.clip((b - tt) / xf + 1, 0, 1)
        bed[i0:i1] += pad_chord(pad, tt, 1400) * env
    bed *= np.clip(t / 1.5, 0, 1) * 0.5
    dry += np.stack([bed, bed], axis=1)
    send += np.stack([bed, bed], axis=1) * 0.35

    step = 60 / 80 / 2  # eighth notes at 80 bpm
    for a, b, _, arp in chords:
        k = 0
        at = max(a, 0.6)
        while at < min(b, cues['outro'] + 0.3):
            f = note(arp[k % 4])
            place(keys(f, 1.4, 0.8), at, 0.16 if k % 4 else 0.2, 0.25 * np.sin(k * 1.3), 0.5)
            at += step
            k += 1

    # --- effects
    place(whoosh(1.2, 300, 3000, 0.6), 0.0, 0.12, -0.3, 0.5)
    place(roll(cues['ballStop'] - cues['ballIn']), cues['ballIn'], 0.22, -0.2, 0.2)
    place(thump(140, 80, 0.2, 0.04), cues['ballStop'] - 0.05, 0.15, 0.0, 0.3)
    place(click(0.008, 3000), cues['ballStop'] - 0.05, 0.05, 0.0, 0.3)
    for tr in cues['transitions']:
        place(whoosh(0.7, 500, 4200, 0.7, 0.8), tr, 0.16, 0.3, 0.45)
    for ph in cues['phrases']:
        place(sparkle(1.2), ph['start'], 0.05, -0.2, 0.7)
    for i, tk in enumerate(cues['ticks']):
        place(click(0.006, 3500) * (1.0 if i % 3 == 0 else 0.6), tk, 0.12, 0.15, 0.2)
    for i, d in enumerate(cues['dots']):
        place(keys(note(['C6', 'D6', 'E6', 'G6', 'A6'][i]), 0.8, 0.4), d, 0.1, -0.6 + 0.3 * i, 0.5)
    place(thump(110, 55, 0.4, 0.1), cues['ballClose'], 0.3, 0.0, 0.2)
    place(sparkle(1.4), cues['ballClose'], 0.07, 0.2, 0.6)
    place(sparkle(1.4), cues['trophyStar'], 0.08, 0.1, 0.6)
    place(whoosh(0.8, 2000, 9000, 0.5, 1.2), cues['trophyShine'], 0.05, 0.4, 0.5)
    place(impact(), cues['logoHit'] - 0.02, 0.22, 0.0, 0.5)
    place(keys(note('C5'), 2.4, 0.6) + keys(note('G5'), 2.4, 0.6) * 0.7, cues['logoHit'], 0.2, 0.0, 0.6)

    # --- reverb and master
    ir_t = secs(2.8)
    ir = rng.standard_normal((len(ir_t), 2)) * np.exp(-ir_t / 0.45)[:, None]
    ir = lowpass(ir, 5000)
    ir[:int(SR * 0.015)] = 0
    wet = np.stack([signal.fftconvolve(send[:, c], ir[:, c])[:n] for c in range(2)], axis=1)
    wet *= 0.9 / (np.max(np.abs(wet)) + 1e-9) * np.max(np.abs(send))
    mix = dry + 0.6 * wet
    fade = np.clip(t / 0.05, 0, 1) * np.clip((dur - t) / (dur - cues['outro']), 0, 1) ** 1.5
    mix *= fade[:, None]
    mix = highpass(mix, 30)
    mix = np.tanh(1.2 * mix / np.max(np.abs(mix))) / np.tanh(1.2)
    mix *= 10 ** (-1 / 20)

    with wave.open(out_path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(mix, -1, 1) * 32767).astype('<i2').tobytes())
    print(f'wrote {out_path}: {dur}s, rms {20 * np.log10(np.sqrt(np.mean(mix ** 2))):.1f} dBFS')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'audio/minimal-cues.json',
         sys.argv[2] if len(sys.argv) > 2 else 'output/minimal-sfx.wav')
