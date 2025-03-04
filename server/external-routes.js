import { createHash } from 'node:crypto';
import { createReadStream, existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { takeScreenshot } from './screenshot.js';
import { fileExceededMaxAge } from './utils.js';

const mediaPath = resolve('./media');

const routes = {
  'zadrugator-map': {
    url: 'https://zemljevid.zastanovanjskezadruge.si/',
    selector: '.map-container',
    async beforeScreenshot(page) {
      page.evaluate(() => {
        document.querySelector('.popup').remove();
        document.querySelector('.signatures-popup').remove();
        document.head.insertAdjacentHTML(
          'beforeend',
          '<style>.map-container::after { content:""; display:block; clear:both; }</style>',
        );
      });
    },
    maxAge: 1000 * 60 * 30, // 30 minutes
  },
};

async function takeAndSaveScreenshot(route, imagePath) {
  return takeScreenshot(route.url, {
    selector: route.selector,
    beforeScreenshot: route.beforeScreenshot,
    savePath: imagePath,
  });
}

function matches(url) {
  if (!url.pathname.startsWith('/external/')) {
    return false;
  }
  const path = url.pathname.replace(/^\/external\//, '').replace(/\/$/, '');
  if (routes[path] && routes[path].url) {
    return true;
  }
  return false;
}

async function handle(request, reply, { url, format, force } = {}) {
  if (format === 'image') {
    const cacheKey = createHash('sha1').update(url.toString()).digest('hex');
    const imagePath = `${mediaPath}/${cacheKey}.png`;
    const path = url.pathname.replace(/^\/external\//, '').replace(/\/$/, '');
    const route = routes[path];

    let image;
    await mkdir(mediaPath, { recursive: true });
    if (!force && existsSync(imagePath)) {
      if (await fileExceededMaxAge(imagePath, route.maxAge)) {
        image = await takeAndSaveScreenshot(route, imagePath);
      } else {
        image = createReadStream(imagePath);
      }
    } else {
      image = await takeAndSaveScreenshot(route, imagePath);
    }
    reply.type('image/png').send(image);
    return;
  }

  reply.badRequest(`Invalid format: ${format}`);
}

export { handle, matches };
