import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';

import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import './plugins/codemirror';

// Style
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

// Composition API
import VueCompositionAPI from '@vue/composition-api';
Vue.use(VueCompositionAPI);

// Toast notification
import VueToast from 'vue-toast-notification';
// import 'vue-toast-notification/dist/theme-default.css';
import 'vue-toast-notification/dist/theme-sugar.css';
Vue.use(VueToast);

// Production
Vue.config.productionTip = false;

/**
 * Initialize the app.
 */
const initApp = () => {
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
  }).$mount('#app');
};

// Load the data from public/config.json for the global config and initialize the app.
fetch(process.env.BASE_URL + 'config.json')
  .then(response => response.json())
  .then(config => {
    Vue.prototype.$config = config;
  })
  .finally(() => {
    initApp();
  });
