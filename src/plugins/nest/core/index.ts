// index.ts

import { App } from './app';
import { reactive } from 'vue';

const core = reactive({
  app: new App(),
});

export default core;
