#!/usr/bin/env python3
"""Cinematic score for kurdistan3d.html, from real instrument recordings.

Twelve bars at 96 bpm (2.5 s each, 30 s) in A minor, resolving to C major on
the logo. The instruments, percussion and hall come from audio/sport3d.py.
The progression is Am F C G twice, then Dm F G C, with small sounds for the
balls: drops, the kick into the net, volleys and the swish.

    node render.mjs --page kurdistan3d.html --cues audio/kurdistan-cues.json
    python3 audio/kurdistan.py audio/kurdistan-cues.json output/kurdistan-sfx.wav
"""
import json
import sys
import wave

import numpy as np
from scipy import signal

from sport3d import (BAR, BEAT, SR, bandpass, bass, boom, cello, hall_ir, harp, highpass, horn, lowpass, midi,
                     piano, pulse, rng, secs, swell, thud, violin)

# chord per bar: ostinato root, minor?, left-hand root, bass note, violins
BARS = [
    ('A3', True, 'A1', 'A1', None),
    ('F3', False, 'F1', 'F1', None),
    ('C4', False, 'C2', 'C2', ['G4', 'C5', 'E5']),
    ('G3', False, 'G1', 'G1', ['G4', 'B4', 'D5']),
    ('A3', True, 'A1', 'A1', ['A4', 'C5', 'E5']),
    ('F3', False, 'F1', 'F1', ['A4', 'C5', 'F5']),
    ('C4', False, 'C2', 'C2', ['G4', 'C5', 'E5', 'G5']),
    ('G3', False, 'G1', 'G1', ['G4', 'B4', 'D5', 'G5']),
    ('D4', True, 'D2', 'D2', ['A4', 'D5', 'F5', 'A5']),
    ('F3', False, 'F1', 'F1', ['A4', 'C5', 'F5', 'A5']),
    ('G3', False, 'G1', 'G1', ['B4', 'D5', 'G5', 'B5']),
    ('C4', False, 'C2', 'C2', ['G4', 'C5', 'E5', 'G5']),
]
CELLO = {5: 'E3', 6: 'F3', 7: 'E3', 8: 'D3', 9: 'F3', 10: 'F3', 11: 'D3', 12: 'E3'}
HORN = [(5, 0, 'E4', 4), (6, 0, 'F4', 2), (6, 2, 'A4', 2), (7, 0, 'G4', 4), (8, 0, 'D4', 2), (8, 2, 'G4', 2),
        (9, 0, 'F4', 4), (10, 0, 'A4', 4), (11, 0, 'B4', 2), (11, 2, 'D5', 2), (12, 0, 'C5', 4)]


def slap():
    """A hand on a volleyball: a short, bright thud."""
    t = secs(0.18)
    body = np.sin(2 * np.pi * np.cumsum(240 * (0.7 + 0.3 * np.exp(-t / 0.01))) / SR) * np.exp(-t / 0.03)
    snap = bandpass(rng.standard_normal(len(t)), 1500, 5000) * np.exp(-t / 0.012)
    x = body + 0.6 * snap / np.abs(snap).max()
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

    # piano ostinato in eighths, bars 1-11; the last bar is a held chord
    for b, (root, minor, lh, _, _) in enumerate(BARS, start=1):
        if b == 12:
            break
        vel = 5 if b <= 2 else (9 if b <= 8 else 12)
        steps = [0, 7, 12, 14, 15 if minor else 16, 14, 12, 7]
        for k, s in enumerate(steps):
            g = (1.0 if k in (0, 4) else 0.78) * (1.5 if b <= 2 else 1) * rng.uniform(0.9, 1.05)
            put('piano', piano[vel].play(midi(root) + s, dur=BEAT * 0.9, release=0.9), bar_t(b, k / 2) + human(), 0.5 * g, 0.12)
        if b >= 3:
            for m in (midi(lh) + 12, midi(lh) + 24):
                put('piano', piano[9].play(m, dur=BAR * 0.95, release=1.2), bar_t(b) + human(), 0.4, -0.2)
    for nm in ('C2', 'G2', 'C3', 'E4', 'G4', 'C5', 'E5'):
        put('piano', piano[9].play(nm, dur=2.2, release=1.5), bar_t(12) + abs(human()), 0.38)
    put('piano', piano[5].play('G5', dur=1.0, release=1.2), bar_t(12, 2), 0.32, 0.25)
    put('piano', piano[5].play('C6', dur=1.0, release=1.3), bar_t(12, 3), 0.3, 0.3)

    # strings: three detuned players per note; contrabass under everything from bar 2
    for b, (_, _, _, bs, vn) in enumerate(BARS, start=1):
        for j, nm in enumerate(vn or []):
            for det, dly, pan in [(-6, 0.0, -0.45), (5, 0.018, 0.1), (0, 0.034, 0.5)]:
                x = violin.play(nm, dur=BAR + 0.15, attack=0.45 if b > 3 else 0.9, release=0.7, detune=det)
                put('strings', x, bar_t(b) + dly - 0.05, 0.15 * (0.8 if b == 3 else 1.0), pan - 0.1 * j)
        if b >= 2:
            put('bass', bass.play(bs, dur=BAR + 0.1, attack=0.3, release=0.6), bar_t(b) - 0.03, 0.55 if b > 2 else 0.35, -0.1)
    for b, nm in CELLO.items():
        for det, dly, pan in [(-4, 0.0, -0.3), (4, 0.022, 0.2)]:
            put('strings', cello.play(nm, dur=min(2.4, BAR), attack=0.25, release=0.5, detune=det), bar_t(b) + dly, 0.2, pan)
    for b, beat, nm, length in HORN:
        for det, dly, pan in [(-5, 0.0, -0.25), (5, 0.025, 0.25)]:
            put('brass', horn.play(nm, dur=length * BEAT, attack=0.2, release=0.6, detune=det), bar_t(b, beat) + dly - 0.04, 0.18, pan)
    for nm in ('G2', 'D3', 'G3'):
        put('brass', horn.play(nm, dur=BAR, attack=0.02, release=0.8), cues['wipe'], 0.15)

    # percussion: low hits on each new sport, a pulse through basketball and the line-up
    for at, size, g in [(bar_t(3), 0.8, 0.4), (bar_t(5), 0.8, 0.42), (bar_t(7), 0.9, 0.5), (bar_t(9), 1.0, 0.55),
                        (cues['wipe'], 1.4, 0.9), (bar_t(12), 1.0, 0.5)]:
        put('perc', boom(size), at, g)
    for b in (7, 8, 9, 10):
        for beat in range(4):
            if beat == 0 and b in (7, 9):
                continue
            put('perc', pulse(), bar_t(b, beat), 0.3 + 0.03 * (b - 7))
    for k in range(4):
        put('perc', pulse(), bar_t(10, 2 + k / 2), 0.34 + 0.07 * k)
    put('fx', swell(2.4), cues['wipe'] - 2.4, 0.2)
    rev = sum(piano[12].play(nm, dur=2.2, release=0.2) for nm in ('G2', 'D3', 'B3', 'F4'))[::-1]
    put('fx', rev, cues['wipe'] - len(rev) / SR, 0.28)
    gl = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5', 'G5', 'C6']
    for k, nm in enumerate(gl):
        put('fx', harp.play(nm, dur=1.5, release=1.0), cues['logo'] - 0.34 + k * 0.034, 0.17, -0.5 + k / 9)

    # the balls
    for i, d in enumerate(cues['drops']):
        put('fx', thud(150 - 20 * i), d, 0.22, -0.5 + 0.5 * i)
    put('fx', thud(110), cues['kick'], 0.35, 0.1)
    put('fx', air(0.6, 600, 3000), cues['kick'] + 0.02, 0.07, -0.1)
    put('fx', air(0.5, 300, 2500) + np.stack([lowpass(rng.standard_normal(int(SR * 0.5)), 400)] * 2, axis=1) * 0.2,
        cues['netHit'], 0.12, -0.2)
    for i, v in enumerate(cues['volleys']):
        put('fx', slap(), v, 0.26, -0.4 if i % 2 == 0 else 0.4)
    put('fx', air(0.45, 1500, 7000), cues['swish'] - 0.05, 0.12, 0.0)
    for p in cues['pedestals']:
        put('fx', thud(80), p, 0.18, 0.0)

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
    main(sys.argv[1] if len(sys.argv) > 1 else 'audio/kurdistan-cues.json',
         sys.argv[2] if len(sys.argv) > 2 else 'output/kurdistan-sfx.wav')
