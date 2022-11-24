<template>
  <div class="navigation">
    <v-navigation-drawer
      :miniVariant="state.miniVariant"
      :style="{ transition: state.resizing ? 'initial' : '' }"
      :width="state.width"
      app
      left
      mini-variant-width="64"
      mobile-breakpoint="64"
      permanent
      v-click-outside="
        () => {
          if (!state.pinNav) {
            reset();
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
            mini-variant
            mini-variant-width="64"
            mobile-breakpoint="64"
            permanent
          >
            <div class="flex">
              <v-list nav>
                <v-list-item
                  :class="{
                    'v-list-item--active': isRoute(route.id),
                  }"
                  :key="route.id"
                  :title="route.title"
                  @click="updatePageContent(route.id)"
                  v-for="route in routes"
                >
                  <v-list-item-icon>
                    <v-list-item-group class="nav-item">
                      <v-icon :color="route.color" v-text="route.icon" />
                      {{ route.title }}
                    </v-list-item-group>
                  </v-list-item-icon>
                  <v-list-item-content />
                </v-list-item>
              </v-list>

              <v-spacer />

              <v-list nav>
                <template v-if="appConfig.devMode">
                  <v-list-item
                    @click="app.updateConfig({ devMode: false })"
                    dense
                    title="Dev mode is on."
                  >
                    <v-list-item-icon v-bind="attrs" v-on="on">
                      <v-list-item-group class="nav-item">
                        <v-icon dense v-text="'mdi-dev-to'" />
                      </v-list-item-group>
                    </v-list-item-icon>
                  </v-list-item>
                </template>

                <v-list-item
                  @click="app.darkMode = !app.darkMode"
                  dense
                  v-if="appConfig.devMode"
                >
                  <v-list-item-icon>
                    <v-list-item-group class="nav-item">
                      <v-icon dense v-text="'mdi-theme-light-dark'" />
                    </v-list-item-group>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="'Dark mode'" />
                  </v-list-item-content>
                </v-list-item>

                <v-list-item @click="reset" title="Settings" to="/settings">
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
                    <v-list-item-title class="text-h1" v-text="'Help'" />
                  </v-list-item-content>
                </v-list-item>

                <v-list-item @click="reset" title="About" to="/about">
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
              </v-list>
            </div>
          </v-navigation-drawer>

          <div style="padding-left: 64px; width: 100%">
            <ProjectNavList v-if="isRoute('project')" />
            <ModelNavList v-if="isRoute('model')" />
          </div>
        </v-col>
      </v-row>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive } from '@vue/composition-api';

import core from '@/core';

import ModelNavList from '@/components/navigation/ModelNavList.vue';
import ProjectNavList from '@/components/navigation/ProjectNavList.vue';

export default Vue.extend({
  name: 'Navigation',
  components: {
    ModelNavList,
    ProjectNavList,
  },
  setup(_, { root }) {
    const state = reactive({
      activeRouteId: '',
      miniVariant: true,
      pinNav: core.app.config.pinNav,
      resizing: false,
      width: 376,
      minWidth: 376,
    });

    /**
     * Toggle navigation drawer.
     */
    const toggleNav = (routeId: string) => {
      state.miniVariant =
        state.activeRouteId === routeId ? !state.miniVariant : false;
      state.activeRouteId = routeId;
    };

    /**
     * Reset navigation drawer.
     */
    const reset = () => {
      state.miniVariant = true;
    };

    /**
     * Updates the page content according to the route ID to navigate to.
     * Please beware: The route IDs used in this class are the ones in the
     * array, which might not contain every route from the Vue router!
     * @param routeId ID of the route to navigate to
     */
    const updatePageContent = (routeId: string) => {
      toggleNav(routeId);

      // Check if the page is already loaded to avoid "Avoided redundant
      // navigation" error.
      if (!root.$route.path.includes(routeId)) {
        switch (routeId) {
          case 'project':
            core.app.project.view.redirect();
            break;
          case 'model':
            core.app.model.view.redirect();
            break;
        }
      }
    };

    /**
     * List of routes in navigation.
     */
    const routes: any[] = [
      {
        color: 'project',
        icon: '$network',
        id: 'project',
        title: 'Project',
      },
      {
        color: 'model',
        icon: '$nest',
        id: 'model',
        title: 'Model',
      },
    ];

    /**
     * Handle mouse move on resizing.
     *
     * @param e MouseEvent from which the x position is taken
     */
    const handleMouseMove = (e: MouseEvent) => {
      window.getSelection().removeAllRanges();
      const width = e.clientX + 2;
      if (width < state.minWidth) {
        return;
      }
      state.width = width;
      window.dispatchEvent(new Event('resize'));
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
     * Check if the current route is active.
     */
    const isRoute = (routeId: string) => root.$route.name.startsWith(routeId);

    /**
     * Resize sidebar.
     */
    const resizeSidebar = () => {
      state.resizing = true;
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    return {
      app: core.app,
      appConfig: core.app.config,
      isRoute,
      reset,
      resizeSidebar,
      routes,
      state,
      updatePageContent,
    };
  },
});
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
  height: 100%;
  position: fixed;
  right: 0;
  width: 4px;
  z-index: 10;
}
</style>
