<template>
  <div class="navigation">
    <ProjectsMenu
      :position="state.projectsMenu.position"
      v-if="state.projectsMenu.show"
    />

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
          <div style="display:flex; flex-direction:column; height: 100%">
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
                :class="{ 'v-list-item--active': state.navList === route.id }"
                :color="route.id"
                :key="route.id"
                :title="route.title"
                @click="() => open(route.id)"
                @contextmenu="e => route.contextmenu(e)"
                v-for="route in routes"
              >
                <v-list-item-icon>
                  <v-list-item-group
                    style="font-size:7px; text-align:center; width:100%"
                  >
                    <v-icon v-text="route.icon" />
                    <div v-text="route.title" />
                  </v-list-item-group>
                </v-list-item-icon>
                <v-list-item-content />
              </v-list-item>
            </v-list>

            <v-spacer />

            <v-list nav dense>
              <v-list-item @click="reset" title="Settings" to="/settings">
                <v-list-item-icon>
                  <v-list-item-group
                    style="font-size:7px; text-align:center; width:100%"
                  >
                    <v-icon small v-text="'mdi-cogs'" />
                    Settings
                  </v-list-item-group>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="'Settings'" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </v-navigation-drawer>

        <div style="padding-left:56px; width:320px" v-show="!state.miniVariant">
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

import ModelNavList from '@/components/navigation/ModelNavList';
import ProjectNavList from '@/components/navigation/ProjectNavList';
import ProjectsMenu from '@/components/project/ProjectsMenu.vue';

export default {
  name: 'Navigation',
  components: {
    ModelNavList,
    ProjectNavList,
    ProjectsMenu,
  },
  setup(props) {
    const state = reactive({
      navList: '',
      miniVariant: true,
      projectsMenu: {
        position: { x: 0, y: 0 },
        show: false,
      },
    });

    const open = navList => {
      state.navList = navList;
      state.miniVariant = false;
    };

    const reset = () => {
      state.navList = '';
      state.miniVariant = true;
    };

    const showProjectsMenu = e => {
      // https://thewebdev.info/2020/08/13/vuetify%E2%80%8A-%E2%80%8Amenus-and-context-menu/
      e.preventDefault();
      state.projectsMenu.show = false;
      state.projectsMenu.position.x = e.clientX;
      state.projectsMenu.position.y = e.clientY;
      setTimeout(() => {
        state.projectsMenu.show = true;
      }, 1);
    };

    const routes = [
      {
        id: 'project',
        icon: 'mdi-brain',
        title: 'Projects',
        contextmenu: showProjectsMenu,
      },
      {
        id: 'model',
        icon: 'mdi-engine-outline',
        title: 'Models',
        contextmenu: e => {},
      },
    ];

    return {
      open,
      reset,
      routes,
      state,
    };
  },
};
</script>
