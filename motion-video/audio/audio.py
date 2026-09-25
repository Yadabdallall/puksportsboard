#!/usr/bin/env python3
"""Synthesises the sound design for the motion ident.

Every sound is generated here (no samples, no licensed music), timed from the
cue list that render.mjs exports from the animation timeline:

    node render.mjs --cues audio/cues.json
    python3 audio/audio.py audio/cues.json output/sfx.wav

Needs numpy and scipy.
"""
import json
import sys
import wave

import numpy as np
from scipy import signal

SR = 48000
rng = np.random.default_rng(2020)


def secs(n):
    return np.arange(int(SR * n)) / SR


def note(name):
    names = {'C': -9, 'D': -7, 'E': -5, 'F': -4, 'G': -2, 'A': 0, 'B': 2}
    return 440.0 * 2 ** ((names[name[0]] + 12 * (int(name[1:]) - 4)) / 12)


def svf_band(x, fc, q=0.7):
    """Band-pass state-variable filter with a per-sample cutoff."""
    fc = np.broadcast_to(np.asarray(fc, dtype=float), x.shape)
    f = 2 * np.sin(np.pi * np.clip(fc, 20, SR / 6) / SR)
    low = band = 0.0
    out = np.empty_like(x)
    for i in range(len(x)):
        low += f[i] * band
        high = x[i] - low - q * band
        band += f[i] * high
        out[i] = band
    return out


def lowpass(x, fc, order=4):
    return signal.sosfilt(signal.butter(order, fc, 'low', fs=SR, output='sos'), x, axis=0)


def highpass(x, fc, order=2):
    return signal.sosfilt(signal.butter(order, fc, 'high', fs=SR, output='sos'), x, axis=0)


def norm(x):
    return x / (np.max(np.abs(x)) + 1e-9)


# ------------------------------------------------------------------ sounds
def whoosh(dur, f0, f1, peak=0.6, q=0.9):
    t = secs(dur)
    u = t / dur
    fc = f0 * (f1 / f0) ** u
    env = np.sin(np.pi * np.clip(u / peak, 0, 1) / 2) ** 2 * np.where(u < peak, 1, (1 - (u - peak) / (1 - peak)) ** 2)
    return norm(svf_band(rng.standard_normal(len(t)), fc, q)) * env


def thump(f0, f1, dur, decay):
    t = secs(dur)
    freq = f1 + (f0 - f1) * np.exp(-t / 0.045)
    phase = 2 * np.pi * np.cumsum(freq) / SR
    return np.sin(phase) * np.exp(-t / decay) * np.minimum(1, t / 0.002)


def click(dur=0.012, fc=2500):
    t = secs(dur)
    return norm(highpass(rng.standard_normal(len(t)), fc)) * np.exp(-t / (dur / 4))


def footstep(variant):
    body = thump(95 + 10 * variant, 48, 0.16, 0.035)
    scuff = norm(svf_band(rng.standard_normal(int(SR * 0.09)), 900 + 300 * variant, 1.2)) * np.exp(-secs(0.09) / 0.02)
    out = np.zeros(int(SR * 0.16))
    out += 0.8 * body
    out[:len(scuff)] += 0.35 * scuff
    return out


def ball_kick():
    out = 1.0 * thump(190, 62, 0.35, 0.06)
    pop = norm(svf_band(rng.standard_normal(int(SR * 0.05)), 1400, 0.6)) * np.exp(-secs(0.05) / 0.009)
    out[:len(pop)] += 0.7 * pop
    c = click(0.01, 3000)
    out[:len(c)] += 0.4 * c
    return out


def impact():
    dur = 3.2
    t = secs(dur)
    sub = thump(75, 30, dur, 0.7) * 1.0
    crash = norm(lowpass(rng.standard_normal(len(t)), 5000)) * np.exp(-t / 0.55) * 0.45
    chime = np.zeros_like(t)
    for f, a in [(note('E6'), 1), (note('A6'), .7), (note('C7'), .5), (note('E7'), .35), (note('A5'), .6)]:
        for det in (-3, 3):
            chime += a * np.sin(2 * np.pi * f * 2 ** (det / 1200) * t)
    chime = chime / 8 * np.exp(-t / 0.9) * (0.8 + 0.2 * np.sin(2 * np.pi * 6 * t)) * np.minimum(1, t / 0.01)
    return sub + crash + 0.5 * chime


def riser(dur):
    t = secs(dur)
    u = t / dur
    noise = norm(svf_band(rng.standard_normal(len(t)), 300 * (12000 / 300) ** u, 0.5))
    return noise * u ** 2.2


def pluck(freq, dur=0.5):
    t = secs(dur)
    x = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(4 * np.pi * freq * t) + 0.12 * np.sin(6 * np.pi * freq * t)
    return x * np.exp(-t / 0.09) * np.minimum(1, t / 0.003)


def sparkle(dur=1.4):
    t = secs(dur)
    out = np.zeros_like(t)
    for i, n in enumerate(['A6', 'C7', 'E7', 'A7', 'C8']):
        start = int(SR * i * 0.055)
        seg = t[:len(t) - start]
        out[start:] += np.sin(2 * np.pi * note(n) * seg) * np.exp(-seg / 0.35) * np.minimum(1, seg / 0.004)
    return out / 3


def saw(freq, t, harmonics=14):
    """Band-limited sawtooth (additive), so the pad stays free of aliasing."""
    ph = rng.random() * 2 * np.pi
    return sum(np.sin(k * (2 * np.pi * freq * t + ph)) / k for k in range(1, harmonics + 1)) * (2 / np.pi)


def pad_chord(notes, t, cutoff):
    x = np.zeros_like(t)
    for n in notes:
        f = note(n)
        for det in (-8, 0, 8):
            x += saw(f * 2 ** (det / 1200), t)
    return lowpass(x / (3 * len(notes)), cutoff, 2)


# ------------------------------------------------------------------ mix
def main(cue_path, out_path):
    cues = json.load(open(cue_path))
    dur = cues['duration']
    n = int(SR * dur)
    dry = np.zeros((n, 2))
    send = np.zeros((n, 2))  # reverb bus

    def place(x, at, gain=1.0, pan=0.0, verb=0.3):
        i = int(at * SR)
        if i >= n:
            return
        x = x[:n - i] * gain
        lg, rg = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        st = np.stack([x * lg, x * rg], axis=1) * np.sqrt(2)
        dry[i:i + len(x)] += st
        send[i:i + len(x)] += st * verb

    def place_panned(x, at, pan0, pan1, gain=1.0, verb=0.3):
        i = int(at * SR)
        x = x[:n - i] * gain
        p = np.linspace(pan0, pan1, len(x))
        st = np.stack([x * np.cos((p + 1) * np.pi / 4), x * np.sin((p + 1) * np.pi / 4)], axis=1) * np.sqrt(2)
        dry[i:i + len(x)] += st
        send[i:i + len(x)] += st * verb

    kick, hit = cues['kick'], cues['logoHit']

    # opening: streak whooshes and a soft ball bounce
    place_panned(whoosh(1.1, 400, 5000, 0.55), 0.0, -0.8, 0.8, 0.30, 0.4)
    place_panned(whoosh(1.2, 250, 3000, 0.6), 0.35, 0.6, -0.4, 0.18, 0.4)
    place(pluck(note('E4'), 0.2) * 0.5 + thump(160, 90, 0.2, 0.03), cues['ballDrop'], 0.22, 0.0, 0.2)

    # run-up
    for i, st in enumerate(cues['steps']):
        x = min(1, max(-1, (st - 2.2) / 2))
        place(footstep(i % 2), st, 0.42 if st < kick else 0.3, -0.4 + 0.3 * x, 0.15)
    place(riser(hit - 1.0), 1.0, 0.16, 0.0, 0.5)

    # the kick, the ball's flight and the logo impact
    place(ball_kick(), kick, 0.75, -0.25, 0.25)
    place_panned(whoosh(hit - kick + 0.15, 500, 4500, 0.8, 0.7), kick, -0.3, 0.45, 0.45, 0.35)
    place(impact(), hit - 0.01, 0.55, 0.25, 0.45)

    # typography
    for i, s in enumerate(cues['swishes']):
        place_panned(whoosh(0.55, 900, 5000, 0.35, 0.8), s, 0.6, -0.2, 0.28 - 0.04 * i, 0.35)
    for i, p in enumerate(cues['pops']):
        place(pluck(note(['E5', 'G5', 'A5', 'C6'][i % 4])), p, 0.2, 0.35 - 0.2 * i, 0.4)
    for s in cues['sparkles']:
        place(sparkle(), s, 0.13, 0.35, 0.6)
    for s in cues['streaks']:
        place_panned(whoosh(0.9, 600, 6000, 0.5, 1.0), s, -0.7, 0.7, 0.06, 0.4)

    # music bed: Am drone into the hit, then F - G - Am - C
    t = secs(dur)
    bed = np.zeros(n)
    chords = [
        (0.0, hit, ['A2', 'E3', 'A3', 'B3'], 700),
        (hit, hit + 2.4, ['F2', 'C3', 'A3', 'E4'], 1800),
        (hit + 2.4, hit + 4.8, ['G2', 'D3', 'B3', 'D4'], 1900),
        (hit + 4.8, hit + 7.2, ['A2', 'E3', 'C4', 'E4'], 2000),
        (hit + 7.2, dur, ['C3', 'G3', 'E4', 'G4'], 2100),
    ]
    xf = 0.35
    for a, b, notes, cut in chords:
        i0, i1 = int(max(0, a - xf) * SR), min(n, int((b + xf) * SR))
        tt = t[i0:i1]
        env = np.clip((tt - a) / xf + 1, 0, 1) * np.clip((b - tt) / xf + 1, 0, 1) if a > 0 else np.clip((b - tt) / xf + 1, 0, 1)
        bed[i0:i1] += pad_chord(notes, tt, cut) * env
    bed *= np.where(t < hit, np.clip(t / 1.2, 0, 1) ** 2 * (0.35 + 0.4 * t / hit), 1.0)
    sub = np.sin(2 * np.pi * note('A1') * t) * np.clip(t / hit, 0, 1) ** 2 * (t < hit + 0.05) * 0.5

    # soft pulse after the reveal with side-chain ducking on the pad
    duck = np.ones(n)
    beat = 0.5
    pulse_start, pulse_end = hit + 1.0, cues['outro'] + 0.4
    b = pulse_start
    k = thump(120, 45, 0.3, 0.08)
    shaker = norm(highpass(rng.standard_normal(int(SR * 0.05)), 6000)) * np.exp(-secs(0.05) / 0.012)
    while b < pulse_end:
        place(k, b, 0.42, 0.0, 0.05)
        place(shaker, b + beat / 2, 0.07, 0.3, 0.1)
        i = int(b * SR)
        m = min(n - i, int(SR * beat))
        duck[i:i + m] = np.minimum(duck[i:i + m], 1 - 0.45 * np.exp(-np.arange(m) / (SR * 0.11)))
        b += beat
    bed = bed * duck * 0.6 + sub * 0.3
    dry += np.stack([bed, bed], axis=1)
    send += np.stack([bed, bed], axis=1) * 0.25

    # reverb: decaying stereo noise impulse response
    ir_t = secs(2.2)
    ir = rng.standard_normal((len(ir_t), 2)) * np.exp(-ir_t / 0.32)[:, None]
    ir = lowpass(ir, 6000)
    ir[:int(SR * 0.012)] = 0
    wet = np.stack([signal.fftconvolve(send[:, c], ir[:, c])[:n] for c in range(2)], axis=1)
    wet *= 0.9 / (np.max(np.abs(wet)) + 1e-9) * np.max(np.abs(send))
    mix = dry + 0.55 * wet

    # fades, gentle saturation, peak at -1 dBFS
    fade = np.clip(t / 0.05, 0, 1) * np.clip((dur - t) / (dur - cues['outro']), 0, 1) ** 1.5
    mix *= fade[:, None]
    mix = highpass(mix, 25)
    mix = np.tanh(1.4 * mix / np.max(np.abs(mix))) / np.tanh(1.4)
    mix *= 10 ** (-1 / 20)

    pcm = (np.clip(mix, -1, 1) * 32767).astype('<i2')
    with wave.open(out_path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    rms = 20 * np.log10(np.sqrt(np.mean(mix ** 2)))
    print(f'wrote {out_path}: {dur}s, rms {rms:.1f} dBFS')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'audio/cues.json',
         sys.argv[2] if len(sys.argv) > 2 else 'output/sfx.wav')
