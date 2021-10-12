<template>
  <div class="ProjectsDialog">
    <v-dialog v-model="appView.state.dialog.open" max-width="1024">
      <v-card>
        <v-card-title
          v-text="`Select projects to ${appView.state.dialog.action}.`"
          v-if="appView.state.dialog.content.length !== 0"
        />

        <v-card-text>
          <v-simple-table v-if="appView.state.dialog.content.length !== 0">
            <template #default>
              <thead>
                <tr>
                  <th v-text="'Project name'" />
                  <th v-text="'Created at'" />
                  <th class="text-center" v-text="'Selected'" />
                  <th
                    class="text-center"
                    v-if="appView.state.dialog.action === 'export'"
                    v-text="'Activities'"
                  />
                </tr>
              </thead>
              <tbody>
                <tr
                  :key="index"
                  v-for="(project, index) in appView.state.dialog.content"
                >
                  <td v-text="project.name" />
                  <td v-text="new Date(project.createdAt).toLocaleString()" />
                  <td class="text-center">
                    <v-checkbox
                      class="my-0 mx-auto"
                      color="project"
                      hide-details
                      v-model="project.state.selected"
                    />
                  </td>
                  <td v-if="appView.state.dialog.action === 'export'">
                    <v-row>
                      <v-col class="py-4" cols="4">
                        <ActivityGraphIcon :project="project" small />
                      </v-col>
                      <v-col cols="4">
                        <v-checkbox
                          :disabled="!project.hasActivities"
                          class="ma-0"
                          color="project"
                          hide-details
                          v-model="project.state.withActivities"
                        />
                      </v-col>
                    </v-row>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="appView.state.dialog.open = false"
            outlined
            small
            text
            v-text="'Cancel'"
          />
          <v-btn
            :disabled="
              !appView.state.dialog.content.some(p => p.state.selected)
            "
            @click="exportProjects"
            outlined
            small
            v-if="appView.state.dialog.action === 'export'"
          >
            <v-icon left v-text="'mdi-export'" />
            Export
          </v-btn>
          <v-btn
            :disabled="
              !appView.state.dialog.content.some(p => p.state.selected)
            "
            @click="deleteProjects"
            outlined
            small
            v-if="appView.state.dialog.action === 'delete'"
          >
            <v-icon left v-text="'mdi-trash-can-outline'" />
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { Project } from '@/core/project/project';
import core from '@/core';
import ActivityGraphIcon from '@/components/activity/ActivityGraphIcon.vue';

export default Vue.extend({
  name: 'ProjectsDialog',
  components: {
    ActivityGraphIcon,
  },
  setup() {
    const appView = core.app.view;

    /**
     * Export projects.
     */
    const exportProjects = () => {
      const selectedProjects: Project[] = appView.state.dialog.content.filter(
        (project: Project) => project.state.selected
      );
      if (selectedProjects.length > 0) {
        appView.exportProjects(selectedProjects);
      }
      appView.state.dialog.open = false;
    };

    /**
     * Delete projects.
     */
    const deleteProjects = () => {
      const selectedProjects: Project[] = appView.state.dialog.content.filter(
        (project: Project) => project.state.selected
      );
      if (selectedProjects.length > 0) {
        appView.deleteProjects(selectedProjects);
      }
      appView.state.dialog.open = false;
    };

    return {
      appView,
      exportProjects,
      deleteProjects,
    };
  },
});
</script>

<style>
.v-input__slot {
  align-items: center;
  justify-content: center;
}
</style>
