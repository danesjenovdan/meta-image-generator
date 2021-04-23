require('make-promises-safe');
require('./load-env.js');
const { createReadStream, existsSync } = require('fs');
const { ensureDir } = require('fs-extra');
const { resolve } = require('path');
const { createHash } = require('crypto');
const { fastify: createFastify } = require('fastify');
const fastifyStatic = require('fastify-static');
const { takeScreenshot } = require('./screenshot.js');

const staticPath = resolve('./dist');
const indexPath = resolve('./dist/index.html');
const mediaPath = resolve('./media');

const port = process.env.PORT || 3000;

const fastify = createFastify({ logger: true });

fastify.register(fastifyStatic, {
  root: staticPath,
  prefix: '/',
  wildcard: false,
});

fastify.get('/*', async (request, reply) => {
  const format = request.query.format || 'image';
  if (format === 'html') {
    reply.type('text/html').send(createReadStream(indexPath));
  } else if (format === 'image') {
    const url = new URL(request.url, `http://localhost:${port}/`);
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
  } else {
    reply.status(400).send({
      message: `Invalid format: ${format}`,
      error: 'Bad Request',
      statusCode: 400,
    });
  }
});

fastify.listen(port, '0.0.0.0', (error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
});
