require('make-promises-safe');
require('./load-env.js');
const { createReadStream } = require('fs');
const { resolve } = require('path');
const { fastify: createFastify } = require('fastify');
const fastifyStatic = require('fastify-static');

const staticPath = resolve('./dist');
const indexPath = resolve('./dist/index.html');

const fastify = createFastify({ logger: true });

fastify.register(fastifyStatic, {
  root: staticPath,
  prefix: '/',
  wildcard: false,
});

fastify.get('/*', (request, reply) => {
  reply.type('text/html').send(createReadStream(indexPath));
});

fastify.listen(process.env.PORT || 3000, '0.0.0.0', (error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
});
