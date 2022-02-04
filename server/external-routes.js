const { resolve } = require('path');
const { createHash } = require('crypto');
const { ensureDir } = require('fs-extra');
const { createReadStream, existsSync } = require('fs');
const { takeScreenshot } = require('./screenshot.js');
const { fileExceededMaxAge } = require('./utils.js');

const mediaPath = resolve('./media');

const screenshotsInProgress = {};

const routes = {
  'zadrugator-map': {
    url: 'https://stanovanjske-zadruge-zemljevid-peticija.lb.djnd.si/',
    selector: '.map-container',
    async beforeScreenshot(page) {
      page.evaluate(() => {
        document.querySelector('.popup').remove();
        document.querySelector('.signatures-popup').remove();
        document.head.insertAdjacentHTML(
          'beforeend',
          '<style>.map-container::after { content:""; display:block; clear:both; }</style>'
        );
      });
    },
    maxAge: 1000 * 60 * 30, // 30 minutes
  },
};

async function takeAndSaveScreenshot(route, imagePath) {
  if (!screenshotsInProgress[imagePath]) {
    // set promise as being in progress
    screenshotsInProgress[imagePath] = takeScreenshot(route.url, {
      selector: route.selector,
      beforeScreenshot: route.beforeScreenshot,
      savePath: imagePath,
    });
    // remove promise when it's done
    screenshotsInProgress[imagePath].finally(() => {
      screenshotsInProgress[imagePath] = null;
    });
  }
  return screenshotsInProgress[imagePath];
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
    await ensureDir(mediaPath);
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

module.exports = {
  matches,
  handle,
};
