const { resolve } = require('path');
const { ensureDir, readJSONSync } = require('fs-extra');
const { createReadStream, existsSync } = require('fs');
const { createHash } = require('crypto');
const { takeScreenshot } = require('./screenshot.js');

const routeJson = readJSONSync('./dist/routes.json');
const indexPath = resolve('./dist/index.html');
const mediaPath = resolve('./media');

function matches(url) {
  return routeJson.routes.includes(url.pathname);
}

async function handle(url, format, request, reply) {
  if (format === 'html') {
    reply.type('text/html').send(createReadStream(indexPath));
    return;
  }

  if (format === 'image') {
    url.searchParams.delete('format');
    const cacheKey = createHash('sha1').update(url.toString()).digest('hex');
    const imagePath = `${mediaPath}/${cacheKey}.png`;
    let image;
    await ensureDir(mediaPath);
    if (existsSync(imagePath)) {
      image = createReadStream(imagePath);
    } else {
      url.searchParams.set('format', 'html');
      image = await takeScreenshot(url.toString(), {
        savePath: imagePath,
      });
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
