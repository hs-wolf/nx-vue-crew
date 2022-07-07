import { acceptHMRUpdate, defineStore } from 'pinia';
import { ALERTS_STORE } from '@src/constants';

export interface IState {
  variable: boolean;
}

export const useAlertsStore = defineStore(ALERTS_STORE, {
  state: (): IState => ({ variable: true }),
  getters: {},
  actions: {
    handleError(error: unknown) {
      console.log(error);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAlertsStore, import.meta.hot));
}
