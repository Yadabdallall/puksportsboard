#!/usr/bin/env python3
"""Replace one keyframe interval of a rendered video with a re-rendered part.

The 3D video takes ~20 minutes to render. When only a few seconds change (a
line of text, say), render just that keyframe interval with
`render.mjs --frames A:B` and splice it in here. The rest of the video is
copied packet for packet, so it keeps its exact original quality.

    python3 patch_video.py original.mp4 part.mp4 FIRST_FRAME patched.mp4

The part must start on a keyframe of the original, end right before the next
keyframe (or at the end of the video), and use the same encoder settings. All
of this is checked before and after writing, down to every decoded frame. The
output is video only; add the audio afterwards with ffmpeg (see README.md).

Needs PyAV (pip install av).
"""
import hashlib
import sys
from fractions import Fraction

import av


def video_packets(path):
    with av.open(path) as c:
        s = c.streams.video[0]
        for p in c.demux(s):
            if p.pts is not None:
                yield p, s


def frame_hashes(path):
    with av.open(path) as c:
        return [hashlib.sha1(f.to_ndarray(format='yuv420p').tobytes()).hexdigest() for f in c.decode(video=0)]


def main(orig_path, part_path, first, out_path):
    first = int(first)
    with av.open(orig_path) as o, av.open(part_path) as p:
        ov, pv = o.streams.video[0], p.streams.video[0]
        if bytes(ov.codec_context.extradata) != bytes(pv.codec_context.extradata):
            sys.exit('encoder headers differ: render the part with the same settings as the original')
        tb = ov.time_base
        step = Fraction(1) / ov.average_rate
        if ov.average_rate != pv.average_rate:
            sys.exit('frame rates differ')
    part_frames = sum(1 for _ in video_packets(part_path))
    start, end = first * step, (first + part_frames) * step
    keys = [pk.pts * tb for pk, _ in video_packets(orig_path) if pk.is_keyframe]
    total = sum(1 for _ in video_packets(orig_path))
    if start not in keys or not (end in keys or first + part_frames == total):
        sys.exit(f'the part must cover exactly one keyframe interval; keyframes are at {[float(k) for k in keys]} s')

    with av.open(orig_path) as template, av.open(out_path, 'w', options={'movflags': '+faststart'}) as out:
        vs = out.add_stream_from_template(template.streams.video[0])
        last_dts = None

        def write(pkt, shift):
            nonlocal last_dts
            pkt.pts += shift
            pkt.dts += shift
            dts = pkt.dts * pkt.time_base
            if last_dts is not None and dts <= last_dts:
                sys.exit(f'decode timestamps would go backwards at {float(dts):.3f} s')
            last_dts = dts
            pkt.stream = vs
            out.mux(pkt)

        for pk, s in video_packets(orig_path):  # before the part
            if pk.pts * s.time_base < start:
                write(pk, 0)
        for pk, s in video_packets(part_path):  # the part itself, moved into place
            shift = int(start / s.time_base)
            write(pk, shift)
        for pk, s in video_packets(orig_path):  # after the part
            if pk.pts * s.time_base >= end:
                write(pk, 0)

    # every frame outside the part must decode exactly as before, and the part as rendered
    got, before, part = frame_hashes(out_path), frame_hashes(orig_path), frame_hashes(part_path)
    expected = before[:first] + part + before[first + part_frames:]
    if got != expected:
        bad = next(i for i, (a, b) in enumerate(zip(got, expected)) if a != b) if len(got) == len(expected) else f'count {len(got)} != {len(expected)}'
        sys.exit(f'verification failed at frame {bad}')
    print(f'wrote {out_path}: frames {first}..{first + part_frames - 1} replaced, all {len(got)} frames verified')


if __name__ == '__main__':
    if len(sys.argv) != 5:
        sys.exit(__doc__)
    main(*sys.argv[1:])
