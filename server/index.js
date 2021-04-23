require('make-promises-safe');
require('./load-env.js');
const { createReadStream, existsSync } = require('fs');
const { ensureDir, readJSONSync } = require('fs-extra');
const { resolve } = require('path');
const { createHash } = require('crypto');
const { fastify: createFastify } = require('fastify');
const { takeScreenshot } = require('./screenshot.js');

const staticPath = resolve('./dist');
const indexPath = resolve('./dist/index.html');
const mediaPath = resolve('./media');
const routeJson = readJSONSync('./dist/routes.json');

const port = process.env.PORT || 3000;

const fastify = createFastify({ logger: true });

fastify.register(require('fastify-sensible'));

fastify.register(require('fastify-static'), {
  root: staticPath,
  prefix: '/',
  wildcard: false,
});

fastify.get('/*', async (request, reply) => {
  const url = new URL(request.url, `http://localhost:${port}/`);

  if (!routeJson.routes.includes(url.pathname)) {
    reply.notFound();
    return;
  }

  const format = request.query.format || 'image';

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
});

fastify.listen(port, '0.0.0.0', (error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
});
