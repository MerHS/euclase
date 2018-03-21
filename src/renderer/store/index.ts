import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

import { editor } from './editor';

Vue.use(Vuex);

export interface RootState {
  version: String,
}

const store: StoreOptions<RootState> = {
  state: {
    version: '0.0.1',
  },
  modules: {
    editor,
  },
  strict: process.env.NODE_ENV !== 'production',
};

export default new Vuex.Store<RootState>(store);
