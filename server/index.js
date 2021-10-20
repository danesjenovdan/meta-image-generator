require('make-promises-safe');
require('./load-env.js');
const { resolve } = require('path');
const { fastify: createFastify } = require('fastify');
const {
  matches: matchesInternalRoute,
  handle: handleInternalRoute,
} = require('./internal-routes.js');
const {
  matches: matchesExternalRoute,
  handle: handleExternalRoute,
} = require('./external-routes.js');

const staticPath = resolve('./dist');

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
  const format = request.query.format || 'image';

  if (matchesInternalRoute(url)) {
    await handleInternalRoute(url, format, request, reply);
    return;
  }

  if (matchesExternalRoute(url)) {
    await handleExternalRoute(url, format, request, reply);
    return;
  }

  reply.notFound();
});

fastify.listen(port, '0.0.0.0', (error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
});
