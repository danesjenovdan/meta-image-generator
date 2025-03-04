import { createHash } from 'node:crypto';
import { createReadStream, existsSync, readFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { takeScreenshot } from './screenshot.js';
import { fileExceededMaxAge } from './utils.js';

const routeFileContents = readFileSync('./dist/routes.json', 'utf8');
const routeJson = JSON.parse(routeFileContents);

const indexPath = resolve('./dist/index.html');
const indexFileContents = readFileSync(indexPath, 'utf8');

const mediaPath = resolve('./media');

const maxAge = 0; // 0 = disabled (no limit)

function matches(url) {
  return routeJson.routes.includes(url.pathname);
}

async function handle(request, reply, { url, format, force } = {}) {
  if (format === 'html') {
    reply.type('text/html');
    reply.send(indexFileContents);
    return;
  }

  if (format === 'image') {
    const cacheKey = createHash('sha1').update(url.toString()).digest('hex');
    const imagePath = `${mediaPath}/${cacheKey}.png`;

    let image;
    await mkdir(mediaPath, { recursive: true });
    if (!force && existsSync(imagePath)) {
      if (await fileExceededMaxAge(imagePath, maxAge)) {
        image = await takeScreenshot(url.toString(), { savePath: imagePath });
      } else {
        image = createReadStream(imagePath);
      }
    } else {
      url.searchParams.set('format', 'html');
      image = await takeScreenshot(url.toString(), { savePath: imagePath });
    }
    reply.type('image/png').send(image);
    return;
  }

  reply.badRequest(`Invalid format: ${format}`);
}

export { handle, matches };
