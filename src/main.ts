import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import combineURLs from 'axios/lib/helpers/combineURLs';

import router from './router';
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
 * Mount application.
 */
const mountApp = () => {
  new Vue({
    router,
    vuetify,
    render: h => h(App),
  }).$mount('#app');
};

if (process.env.IS_ELECTRON) {
  Vue.prototype.$appConfig = {
    insiteAccess: { url: 'http://localhost:8080' },
    nestSimulator: { url: 'http://localhost:5000' },
  };
  mountApp();
} else {
  // Load the data from config.json for the global config and mount the app.
  fetch(combineURLs(process.env.BASE_URL, 'config/app.json'))
    .then(response => response.json())
    .then(appConfig => (Vue.prototype.$appConfig = appConfig))
    .finally(mountApp);
}
