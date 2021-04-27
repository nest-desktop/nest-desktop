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
          if (!state.pinNav) {
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
            <v-list dense nav>
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
                    <v-icon small v-text="route.icon" />
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
                color="settings darken1"
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

              <v-list-item
                href="https://nest-desktop.readthedocs.io/en/latest/"
                target="_blank"
                title="Help"
              >
                <v-list-item-icon>
                  <v-list-item-group
                    style="font-size:7px; text-align:center; width:100%"
                  >
                    <v-icon small v-text="'mdi-help-circle-outline'" />
                    Help
                  </v-list-item-group>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="'Help'" />
                </v-list-item-content>
              </v-list-item>

              <v-dialog max-width="400" v-model="state.dialog">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item
                    @click="reset"
                    title="About"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-list-item-icon>
                      <v-list-item-group
                        style="font-size:7px; text-align:center; width:100%"
                      >
                        <v-icon small v-text="'mdi-information-variant'" />
                        About
                      </v-list-item-group>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="'About'" />
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <v-card class="about-dialog">
                  <v-card-title class="headline">
                    About NEST Desktop
                  </v-card-title>
                  <v-card-text>
                    <v-list dense>
                      <v-list-item>
                        <v-row>
                          <v-col class="font-weight-bold" cols="4">
                            Documentation
                          </v-col>
                          <v-col cols="8">
                            <a
                              href="https://nest-desktop.readthedocs.io"
                              target="_blank"
                              v-text="'https://nest-desktop.readthedocs.io'"
                            />
                          </v-col>
                        </v-row>
                      </v-list-item>
                      <v-list-item>
                        <v-row>
                          <v-col class="font-weight-bold" cols="4">
                            Source Code
                          </v-col>
                          <v-col cols="8">
                            <a
                              href="https://github.com/babsey/nest-desktop"
                              target="_blank"
                              v-text="'https://github.com/babsey/nest-desktop'"
                            />
                          </v-col>
                        </v-row>
                      </v-list-item>
                      <v-list-item>
                        <v-row>
                          <v-col class="font-weight-bold" cols="4">
                            License
                          </v-col>
                          <v-col cols="8">
                            MIT License
                          </v-col>
                        </v-row>
                      </v-list-item>
                      <v-list-item>
                        <v-row>
                          <v-col class="font-weight-bold" cols="4">
                            Current Version
                          </v-col>
                          <v-col cols="8">
                            {{ state.version }}
                          </v-col>
                        </v-row>
                      </v-list-item>
                      <v-list-item>
                        <v-row>
                          <v-col class="font-weight-bold" cols="4">
                            Contact
                          </v-col>
                          <v-col cols="8">
                            <a href="mailto:spreizer@uni-trier.de">
                              Sebastian Spreizer
                            </a>
                          </v-col>
                        </v-row>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="state.dialog = false" text>
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
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
      dialog: false,
      miniVariant: true,
      navList: '',
      pinNav: core.app.config.pinNav,
      projectsMenu: {
        position: { x: 0, y: 0 },
        show: false,
      },
      version: core.app.version,
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
        color: 'project darken1',
        icon: 'mdi-brain',
        title: 'Projects',
        contextmenu: showProjectsMenu,
      },
      {
        id: 'model',
        color: 'model darken1',
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

<style>
.about-dialog .v-list {
  font-size: 12px;
}
.about-dialog .v-list-item {
  height: 28px !important;
  min-height: 28px !important;
}
.about-dialog a {
  text-decoration: none;
  color: black !important;
}
.about-dialog .col-4,
.about-dialog .col-8 {
  padding: 4px;
}
</style>
