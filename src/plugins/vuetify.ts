import Vue from 'vue';
import Vuetify from 'vuetify/lib';

// Colors
import colors from 'vuetify/lib/util/colors';

import { mdiDatabaseRefreshOutline } from '@mdi/js';
import DiceMultipleOutlineIcon from '@/components/icons/DiceMultipleOutlineIcon.vue';
import DotsGridIcon from '@/components/icons/DotsGridIcon.vue';
import NESTIcon from '@/components/icons/NESTIcon.vue';
import NetworkIcon from '@/components/icons/NetworkIcon.vue';

Vue.use(Vuetify);

// Color code taken from
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
      nest: {
        component: NESTIcon,
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
        secondary: colors.shades.white,
        accent: colors.grey.darken2,
        model: {
          base: '#FF6633',
        },
        project: {
          base: '#1281B3',
        },
      },
      dark: {
        primary: colors.grey.base,
        secondary: colors.grey.darken4,
        accent: colors.grey.lighten4,
        model: {
          base: '#FF6633',
        },
        project: {
          base: '#1281B3',
        },
      },
    },
  },
});
