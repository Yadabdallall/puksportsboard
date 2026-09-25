#!/usr/bin/env python3
"""Cinematic score for sport3d.html, built from real instrument recordings.

Eight bars at 96 bpm (2.5 s each) in D minor, resolving to F major on the
logo. A Salamander grand piano plays the ostinato, joined by violins, cello,
contrabass and French horns, with low cinematic hits on the shot changes.

Samples come from npm packages (see package.json): Salamander Grand Piano
(@audio-samples/*) and tonejs-instruments. Both sets are released under CC-BY 3.0.

    node render.mjs --page sport3d.html --cues audio/sport3d-cues.json
    python3 audio/sport3d.py audio/sport3d-cues.json output/sport3d-sfx.wav
"""
import functools
import json
import os
import re
import subprocess
import sys
import wave

import imageio_ffmpeg
import numpy as np
from scipy import signal

SR = 48000
BPM = 96
BEAT = 60 / BPM
BAR = 4 * BEAT
HERE = os.path.dirname(os.path.abspath(__file__))
NODE = os.path.join(HERE, '..', 'node_modules')
rng = np.random.default_rng(96)

NAMES = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def midi(name):
    m = re.fullmatch(r'([A-G])(#|s|b)?(-?\d)', name)
    acc = {'#': 1, 's': 1, 'b': -1}.get(m.group(2), 0)
    return 12 * (int(m.group(3)) + 1) + NAMES[m.group(1)] + acc


def secs(n):
    return np.arange(int(SR * n)) / SR


@functools.lru_cache(maxsize=None)
def load(path):
    raw = subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), '-v', 'error', '-i', path, '-f', 'f32le',
                          '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)


class Sampler:
    """Plays the nearest recorded note, repitched by up to a few semitones."""

    def __init__(self, folder, pattern):
        self.notes = {}
        for f in os.listdir(folder):
            m = re.fullmatch(pattern, f)
            if m:
                self.notes[midi(m.group(1))] = os.path.join(folder, f)

    @functools.lru_cache(maxsize=None)
    def raw(self, m):
        src = min(self.notes, key=lambda k: (abs(k - m), k))
        x = load(self.notes[src])
        if src != m:
            ratio = 2 ** ((m - src) / 12)
            x = signal.resample(x, int(len(x) / ratio), axis=0)
        return x

    def play(self, name, dur=None, attack=0.0, release=0.4, detune=0.0):
        m = midi(name) if isinstance(name, str) else name
        x = self.raw(m).copy()
        if detune:
            x = signal.resample(x, int(len(x) / 2 ** (detune / 1200)), axis=0)
        if dur is not None:
            n = min(len(x), int(SR * (dur + release)))
            x = x[:n]
            t = np.arange(n) / SR
            x *= np.clip((dur + release - t) / release, 0, 1)[:, None] ** 2
        if attack:
            x[:int(SR * attack)] *= np.linspace(0, 1, int(SR * attack))[:, None] ** 1.5
        return x


piano = {v: Sampler(os.path.join(NODE, f'@audio-samples/piano-mp3-velocity{v}/audio'), rf'([A-G]#?\d)v{v}\.mp3') for v in (5, 9, 12)}
violin = Sampler(os.path.join(NODE, 'tonejs-instrument-violin-mp3'), r'([A-G]s?\d)\.mp3')
cello = Sampler(os.path.join(NODE, 'tonejs-instrument-cello-mp3'), r'([A-G]s?\d)\.mp3')
bass = Sampler(os.path.join(NODE, 'tonejs-instrument-contrabass-mp3'), r'([A-G]s?\d)\.mp3')
horn = Sampler(os.path.join(NODE, 'tonejs-instrument-french-horn-mp3'), r'([A-G]s?\d)\.mp3')
harp = Sampler(os.path.join(NODE, 'tonejs-instrument-harp-mp3'), r'([A-G]s?\d)\.mp3')


# ------------------------------------------------------------------ synthesised percussion
def lowpass(x, fc, order=4):
    return signal.sosfilt(signal.butter(order, fc, 'low', fs=SR, output='sos'), x, axis=0)


def highpass(x, fc, order=2):
    return signal.sosfilt(signal.butter(order, fc, 'high', fs=SR, output='sos'), x, axis=0)


def bandpass(x, lo, hi, order=2):
    return signal.sosfilt(signal.butter(order, [lo, hi], 'band', fs=SR, output='sos'), x, axis=0)


def mono(x):
    return np.stack([x, x], axis=1)


def boom(size=1.0):
    """Low cinematic hit: pitched sub, a felt-like body and a short air burst."""
    t = secs(2.8)
    f = 38 + 30 * np.exp(-t / 0.08)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (0.55 * size))
    body = lowpass(rng.standard_normal(len(t)), 260) * np.exp(-t / 0.18)
    body /= np.abs(body).max()
    air = highpass(rng.standard_normal(len(t)), 1800) * np.exp(-t / 0.05)
    air /= np.abs(air).max()
    x = np.tanh(1.6 * (sub + 0.5 * body)) + 0.05 * air
    return mono(x * np.minimum(1, t / 0.003))


def pulse():
    t = secs(0.5)
    f = 45 + 50 * np.exp(-t / 0.03)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.13)
    return mono(np.tanh(1.3 * x))


def swell(dur, lo=200, hi=6000):
    """Air rising into a hit (filtered noise, no pitch)."""
    t = secs(dur)
    u = t / dur
    n = rng.standard_normal((len(t), 2))
    out = np.zeros_like(n)
    for k in range(8):  # sweep the band in steps
        a, b = int(len(t) * k / 8), int(len(t) * (k + 1) / 8)
        fc = lo * (hi / lo) ** ((k + 0.5) / 8)
        out[a:b] = bandpass(n, fc * 0.7, min(fc * 1.4, 20000))[a:b]
    return out / np.abs(out).max() * (u ** 2.5)[:, None]


def thud(freq=160):
    t = secs(0.25)
    f = freq * (0.6 + 0.4 * np.exp(-t / 0.02))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.045)
    grit = lowpass(rng.standard_normal(len(t)), 1200) * np.exp(-t / 0.015)
    return mono(x + 0.3 * grit / np.abs(grit).max())


# ------------------------------------------------------------------ reverb
def hall_ir(length=3.0, rt60=2.3):
    """Stereo hall response: early reflections plus a tail that darkens as it decays."""
    t = secs(length)
    ir = np.zeros((len(t), 2))
    bands = [(20, 400, 1.0), (400, 2000, 0.85), (2000, 6000, 0.6), (6000, 16000, 0.35)]
    for lo, hi, k in bands:
        n = bandpass(rng.standard_normal((len(t), 2)), lo, hi)
        ir += n * np.exp(-6.9 * t / (rt60 * k))[:, None]
    for d, g in [(0.011, 0.5), (0.019, 0.4), (0.027, 0.33), (0.041, 0.25), (0.053, 0.2)]:
        i = int(d * SR)
        ir[i, 0] += g * (1 if rng.random() > .5 else -1) * 3
        ir[i + int(0.0013 * SR), 1] += g * 3
    ir[:int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))[:, None]
    return ir / np.sqrt(np.sum(ir ** 2))


# ------------------------------------------------------------------ score
# chord per bar: name, ostinato root, minor?, left-hand root, bass, violins
BARS = [
    ('Dm', 'D4', True, 'D2', 'D2', None),
    ('Bb', 'Bb3', False, 'Bb1', 'Bb1', None),
    ('F', 'F4', False, 'F2', 'F1', ['A4', 'C5', 'F5']),
    ('C', 'C4', False, 'C2', 'C2', ['G4', 'C5', 'E5']),
    ('Dm', 'D4', True, 'D2', 'D2', ['A4', 'D5', 'F5']),
    ('Bb', 'Bb3', False, 'Bb1', 'Bb1', ['F4', 'Bb4', 'D5', 'F5']),
    ('C', 'C4', False, 'C2', 'C2', ['G4', 'C5', 'E5', 'G5']),
    ('F', 'F4', False, 'F2', 'F1', ['A4', 'C5', 'F5', 'A5']),
]
CELLO = {5: ['D3'], 6: ['D3'], 7: ['E3'], 8: ['F3']}
HORN = [(5, 0, 'D4', 4), (6, 0, 'D4', 2), (6, 2, 'F4', 2), (7, 0, 'G4', 2), (7, 2, 'E4', 2), (8, 0, 'F4', 4)]


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

    # piano ostinato: root, fifth, octave, ninth, tenth and back, in eighths
    for b, (_, root, minor, lh, _, _) in enumerate(BARS, start=1):
        if b == 8:
            break
        vel = 5 if b <= 2 else (9 if b <= 6 else 12)
        steps = [0, 7, 12, 14, 15 if minor else 16, 14, 12, 7]
        for k, s in enumerate(steps):
            accent = 1.0 if k in (0, 4) else 0.78
            g = accent * (1.5 if b <= 2 else 1) * rng.uniform(0.9, 1.05)
            put('piano', piano[vel].play(midi(root) + s, dur=BEAT * 0.9, release=0.9), bar_t(b, k / 2) + human(), 0.5 * g, 0.12)
        if b >= 3:  # left hand octave on the downbeat
            for m in (midi(lh), midi(lh) + 12):
                put('piano', piano[9].play(m, dur=BAR * 0.95, release=1.2), bar_t(b) + human(), 0.42, -0.2)
    # final chord and two last notes
    for nm in ('F2', 'C3', 'F3', 'A4', 'C5', 'F5'):
        put('piano', piano[9].play(nm, dur=2.4, release=1.5), bar_t(8) + abs(human()), 0.4, 0.0)
    put('piano', piano[5].play('A5', dur=1.2, release=1.2), bar_t(8, 2), 0.35, 0.25)
    put('piano', piano[5].play('C6', dur=1.0, release=1.2), bar_t(8, 3), 0.3, 0.3)

    # strings: a small section (three slightly detuned, offset players per note)
    for b, (_, _, _, _, bs, vn) in enumerate(BARS, start=1):
        if vn:
            for j, nm in enumerate(vn):
                for p, (det, dly, pan) in enumerate([(-6, 0.0, -0.45), (5, 0.018, 0.1), (0, 0.034, 0.5)]):
                    x = violin.play(nm, dur=BAR + 0.15, attack=0.45 if b > 3 else 0.9, release=0.7, detune=det)
                    put('strings', x, bar_t(b) + dly - 0.05, 0.16 * (0.8 if b == 3 else 1.0), pan - 0.1 * j)
        if b >= 2:
            put('bass', bass.play(bs, dur=BAR + 0.1, attack=0.3, release=0.6), bar_t(b) - 0.03, 0.55 if b > 2 else 0.35, -0.1)
    for b, notes in CELLO.items():
        for nm in notes:
            for det, dly, pan in [(-4, 0.0, -0.3), (4, 0.022, 0.2)]:
                put('strings', cello.play(nm, dur=min(2.4, BAR), attack=0.25, release=0.5, detune=det), bar_t(b) + dly, 0.22, pan)

    for b, beat, nm, length in HORN:
        for det, dly, pan in [(-5, 0.0, -0.25), (5, 0.025, 0.25)]:
            put('brass', horn.play(nm, dur=length * BEAT, attack=0.2, release=0.6, detune=det), bar_t(b, beat) + dly - 0.04, 0.2, pan)
    for nm in ('C3', 'G3'):  # the hit under the wipe
        put('brass', horn.play(nm, dur=BAR, attack=0.02, release=0.8), cues['wipe'], 0.16, 0.0)

    # percussion: low hits on the shot changes, a heartbeat pulse in bars 5-6
    for at, size, g in [(bar_t(3), 0.8, 0.45), (bar_t(5), 0.9, 0.55), (cues['wipe'], 1.4, 0.9), (bar_t(8), 1.0, 0.5)]:
        put('perc', boom(size), at, g)
    for b in (5, 6):
        for beat in range(4):
            if b == 5 and beat == 0:
                continue
            put('perc', pulse(), bar_t(b, beat), 0.32 + 0.08 * (b - 5))
    for k in range(4):  # eighths driving into the wipe
        put('perc', pulse(), bar_t(6, 2 + k / 2), 0.3 + 0.08 * k)
    put('fx', swell(2.4), cues['wipe'] - 2.4, 0.22)
    # a reversed piano chord breathing in before the wipe
    rev = sum(piano[12].play(nm, dur=2.2, release=0.2) for nm in ('D3', 'A3', 'F4', 'C5'))[::-1]
    put('fx', rev, cues['wipe'] - len(rev) / SR, 0.3)

    # harp glissando up to the logo
    gl = ['F4', 'G4', 'A4', 'C5', 'D5', 'F5', 'G5', 'A5', 'C6']
    for k, nm in enumerate(gl):
        put('fx', harp.play(nm, dur=1.5, release=1.0), cues['logo'] - 0.3 + k * 0.034, 0.18, -0.5 + k / 8)

    # the scene itself, kept subtle and natural
    for bt in cues['bounces']:
        put('fx', thud(170), bt, 0.12, -0.2)
    for p in cues['podiumUp']:
        put('fx', thud(80), p + 0.3, 0.2, 0.0)

    # ---------------------------------------------------------------- mix
    ir = hall_ir()
    sends = {'piano': 0.28, 'strings': 0.5, 'brass': 0.45, 'bass': 0.12, 'perc': 0.18, 'fx': 0.4}
    levels = {'piano': 1.0, 'strings': 0.9, 'brass': 0.75, 'bass': 0.8, 'perc': 0.85, 'fx': 0.7}
    dry = np.zeros((n, 2))
    send = np.zeros((n, 2))
    for k, x in stems.items():
        dry += x * levels[k]
        send += x * levels[k] * sends[k]
    wet = np.stack([signal.fftconvolve(send[:, c], ir[:, c])[:n] for c in range(2)], axis=1)
    mix = dry + wet * 1.1
    mix = highpass(mix, 30)
    # gentle glue compression (RMS detector, 2:1 above threshold)
    env = np.sqrt(lowpass(np.mean(mix ** 2, axis=1), 8, 2).clip(1e-12))
    ref = np.percentile(env, 90)
    gain = np.where(env > ref * 0.5, (env / (ref * 0.5)) ** (-0.5), 1.0)
    mix *= gain[:, None]
    t = secs(dur)[:n]
    fade = np.clip(t / 0.03, 0, 1) * np.clip((dur - t) / (dur - cues['outro']), 0, 1) ** 1.2
    mix *= fade[:, None]
    mix = np.tanh(1.1 * mix / np.max(np.abs(mix))) / np.tanh(1.1)
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
