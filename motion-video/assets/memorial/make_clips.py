#!/usr/bin/env python3
"""Turn the two video clips in clips/src/ into frames for memorial.html.

The film is drawn one frame at a time, so each clip is unpacked into JPEG
frames (clips/A/0000.jpg ...), cropped to the photo frame's shape (1080:820)
and enlarged to its 4K size (2160x1640) with Lanczos. Clip A is cropped
clear of the «kurdsat» and «1992 Picsart» marks burned into its corners.
The frames are not kept in git; memorial.py reads the sound from the .mov
files directly.

    python3 assets/memorial/make_clips.py
"""
import os
import shutil
import subprocess

import imageio_ffmpeg

HERE = os.path.dirname(os.path.abspath(__file__))
CLIPS = {  # crop w:h:x:y in the source pixels, then a light grade
    'A': ('640:486:200:25', 'eq=saturation=0.85:contrast=1.04'),
    'B': ('553:420:96:0', 'eq=saturation=0.92'),
}

for name, (crop, grade) in CLIPS.items():
    out = os.path.join(HERE, 'clips', name)
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(out)
    subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), '-v', 'error', '-i', os.path.join(HERE, 'clips', 'src', f'{name}.mov'),
                    '-vf', f'crop={crop},scale=2160:1640:flags=lanczos,unsharp=5:5:0.5,{grade}',
                    '-fps_mode', 'passthrough', '-q:v', '3', '-start_number', '0', os.path.join(out, '%04d.jpg')], check=True)
    print(name, len(os.listdir(out)), 'frames')
