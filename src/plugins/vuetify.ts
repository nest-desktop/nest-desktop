import Vue from 'vue';
import Vuetify from 'vuetify/lib';

// Colors
import colors from 'vuetify/lib/util/colors';

import { mdiDatabaseRefreshOutline } from '@mdi/js';
import NetworkIcon from '@/components/icons/NetworkIcon.vue';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    values: {
      mdiDatabaseRefreshOutline,
      network: {
        component: NetworkIcon,
      },
    },
  },
  theme: {
    themes: {
      light: {
        primary: colors.grey.base,
        secondary: colors.grey.lighten2,
        accent: colors.grey.darken2,
        project: {
          base: colors.teal.base, //'#93b5ad',
          darken: colors.teal.darken1,
          // darken1: '#84A29B',
        },
        model: {
          base: colors.orange.darken4, //'#be6442',
        },
        settings: {
          base: colors.deepPurple.base, //'#ce934a',
        },
      },
    },
  },
});
