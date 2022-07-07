import { createI18n } from 'vue-i18n';
import type { UserPlugin } from '@src/types';

import messages from '@intlify/vite-plugin-vue-i18n/messages';

const i18n = createI18n({
  legacy: false,
  locale: 'en-us',
  messages,
});

export const install: UserPlugin = ({ app }) => {
  app.use(i18n);
};

export { i18n };
