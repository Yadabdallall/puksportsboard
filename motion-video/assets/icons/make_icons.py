#!/usr/bin/env python3
"""Turn the official platform icons in src/ into clean single-colour masks.

Each icon becomes a white shape on a transparent 1024 px square (facebook.png,
instagram.png, tiktok.png, telegram.png); social.html tints them in the film's
greens. The shape is pulled out of the original colours (the blue of Facebook,
the gradient of Instagram against its grey checkerboard, the black of TikTok
and Telegram), enlarged smoothly and given a crisp anti-aliased edge again, so
the small sources stay sharp at 4K.

    python3 assets/icons/make_icons.py
"""
import os

import numpy as np
from PIL import Image
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
SIZE = 1024


def rgba(name):
    return np.asarray(Image.open(os.path.join(HERE, 'src', name)).convert('RGBA')).astype(float) / 255


def facebook():
    a = rgba('facebook.webp')  # blue tile and a white f, transparent around it
    return np.clip((a[..., 2] - a[..., 0]) / 0.9, 0, 1) * a[..., 3]


def instagram():
    a = rgba('instagram.jpg')  # gradient outline on a baked grey checkerboard
    chroma = a[..., :3].max(-1) - a[..., :3].min(-1)
    return np.clip((chroma - 0.12) / 0.2, 0, 1)


def dark(name):
    a = rgba(name)  # black mark on white (Telegram: the white plane is the cut-out)
    return np.clip((0.85 - a[..., :3].mean(-1)) / 0.7, 0, 1)


def clean(m):
    """Crop to the shape, centre it on a square, enlarge and re-sharpen the edge."""
    ys, xs = np.nonzero(m > 0.5)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    m = m[y0:y1, x0:x1]
    side = max(m.shape)
    sq = np.zeros((side, side))
    oy, ox = (side - m.shape[0]) // 2, (side - m.shape[1]) // 2
    sq[oy:oy + m.shape[0], ox:ox + m.shape[1]] = m
    pad = int(side * 0.01) + 2
    sq = np.pad(sq, pad)
    scale = SIZE / sq.shape[0]
    big = np.asarray(Image.fromarray(sq.astype(np.float32), 'F').resize((SIZE, SIZE), Image.LANCZOS))
    big = ndimage.gaussian_filter(big, sigma=max(1.0, 0.7 * scale))
    alpha = np.clip((big - 0.5) * scale / 1.6 + 0.5, 0, 1)
    out = np.zeros((SIZE, SIZE, 4), np.uint8)
    out[..., :3] = 255
    out[..., 3] = (alpha * 255).round().astype(np.uint8)
    return out


if __name__ == '__main__':
    for name, m in [('facebook', facebook()), ('instagram', instagram()), ('tiktok', dark('tiktok.png')),
                    ('telegram', dark('telegram.png'))]:
        Image.fromarray(clean(m)).save(os.path.join(HERE, f'{name}.png'), optimize=True)
        print('wrote', name)
