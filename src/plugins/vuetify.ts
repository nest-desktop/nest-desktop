import Vue from 'vue';
import Vuetify from 'vuetify/lib';

// Colors
import colors from 'vuetify/lib/util/colors';

import { mdiDatabaseRefreshOutline } from '@mdi/js';
import DiceMultipleOutlineIcon from '@/components/icons/DiceMultipleOutlineIcon.vue';
import DotsGridIcon from '@/components/icons/DotsGridIcon.vue';
import NetworkIcon from '@/components/icons/NetworkIcon.vue';

Vue.use(Vuetify);

// Color  code taken from
// https://color.adobe.com/de/create/color-wheel

export default new Vuetify({
  icons: {
    values: {
      mdiDatabaseRefreshOutline,
      diceMultipleOutline: {
        component: DiceMultipleOutlineIcon,
      },
      dotsGrid: {
        component: DotsGridIcon,
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
        kernel: {
          base: '#FF6633',
          darken1: '#B33A12',
          lighen1: '#FF794D',
        },
        model: {
          base: '#FF6633',
          darken1: '#B33A12',
          lighen1: '#FF794D',
        },
        project: {
          base: '#1281B3',
          darken1: '#054766',
          lighten1: '#26BCFF',
        },
        settings: {
          base: '#36B34F',
          darken1: '#146625',
          lighen1: '#40FF66',
        },
      },
    },
  },
});
