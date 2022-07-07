import path from 'path';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-vue-layouts';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import VueI18n from '@intlify/vite-plugin-vue-i18n';

export default defineConfig({
  server: {
    host: true,
    port: 3001,
  },
  cacheDir: '/node_modules/.vite/testing-vite-vue-spa',
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@environments': path.resolve(__dirname, './src/environments'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@josh-israel/models': path.resolve(
        __dirname,
        '/packages/models/src/index.ts'
      ),
    },
  },
  plugins: [
    Vue(),
    Pages(),
    Layouts(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        '@vueuse/core',
        '@vueuse/head',
        'vee-validate',
        'pinia',
      ],
      dts: './src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [
        IconsResolver({ prefix: 'icon', customCollections: ['josh-israel'] }),
      ],
      dts: './src/components.d.ts',
      directoryAsNamespace: true,
    }),
    Icons({
      autoInstall: true,
      compiler: 'vue3',
      customCollections: {
        'josh-israel': FileSystemIconLoader(
          path.resolve(__dirname, './src/assets/icons')
        ),
      },
    }),
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [path.resolve(__dirname, './locales/**')],
    }),
  ],
});
