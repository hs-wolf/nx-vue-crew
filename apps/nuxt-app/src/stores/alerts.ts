import { defineStore, acceptHMRUpdate } from 'pinia';
import { ALERTS_STORE_KEY } from '~~/contants';

interface IState {
  variable?: 'value';
}

export const useAlertsStore = defineStore(ALERTS_STORE_KEY, {
  state: (): IState => ({}),
  getters: {},
  actions: {
    handleSuccess(message: string) {
      console.error('✅ SUCCESS:', message);
    },
    handleWarning(message: string) {
      console.log('⚠️ WARNING:', message);
    },
    handleError(error: unknown) {
      console.error('🛑 ERROR:', error);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAlertsStore, import.meta.hot));
}
