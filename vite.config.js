import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

function buildServerRoutes() {
  return {
    name: 'build-server-routes',
    moduleParsed(moduleInfo) {
      if (moduleInfo.id?.endsWith('routes.js')) {
        const variableDeclarator = moduleInfo.ast.body.find(
          (o) => o.type === 'VariableDeclaration'
        )?.declarations?.[0];
        if (variableDeclarator?.id?.name === 'routes') {
          const elements = variableDeclarator.init?.elements || [];
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

export default defineConfig({
  clearScreen: false,
  plugins: [vue(), buildServerRoutes()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
