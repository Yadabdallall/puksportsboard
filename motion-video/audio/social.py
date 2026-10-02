#!/usr/bin/env python3
"""Music and sound for social.html: 30 s, 12 bars at 96 bpm, in D major.

Refined and warm, closer to an elegant lounge or deep-house track than to
pop: a real grand piano (Salamander, CC-BY 3.0) plays rich seventh and
ninth chords with a light, swung rhythm and a simple melody; violins and
cellos (tonejs-instruments, CC-BY 3.0) hold the harmony; a round synthesised
bass, a soft kick, finger snaps and a shaker carry the groove; a harp opens
and closes it. The film's moments (the logo, the three icons, the taps on
the follow buttons, the finale) get quiet bells, harp and air rather than
hits.

    bars 1-2    the logo and the name: piano and strings, no drums
    bars 3-4    «فۆڵۆمان بکەن»: the bass and a half-time beat come in
    bars 5-10   the three platforms: the full groove and the piano melody;
                the beat breathes out on the last two beats of bar 10
    bars 11-12  the finale: the melody resolves, the last chord rings out

    node render.mjs --page social.html --cues audio/social-cues.json
    python3 audio/social.py audio/social-cues.json output/social.wav
"""
import functools
import json
import sys
import wave

import numpy as np
from scipy import signal

from sport3d import SR, bandpass, boom, cello, hall_ir, harp, highpass, lowpass, midi, piano, secs, swell, violin
from trio import air

rng = np.random.default_rng(96)

# one chord per bar (the last bar has two): the left hand, then the right hand
CH = {
    'Gmaj9': (['G2', 'D3'], ['B3', 'D4', 'F#4', 'A4']),
    'A9sus4': (['A2', 'E3'], ['D4', 'E4', 'G4', 'B4']),
    'Dmaj9': (['D2', 'A2'], ['F#4', 'A4', 'C#5', 'E5']),
    'Bm9': (['B2', 'F#3'], ['A3', 'D4', 'F#4', 'C#5']),
    'F#m7': (['F#2', 'C#3'], ['A3', 'C#4', 'E4', 'B4']),
    'Em9': (['E2', 'B2'], ['G3', 'B3', 'D4', 'F#4']),
}
PROG = [['Gmaj9'], ['A9sus4'], ['Dmaj9'], ['Bm9'], ['Gmaj9'], ['F#m7'], ['Em9'], ['A9sus4'],
        ['Gmaj9'], ['A9sus4'], ['Dmaj9'], ['Gmaj9', 'Dmaj9']]
# the piano melody: (bar, beat, beats, note)
MELODY = [(1, 2, 1, 'F#5'), (1, 3, 1, 'A5'), (2, 0, 2, 'G5'), (2, 2, 2, 'E5'),
          (3, 0, 2, 'F#5'), (3, 2, 1, 'E5'), (3, 3, 1, 'C#5'), (4, 0, 2, 'D5'), (4, 2, 2, 'F#5'),
          (5, 0, 1.5, 'F#5'), (5, 1.5, 0.5, 'E5'), (5, 2, 1, 'D5'), (5, 3, 1, 'B4'),
          (6, 0, 1.5, 'C#5'), (6, 1.5, 0.5, 'E5'), (6, 2, 2, 'A4'),
          (7, 0, 1, 'B4'), (7, 1, 1, 'D5'), (7, 2, 1, 'F#5'), (7, 3, 1, 'G5'),
          (8, 0, 2, 'E5'), (8, 2, 2, 'D5'),
          (9, 0, 1.5, 'F#5'), (9, 1.5, 0.5, 'G5'), (9, 2, 1, 'A5'), (9, 3, 1, 'B5'),
          (10, 0, 2, 'A5'), (10, 2, 1, 'G5'), (10, 3, 1, 'E5'),
          (11, 0, 3, 'F#5'), (11, 3, 1, 'A5'), (12, 0, 2, 'B5'), (12, 2, 2, 'A5')]
SWING = 0.03  # the off-beat sixteenths come a little late


@functools.lru_cache(maxsize=None)
def kick():
    t = secs(0.5)
    f = 50 + 70 * np.exp(-t / 0.04)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.2)
    click = lowpass(rng.standard_normal(len(t)), 3000) * np.exp(-t / 0.003)
    return np.tanh(1.2 * x) + 0.05 * click


@functools.lru_cache(maxsize=None)
def snap():
    """A finger snap: a bright burst and a little tone."""
    t = secs(0.25)
    x = bandpass(rng.standard_normal(len(t)), 1500, 5000) * np.exp(-t / 0.018)
    x = x / np.abs(x).max() + 0.25 * np.sin(2 * np.pi * 1850 * t) * np.exp(-t / 0.012)
    return x


@functools.lru_cache(maxsize=None)
def shaker(accent):
    t = secs(0.12)
    env = np.minimum(1, t / 0.012) * np.exp(-t / (0.035 if accent else 0.022))
    x = highpass(rng.standard_normal(len(t)), 5000, 4) * env
    return x / np.abs(x).max()


@functools.lru_cache(maxsize=None)
def open_hat():
    t = secs(0.45)
    x = highpass(rng.standard_normal(len(t)), 7500, 4) * np.exp(-t / 0.13)
    return x / np.abs(x).max()


@functools.lru_cache(maxsize=None)
def bass_note(m, dur):
    """A round bass: a sine with a touch of its second harmonic, softly saturated."""
    f = 440 * 2 ** ((m - 69) / 12)
    n = int(SR * (dur + 0.06))
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t) + 0.08 * np.sin(6 * np.pi * f * t)
    env = np.minimum(1, t / 0.008) * np.clip((dur + 0.06 - t) / 0.06, 0, 1) * (0.75 + 0.25 * np.exp(-t / 0.15))
    return np.tanh(1.3 * x * env) / np.tanh(1.3)


@functools.lru_cache(maxsize=None)
def bell(m):
    """A small, glassy FM bell."""
    f = 440 * 2 ** ((m - 69) / 12)
    t = secs(2.0)
    mod = 1.6 * np.exp(-t / 0.35) * np.sin(2 * np.pi * f * 2.0 * t)
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t / 0.6) * np.minimum(1, t / 0.002)


def click():
    t = secs(0.06)
    x = np.sin(2 * np.pi * (1400 + 900 * np.exp(-t / 0.006)) * t) * np.exp(-t / 0.012)
    return x + 0.3 * highpass(rng.standard_normal(len(t)), 4000) * np.exp(-t / 0.003)


def main(cue_path, out_path):
    cues = json.load(open(cue_path))
    dur = cues['duration']
    bar = cues['bar']
    beat = bar / 4
    n = int(SR * (dur + 0.5))
    stems = {k: np.zeros((n, 2)) for k in ('piano', 'strings', 'harp', 'bass', 'drums', 'fx')}

    def put(stem, x, t, gain=1.0, pan=0.0):
        x = np.asarray(x)
        if x.ndim == 1:
            x = np.stack([x, x], axis=1)
        x = x * np.array([np.sqrt(1 - pan), np.sqrt(1 + pan)])
        i = int(round(t * SR))
        if i >= n:
            return
        if i < 0:
            x, i = x[-i:], 0
        m = min(len(x), n - i)
        stems[stem][i:i + m] += x[:m] * gain

    bar_t = lambda b, bt=0.0: (b - 1) * bar + bt * beat
    swing = lambda bt: SWING if (bt * 4) % 2 == 1 else 0.0
    # the whole piece swells gently towards the finale
    level = lambda b: np.interp(b, [1, 3, 5, 9, 11, 12], [0.6, 0.75, 0.85, 0.95, 1.0, 0.9])
    kicks = []

    # ---------------------------------------------------------------- piano and strings
    for b, chords in enumerate(PROG, start=1):
        lv = level(b)
        for c, name in enumerate(chords):
            lh, rh = CH[name]
            span = 4 / len(chords)
            b0 = c * span
            last = b == len(PROG) and c == len(chords) - 1
            if b <= 2 or last:  # held chords, rolled from the bottom
                hold = (3.2 if last else span) * beat
                for k, note in enumerate(lh + rh):
                    put('piano', piano[9 if k < 2 else 5].play(midi(note), dur=hold, release=1.6 if last else 0.9),
                        bar_t(b, b0) + 0.025 * k, (0.5 if k < 2 else 0.32) * lv, -0.3 + 0.1 * k)
            else:  # the chord, then light re-strikes on the swung off-beats
                for k, note in enumerate(lh):
                    put('piano', piano[9].play(midi(note), dur=span * beat * 0.9, release=0.6), bar_t(b, b0), 0.45 * lv, -0.2)
                for bt, v, g, d in ((0, 9, 0.3, 1.2), (1.5, 5, 0.22, 0.4), (2.5, 5, 0.2, 0.4), (3.5, 5, 0.16, 0.3)):
                    if bt >= b0 + span or bt < b0:
                        continue
                    for k, note in enumerate(rh):
                        put('piano', piano[v].play(midi(note), dur=d * beat, release=0.35), bar_t(b, bt) + swing(bt) + 0.008 * k,
                            g * lv, -0.1 + 0.1 * k)
            # strings: cellos on the root, violins on the top of the chord
            hold = span * beat + 0.2 + (2.0 if last else 0)
            put('strings', cello.play(midi(lh[0]) + 12, dur=hold, attack=0.5, release=1.2), bar_t(b, b0), 0.09 * lv, -0.35)
            if b >= 3:
                for k, note in enumerate(rh[-2:]):
                    put('strings', violin.play(midi(note) + 12 * (b >= 9), dur=hold, attack=0.6, release=1.2),
                        bar_t(b, b0), (0.05 + 0.025 * (b >= 9)) * lv, 0.25 + 0.15 * k)
    for b, bt, d, note in MELODY:
        put('piano', piano[12 if b >= 5 else 9].play(midi(note), dur=d * beat, release=0.8), bar_t(b, bt) + swing(bt),
            (0.42 if b >= 5 else 0.32) * level(b), 0.15)
        if b >= 9:  # doubled softly an octave up towards the end
            put('piano', piano[5].play(midi(note) + 12, dur=d * beat, release=0.6), bar_t(b, bt) + swing(bt), 0.12, 0.3)

    # ---------------------------------------------------------------- bass
    for b, chords in enumerate(PROG, start=1):
        if b < 3:
            continue
        for c, name in enumerate(chords):
            root = 33 + (midi(CH[name][0][0]) - 33) % 12  # between A1 and G#2, where a bass sits well
            span = 4 / len(chords)
            last = b == len(PROG) and c == len(chords) - 1
            if last:
                put('bass', bass_note(root, beat * 3), bar_t(b, c * span), 0.5)
                continue
            for bt, dd, off, g in ((0, 0.8, 0, 0.55), (1.5, 0.35, 0, 0.38), (2.5, 0.35, 7, 0.36), (3.5, 0.35, 12, 0.32)):
                if c * span <= bt < (c + 1) * span and not (b == 10 and bt >= 2):
                    put('bass', bass_note(root + off, dd * beat), bar_t(b, bt) + swing(bt), g)

    # ---------------------------------------------------------------- drums
    for b in range(3, len(PROG) + 1):
        for bt in range(4):
            if b == 10 and bt >= 2:  # a breath before the finale
                continue
            if b == len(PROG) and bt >= 2:
                continue
            t = bar_t(b, bt)
            if b >= 5 or bt % 2 == 0:
                put('drums', kick(), t, 0.3)
                kicks.append(t)
            if bt % 2 == 1:
                put('drums', snap(), t, 0.22, 0.15)
            for s in range(4):  # the shaker, swung
                if b < 4 and s % 2 == 0:
                    continue
                put('drums', shaker(s == 2), t + s * beat / 4 + (SWING if s % 2 else 0), (0.05, 0.035, 0.08, 0.04)[s], -0.25)
            if b >= 5:
                put('drums', open_hat(), t + beat / 2 + SWING, 0.045, 0.3)
    # light sidechain: the bass and strings lean back under each kick
    duck = np.ones(n)
    for k in kicks:
        i = int(k * SR)
        m = min(n - i, int(0.35 * SR))
        tt = np.arange(m) / SR
        duck[i:i + m] = np.minimum(duck[i:i + m], 1 - 0.35 * np.exp(-tt / 0.12))
    stems['bass'] *= duck[:, None]
    stems['strings'] *= (0.5 + 0.5 * duck)[:, None]

    # ---------------------------------------------------------------- the film's moments
    def gliss(t, lo, hi, gain, step=0.03):
        scale = [2, 4, 6, 7, 9, 11, 1]
        notes = [m for m in range(lo, hi) if m % 12 in scale]
        for k, m in enumerate(notes):
            put('harp', harp.play(m, dur=1.4, release=1.2), t + k * step, gain, -0.5 + k / len(notes))

    put('fx', boom(1.2), cues['logo'], 0.12)
    gliss(cues['logo'] - 0.35, 62, 86, 0.1)
    t0, step, count = cues['letters']
    for k, m in enumerate((86, 90, 93, 98)):  # a few soft bells as the name appears
        put('fx', bell(m), t0 + step * count * k / 4, 0.045, -0.3 + 0.2 * k)
    put('fx', swell(1.6, 300, 6000), cues['title'] - 1.6, 0.05)
    put('fx', boom(1.0), cues['title'], 0.1)
    for k, t in enumerate(cues['pops']):
        put('fx', bell((81, 86, 90)[k % 3]), t, 0.07, (0.4, 0.0, -0.4)[k % 3])
    for c in cues['cuts'][1:]:
        put('fx', air(0.8, 400, 6000), c - 0.55, 0.06, 0.2)
    for t in cues['taps']:
        put('fx', click(), t, 0.16)
        put('fx', bell(93), t + 0.04, 0.06, 0.3)
        put('fx', bell(98), t + 0.13, 0.045, -0.2)
    put('fx', swell(2.0, 300, 7000), cues['finale'] - 2.0, 0.07)
    put('fx', boom(1.3), cues['finale'], 0.13)
    gliss(cues['finale'] - 0.4, 50, 86, 0.1, 0.025)

    # ---------------------------------------------------------------- mix
    ir = hall_ir(3.0, 2.2)
    sends = {'piano': 0.3, 'strings': 0.5, 'harp': 0.5, 'bass': 0.0, 'drums': 0.12, 'fx': 0.35}
    levels = {'piano': 1.6, 'strings': 2.2, 'harp': 1.0, 'bass': 0.26, 'drums': 0.9, 'fx': 0.9}
    dry = np.zeros((n, 2))
    send = np.zeros((n, 2))
    for k, x in stems.items():
        dry += x * levels[k]
        send += x * levels[k] * sends[k]
    wet = np.stack([signal.fftconvolve(send[:, c], ir[:, c])[:n] for c in range(2)], axis=1)
    out = highpass(dry + wet, 28)
    env = np.sqrt(lowpass(np.mean(out ** 2, axis=1), 5, 2).clip(1e-12))
    ref = np.percentile(env, 85)
    out *= np.where(env > ref * 0.6, (env / (ref * 0.6)) ** (-0.35), 1.0)[:, None]
    t = secs(dur + 0.5)[:n]
    out *= (np.clip(t / 0.02, 0, 1) * np.clip((dur - t) / (dur - cues['outro']), 0, 1) ** 1.3)[:, None]
    out = out[:int(SR * dur)]
    out = np.tanh(1.4 * out / np.max(np.abs(out))) / np.tanh(1.4) * 10 ** (-1 / 20)
    with wave.open(out_path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(out, -1, 1) * 32767).astype('<i2').tobytes())
    print(f'wrote {out_path}: {dur}s, rms {20 * np.log10(np.sqrt(np.mean(out ** 2))):.1f} dBFS')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
