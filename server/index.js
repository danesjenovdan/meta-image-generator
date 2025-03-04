import fastifySensible from '@fastify/sensible';
import fastifyStatic from '@fastify/static';
import dotenvExpand from 'dotenv-expand';
import dotenv from 'dotenv-flow';
import createFastify from 'fastify';
import { resolve } from 'node:path';
import {
  handle as handleExternalRoute,
  matches as matchesExternalRoute,
} from './external-routes.js';
import {
  handle as handleInternalRoute,
  matches as matchesInternalRoute,
} from './internal-routes.js';

dotenvExpand.expand(dotenv.config());

const distPath = resolve('./dist');

const port = process.env.VITE_PORT || 3000;

const fastify = createFastify({ logger: true, ignoreTrailingSlash: true });

fastify.register(fastifySensible);

fastify.register(fastifyStatic, {
  root: distPath,
  prefix: '/',
  wildcard: false,
});

fastify.get('/*', async (request, reply) => {
  const url = new URL(request.url, `http://localhost:${port}/`);

  const format = request.query.format || 'image';
  url.searchParams.delete('format');

  const force = ['1', 'true', 'yes', 'on'].includes(
    request.query.force?.toLowerCase?.(),
  );
  url.searchParams.delete('force');

  if (matchesInternalRoute(url)) {
    if (await handleInternalRoute(request, reply, { url, format, force })) {
      return reply;
    }
  }

  if (matchesExternalRoute(url)) {
    if (await handleExternalRoute(request, reply, { url, format, force })) {
      return reply;
    }
  }

  reply.notFound();
  return reply;
});

fastify.listen({ port, host: '0.0.0.0' }, (error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
});
