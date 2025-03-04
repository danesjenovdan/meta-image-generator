import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

const currentDir = dirname(fileURLToPath(import.meta.url));

function buildServerRoutes() {
  return {
    name: 'build-server-routes',
    moduleParsed(moduleInfo) {
      if (moduleInfo.id?.endsWith('routes.js')) {
        const routesDeclaration = moduleInfo.ast.body
          .filter((node) => node.type === 'VariableDeclaration')
          .map((node) => node.declarations)
          .flat()
          .find(
            (declaration) =>
              declaration.id?.type === 'Identifier' &&
              declaration.id?.name === 'routes' &&
              declaration.init?.type === 'ArrayExpression',
          );
        if (routesDeclaration) {
          const elements = routesDeclaration.init.elements || [];
          const paths = elements
            .map((e) => e?.properties.find((p) => p.key?.name === 'path'))
            .map((p) => p.value?.value);
          this.emitFile({
            type: 'asset',
            name: 'routes.json',
            fileName: 'routes.json',
            source: JSON.stringify({ routes: paths }, null, 2),
          });
        }
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, currentDir);

  return {
    clearScreen: false,
    plugins: [vue(), buildServerRoutes()],
    resolve: {
      alias: {
        '@': resolve(currentDir, 'src'),
      },
    },
    server: {
      port: env.VITE_PORT || 3000,
      strictPort: true,
    },
  };
});
