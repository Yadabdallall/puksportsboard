#!/usr/bin/env python3
"""Music and sound for social.html: 30 s, 15 bars at 120 bpm, in E major.

Unlike the orchestral scores of the other films, this one is bright
electronic pop, all synthesised here except the piano hook (Salamander
grand, CC-BY 3.0):

    supersaw    seven detuned PolyBLEP saws per note, the chords, pumping
                against the kick (sidechain) and opening its filter at the drop
    pluck       additive saw whose upper harmonics die first, a 16th-note
                arpeggio with a ping-pong delay
    bass        a sine sub and a filtered saw an octave up, also sidechained
    piano       the hook, from the second platform on
    drums       kick, clap, closed and open hats, a snare roll for the builds

The bars follow the film: the logo and the typed name (1-2), the drop on
"follow us" (3-4), one platform every two bars (5-12, a tap on the third
beat of each pair), the finale on the logo (13-15).

    node render.mjs --page social.html --cues audio/social-cues.json
    python3 audio/social.py audio/social-cues.json output/social.wav
"""
import functools
import json
import sys
import wave

import numpy as np
from scipy import signal

from sport3d import SR, bandpass, boom, hall_ir, highpass, lowpass, midi, piano, secs

BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT
rng = np.random.default_rng(120)

CHORDS = {'E': [4, 8, 11], 'B': [11, 3, 6], 'C#m': [1, 4, 8], 'A': [9, 1, 4]}
ROOT = {'E': 'E', 'B': 'B', 'C#m': 'C#', 'A': 'A'}
# one chord per bar: a hint of the loop in the intro, the drop on the tonic,
# vi-IV-I-V under the platforms, a plagal close on the logo
PROG = ['C#m', 'B', 'E', 'B', 'C#m', 'A', 'E', 'B', 'C#m', 'A', 'E', 'B', 'E', 'A', 'E']
# the piano hook, one line per chord: (beat, beats, note)
HOOK = {
    'C#m': [(0, .5, 'G#4'), (.5, .5, 'B4'), (1, 1, 'C#5'), (2, .5, 'B4'), (2.5, .5, 'C#5'), (3, 1, 'E5')],
    'A': [(0, 1.5, 'C#5'), (1.5, .5, 'B4'), (2, 1, 'A4'), (3, .5, 'B4'), (3.5, .5, 'C#5')],
    'E': [(0, .5, 'G#4'), (.5, .5, 'B4'), (1, 1, 'E5'), (2, .5, 'F#5'), (2.5, .5, 'E5'), (3, 1, 'G#5')],
    'B': [(0, 1.5, 'F#5'), (1.5, .5, 'E5'), (2, 1, 'D#5'), (3, 1, 'B4')],
}
ARP = [0, 1, 2, 3, 2, 1, 2, 3, 0, 1, 2, 3, 2, 3, 1, 2]


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def bar_t(b, beat=0.0):
    """Time of a beat in bar b (bars count from 1)."""
    return (b - 1) * BAR + beat * BEAT


def near(pc, lo):
    """The first midi note at or above lo with pitch class pc."""
    return lo + (pc - lo) % 12


def voicing(chord, lo):
    """Close voicing from lo up, plus the root an octave higher."""
    notes = sorted(near(pc, lo) for pc in CHORDS[chord])
    return notes + [near(CHORDS[chord][0], notes[-1] + 1)]


# ------------------------------------------------------------------ oscillators
def blep_saw(f, n, phase0=0.0):
    """Band-limited saw at a fixed frequency (PolyBLEP)."""
    dt = f / SR
    p = (phase0 + dt * np.arange(n)) % 1.0
    x = 2 * p - 1
    a = p < dt
    u = p[a] / dt
    x[a] -= u + u - u * u - 1
    b = p > 1 - dt
    u = (p[b] - 1) / dt
    x[b] -= u * u + u + u + 1
    return x


def sweep_lowpass(x, fc, block=256, q=0.9):
    """Lowpass whose cutoff follows the array fc (Hz per sample), filtered in blocks."""
    out = np.zeros_like(x)
    zi = np.zeros((1, 2) + x.shape[1:])
    for i in range(0, len(x), block):
        f = float(np.clip(fc[min(i + block // 2, len(fc) - 1)], 30, SR * 0.45))
        w = 2 * np.pi * f / SR
        alpha = np.sin(w) / (2 * q)
        cw = np.cos(w)
        bb = np.array([(1 - cw) / 2, 1 - cw, (1 - cw) / 2])
        aa = np.array([1 + alpha, -2 * cw, 1 - alpha])
        sos = np.concatenate([bb / aa[0], aa / aa[0]])[None, :]
        out[i:i + block], zi = signal.sosfilt(sos, x[i:i + block], axis=0, zi=zi)
    return out


@functools.lru_cache(maxsize=None)
def supersaw(m, dur):
    """Seven detuned saws spread across the stereo field, with a soft attack and release."""
    n = int(SR * (dur + 0.35))
    out = np.zeros((n, 2))
    for k, cents in enumerate((-24, -15, -7, 0, 7, 15, 24)):
        x = blep_saw(hz(m) * 2 ** (cents / 1200), n, rng.random())
        pan = (k - 3) / 3 * 0.8
        out[:, 0] += x * np.sqrt((1 - pan) / 2)
        out[:, 1] += x * np.sqrt((1 + pan) / 2)
    t = np.arange(n) / SR
    env = np.minimum(1, t / 0.03) * np.clip((dur + 0.35 - t) / 0.35, 0, 1) ** 2
    return out * env[:, None] / 7


@functools.lru_cache(maxsize=None)
def pluck(m, bright=1.0):
    """A saw whose upper harmonics decay first, like a quick filter envelope."""
    f = hz(m)
    t = secs(0.6)
    x = np.zeros_like(t)
    for k in range(1, int(9000 / f) + 1):
        x += (1 / k) * np.sin(2 * np.pi * k * f * t + 0.3 * k) * np.exp(-t * (4 + k * f / (900 * bright)))
    x *= np.minimum(1, t / 0.002)
    return x / 1.6


@functools.lru_cache(maxsize=None)
def bass_note(m, dur):
    n = int(SR * (dur + 0.08))
    t = np.arange(n) / SR
    sub = np.sin(2 * np.pi * hz(m) * t)
    mid = lowpass(blep_saw(hz(m + 12), n), 520)
    env = np.minimum(1, t / 0.006) * np.clip((dur + 0.08 - t) / 0.08, 0, 1)
    return (0.8 * sub + 0.35 * mid) * env


@functools.lru_cache(maxsize=None)
def bell(m):
    """A small FM bell for the taps and the sparkles."""
    t = secs(1.6)
    f = hz(m)
    mod = 2.2 * np.exp(-t / 0.25) * np.sin(2 * np.pi * f * 3.5 * t)
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t / 0.45) * np.minimum(1, t / 0.002)


# ------------------------------------------------------------------ drums and effects
def noise(n):
    return rng.standard_normal(n)


@functools.lru_cache(maxsize=None)
def kick():
    t = secs(0.45)
    f = 48 + 110 * np.exp(-t / 0.035)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.22)
    click = highpass(noise(len(t)), 2500) * np.exp(-t / 0.004)
    return np.tanh(1.8 * body) + 0.12 * click


@functools.lru_cache(maxsize=None)
def clap():
    t = secs(0.4)
    env = np.zeros_like(t)
    for d in (0.0, 0.011, 0.022):
        env += (t >= d) * np.exp(-np.maximum(t - d, 0) / 0.007)
    env += (t >= 0.03) * np.exp(-np.maximum(t - 0.03, 0) / 0.11) * 0.7
    x = bandpass(noise(len(t)), 900, 3200) * env
    return x / np.abs(x).max()


@functools.lru_cache(maxsize=None)
def snare():
    t = secs(0.25)
    tone = np.sin(2 * np.pi * 200 * t) * np.exp(-t / 0.05)
    x = bandpass(noise(len(t)), 1500, 8000) * np.exp(-t / 0.07)
    return 0.4 * tone + 0.8 * x / np.abs(x).max()


@functools.lru_cache(maxsize=None)
def hat(open_=False):
    t = secs(0.5 if open_ else 0.08)
    x = highpass(noise(len(t)), 7000, 4) * np.exp(-t / (0.12 if open_ else 0.018))
    return x / np.abs(x).max()


def crash(dur=2.5):
    t = secs(dur)
    x = highpass(noise(len(t)), 4500, 2) * np.exp(-t / 0.7)
    x += 0.3 * bandpass(noise(len(t)), 2000, 6000) * np.exp(-t / 0.2)
    return x / np.abs(x).max()


def riser(dur):
    """Noise sweeping up with a rising saw underneath, building into the hit."""
    n = int(SR * dur)
    u = np.arange(n) / n
    fc = 300 * (9000 / 300) ** u
    x = sweep_lowpass(np.stack([noise(n), noise(n)], axis=1), fc, q=2.5)
    f = 110 * 2 ** (2 * u)
    saw = np.cumsum(f) / SR % 1 * 2 - 1
    x[:, 0] += 0.15 * lowpass(saw, 3000)
    x[:, 1] += 0.15 * lowpass(saw, 3000)
    return x / np.abs(x).max() * (u ** 2)[:, None]


def whoosh(dur=0.7):
    n = int(SR * dur)
    u = np.arange(n) / n
    fc = 600 * (7000 / 600) ** np.sin(np.pi * u)
    x = sweep_lowpass(np.stack([noise(n), noise(n)], axis=1), fc, q=1.2)
    return x / np.abs(x).max() * (np.sin(np.pi * u) ** 2)[:, None]


def pop(m):
    """A bubbly blip rising a fifth, for the icons as they pop in."""
    t = secs(0.25)
    f = hz(m) * 2 ** (7 / 12 * np.minimum(1, t / 0.05))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.07) * np.minimum(1, t / 0.002)


def key_click():
    t = secs(0.05)
    x = bandpass(noise(len(t)), 2000, 7000) * np.exp(-t / 0.006)
    x += 0.5 * np.sin(2 * np.pi * 1100 * t) * np.exp(-t / 0.01)
    return x / np.abs(x).max()


def tap():
    t = secs(0.12)
    x = np.sin(2 * np.pi * (900 + 600 * np.exp(-t / 0.01)) * t) * np.exp(-t / 0.025)
    x += 0.4 * bandpass(noise(len(t)), 3000, 9000) * np.exp(-t / 0.004)
    return x


# ------------------------------------------------------------------ score
def main(cue_path, out_path):
    cues = json.load(open(cue_path))
    dur = cues['duration']
    n = int(SR * (dur + 0.5))
    stems = {k: np.zeros((n, 2)) for k in ('pad', 'pluck', 'bass', 'piano', 'drums', 'fx')}

    def put(stem, x, t, gain=1.0, pan=0.0):
        x = np.asarray(x)
        if x.ndim == 1:
            x = np.stack([x * np.sqrt((1 - pan) / 2), x * np.sqrt((1 + pan) / 2)], axis=1) * np.sqrt(2)
        i = int(round(t * SR))
        if i >= n:
            return
        if i < 0:
            x, i = x[-i:], 0
        m = min(len(x), n - i)
        stems[stem][i:i + m] += x[:m] * gain

    bars = len(PROG)
    drop, finale = cues['drop'], cues['finale']
    # bar sections: 1-2 intro, 3-12 groove (with breaths on the builds), 13-15 finale
    groove = lambda b: 3 <= b <= 14
    kicks = []

    # ---------------------------------------------------------------- drums
    for b in range(1, bars + 1):
        for beat in range(4):
            t = bar_t(b, beat)
            build = (b == 12 and beat >= 2) or b == 15 and beat > 0
            if groove(b) and not build:
                put('drums', kick(), t, 0.95)
                kicks.append(t)
                if beat in (1, 3):
                    put('drums', clap(), t, 0.6, 0.05)
            if b == 15 and beat == 0:
                put('drums', kick(), t, 0.95)
                kicks.append(t)
            if groove(b) and not build:
                for s in range(4):  # 16th hats, accents on the off-beat
                    g = (0.15, 0.09, 0.26, 0.1)[s]
                    put('drums', hat(), t + s * BEAT / 4 + (0.008 if s % 2 else 0), g, 0.25)
                if b >= 5:
                    put('drums', hat(True), t + BEAT / 2, 0.13, -0.2)
        if b in (4, 8):  # a short fill into the next section
            for s in range(4):
                put('drums', snare(), bar_t(b, 3 + s / 4), 0.12 + 0.05 * s, 0.1)
    # the intro roll and the build before the finale, growing towards the hit
    for t0, t1 in ((bar_t(2), drop), (bar_t(12, 2), finale)):
        t = t0
        while t < t1 - 0.01:
            u = (t - t0) / (t1 - t0)
            put('drums', snare(), t, 0.05 + 0.3 * u ** 1.6, (-0.2, 0.2)[int(t * 8) % 2])
            t += BEAT / 2 if u < 0.5 else BEAT / 4 if u < 0.85 else BEAT / 8
    for t, g in ((drop, 0.38), (bar_t(5), 0.22), (bar_t(9), 0.26), (finale, 0.42)):
        put('drums', crash(), t, g, 0.15)

    # sidechain: everything melodic ducks under the kick
    duck = np.ones(n)
    for k in kicks:
        i = int(k * SR)
        m = min(n - i, int(0.3 * SR))
        tt = np.arange(m) / SR
        duck[i:i + m] = np.minimum(duck[i:i + m], 1 - 0.7 * np.exp(-tt / 0.09) * np.minimum(1, tt / 0.004 + 0.6))

    # ---------------------------------------------------------------- chords, arpeggio, bass
    for b, ch in enumerate(PROG, start=1):
        t = bar_t(b)
        last = b == bars
        length = BAR * (1.6 if last else 1.0)
        for m in voicing(ch, 56):
            put('pad', supersaw(m, length), t, 0.11)
        for m in voicing(ch, 44)[:2]:
            put('pad', supersaw(m, length), t, 0.05)
        notes = voicing(ch, 64)
        if not last:
            for s in range(16):
                bright = 0.5 + 0.7 * (b >= 3)
                put('pluck', pluck(notes[ARP[s]], bright), t + s * BEAT / 4, 0.16 if b >= 3 else 0.1, (-0.35, 0.35)[s % 2])
        if b >= 3:
            root = near(CHORDS[ch][0], 28)  # E1 .. D#2
            if last:
                put('bass', bass_note(root, BAR * 1.4), t, 0.5)
            elif b == 12:
                for beat in range(2):  # the bass drops out for the build
                    put('bass', bass_note(root, BEAT * 0.9), t + beat * BEAT, 0.5)
            else:
                for e in range(8):  # driving 8ths, the off-beats an octave up
                    put('bass', bass_note(root + 12 * (e % 2), BEAT * 0.45), t + e * BEAT / 2, 0.5 if e % 2 == 0 else 0.3)

    # the piano hook, from the second platform on, doubled an octave up in the finale
    vel = piano[12]
    for b in range(7, bars + 1):
        ch = PROG[b - 1]
        line = [(0, 3, 'G#5'), (0, 3, 'E5'), (0, 3, 'B4')] if b == bars else HOOK[ch]
        for beat, d, name in line:
            m = midi(name)
            t = bar_t(b, beat)
            put('piano', vel.play(m, dur=d * BEAT, release=0.5), t, 0.5, -0.1)
            if b >= 13:
                put('piano', piano[9].play(m + 12, dur=d * BEAT, release=0.5), t, 0.22, 0.2)
        if b == bars:  # a rising arpeggio to close
            for k, m in enumerate((52, 56, 59, 64, 68, 71, 76)):
                put('piano', piano[9].play(m, dur=1.6, release=1.0), bar_t(b, 1) + k * BEAT / 4, 0.3, -0.3 + 0.1 * k)

    # ---------------------------------------------------------------- the film's sounds
    put('fx', boom(1.0), cues['logo'], 0.4)
    for k, m in enumerate((64, 71, 76, 80)):
        put('fx', bell(m), cues['logo'] + 0.05 + 0.06 * k, 0.08, -0.3 + 0.2 * k)
    t0, t1, count = cues['typing']
    name = 'PUK SPORTS BOARD'
    for k in range(1, count + 1):
        if k <= len(name) and name[k - 1] == ' ':
            continue
        put('fx', key_click(), t0 + (t1 - t0) * k / count, 0.12, (-0.2, 0.2)[k % 2])
    put('fx', riser(drop - bar_t(2)), bar_t(2), 0.22)
    put('fx', boom(1.2), drop, 0.4)
    for k, t in enumerate(cues['pops']):
        put('fx', pop((76, 80, 83, 88)[k % 4]), t, 0.2, -0.45 + 0.3 * k)
    for c in cues['cuts']:
        put('fx', whoosh(0.7), c - 0.45, 0.2, 0.2)
    for k, t in enumerate(cues['taps']):
        put('fx', tap(), t, 0.3)
        for j, m in enumerate((83, 88, 92)):  # the sparkle as the button flips
            put('fx', bell(m), t + 0.05 + 0.07 * j, 0.07, 0.3 - 0.3 * j)
    put('fx', riser(finale - bar_t(12, 2)), bar_t(12, 2), 0.2)
    put('fx', boom(1.3), finale, 0.45)
    for k, m in enumerate((76, 80, 83, 88, 92)):
        put('fx', bell(m), finale + 0.04 * k, 0.07, -0.4 + 0.2 * k)

    # ---------------------------------------------------------------- mix
    # the pad opens up at the drop, closes for the build, opens fully in the finale
    t = np.arange(n) / SR
    fc = np.interp(t, [0, drop - 0.2, drop, bar_t(12, 2), finale - 0.05, finale, dur],
                   [500, 2600, 3600, 3600, 2000, 6000, 4500])
    stems['pad'] = sweep_lowpass(stems['pad'], fc, q=1.1)
    stems['pluck'] = sweep_lowpass(stems['pluck'], np.interp(t, [0, drop, dur], [1800, 9000, 9000]), q=0.8)
    for k in ('pad', 'bass', 'pluck'):
        stems[k] *= (duck if k != 'pluck' else 0.5 + 0.5 * duck)[:, None]
    # ping-pong delay on the plucks: a dotted 8th, alternating sides
    d = int(0.75 * BEAT * SR)
    echo = np.zeros_like(stems['pluck'])
    src = stems['pluck'].mean(axis=1)
    for k in range(1, 5):
        g = 0.38 ** k
        side = k % 2
        seg = lowpass(src, 4500 - 600 * k)[:n - d * k] * g
        echo[d * k:, side] += seg
    stems['pluck'] += echo

    ir = hall_ir(2.2, 1.6)
    sends = {'pad': 0.25, 'pluck': 0.3, 'bass': 0.0, 'piano': 0.35, 'drums': 0.06, 'fx': 0.3}
    levels = {'pad': 3.0, 'pluck': 1.0, 'bass': 0.5, 'piano': 1.9, 'drums': 0.42, 'fx': 0.8}
    dry = np.zeros((n, 2))
    send = np.zeros((n, 2))
    for k, x in stems.items():
        dry += x * levels[k]
        send += x * levels[k] * sends[k]
    wet = np.stack([signal.fftconvolve(send[:, c], ir[:, c])[:n] for c in range(2)], axis=1)
    out = highpass(dry + wet, 28)
    out += 0.3 * highpass(out, 5000)  # a little air on top
    # a gentle bus compressor, then soft clipping to the ceiling
    env = np.sqrt(lowpass(np.mean(out ** 2, axis=1), 6, 2).clip(1e-12))
    ref = np.percentile(env, 85)
    out *= np.where(env > ref * 0.6, (env / (ref * 0.6)) ** (-0.4), 1.0)[:, None]
    out *= (np.clip(t / 0.01, 0, 1) * np.clip((dur - t) / (dur - cues['outro']), 0, 1) ** 1.3)[:, None]
    out = out[:int(SR * dur)]
    out = np.tanh(1.3 * out / np.max(np.abs(out))) / np.tanh(1.3) * 10 ** (-1 / 20)
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
