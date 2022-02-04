const { resolve } = require('path');
const { ensureDir, readJSONSync } = require('fs-extra');
const { createReadStream, existsSync } = require('fs');
const { createHash } = require('crypto');
const { takeScreenshot } = require('./screenshot.js');
const { fileExceededMaxAge } = require('./utils.js');

const routeJson = readJSONSync('./dist/routes.json');
const indexPath = resolve('./dist/index.html');
const mediaPath = resolve('./media');

function matches(url) {
  return routeJson.routes.includes(url.pathname);
}

async function handle(request, reply, { url, format, force } = {}) {
  if (format === 'html') {
    reply.type('text/html').send(createReadStream(indexPath));
    return;
  }

  if (format === 'image') {
    const cacheKey = createHash('sha1').update(url.toString()).digest('hex');
    const imagePath = `${mediaPath}/${cacheKey}.png`;
    const route = routeJson.routes[url.pathname];

    let image;
    await ensureDir(mediaPath);
    if (!force && existsSync(imagePath)) {
      if (await fileExceededMaxAge(imagePath, route.maxAge)) {
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

module.exports = {
  matches,
  handle,
};
