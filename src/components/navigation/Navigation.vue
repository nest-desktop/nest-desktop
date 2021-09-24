<template>
  <div class="navigation">
    <ProjectsMenu
      :position="state.projectsMenu.position"
      v-if="state.projectsMenu.show"
    />

    <v-navigation-drawer
      :miniVariant="state.miniVariant"
      :style="{ transition: state.resizing ? 'initial' : '' }"
      :width="state.width"
      app
      left
      mobile-breakpoint="64"
      mini-variant-width="64"
      permanent
      v-click-outside="
        () => {
          if (!state.pinNav) {
            state.miniVariant = true;
            state.navList = '';
          }
        }
      "
    >
      <div
        @mousedown="resizeSidebar"
        class="resize-handle"
        v-if="!state.miniVariant"
      />
      <v-row class="fill-height" no-gutters>
        <v-col>
          <v-navigation-drawer
            absolute
            app
            mini-variant
            mini-variant-width="64"
            mobile-breakpoint="64"
            permanent
          >
            <div class="flex">
              <v-list nav>
                <v-list-item
                  :class="{ 'v-list-item--active': state.navList === route.id }"
                  :color="route.color"
                  :key="route.id"
                  :title="route.title"
                  @click="() => updatePageContent(route.id)"
                  @contextmenu="e => route.contextmenu(e)"
                  v-for="route in routes"
                >
                  <v-list-item-icon>
                    <v-list-item-group class="nav-item">
                      <v-icon v-text="route.icon" />
                      <div v-text="route.title" />
                    </v-list-item-group>
                  </v-list-item-icon>
                  <v-list-item-content />
                </v-list-item>
              </v-list>

              <v-spacer />

              <v-list nav>
                <template v-if="state.app.config.devMode">
                  <v-tooltip right>
                    <template #activator="{ on, attrs }">
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
                    <v-list-item-group class="nav-item">
                      <v-icon v-text="'mdi-cogs'" />
                      Settings
                    </v-list-item-group>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="'Settings'" />
                  </v-list-item-content>
                </v-list-item>

                <v-list-item
                  href="https://nest-desktop.readthedocs.io"
                  target="_blank"
                  title="Help"
                >
                  <v-list-item-icon>
                    <v-list-item-group class="nav-item">
                      <v-icon v-text="'mdi-help-circle-outline'" />
                      Help
                    </v-list-item-group>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="'Help'" class="text-h1" />
                  </v-list-item-content>
                </v-list-item>

                <v-dialog max-width="450" v-model="state.dialog">
                  <template #activator="{ on, attrs }">
                    <v-list-item
                      @click="reset"
                      title="About"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-list-item-icon>
                        <v-list-item-group class="nav-item">
                          <v-icon v-text="'mdi-information-variant'" />
                          About
                        </v-list-item-group>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title v-text="'About'" />
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                  <v-card class="about-dialog">
                    <v-card-title
                      class="headline"
                      v-text="'About NEST Desktop'"
                    />
                    <v-card-text>
                      <About />
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        @click="state.dialog = false"
                        text
                        v-text="'Close'"
                      />
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list>
            </div>
          </v-navigation-drawer>

          <div style="padding-left: 64px">
            <ProjectNavList v-if="state.navList === 'project'" />
            <ModelNavList v-if="state.navList === 'model'" />
          </div>
        </v-col>
      </v-row>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { reactive } from '@vue/composition-api';

import core from '@/core';

import About from '@/components/About.vue';
import ModelNavList from '@/components/navigation/ModelNavList.vue';
import ProjectNavList from '@/components/navigation/ProjectNavList.vue';
import ProjectsMenu from '@/components/project/ProjectsMenu.vue';
import VueRouter, { Route } from 'vue-router';

export default {
  name: 'Navigation',
  components: {
    About,
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
      resizing: false,
      width: 320,
    });
    let recentProjectId = '';
    let recentModelId = 'ac_generator';

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
     * Redirects the page content to the most recent chosen project/model. If
     * no one was chosen before, the first one is selected.
     * Please beware: The route IDs used in this class are the ones in the
     * array, which might not contain every route from the Vue router!
     * @param targetRouteId ID of the route to navigate to
     * @param router Vue router (this.$router)
     */
    function redirect(targetRouteId: string, router: VueRouter) {
      if (targetRouteId === 'project') {
        // check if project ID is undefined or project does not exist anymore
        if (
          recentProjectId == undefined ||
          recentProjectId.length <= 0 ||
          state.app.view.filteredProjects.filter(
            project => project.id == recentProjectId
          ).length <= 0
        ) {
          recentProjectId = state.app.view.filteredProjects[0].id;
        }
        router.push({
          name: 'ProjectId',
          params: { id: recentProjectId },
        });
      } else {
        if (recentModelId == undefined || recentModelId.length <= 0) {
          recentModelId = 'ac_generator';
        }
        router.push({ name: 'ModelId', params: { id: recentModelId } });
      }
    }

    /**
     * Stores the most recently used model or project, respectively.
     * Please beware: The route IDs used in this class are the ones in the
     * array, which might not contain every route from the Vue router!
     * @param currentTargetId ID of the route to navigate to
     * @param sourceRroute Vue route of the page to leave (this.$route)
     */
    function saveRecentId(targetRouteId: string, sourceRoute: Route) {
      switch (targetRouteId) {
        case 'model':
          recentProjectId = sourceRoute.params.id;
          break;
        case 'project':
          recentModelId = sourceRoute.params.id;
          break;
        default:
          break;
      }
    }

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
     * Updates the page content according to the route ID to navigate to.
     * Please beware: The route IDs used in this class are the ones in the
     * array, which might not contain every route from the Vue router!
     * @param routeId ID of the route to navigate to
     */
    function updatePageContent(routeId: string) {
      toggle(routeId);

      // Check if the page is already loaded to avoid "Avoided redundant
      // navigation" error
      let pathstring: string = this.$route.path;
      if (pathstring.indexOf(routeId) < 0) {
        saveRecentId(routeId, this.$route);
        redirect(routeId, this.$router);
      }
    }

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

    /**
     * Handle mouse move on resizing.
     */
    const handleMouseMove = (e: MouseEvent) => {
      window.getSelection().removeAllRanges();
      const width = e.clientX + 2;
      if (width > 320) {
        state.width = width;
        window.dispatchEvent(new Event('resize'));
      }
    };

    /**
     * Handle mouse up on resizing.
     */
    const handleMouseUp = () => {
      state.resizing = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    /**
     * Resize sidebar.
     */
    const resizeSidebar = () => {
      state.resizing = true;
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    return {
      resizeSidebar,
      reset,
      routes,
      state,
      toggle,
      updatePageContent,
    };
  },
};
</script>

<style>
.navigation .flex {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.navigation .nav-item {
  font-size: 9px;
  text-align: center;
  width: 100%;
}

.navigation .resize-handle {
  cursor: ew-resize;
  height: 100vh;
  position: fixed;
  right: 0;
  width: 4px;
  z-index: 10;
}
</style>
