#!/usr/bin/env python3
"""Music for memorial.html: 50 s, an elegy in 3/4 at about 76 bpm.

Real instruments only (Salamander grand piano and tonejs-instruments, both
CC-BY 3.0): piano, cello, violins, double bass, a soft horn and a harp. The
key is D in maqam Kurd (the Phrygian mode, with its flat second, E flat),
with a raised C sharp on the dominant, and the last chord turns to D major.

The film shows one photo every two bars (4.75 s), so the music follows it
bar by bar:

    bars 1-2    the candle and the title: piano alone
    bars 3-6    the first photos: flowing piano, the strings come in
    bars 7-10   the cello sings the melody
    bars 11-18  the violins take it, the bass and horn fill out, the
                climax on the presidency (bars 13-16)
    bars 19-21  the candle again and the logo: the piano's first motif, a
                harp glissando on the logo, D major

    node render.mjs --page memorial.html --cues audio/memorial-cues.json
    python3 audio/memorial.py audio/memorial-cues.json output/memorial.wav
"""
import json
import sys
import wave

import numpy as np
from scipy import signal

from sport3d import SR, boom, cello, hall_ir, harp, highpass, horn, lowpass, midi, piano, secs, swell, violin
from sport3d import bass as dbass

CHORDS = {'Dm': (2, [2, 5, 9]), 'Eb/D': (2, [3, 7, 10]), 'Bb': (10, [10, 2, 5]), 'Gm': (7, [7, 10, 2]),
          'Eb': (3, [3, 7, 10]), 'A': (9, [9, 1, 4]), 'C': (0, [0, 4, 7]), 'F': (5, [5, 9, 0]), 'D': (2, [2, 6, 9])}
PROG = ['Dm', 'Eb/D', 'Dm', 'Bb', 'Gm', 'Eb', 'Bb', 'A', 'Dm', 'Bb', 'Gm', 'C', 'F', 'Bb', 'Gm', 'Eb', 'Dm', 'A',
        'Dm', 'Eb/D', 'D']
# (bar, beat, beats, note)
PIANO_MOTIF = [(1, 0, 1, 'A4'), (1, 1, 1, 'D5'), (1, 2, 1, 'F5'), (2, 0, 1.5, 'G5'), (2, 1.5, 0.5, 'F5'), (2, 2, 1, 'Eb5'),
               (3, 0, 2, 'D5'), (3, 2, 1, 'A4'), (4, 0, 2, 'F5'), (4, 2, 1, 'D5'),
               (19, 0, 1, 'A5'), (19, 1, 1, 'F5'), (19, 2, 1, 'D5'), (20, 0, 1, 'G5'), (20, 1, 1, 'Eb5'), (20, 2, 1, 'Bb4'),
               (21, 0, 3, 'A4')]
CELLO_MELODY = [(5, 0, 2, 'Bb3'), (5, 2, 1, 'A3'), (6, 0, 1.5, 'G3'), (6, 1.5, 0.5, 'F3'), (6, 2, 1, 'Eb3'),
                (7, 0, 2, 'D3'), (7, 2, 0.5, 'F3'), (7, 2.5, 0.5, 'Bb3'), (8, 0, 3, 'A3'),
                (9, 0, 1, 'A3'), (9, 1, 1, 'D4'), (9, 2, 1, 'F4'), (10, 0, 2, 'F4'), (10, 2, 0.5, 'Eb4'), (10, 2.5, 0.5, 'D4')]
VIOLIN_MELODY = [(11, 0, 1.5, 'D5'), (11, 1.5, 0.5, 'Bb4'), (11, 2, 1, 'G4'), (12, 0, 2, 'C5'), (12, 2, 1, 'E5'),
                 (13, 0, 1, 'F5'), (13, 1, 1, 'A5'), (13, 2, 1, 'C6'), (14, 0, 2, 'D6'), (14, 2, 1, 'C6'),
                 (15, 0, 1, 'Bb5'), (15, 1, 1, 'A5'), (15, 2, 1, 'G5'), (16, 0, 2, 'G5'), (16, 2, 0.5, 'F5'), (16, 2.5, 0.5, 'Eb5'),
                 (17, 0, 2, 'D5'), (17, 2, 1, 'F5'), (18, 0, 1.5, 'E5'), (18, 1.5, 0.5, 'C#5'), (18, 2, 1, 'A4')]


def near(pc, lo):
    """The first midi note at or above lo with pitch class pc."""
    return lo + (pc - lo) % 12


def main(cue_path, out_path):
    cues = json.load(open(cue_path))
    dur, bar = cues['duration'], cues['bar']
    beat = bar / cues['beats']
    n = int(SR * (dur + 0.5))
    stems = {k: np.zeros((n, 2)) for k in ('piano', 'strings', 'bass', 'harp', 'brass', 'fx')}

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
    # the overall swell: quiet at the start and the end, fullest on bars 13-16
    level = lambda b: np.interp(b, [1, 4, 9, 13, 16, 18, 21], [0.55, 0.7, 0.85, 1.0, 1.0, 0.8, 0.6])

    # ---------------------------------------------------------------- piano
    for b, ch in enumerate(PROG, start=1):
        root, pcs = CHORDS[ch]
        lv = level(b)
        lo = near(root, 38)  # D2 .. C#3
        if b in (1, 2, 20):  # a low D pedal under the motif
            put('piano', piano[9].play(38, dur=bar * 1.2, release=1.5), bar_t(b), 0.5)
            put('piano', piano[5].play(50, dur=bar * 1.2, release=1.5), bar_t(b), 0.35)
            continue
        if b == 21:  # the last chord: D major, held
            for k, m in enumerate((38, 45, 50, 54, 57, 62)):
                put('piano', piano[9 if k < 2 else 5].play(m, dur=4.0, release=2.0), bar_t(b) + 0.03 * k, 0.5, -0.3 + 0.12 * k)
            continue
        # flowing eighths: the bass, then the chord climbing and falling back
        third = (pcs[1] - pcs[0]) % 12
        up = [lo, lo + 7, lo + 12 + third, lo + 19, lo + 24, lo + 12 + third]
        if ch == 'Eb/D':
            up = [38, 46, 51, 55, 58, 55]
        for e, m in enumerate(up):
            g = (0.6 if e == 0 else 0.32) * lv
            put('piano', piano[5].play(m, dur=beat * (2.2 if e == 0 else 0.9), release=0.9), bar_t(b, e / 2), g, -0.25 + 0.1 * e)
    for b, bt, d, name in PIANO_MOTIF:
        put('piano', piano[9].play(midi(name), dur=d * beat, release=1.2), bar_t(b, bt), 0.75 * level(b), 0.15)
    # the piano doubles the violins softly an octave up at the climax
    for b, bt, d, name in VIOLIN_MELODY:
        if 13 <= b <= 16:
            put('piano', piano[5].play(midi(name) + 12, dur=d * beat, release=0.8), bar_t(b, bt), 0.22, 0.3)

    # ---------------------------------------------------------------- strings
    def legato(inst, notes, gain, pan, octave=0):
        for b, bt, d, name in notes:
            m = midi(name) + octave
            put('strings', inst.play(m, dur=d * beat + 0.12, attack=0.1, release=0.6), bar_t(b, bt) - 0.03, gain * level(b), pan)

    legato(cello, CELLO_MELODY, 0.4, -0.2)
    legato(violin, VIOLIN_MELODY, 0.42, 0.2)
    legato(cello, [x for x in VIOLIN_MELODY if x[0] >= 17], 0.28, -0.2, octave=-12)
    # the sustained harmony: cellos low, violins high, swelling in each bar
    for b, ch in enumerate(PROG, start=1):
        root, pcs = CHORDS[ch]
        if b < 3 or b == 20:
            continue
        lv = level(b)
        hold = bar * (2.0 if b == 21 else 1.05)
        put('strings', cello.play(near(root, 43), dur=hold, attack=0.5, release=1.0), bar_t(b), 0.12 * lv, -0.35)
        if b >= 5:
            put('strings', cello.play(near(pcs[2], 50), dur=hold, attack=0.5, release=1.0), bar_t(b), 0.08 * lv, -0.15)
        if b >= 7:
            for k, pc in enumerate(pcs[1:]):
                put('strings', violin.play(near(pc, 64 + 3 * k), dur=hold, attack=0.6, release=1.0), bar_t(b), 0.065 * lv, 0.3 + 0.1 * k)
        if b >= 11:
            put('bass', dbass.play(near(root, 31), dur=hold, attack=0.3, release=1.0), bar_t(b), 0.22 * lv)
        if 11 <= b <= 18:
            put('brass', horn.play(near(pcs[0], 53), dur=hold, attack=0.6, release=1.0), bar_t(b), 0.1 * lv, -0.1)
            put('brass', horn.play(near(pcs[2], 57), dur=hold, attack=0.6, release=1.0), bar_t(b), 0.08 * lv, 0.1)

    # ---------------------------------------------------------------- the film's moments
    put('fx', swell(1.2, 300, 5000), cues['flame'] - 0.9, 0.05)
    put('fx', boom(1.3), cues['title'], 0.14)
    for k, t in enumerate(cues['photos']):  # a single harp note as each photo arrives
        m = [62, 65, 69, 74, 72, 74, 77, 74][k]
        put('harp', harp.play(m, dur=1.6, release=1.5), t, 0.16, (-0.3, 0.3)[k % 2])
    put('fx', swell(2.0, 200, 4000), cues['outro'] - 1.6, 0.07)
    put('fx', boom(1.5), cues['logo'], 0.16)
    scale = [2, 3, 5, 7, 9, 10, 0]
    gl = [m for m in range(50, 87) if m % 12 in scale]
    for k, m in enumerate(gl):
        put('harp', harp.play(m, dur=1.6, release=1.4), cues['logo'] - 0.5 + k * 0.025, 0.1, -0.5 + k / len(gl))
    for k, m in enumerate((74, 78, 81, 86)):
        put('harp', harp.play(m, dur=2.5, release=2.0), bar_t(21) + 0.15 * k, 0.12, -0.2 + 0.15 * k)

    # ---------------------------------------------------------------- mix
    ir = hall_ir(4.0, 3.2)
    sends = {'piano': 0.32, 'strings': 0.55, 'bass': 0.2, 'harp': 0.55, 'brass': 0.5, 'fx': 0.3}
    levels = {'piano': 1.0, 'strings': 0.95, 'bass': 0.8, 'harp': 0.8, 'brass': 0.7, 'fx': 0.9}
    dry = np.zeros((n, 2))
    send = np.zeros((n, 2))
    for k, x in stems.items():
        dry += x * levels[k]
        send += x * levels[k] * sends[k]
    wet = np.stack([signal.fftconvolve(send[:, c], ir[:, c])[:n] for c in range(2)], axis=1)
    out = highpass(dry + wet * 1.15, 30)
    env = np.sqrt(lowpass(np.mean(out ** 2, axis=1), 5, 2).clip(1e-12))
    ref = np.percentile(env, 90)
    out *= np.where(env > ref * 0.5, (env / (ref * 0.5)) ** (-0.4), 1.0)[:, None]
    t = secs(dur + 0.5)[:n]
    out *= (np.clip(t / 0.05, 0, 1) * np.clip((dur - t) / (dur - cues['fade']), 0, 1) ** 1.5)[:, None]
    out = out[:int(SR * dur)]
    out = np.tanh(1.05 * out / np.max(np.abs(out))) / np.tanh(1.05) * 10 ** (-1 / 20)
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
