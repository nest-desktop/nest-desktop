import Vue from 'vue';
import Vuetify from 'vuetify/lib';

// Colors
import colors from 'vuetify/lib/util/colors';

import GithubIcon from '@/components/icons/GithubIcon.vue';
import NetworkIcon from '@/components/icons/NetworkIcon.vue';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    values: {
      github: {
        component: GithubIcon,
      },
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
          base: '#93b5ad',
          darken1: '#84A29B',
        },
        model: {
          base: '#be6442',
        },
        setting: {
          base: '#ce934a',
        },
      },
    },
  },
});
