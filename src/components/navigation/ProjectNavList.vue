<template>
  <div class="projects">
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
        <v-list-item-title v-text="'New project'" />
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
          <template #append-outer>
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
                {{ project.network.nodes.length }} nodes,
                {{ project.network.connections.length }} connections
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-icon>
              <ActivityGraphIcon
                :project="project"
                :small="true"
                v-if="project.hasActivities"
              />
              <!-- <v-icon
                small
                v-show="!project.rev"
                v-text="'mdi-alert-circle-outline'"
              /> -->
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
import ActivityGraphIcon from '@/components/activity/ActivityGraphIcon.vue';
import core from '@/core';
import ProjectMenu from '@/components/project/ProjectMenu.vue';

export default Vue.extend({
  name: 'ProjectNavList',
  components: {
    ActivityGraphIcon,
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

    /**
     * Show project menu.
     */
    const showProjectMenu = function (e: MouseEvent, project: Project) {
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
