<template>
  <div class="navigation">
    <v-navigation-drawer
      :mini-variant="state.miniVariant"
      app
      clipped
      mobile-breakpoint="56"
      permanent
      width="320"
    >
      <v-row class="fill-height" no-gutters>
        <v-navigation-drawer
          absolute
          mini-variant
          mini-variant-width="56"
          mobile-breakpoint="56"
        >
          <!-- <v-toolbar dense flat>
            <v-icon
              @click="state.miniVariant = !state.miniVariant"
              v-text="
                state.miniVariant ? 'mdi-chevron-right' : 'mdi-chevron-left'
              "
            />
          </v-toolbar> -->

          <v-list nav dense>
            <v-list-item
              :disabled="state.navList.length === 0"
              @click="state.miniVariant = !state.miniVariant"
              title="Toggle navigation"
            >
              <v-list-item-icon>
                <v-icon
                  v-text="
                    'mdi-chevron-' + (state.miniVariant ? 'right' : 'left')
                  "
                />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="'Close'" />
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-list nav>
            <v-list-item @click="reset" title="Home" to="/">
              <v-list-item-icon>
                <v-icon v-text="'mdi-home'" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="'Home'" />
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              :key="route.id"
              :title="route.title"
              @click="() => open(route.id)"
              v-for="route in routes"
              :class="{ 'v-list-item--active': state.navList === route.id }"
              :color="route.id"
            >
              <v-list-item-icon>
                <v-list-item-group>
                  <v-icon v-text="route.icon" />
                  <div style="font-size:7px">{{ route.title }}</div>
                </v-list-item-group>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="route.title" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        <div style="padding-left:56px">
          <ProjectNavList v-if="state.navList === 'project'" />
          <ModelNavList v-if="state.navList === 'model'" />
          <SettingNavList v-if="state.navList === 'setting'" />
        </div>
      </v-row>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { reactive } from '@vue/composition-api';
import ModelNavList from '@/components/model/ModelNavList';
import ProjectNavList from '@/components/project/ProjectNavList';
import SettingNavList from '@/components/setting/SettingNavList';

export default {
  name: 'Navigation',
  components: {
    ModelNavList,
    ProjectNavList,
    SettingNavList,
  },
  setup(props) {
    const routes = [
      {
        id: 'project',
        icon: 'mdi-brain',
        title: 'Projects',
      },
      {
        id: 'model',
        icon: 'mdi-engine-outline',
        title: 'Models',
      },
      {
        id: 'setting',
        icon: 'mdi-cogs',
        title: 'Settings',
      },
    ];
    const state = reactive({
      navList: '',
      miniVariant: true,
    });
    const open = navList => {
      state.navList = navList;
      state.miniVariant = false;
    };
    const reset = () => {
      state.navList = '';
      state.miniVariant = true;
    };
    return {
      open,
      reset,
      routes,
      state,
    };
  },
};
</script>
