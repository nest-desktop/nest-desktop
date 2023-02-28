import Vue from 'vue';
import Vuetify from 'vuetify/lib';

// Colors
import colors from 'vuetify/lib/util/colors';

import { mdiDatabaseRefreshOutline } from '@mdi/js';
import CopyModelIcon from '@/components/icons/CopyModelIcon.vue';
import DiceMultipleOutlineIcon from '@/components/icons/DiceMultipleOutlineIcon.vue';
import DotsGridIcon from '@/components/icons/DotsGridIcon.vue';
import NESTIcon from '@/components/icons/NESTIcon.vue';
import NetworkIcon from '@/components/icons/NetworkIcon.vue';
import RecorderIcon from '@/components/icons/RecorderIcon.vue';
import StimulatorIcon from '@/components/icons/StimulatorIcon.vue';

Vue.use(Vuetify);

// Color code taken from
// https://color.adobe.com/de/create/color-wheel

export default new Vuetify({
  icons: {
    values: {
      mdiDatabaseRefreshOutline,
      copyModel: {
        component: CopyModelIcon,
      },
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
      recorder: {
        component: RecorderIcon,
      },
      stimulator: {
        component: StimulatorIcon,
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
        systemBar: colors.grey.darken3,
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
        systemBar: colors.grey.darken3,
      },
    },
  },
});
