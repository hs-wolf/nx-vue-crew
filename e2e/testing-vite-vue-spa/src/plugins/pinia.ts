import { createPinia } from 'pinia';
import { UserModule } from '@src/types';

const pinia = createPinia();

export const install: UserModule = ({ app }) => {
  app.use(pinia);
};

export { pinia };
