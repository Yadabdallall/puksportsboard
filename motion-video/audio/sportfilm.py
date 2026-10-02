#!/usr/bin/env python3
"""Music and sound for sportfilm.html: 45 s, 18 bars at 96 bpm.

Every sport gets its own arrangement, played on the same real instruments
as the other films (Salamander grand piano and tonejs-instruments, both
CC-BY 3.0). The sport's "mood" in sports/sports.json picks the harmony, the
instruments and the rhythm:

    energetic  major, driving piano, four-on-the-floor pulse, claps
    heroic     minor, low strings and horns, taiko-like drums, ends in major
    elegant    major, flowing piano and harp, strings, a light pulse
    adventure  major with a lydian lift, horn melody, harp, open rhythm

The key comes from "key" in sports.json, or is picked from the sport's id,
so two sports with the same mood still sound different. The film's cues
(window.soundCues) place everything else: the sounds of the play itself
(kicks, hits, bounces, punches, splashes, clicks...), the start whistle or
bell, the counters, the words of the phrase, and the logo.

The music follows the film's sections: a quiet intro (bars 1-2), the field
(3-6), the facts with the melody (7-10), the phrase at full strength
(11-13), a build (14-15) and the resolution on the logo (16-18).

    node render.mjs --page sportfilm.html --query sport=football --cues output/sports/football-cues.json
    python3 audio/sportfilm.py output/sports/football-cues.json output/sports/football.wav
"""
import functools
import json
import sys
import wave
import zlib

import numpy as np
from scipy import signal

from sport3d import (BAR, BEAT, SR, bandpass, bass, boom, cello, hall_ir, harp, highpass, horn, lowpass, midi, piano, pulse,
                     rng, secs, swell, thud, violin)
from trio import air, hand, pok, punch

PC = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8,
      'A': 9, 'A#': 10, 'Bb': 10, 'B': 11}
MAJOR, MINOR = [0, 2, 4, 5, 7, 9, 11], [0, 2, 3, 5, 7, 8, 10]
ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

# 18 bars: intro 1-2, field 3-6, facts 7-10, phrase 11-13, build 14-15, logo 16-18.
# Upper case is a major chord, lower case minor.
MOODS = {
    'energetic': dict(mode='major', keys=['D', 'E', 'F', 'G', 'A', 'C'],
                      prog=['I', 'IV', 'vi', 'IV', 'I', 'V', 'vi', 'IV', 'I', 'V', 'IV', 'V', 'vi', 'IV', 'V', 'I', 'IV', 'I'],
                      ost=[0, 2, 3, 2, 4, 2, 3, 2], ost_oct=0, ost_dur=0.45, drums='four', shaker=8, clap=True,
                      lead='piano', strings_from=5, horns_from=11, harp=False),
    'elegant': dict(mode='major', keys=['Eb', 'F', 'G', 'Ab', 'Bb', 'D'],
                    prog=['I', 'IV', 'I', 'iii', 'IV', 'V', 'vi', 'iii', 'IV', 'V', 'IV', 'V', 'vi', 'ii', 'V', 'I', 'IV', 'I'],
                    ost=[0, 2, 3, 4, 5, 4, 3, 2], ost_oct=0, ost_dur=0.9, drums='soft', shaker=0, clap=False,
                    lead='piano', strings_from=3, horns_from=11, harp=True),
    'adventure': dict(mode='major', keys=['D', 'E', 'F', 'G', 'A'],
                      prog=['I', 'II', 'I', 'II', 'IV', 'V', 'vi', 'IV', 'I', 'V', 'IV', 'V', 'vi', 'IV', 'V', 'I', 'IV', 'I'],
                      ost=[0, 2, 3, 9, 4, 3, 9, 2], ost_oct=0, ost_dur=0.6, drums='half', shaker=16, clap=False,
                      lead='horn', strings_from=3, horns_from=7, harp=True),
    'heroic': dict(mode='minor', keys=['C', 'D', 'E', 'F', 'G', 'A', 'B'],
                   prog=['i', 'VI', 'i', 'VII', 'VI', 'V', 'i', 'VI', 'III', 'VII', 'VI', 'VII', 'i', 'VI', 'V', 'i', 'VI', 'I'],
                   ost=[0, 0, 2, 0, 3, 0, 2, 0], ost_oct=-12, ost_dur=0.22, drums='taiko', shaker=0, clap=False,
                   lead='horn', strings_from=3, horns_from=7, harp=False),
}
# The melody as a contour: (beat, beats, semitones above the tonic). Each
# note snaps to the nearest tone of the bar's chord ("p" notes to the scale),
# so the same line fits every key, mode and progression.
MELODY = {
    7: [(0, 1.5, 7), (1.5, 0.5, 4), (2, 1, 9), (3, 1, 7)],
    8: [(0, 2, 5), (2, 1, 4), (3, 1, 2, 'p')],
    9: [(0, 1.5, 4), (1.5, 0.5, 7), (2, 2, 12)],
    10: [(0, 2, 11), (2, 1, 7), (3, 1, 2, 'p')],
    11: [(0, 1, 9), (1, 1, 12), (2, 2, 16)],
    12: [(0, 1, 14), (1, 1, 12), (2, 2, 11)],
    13: [(0, 3, 12), (3, 1, 16)],
    16: [(0, 4, 16)],
    17: [(0, 2, 17), (2, 2, 12)],
}


def section(b):
    return 'intro' if b <= 2 else 'field' if b <= 6 else 'facts' if b <= 10 else 'phrase' if b <= 13 else 'build' if b <= 15 else 'end'


def chord(sym, tonic, mode):
    deg = ROMAN.index(sym.upper())
    root = (tonic + (MAJOR if mode == 'major' else MINOR)[deg]) % 12
    third = 4 if sym.isupper() else 3
    return root, third, [root, (root + third) % 12, (root + 7) % 12]


def near(pcs, target):
    """The MIDI note nearest to target whose pitch class is in pcs (the higher one on a tie)."""
    return min((m for m in range(target - 12, target + 13) if m % 12 in pcs), key=lambda m: (abs(m - target), -m))


def voicing(pcs, center, n):
    cands = sorted((m for m in range(center - 9, center + 10) if m % 12 in pcs), key=lambda m: abs(m - center))
    return sorted(cands[:n])


# ------------------------------------------------------------------ sounds of the play
def noise(dur, lo, hi, decay, attack=0.0):
    t = secs(dur)
    x = bandpass(rng.standard_normal(len(t)), lo, min(hi, SR / 2 - 100)) * np.exp(-t / decay)
    if attack:
        x *= np.minimum(1, t / attack)
    return np.stack([x, x], axis=1) / (np.abs(x).max() + 1e-9)


def tone(freq, dur, decay, partials=((1, 1.0),)):
    t = secs(dur)
    x = sum(a * np.sin(2 * np.pi * freq * k * t) * np.exp(-t / (decay / k ** 0.5)) for k, a in partials)
    x *= np.minimum(1, t / 0.002)
    return np.stack([x, x], axis=1) / (np.abs(x).max() + 1e-9)


def mix(*parts):
    n = max(len(p) for p, _ in parts)
    out = np.zeros((n, 2))
    for p, g in parts:
        out[:len(p)] += p * g
    return out


def kick():  # a foot on a leather ball
    t = secs(0.3)
    body = np.sin(2 * np.pi * np.cumsum(70 + 90 * np.exp(-t / 0.015)) / SR) * np.exp(-t / 0.06)
    return mix((np.stack([body, body], 1), 1.0), (noise(0.1, 700, 3000, 0.01), 0.45))


def dribble():  # a basketball on a wooden floor
    t = secs(0.35)
    body = np.sin(2 * np.pi * np.cumsum(120 * (0.8 + 0.2 * np.exp(-t / 0.02))) / SR) * np.exp(-t / 0.07)
    return mix((np.stack([body, body], 1), 1.0), (pok(900, 0.01), 0.3))


def clank():  # steel plates
    return mix((tone(310, 0.9, 0.35, ((1, 1), (2.76, 0.6), (5.4, 0.35), (8.9, 0.2))), 0.7), (thud(90), 0.6))


def clash():  # blades
    return mix((tone(2100, 0.6, 0.18, ((1, 1), (1.62, 0.7), (2.47, 0.5), (3.9, 0.3))), 0.6), (noise(0.08, 3000, 12000, 0.01), 0.4))


def beep(freq=1000, dur=0.28):
    t = secs(dur + 0.05)
    x = np.sin(2 * np.pi * freq * t) * np.clip(np.minimum(t / 0.01, (dur - t) / 0.03 + 1), 0, 1)
    return np.stack([x, x], 1)


def whistle():  # a referee's whistle, with the pea's flutter
    t = secs(0.55)
    x = np.sin(2 * np.pi * np.cumsum(2900 + 60 * np.sin(2 * np.pi * 34 * t)) / SR) * (0.6 + 0.4 * np.sin(2 * np.pi * 34 * t))
    x *= np.clip(np.minimum(t / 0.03, (0.55 - t) / 0.08), 0, 1)
    return np.stack([x, x], 1) * 0.8 + noise(0.55, 2500, 6000, 0.3, 0.03) * 0.15


def bell():  # the ring bell, twice
    one = tone(760, 1.6, 0.6, ((1, 1), (2.76, 0.5), (5.4, 0.25), (8.9, 0.1)))
    out = np.zeros((len(one) + int(0.26 * SR), 2))
    out[:len(one)] += one
    out[int(0.26 * SR):] += one * 0.8
    return out


def engine():  # a car passing: a low buzz that falls in pitch
    t = secs(0.9)
    f = 150 * (1.25 - 0.45 * t / 0.9)
    x = signal.sawtooth(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.9) ** 2
    x = lowpass(x, 1100)
    return np.stack([x, x], 1) / np.abs(x).max()


def splash():
    return mix((noise(0.5, 400, 7000, 0.12, 0.01), 1.0), (noise(0.3, 150, 600, 0.08), 0.5))


def gallop():
    out = np.zeros((int(0.5 * SR), 2))
    for k, d in enumerate((0, 0.07, 0.16, 0.23)):
        x = thud(110 + 20 * k)
        out[int(d * SR):int(d * SR) + len(x)] += x[:len(out) - int(d * SR)] * (0.8 if k % 2 else 1)
    return out


def rumble(dur=1.2):  # a ball rolling down a lane
    t = secs(dur)
    x = lowpass(rng.standard_normal(len(t)), 260) * (t / dur) ** 1.5
    return np.stack([x, x], 1) / np.abs(x).max()


def pins():
    out = np.zeros((int(0.7 * SR), 2))
    r = np.random.default_rng(3)
    for k in range(9):
        x = pok(700 + 900 * r.random(), 0.04)
        i = int(r.random() * 0.18 * SR)
        out[i:i + len(x)] += x * (0.4 + 0.4 * r.random())
    out[:len(thud(80))] += thud(80) * 0.8
    return out


def blip():
    return mix((tone(1320, 0.18, 0.05), 0.6), (tone(1980, 0.18, 0.03), 0.4))


# (family, role) -> (sound, gain). A role with no entry for the family falls back to ('*', role).
def play_sound(family, role):
    S = {
        ('ball', 'touch'): (kick, 0.5), ('hand', 'touch'): (hand, 0.42), ('bounce', 'touch'): (dribble, 0.5),
        ('stick', 'touch'): (lambda: mix((pok(1100, 0.015), 1), (noise(0.05, 2000, 6000, 0.008), 0.4)), 0.4),
        ('water', 'touch'): (lambda: mix((hand(), 0.7), (splash(), 0.4)), 0.45),
        ('racket', 'hit'): (lambda: mix((pok(950, 0.03), 1), (tone(2600, 0.1, 0.012), 0.3)), 0.42),
        ('racket', 'bounce'): (lambda: pok(320, 0.02), 0.3),
        ('pingpong', 'hit'): (lambda: pok(1300, 0.03), 0.34), ('pingpong', 'bounce'): (lambda: pok(2300, 0.018), 0.26),
        ('shuttle', 'hit'): (lambda: mix((noise(0.08, 1500, 7000, 0.015), 1), (pok(700, 0.015), 0.5)), 0.36),
        ('hand', 'hit'): (hand, 0.42), ('ball', 'hit'): (kick, 0.45),
        ('bat', 'hit'): (lambda: mix((noise(0.06, 1000, 6000, 0.008), 1), (pok(1800, 0.012), 0.8), (thud(140), 0.4)), 0.5),
        ('glove', 'strike'): (punch, 0.45),
        ('body', 'strike'): (lambda: mix((punch(), 0.6), (noise(0.2, 300, 2500, 0.05), 0.3)), 0.4),
        ('blade', 'strike'): (clash, 0.32),
        ('body', 'finish'): (lambda: mix((thud(70), 1), (boom(0.6), 0.6)), 0.45),
        ('blade', 'finish'): (lambda: mix((clash(), 0.6), (beep(1040, 0.5), 0.35)), 0.4),
        ('foot', 'pass'): (lambda: air(0.6, 600, 5000), 0.16), ('wheel', 'pass'): (lambda: air(0.8, 200, 2500), 0.2),
        ('motor', 'pass'): (engine, 0.18), ('water', 'pass'): (splash, 0.22), ('water', 'turn'): (splash, 0.3),
        ('hoof', 'pass'): (gallop, 0.35), ('ice', 'pass'): (lambda: air(0.4, 1500, 9000), 0.2),
        ('air', 'pass'): (lambda: air(1.2, 200, 1500), 0.2),
        ('metal', 'pull'): (lambda: air(0.5, 400, 3000), 0.18), ('metal', 'lock'): (clank, 0.4),
        ('metal', 'light'): (lambda: beep(880, 0.16), 0.16), ('metal', 'drop'): (lambda: mix((clank(), 1), (boom(0.5), 0.6)), 0.45),
        ('mat', 'jump'): (lambda: air(0.5, 600, 6000), 0.14), ('mat', 'land'): (lambda: mix((thud(110), 1), (noise(0.1, 200, 1500, 0.02), 0.4)), 0.4),
        ('water', 'jump'): (lambda: air(0.5, 600, 6000), 0.14), ('water', 'land'): (splash, 0.35),
        ('ice', 'jump'): (lambda: air(0.5, 1500, 8000), 0.14), ('ice', 'land'): (lambda: mix((thud(120), 1), (noise(0.2, 2000, 9000, 0.06), 0.5)), 0.35),
        ('wood', 'move'): (lambda: mix((pok(900, 0.02), 1), (pok(1700, 0.01), 0.6)), 0.4),
        ('digital', 'move'): (blip, 0.22),
        ('arrow', 'impact'): (lambda: mix((thud(210), 1), (pok(1400, 0.008), 0.5)), 0.42),
        ('gun', 'impact'): (lambda: mix((noise(0.06, 2000, 9000, 0.02), 1), (pok(1200, 0.01), 0.5)), 0.35),
        ('golf', 'swing'): (lambda: mix((air(0.3, 800, 6000), 0.5), (pok(2600, 0.008), 1)), 0.4),
        ('golf', 'land'): (lambda: thud(150), 0.25), ('golf', 'score'): (lambda: mix((pok(420, 0.05), 1), (pok(260, 0.06), 0.8)), 0.45),
        ('pins', 'release'): (rumble, 0.3), ('pins', 'impact'): (pins, 0.5),
        ('stone', 'release'): (lambda: noise(1.1, 200, 1500, 0.6, 0.15), 0.18), ('stone', 'impact'): (lambda: mix((pok(520, 0.04), 1), (thud(120), 0.6)), 0.42),
        ('balls', 'impact'): (lambda: mix((pok(2500, 0.01), 1), (pok(3400, 0.008), 0.6)), 0.38), ('balls', 'pocket'): (lambda: pok(220, 0.06), 0.4),
        ('bat', 'land'): (lambda: thud(130), 0.25), ('bat', 'step'): (lambda: thud(100), 0.25),
        ('thud', 'release'): (lambda: air(0.4, 400, 3000), 0.16), ('thud', 'land'): (lambda: mix((thud(75), 1), (noise(0.25, 200, 1200, 0.06), 0.5)), 0.45),
        ('foot', 'release'): (lambda: air(0.4, 500, 4000), 0.14), ('foot', 'land'): (lambda: mix((thud(95), 1), (noise(0.3, 300, 2500, 0.08), 0.6)), 0.42),
        ('rock', 'step'): (lambda: mix((thud(95), 1), (noise(0.08, 400, 3000, 0.02), 0.6)), 0.35),
        ('wheel', 'step'): (lambda: air(0.5, 200, 2000), 0.18),
        ('wheel', 'jump'): (lambda: air(0.4, 300, 3000), 0.16), ('wheel', 'land'): (lambda: thud(120), 0.35),
        ('motor', 'jump'): (engine, 0.16), ('motor', 'land'): (lambda: thud(90), 0.35),
        ('hoof', 'jump'): (lambda: air(0.4, 300, 3000), 0.14), ('hoof', 'land'): (gallop, 0.4),
        ('foot', 'jump'): (lambda: air(0.4, 500, 4000), 0.14), ('foot', 'land'): (lambda: thud(110), 0.35),
        ('*', 'touch'): (kick, 0.4), ('*', 'hit'): (lambda: pok(900, 0.03), 0.35), ('*', 'bounce'): (lambda: pok(320, 0.02), 0.25),
        ('*', 'strike'): (punch, 0.35), ('*', 'pass'): (lambda: air(0.6, 400, 4000), 0.16), ('*', 'step'): (lambda: thud(110), 0.3),
        ('*', 'impact'): (lambda: thud(150), 0.35), ('*', 'release'): (lambda: air(0.4, 400, 3000), 0.14),
        ('*', 'land'): (lambda: thud(110), 0.35), ('*', 'move'): (lambda: pok(1000, 0.02), 0.3), ('*', 'jump'): (lambda: air(0.4, 500, 5000), 0.14),
        ('*', 'turn'): (lambda: air(0.4, 400, 4000), 0.15), ('*', 'pull'): (lambda: air(0.5, 400, 3000), 0.15),
        ('*', 'lock'): (clank, 0.35), ('*', 'light'): (lambda: beep(880, 0.16), 0.15), ('*', 'drop'): (clank, 0.4),
        ('*', 'pocket'): (lambda: pok(220, 0.06), 0.35), ('*', 'swing'): (lambda: air(0.3, 800, 6000), 0.2),
    }
    hit = S.get((family, role)) or S.get(('*', role))
    return (hit[0](), hit[1]) if hit else (None, 0)


# The samplers repitch the whole recording for every detuned note; keep each
# (note, detune) once, which makes a whole score several times faster.
@functools.lru_cache(maxsize=None)
def _recording(inst, m, detune):
    x = inst.raw(m)
    return signal.resample(x, int(len(x) / 2 ** (detune / 1200)), axis=0) if detune else x


def _play(inst, name, dur=None, attack=0.0, release=0.4, detune=0.0):
    m = midi(name) if isinstance(name, str) else name
    x = _recording(inst, m, detune).copy()
    if dur is not None:
        k = min(len(x), int(SR * (dur + release)))
        x = x[:k]
        t = np.arange(k) / SR
        x *= np.clip((dur + release - t) / release, 0, 1)[:, None] ** 2
    if attack:
        x[:int(SR * attack)] *= np.linspace(0, 1, int(SR * attack))[:, None] ** 1.5
    return x


for _inst in (violin, cello, bass, horn, harp, *piano.values()):
    _inst.play = functools.partial(_play, _inst)

START = {'whistle': (whistle, 0.2), 'bell': (bell, 0.22), 'beep': (lambda: beep(1000, 0.35), 0.16),
         'gun': (lambda: mix((noise(0.25, 300, 6000, 0.04), 1), (thud(80), 0.6)), 0.32)}


# ------------------------------------------------------------------ the arrangement
def main(cue_path, out_path):
    cues = json.load(open(cue_path))
    sport = cues['sport']
    M = MOODS.get(sport['mood'], MOODS['energetic'])
    key = sport.get('key') or M['keys'][zlib.crc32(sport['id'].encode()) % len(M['keys'])]
    tonic = PC[key.rstrip('m')]
    mode = M['mode']
    scale = [(tonic + i) % 12 for i in (MAJOR if mode == 'major' else MINOR)]
    dur = cues['duration']
    n = int(SR * dur)
    stems = {k: np.zeros((n, 2)) for k in ('piano', 'strings', 'brass', 'harp', 'bass', 'perc', 'fx')}
    bar_t = lambda b, beat=0.0: (b - 1) * BAR + beat * BEAT
    human = lambda: rng.normal(0, 0.005)
    # a pitched thud tuned to the key, so the stamps sit in the harmony
    tthud = lambda: thud(440 * 2 ** ((near([tonic], 45) - 69) / 12) * 2)

    def put(stem, x, at, gain=1.0, pan=0.0):
        i = int(round(at * SR))
        if x is None or i >= n:
            return
        if i < 0:
            x, i = x[-i:], 0
        x = x[:n - i] * gain
        l, r = np.cos((pan + 1) * np.pi / 4) * np.sqrt(2), np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)
        stems[stem][i:i + len(x), 0] += x[:, 0] * l
        stems[stem][i:i + len(x), 1] += x[:, 1] * r

    def strings(notes, at, length, gain, attack=0.5, release=0.9, players=3):
        for j, m in enumerate(notes):
            for det, dly, pan in [(-6, 0.0, -0.45), (5, 0.018, 0.1), (0, 0.034, 0.5)][:players]:
                put('strings', violin.play(m, dur=length, attack=attack, release=release, detune=det), at + dly - 0.04, gain, pan - 0.08 * j)

    chords = [chord(sym, tonic, mode) for sym in M['prog']]
    base = 60 + tonic if tonic >= 6 else 72 + tonic  # the melody's tonic, between F#4 and F5

    for b in range(1, 19):
        root, third, pcs = chords[b - 1]
        sec = section(b)
        r4 = near([root], 60 if M['ost_oct'] == 0 else 57)
        tones = [r4, r4 + third, r4 + 7, r4 + 12, r4 + 12 + third, r4 + 19]
        pick = lambda k: (r4 + 14) if k == 9 else tones[k]

        # piano
        if sec == 'intro':
            for k, m in enumerate([near([root], 48), r4, r4 + 7, r4 + 12 + third]):
                put('piano', piano[5].play(m, dur=BAR * 0.9, release=1.6), bar_t(b) + 0.03 * k, 0.55, -0.2 + 0.1 * k)
            put('piano', piano[5].play(r4 + 7, dur=BEAT * 1.5, release=1.2), bar_t(b, 2), 0.42, 0.2)
            for det, dly, pan in [(-4, 0.0, -0.3), (4, 0.022, 0.2)]:
                put('strings', cello.play(near([root], 45), dur=BAR, attack=0.6, release=0.8, detune=det), bar_t(b) + dly, 0.12, pan)
        elif sec in ('field', 'facts', 'phrase') or b == 15:
            vel = 5 if sec == 'field' and sport['mood'] in ('elegant', 'adventure') else 9
            g = {'field': 0.3, 'facts': 0.32, 'phrase': 0.36}.get(sec, 0.3)
            for k, idx in enumerate(M['ost']):
                gk = g * (0.55 + 0.45 * k / 7) if b == 15 else g * (1.0 if k % 2 == 0 else 0.8)
                put('piano', piano[vel].play(pick(idx) + M['ost_oct'], dur=BEAT * M['ost_dur'], release=0.5), bar_t(b, k * 0.5) + human(), gk, -0.2)
            if sec == 'phrase':
                for beat in (0, 2):
                    put('piano', piano[9].play(near([root], 38), dur=BEAT * 1.8, release=1.0), bar_t(b, beat), 0.36, -0.3)
                    put('piano', piano[9].play(near([root], 38) + 12, dur=BEAT * 1.8, release=1.0), bar_t(b, beat), 0.28, -0.3)
        elif b == 14:
            for k, idx in enumerate([0, 2, 3, 4]):
                put('piano', piano[5].play(tones[idx], dur=BEAT * 0.9, release=0.8), bar_t(b, k) + human(), 0.34, -0.1)
        else:  # the end: a big rolled chord, then a plagal close
            vel, g = (12, 0.42) if b == 16 else (9, 0.34)
            length = BAR * 0.95 if b < 18 else 3.6
            for k, m in enumerate([near([root], 38), near([root], 38) + 12, r4, r4 + 7, r4 + 12, r4 + 12 + third]):
                put('piano', piano[vel].play(m, dur=length, release=1.8), bar_t(b) + 0.025 * k, g, -0.25 + 0.1 * k)
            if b == 18:
                put('piano', piano[5].play(base + 24 if base + 24 < 100 else base + 12, dur=1.2, release=1.6), bar_t(b, 2), 0.2, 0.3)

        # strings, cello, bass
        if b >= M['strings_from']:
            center, nv, g, att = {'field': (74, 3, 0.07, 0.7), 'facts': (76, 3, 0.09, 0.5), 'phrase': (79, 4, 0.12, 0.35),
                                  'build': (76, 3, 0.08, 1.2), 'end': (79, 4, 0.12, 0.4)}.get(sec, (74, 3, 0.06, 0.8))
            if sport['mood'] == 'heroic':
                center -= 5
            strings(voicing(pcs, center, nv), bar_t(b), 3.6 if b == 18 else BAR + 0.15, g, att, 1.5 if b == 18 else 0.9)
        if b >= 3:
            low = near([root], 45)
            if sport['mood'] == 'heroic' and sec in ('field', 'facts', 'phrase'):
                for k in range(8):
                    put('strings', cello.play(low, dur=0.2, attack=0.01, release=0.15), bar_t(b, k * 0.5), 0.26 if k % 2 == 0 else 0.18, -0.25)
            else:
                for beat, m in ((0, low), (2, near([(root + 7) % 12], low + 4))):
                    for det, dly, pan in [(-4, 0.0, -0.3), (4, 0.022, 0.2)]:
                        put('strings', cello.play(m, dur=BEAT * 1.9, attack=0.2, release=0.5, detune=det), bar_t(b, beat) + dly, 0.16, pan)
            bnote = near([root], 33)
            if sport['mood'] == 'energetic' and sec in ('facts', 'phrase'):
                for beat in (0, 2):
                    put('bass', bass.play(bnote, dur=BEAT * 1.4, attack=0.03, release=0.3), bar_t(b, beat), 0.5, -0.1)
            else:
                put('bass', bass.play(bnote, dur=(3.6 if b == 18 else BAR + 0.1), attack=0.25, release=0.8), bar_t(b) - 0.03, 0.5, -0.1)

        # horns: a warm pad from the phrase (or earlier for the heroic and adventurous moods)
        if b >= M['horns_from']:
            g = 0.12 if sec in ('phrase', 'end') else 0.08
            for m in (near([root], 53), near([(root + 7) % 12], 57)):
                for det, dly, pan in [(-5, 0.0, -0.25), (5, 0.025, 0.25)]:
                    put('brass', horn.play(m, dur=(3.4 if b == 18 else BAR), attack=0.5, release=0.9, detune=det), bar_t(b) + dly - 0.04, g, pan)

        # harp arpeggios for the elegant and adventurous moods
        if M['harp'] and sec in ('field', 'build'):
            arp = [m for m in range(r4, r4 + 26) if m % 12 in pcs][:8]
            for k, m in enumerate(arp):
                put('harp', harp.play(m, dur=1.2, release=1.0), bar_t(b, k * 0.25), 0.12, -0.4 + 0.1 * k)

        # the melody
        for note in MELODY.get(b, []):
            beat, beats, off = note[:3]
            m = near(scale if len(note) > 3 else pcs, base + off)
            at = bar_t(b, beat) + human()
            lead = 'piano' if sec in ('phrase', 'end') else M['lead']
            if lead == 'horn':
                for det, dly, pan in [(-4, 0.0, -0.1), (4, 0.02, 0.15)]:
                    put('brass', horn.play(m - 12, dur=beats * BEAT * 0.95, attack=0.08, release=0.6, detune=det), at + dly, 0.2, pan)
            else:
                put('piano', piano[12 if sport['mood'] == 'energetic' else 9].play(m, dur=beats * BEAT * 0.95, release=1.3), at, 0.5, 0.15)
            if sec in ('phrase', 'end'):
                strings([m + 12 if m + 12 <= 96 else m], at, beats * BEAT * 0.95, 0.07, 0.12, 0.7, players=2)

    # ---------------------------------------------------------------- rhythm
    drums = M['drums']
    for b in range(1, 19):
        sec = section(b)
        if sec in ('field', 'facts', 'phrase'):
            lvl = {'field': 0.8, 'facts': 1.0, 'phrase': 1.15}[sec]
            if drums == 'four':
                for beat in range(4):
                    put('perc', pulse(), bar_t(b, beat), 0.24 * lvl)
            elif drums == 'half':
                for beat in (0, 2):
                    put('perc', pulse(), bar_t(b, beat), 0.24 * lvl)
                if b % 2 == 0:
                    put('perc', thud(105), bar_t(b, 3.5), 0.22 * lvl, 0.2)
            elif drums == 'soft' and sec != 'field':
                put('perc', pulse(), bar_t(b), 0.2 * lvl)
            elif drums == 'taiko':
                for beat, g in ((0, 1.0), (0.75, 0.45), (1.5, 0.6), (2, 0.9), (3, 0.7), (3.5, 0.55)):
                    put('perc', thud(88 if beat in (0, 2) else 120), bar_t(b, beat), 0.38 * g * lvl, -0.15 if beat % 1 else 0.1)
            if M['shaker'] and sec != 'field':
                # off-beat eighths, or soft sixteenths
                beats = [k + 0.5 for k in range(4)] if M['shaker'] == 8 else [k * 0.25 for k in range(16)]
                for k, beat in enumerate(beats):
                    g = 0.05 if M['shaker'] == 8 else (0.035 if k % 2 else 0.02)
                    put('perc', noise(0.06, 6000, 14000, 0.012), bar_t(b, beat), g, 0.3)
            if M['clap'] and sec == 'phrase':
                for beat in (1, 3):
                    for d in (0.0, 0.012, 0.025):
                        put('perc', noise(0.12, 900, 5000, 0.02 if d else 0.05), bar_t(b, beat) + d, 0.09, -0.1)
        if b == 14 and drums != 'soft':
            for beat in (0, 2):
                put('perc', pulse() if drums != 'taiko' else thud(88), bar_t(b, beat), 0.22)
        if b == 15:  # the build: a roll that grows into the logo
            steps = 16 if drums in ('four', 'taiko') else 8
            for k in range(steps):
                g = 0.05 + 0.25 * (k / steps) ** 1.5
                put('perc', thud(110) if drums == 'taiko' else pulse(), bar_t(b, k * 4 / steps), g)
    for c, g in [(cues['cuts'][0], 0.18), (cues['cuts'][1], 0.26), (cues['cuts'][2], 0.32), (cues['cuts'][4], 0.48)]:
        put('perc', boom(1.0 if g > 0.3 else 0.8), c, g)

    # ---------------------------------------------------------------- the film's sounds
    for c in cues['cuts']:
        put('fx', air(0.9, 250, 3500), c - 0.5, 0.16, 0.3)
    put('fx', swell(2.2), cues['cuts'][4] - 2.2, 0.12)
    put('fx', tthud(), cues['land'], 0.28)
    put('harp', harp.play(base + 12 - 12 * (base + 12 > 88), dur=1.4, release=1.2), cues['land'], 0.16, 0.2)
    for k, m in enumerate(voicing(chords[0][2], base + 4, 3)):
        put('harp', harp.play(m, dur=1.2, release=1.2), cues['title'] + 0.08 * k, 0.1, -0.3 + 0.3 * k)
    if sport.get('start') in START:
        fn, g = START[sport['start']]
        put('fx', fn(), cues['start'] - 0.2, g, 0.1)
    fam = sport['sfx']
    for i, e in enumerate(cues['events']):
        x, g = play_sound(fam, e['role'])
        put('fx', x, e['t'], g, (-0.25, 0.25)[i % 2])
        if e['role'] in ('score', 'finish'):
            if x is None:
                put('fx', air(0.6, 2000, 9000), e['t'], 0.2)
            put('perc', boom(0.7), e['t'], 0.22)
            for k, m in enumerate(voicing([scale[0], scale[2], scale[4]], base + 7, 3) + [base + 12]):
                put('harp', harp.play(m, dur=1.2, release=1.2), e['t'] + 0.06 * k, 0.14, -0.3 + 0.2 * k)
    # the counters tick, slowing as the number settles, and land with a soft stamp
    for t0, t1 in cues['counts']:
        t = t0
        while t < t1 - 0.05:
            u = (t - t0) / (t1 - t0)
            put('fx', pok(3200, 0.006), t, 0.05 * (1 - u) + 0.015, 0.2)
            t += 0.045 + 0.2 * u ** 2
        put('fx', tthud(), t1, 0.24)
        put('harp', harp.play(near([scale[4]], base + 7), dur=1.0, release=1.0), t1, 0.12, -0.2)
    # one harp note for each word of the phrase, climbing the scale
    for k, t in enumerate(cues['words']):
        put('harp', harp.play(near(scale, base + [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19][k % 12]), dur=1.0, release=1.2), t, 0.12, -0.3 + 0.1 * (k % 6))
        put('fx', air(0.5, 1500, 7000), t - 0.1, 0.04, 0.2)
    # the globe: a bright fifth and octave
    put('fx', tthud(), cues['status'], 0.25)
    for k, off in enumerate((7, 12)):
        put('harp', harp.play(near(scale, base + off), dur=1.4, release=1.2), cues['status'] + 0.15 * k, 0.15, 0.2 * k)
    # a glissando into the logo
    gl = [m for m in range(base - 12, base + 15) if m % 12 in scale]
    for k, m in enumerate(gl):
        put('harp', harp.play(m, dur=1.4, release=1.0), cues['logo'] - 0.4 + k * 0.03, 0.13, -0.5 + k / len(gl))

    # ---------------------------------------------------------------- mix
    ir = hall_ir()
    sends = {'piano': 0.26, 'strings': 0.5, 'brass': 0.45, 'harp': 0.5, 'bass': 0.12, 'perc': 0.14, 'fx': 0.25}
    levels = {'piano': 1.0, 'strings': 0.9, 'brass': 0.8, 'harp': 0.8, 'bass': 0.8, 'perc': 0.9, 'fx': 0.85}
    dry = np.zeros((n, 2))
    send = np.zeros((n, 2))
    for k, x in stems.items():
        dry += x * levels[k]
        send += x * levels[k] * sends[k]
    wet = np.stack([signal.fftconvolve(send[:, c], ir[:, c])[:n] for c in range(2)], axis=1)
    out = highpass(dry + wet * 1.1, 30)
    env = np.sqrt(lowpass(np.mean(out ** 2, axis=1), 8, 2).clip(1e-12))
    ref = np.percentile(env, 90)
    out *= np.where(env > ref * 0.5, (env / (ref * 0.5)) ** (-0.5), 1.0)[:, None]
    t = secs(dur)[:n]
    out *= (np.clip(t / 0.03, 0, 1) * np.clip((dur - t) / (dur - cues['outro']), 0, 1) ** 1.2)[:, None]
    out = np.tanh(1.1 * out / np.max(np.abs(out))) / np.tanh(1.1) * 10 ** (-1 / 20)
    with wave.open(out_path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(out, -1, 1) * 32767).astype('<i2').tobytes())
    print(f'wrote {out_path}: {sport["id"]}, {sport["mood"]} in {key} {mode}, {dur}s, '
          f'rms {20 * np.log10(np.sqrt(np.mean(out ** 2))):.1f} dBFS')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
