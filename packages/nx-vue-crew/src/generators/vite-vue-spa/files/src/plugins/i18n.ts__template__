import { createI18n } from 'vue-i18n';
import type { UserModule } from '@src/types';

import messages from '@intlify/vite-plugin-vue-i18n/messages';

const i18n = createI18n({
  legacy: false,
  locale: 'en-us',
  messages,
});

export const install: UserModule = ({ app }) => {
  app.use(i18n);
};

export { i18n };
