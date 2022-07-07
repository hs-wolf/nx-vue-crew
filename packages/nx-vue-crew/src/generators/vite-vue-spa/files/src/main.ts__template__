import { createApp } from 'vue';
import { createHead } from '@vueuse/head';
import App from '@src/app.vue';
import { AppContext } from '@src/types';
import { routes, router } from '@modules/router';
import '@assets/style/global.scss';

// Insert the head and router plugins to be used as context for other plugins.
const app = createApp(App);
const head = createHead();
app.use(head);
app.use(router);

const modules = import.meta.globEager('./plugins/*.ts');
Object.values(modules).map((i) => {
  const ctx: AppContext = { app, router, routes, head };
  i.install?.(ctx);
});

app.mount('#app');
