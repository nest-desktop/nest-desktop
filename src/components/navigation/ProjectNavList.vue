<template>
  <div class="projectNavList">
    <v-list dense>
      <v-list-item exact to="/project/">
        <v-list-item-icon>
          <v-icon left v-text="'mdi-plus'" />
        </v-list-item-icon>
        <v-list-item-title v-text="'New project'" />
      </v-list-item>
    </v-list>

    <v-container
      :key="projectStore.view.state.project.id"
      class="py-0"
      v-if="projectStore.view.state.project"
    >
      <v-text-field
        @change="() => projectStore.view.state.project.clean()"
        clearable
        dense
        hide-details
        placeholder="Project name"
        title="Rename the current project"
        v-model="projectStore.view.state.project.name"
      >
        <template #append-outer>
          <v-row>
            <v-btn
              @click="saveProject"
              class="mx-2"
              depressed
              fab
              small
              title="Save the current project"
            >
              <v-icon v-text="'mdi-content-save-outline'" />
            </v-btn>
          </v-row>
        </template>
      </v-text-field>
    </v-container>

    <v-container class="py-0">
      <v-text-field
        clearable
        hide-details
        placeholder="Search project"
        prepend-inner-icon="mdi-magnify"
        v-model="projectStore.state.searchTerm"
      />
    </v-container>

    <v-list :key="projectStore.state.projects.length" dense two-line>
      <draggable v-model="projectStore.state.projects">
        <transition-group>
          <v-list-item
            :key="project.id"
            :to="'/project/' + project.id"
            class="projectItem"
            two-line
            v-for="project in projectStore.filteredProjects"
          >
            <v-list-item-content>
              <v-list-item-title v-text="project.name" />
              <v-list-item-subtitle>
                {{ project.network.nodes.length }} nodes,
                {{ project.network.connections.length }} connections
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-icon class="icon">
              <span v-if="project.doc">
                <v-icon
                  class="px-1"
                  small
                  v-if="
                    project.id !== project.doc.id ||
                    project.state.hash !== project.doc.hash
                  "
                  v-text="'mdi-alert-circle-outline'"
                />
                <ActivityGraphIcon
                  :project="project"
                  append
                  v-else-if="project.state.activities.hasSomeEvents"
                />
              </span>
            </v-list-item-icon>

            <v-list-item-action class="action">
              <ProjectMenu :projectId="project.id" />
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';

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
  setup(_, { root }) {
    const projectStore = core.app.project;

    const saveProject = () => {
      const project = projectStore.view.state.project;
      project.save().then(() => {
        if (!root.$route.path.endsWith(project.id)) {
          root.$router.push({
            name: 'projectId',
            params: { id: project.id },
          });
        }
      });
    };

    return {
      projectStore,
      saveProject,
    };
  },
});
</script>

<style>
.projectNavList .projectItem .action {
  display: none;
}

.projectNavList .projectItem:hover .action {
  display: block;
}

.projectNavList .projectItem .icon {
  display: flex;
  margin-bottom: 0;
}

.projectNavList .projectItem:hover .icon {
  display: none;
}
</style>
