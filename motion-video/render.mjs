#!/usr/bin/env node
// Renders index.html frame by frame with headless Chromium and encodes an MP4.
//
//   node render.mjs                       -> output/puk-sports-board-motion.mp4
//   node render.mjs --fps 30 --out a.mp4  -> custom frame rate / path
//   node render.mjs --audio sfx.wav       -> mux an audio track
//   node render.mjs --stills 1,2.9,8      -> PNG snapshots only (for review)
//   node render.mjs --cues audio/cues.json -> sound cue times for audio.py
//
// Needs Playwright (npm i playwright) and ffmpeg (on PATH or via $FFMPEG).
import { spawn } from 'node:child_process';
import { readFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = require(path.join(process.env.NODE_GLOBAL || '/opt/node22/lib/node_modules', 'playwright')));
}

const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => {
  if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]);
  return acc;
}, []));
const fps = Number(args.fps || 60);
const out = path.resolve(here, args.out || 'output/puk-sports-board-motion.mp4');
const ffmpeg = process.env.FFMPEG || 'ffmpeg';

const MIME = { '.html': 'text/html', '.png': 'image/png', '.ttf': 'font/ttf', '.js': 'text/javascript' };
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.route('http://motion.local/**', async route => {
  const rel = decodeURIComponent(new URL(route.request().url()).pathname);
  const file = path.join(here, rel === '/' ? 'index.html' : rel);
  try {
    route.fulfill({ body: await readFile(file), contentType: MIME[path.extname(file)] || 'application/octet-stream' });
  } catch {
    route.fulfill({ status: 404, body: 'not found' });
  }
});
page.on('pageerror', e => { console.error('page error:', e); process.exitCode = 1; });
await page.goto('http://motion.local/index.html?capture');
await page.evaluate(() => window.ready);
const duration = await page.evaluate(() => window.DURATION);

// Reading the canvas directly is ~3x faster than a page screenshot.
const grab = async t => {
  const url = await page.evaluate(t => {
    window.renderFrame(t);
    return document.getElementById('stage').toDataURL('image/png');
  }, t);
  return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
};

if (args.cues) {
  const { writeFile } = await import('node:fs/promises');
  await writeFile(path.resolve(here, args.cues), JSON.stringify(await page.evaluate(() => window.soundCues()), null, 2));
  console.log('wrote', args.cues);
  await browser.close();
  process.exit();
}

if (args.stills) {
  const dir = path.resolve(here, args.dir || 'output/stills');
  await mkdir(dir, { recursive: true });
  for (const t of String(args.stills).split(',').map(Number)) {
    const { writeFile } = await import('node:fs/promises');
    const f = path.join(dir, `t${t.toFixed(2).padStart(6, '0')}.png`);
    await writeFile(f, await grab(t));
    console.log(f);
  }
  await browser.close();
  process.exit();
}

await mkdir(path.dirname(out), { recursive: true });
const ffArgs = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-'];
if (args.audio) ffArgs.push('-i', path.resolve(args.audio));
ffArgs.push('-c:v', 'libx264', '-preset', 'slow', '-crf', String(args.crf || 18), '-pix_fmt', 'yuv420p',
  '-profile:v', 'high', '-movflags', '+faststart', '-r', String(fps));
if (args.audio) ffArgs.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
ffArgs.push(out);
const enc = spawn(ffmpeg, ffArgs, { stdio: ['pipe', 'inherit', 'inherit'] });
const done = new Promise((res, rej) => enc.on('close', c => (c ? rej(new Error('ffmpeg exited ' + c)) : res())));

const frames = Math.round(duration * fps);
const t0 = Date.now();
for (let i = 0; i < frames; i++) {
  const buf = await grab(i / fps);
  if (!enc.stdin.write(buf)) await new Promise(r => enc.stdin.once('drain', r));
  if (i % fps === 0) process.stdout.write(`\rframe ${i}/${frames} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
enc.stdin.end();
await done;
await browser.close();
console.log(`\nwrote ${out}`);
