<template>
  <div class="projects">
    <!-- <v-toolbar dense flat dark color="secondary">
      Projects
    </v-toolbar> -->

    <ProjectMenu
      :project="state.projectMenu.project"
      :position="state.projectMenu.position"
      v-if="state.projectMenu.show"
    />

    <v-list dense class="pa-0">
      <v-list-item exact to="/project/">
        <v-list-item-icon>
          <v-icon left v-text="'mdi-plus'" />
        </v-list-item-icon>
        <v-list-item-title>
          New project
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <v-form>
      <v-container :key="state.projectId" class="py-0" v-if="state.app.project">
        <v-text-field
          clearable
          hide-details
          placeholder="Project name"
          title="Rename the current project"
          v-model="state.app.project.name"
        >
          <template v-slot:append-outer>
            <v-row>
              <v-btn
                @click="state.app.project.save()"
                class="mx-2"
                icon
                small
                title="Save the current project"
              >
                <v-icon v-text="'mdi-content-save-outline'" />
              </v-btn>
            </v-row>
          </template>
        </v-text-field>
      </v-container>
    </v-form>

    <v-form>
      <v-container class="py-0">
        <v-text-field
          clearable
          hide-details
          placeholder="Search project"
          prepend-inner-icon="mdi-magnify"
          v-model="state.app.view.project.searchTerm"
        />
      </v-container>
    </v-form>

    <v-list :key="state.app.projects.length" dense two-line>
      <draggable v-model="state.app.projects">
        <transition-group>
          <v-list-item
            :key="project.id"
            :to="'/project/' + project.id"
            @click="state.projectId = project.id"
            @contextmenu="e => showProjectMenu(e, project)"
            v-for="project in state.app.view.filteredProjects"
          >
            <v-list-item-content>
              <v-list-item-title v-text="project.name" />
              <!-- <v-list-item-subtitle v-html="timeSince(project.createdAt)" /> -->
              <v-list-item-subtitle>
                {{ project.network.nodes.length }} nodes;
                {{ project.network.connections.length }} connections
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-icon>
              <!-- <v-icon
                v-show="project.activityGraph.codeHash !== undefined"
                v-text="'mdi-chart-scatter-plot'"
              /> -->
              <v-icon
                v-show="!project.rev"
                v-text="'mdi-alert-circle-outline'"
              />
            </v-list-item-icon>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive } from '@vue/composition-api';
import draggable from 'vuedraggable';

import { Project } from '@/core/project/project';
import core from '@/core';
import ProjectMenu from '@/components/project/ProjectMenu.vue';

export default Vue.extend({
  name: 'ProjectNavList',
  components: {
    draggable,
    ProjectMenu,
  },
  setup() {
    const state = reactive({
      app: core.app,
      projectId: '',
      projectMenu: {
        position: { x: 0, y: 0 },
        project: undefined,
        show: false,
      },
    });

    // const timeSince = date => {
    //   const seconds = Math.floor((+new Date() - +new Date(date)) / 1000);
    //   if (seconds < 60) {
    //     return 'Just now';
    //   }
    //   const intervals = {
    //     year: 31536000,
    //     month: 2592000,
    //     week: 604800,
    //     day: 86400,
    //     hour: 3600,
    //     minute: 60,
    //   };
    //   let counter;
    //   for (const i in intervals) {
    //     counter = Math.floor(seconds / intervals[i]);
    //     if (counter > 0) {
    //       if (counter === 1) {
    //         return counter + ' ' + i + ' ago'; // singular (1 day ago)
    //       } else {
    //         return counter + ' ' + i + 's ago'; // plural (2 days ago)
    //       }
    //     }
    //   }
    // };

    /**
     * Show project menu.
     */
    const showProjectMenu = function(e: MouseEvent, project: Project) {
      // https://thewebdev.info/2020/08/13/vuetify%E2%80%8A-%E2%80%8Amenus-and-context-menu/
      e.preventDefault();
      state.projectMenu.show = false;
      state.projectMenu.project = project;
      state.projectMenu.position.x = e.clientX;
      state.projectMenu.position.y = e.clientY;
      this.$nextTick(() => {
        state.projectMenu.show = true;
      });
    };

    return {
      showProjectMenu,
      state,
    };
  },
});
</script>
