import { createPinia } from 'pinia';
import { UserPlugin } from '@src/types';

const pinia = createPinia();

export const install: UserPlugin = ({ app }) => {
  app.use(pinia);
};

export { pinia };
