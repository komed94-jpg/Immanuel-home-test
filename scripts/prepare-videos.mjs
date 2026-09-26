import { createReadStream, createWriteStream } from 'node:fs';
import { readFile, mkdir, stat, rename, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(await readFile(path.join(root, 'assets/video-parts/manifest.json'), 'utf8'));
for (const video of manifest) {
  const output = path.join(root, 'public/videos', video.filename);
  await mkdir(path.dirname(output), { recursive: true });
  const temporary = output + '.partial';
  const digest = createHash('sha256');
  async function* bytes() {
    for (const part of video.parts) {
      for await (const buffer of createReadStream(path.join(root, 'assets/video-parts', part))) {
        digest.update(buffer);
        yield buffer;
      }
    }
  }
  try {
    await pipeline(bytes(), createWriteStream(temporary));
    const actual = await stat(temporary);
    if (actual.size !== video.bytes || digest.digest('hex') !== video.sha256) {
      throw new Error(`Video integrity check failed: ${video.filename}`);
    }
    await rename(temporary, output);
    console.log(`Prepared and verified ${video.filename}`);
  } catch (error) {
    await rm(temporary, { force: true });
    throw error;
  }
}
