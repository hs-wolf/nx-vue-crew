import generatedRoutes from 'virtual:generated-pages';
import { setupLayouts } from 'virtual:generated-layouts';
import { createRouter, createWebHistory } from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
  }
}

const routes = setupLayouts(generatedRoutes);
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((_to, _from) => {
  return;
});

router.afterEach((to) => {
  const parent = to.matched.find((record) => record.meta.title);
  const parentTitle = parent ? (parent.meta.title as string) : null;
  document.title = (to.meta.title as string) || parentTitle || 'Vite Vue SPA';
});

export { routes, router };
