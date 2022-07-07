import { acceptHMRUpdate, defineStore } from 'pinia';
import { LOCALES_STORE, LOCALE_LOCAL_KEY } from '@src/constants';
import { i18n } from '@plugins/i18n';
import { useAlertsStore } from '@stores/alerts';

const { locale: currentLocale } = i18n.global;

interface IState {
  direction: string;
  rtlList: string[];
}

export const useLocalesStore = defineStore(LOCALES_STORE, {
  state: (): IState => ({
    direction: 'lfr',
    rtlList: ['he-il'],
  }),
  getters: {},
  actions: {
    changeLocale(locale: string): void {
      try {
        currentLocale.value = locale;
        this.saveLocale(locale);
        if (this.rtlList.includes(locale)) {
          this.changeDirection('rtl');
          return;
        }
        this.changeDirection('ltr');
      } catch (error) {
        useAlertsStore().handleError(error);
      }
    },
    changeDirection(direction: string): void {
      try {
        this.direction = direction;
      } catch (error) {
        useAlertsStore().handleError(error);
      }
    },
    saveLocale(locale: string): void {
      try {
        localStorage.setItem(LOCALE_LOCAL_KEY, locale);
      } catch (error) {
        useAlertsStore().handleError(error);
      }
    },
    loadLocale(): void {
      try {
        const value = localStorage.getItem(LOCALE_LOCAL_KEY);
        if (value) {
          this.changeLocale(value);
        }
      } catch (error) {
        useAlertsStore().handleError(error);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLocalesStore, import.meta.hot));
}
