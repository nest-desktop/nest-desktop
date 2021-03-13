<template>
  <div class="navigation">
    <ProjectsMenu
      :position="state.projectsMenu.position"
      v-if="state.projectsMenu.show"
    />

    <v-navigation-drawer
      :miniVariant="state.miniVariant"
      app
      clipped
      mobile-breakpoint="56"
      permanent
      v-click-outside="
        () => {
          if (!state.pinned) {
            state.miniVariant = true;
            state.navList = '';
          }
        }
      "
      width="320"
    >
      <v-row class="fill-height" no-gutters>
        <v-navigation-drawer
          absolute
          mini-variant
          mini-variant-width="56"
          mobile-breakpoint="56"
        >
          <div style="display:flex; flex-direction:column; height: 100%">
            <v-list nav dense>
              <v-list-item
                :title="state.pinned ? 'Unpin' : 'Pin' + ' navigation'"
                @click="
                  () => {
                    state.pinned = !state.pinned;
                    state.miniVariant = false;
                    state.navList =
                      state.navList === '' ? 'project' : state.navList;
                  }
                "
              >
                <v-list-item-icon>
                  <v-icon
                    v-text="
                      state.pinned ? 'mdi-pin-outline' : 'mdi-pin-off-outline'
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
                :color="route.color"
                :key="route.id"
                :title="route.title"
                @click="() => toggle(route.id)"
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
              <template v-if="state.app.config.devMode">
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item v-bind="attrs" v-on="on">
                      <v-list-item-icon v-bind="attrs" v-on="on">
                        <v-icon v-text="'mdi-dev-to'" />
                      </v-list-item-icon>
                    </v-list-item>
                  </template>
                  <span v-text="'Dev mode is on.'" />
                </v-tooltip>
              </template>

              <v-list-item
                @click="reset"
                color="settings darken"
                title="Settings"
                to="/settings"
              >
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

        <div style="padding-left:56px">
          <ProjectNavList v-if="state.navList === 'project'" />
          <ModelNavList v-if="state.navList === 'model'" />
          <SettingNavList v-if="state.navList === 'setting'" />
        </div>
      </v-row>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { reactive } from '@vue/composition-api';

import core from '@/core';

import ModelNavList from '@/components/navigation/ModelNavList.vue';
import ProjectNavList from '@/components/navigation/ProjectNavList.vue';
import ProjectsMenu from '@/components/project/ProjectsMenu.vue';

export default {
  name: 'Navigation',
  components: {
    ModelNavList,
    ProjectNavList,
    ProjectsMenu,
  },
  setup() {
    const state = reactive({
      app: core.app,
      navList: '',
      miniVariant: true,
      projectsMenu: {
        position: { x: 0, y: 0 },
        show: false,
      },
      pinned: true,
    });

    /**
     * Toggle navigation drawer.
     */
    const toggle = (navList: string) => {
      state.miniVariant = state.navList === navList;
      state.navList = state.navList === navList ? '' : navList;
    };

    /**
     * Reset navigation drawer.
     */
    const reset = () => {
      state.navList = '';
      state.miniVariant = true;
    };

    /**
     * Show project menu.
     */
    const showProjectsMenu = (e: MouseEvent) => {
      // https://thewebdev.info/2020/08/13/vuetify%E2%80%8A-%E2%80%8Amenus-and-context-menu/
      e.preventDefault();
      state.projectsMenu.show = false;
      state.projectsMenu.position.x = e.clientX;
      state.projectsMenu.position.y = e.clientY;
      setTimeout(() => {
        state.projectsMenu.show = true;
      }, 1);
    };

    /**
     * List of routes in navigation.
     */
    const routes: any[] = [
      {
        id: 'project',
        color: 'project darken',
        icon: 'mdi-brain',
        title: 'Projects',
        contextmenu: showProjectsMenu,
      },
      {
        id: 'model',
        color: 'model',
        icon: 'mdi-square-root',
        title: 'Models',
        contextmenu: () => {},
      },
    ];

    return {
      toggle,
      reset,
      routes,
      state,
    };
  },
};
</script>
