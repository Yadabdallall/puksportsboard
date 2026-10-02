#!/usr/bin/env python3
"""Enlarge the archive photos in src/ for the 4K memorial film (memorial.html).

The originals are small (about 450 to 1200 px wide). Each is enlarged with
Lanczos to 2400 px wide, so the browser never has to stretch a small image
itself, and given a gentle unsharp mask to keep faces crisp.

    python3 assets/memorial/make_photos.py
"""
import os

from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
WIDTH = 2400

for name in sorted(os.listdir(os.path.join(HERE, 'src'))):
    im = Image.open(os.path.join(HERE, 'src', name)).convert('RGB')
    w, h = im.size
    big = im.resize((WIDTH, round(h * WIDTH / w)), Image.LANCZOS)
    big = big.filter(ImageFilter.UnsharpMask(radius=2.4, percent=55, threshold=2))
    big.save(os.path.join(HERE, name), quality=90, optimize=True)
    print(f'{name}: {w}x{h} -> {big.size[0]}x{big.size[1]}')
