<template>
  <div class="ProjectsDialog">
    <v-dialog max-width="1024" v-model="dialogState.open">
      <span v-if="dialogState.action === 'import'">
        <ProjectsImport />
      </span>
      <span v-else>
        <v-card>
          <v-card-title
            v-if="dialogState.content.length !== 0"
            v-text="`Select projects to ${dialogState.action}.`"
          />

          <v-card-text>
            <v-simple-table v-if="dialogState.content.length !== 0">
              <template #default>
                <thead>
                  <tr>
                    <th v-text="'Project name'" />
                    <th v-text="'Created at'" />
                    <th class="text-center" v-text="'Selected'" />
                    <th
                      class="text-center"
                      v-if="dialogState.action === 'export'"
                      v-text="'Activities'"
                    />
                  </tr>
                </thead>
                <tbody>
                  <tr
                    :key="index"
                    v-for="(project, index) in dialogState.content"
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
                    <td v-if="dialogState.action === 'export'">
                      <v-row>
                        <v-col class="py-4" cols="4">
                          <ActivityGraphIcon :project="project" small />
                        </v-col>
                        <v-col cols="4">
                          <v-checkbox
                            :disabled="!project.state.hasActivities"
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
            <v-btn @click="closeDialog" outlined small text v-text="'Cancel'" />
            <v-btn
              :disabled="!dialogState.content.some(p => p.state.selected)"
              @click="exportProjects"
              outlined
              small
              v-if="dialogState.action === 'export'"
            >
              <v-icon left v-text="'mdi-export'" />
              Export
            </v-btn>
            <v-btn
              :disabled="!dialogState.content.some(p => p.state.selected)"
              @click="deleteProjects"
              outlined
              small
              v-if="dialogState.action === 'delete'"
            >
              <v-icon left v-text="'mdi-trash-can-outline'" />
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </span>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { Project } from '@/core/project/project';
import core from '@/core';
import ActivityGraphIcon from '@/components/activity/ActivityGraphIcon.vue';
import ProjectsImport from '@/components/project/ProjectsImport.vue';

export default Vue.extend({
  name: 'ProjectsDialog',
  components: {
    ActivityGraphIcon,
    ProjectsImport,
  },
  setup() {
    const dialogState = core.app.state.dialog;

    /**
     * Export selected projects.
     */
    const exportProjects = () => {
      const selectedProjects: Project[] = dialogState.content.filter(
        (project: Project) => project.state.selected
      );
      if (selectedProjects.length > 0) {
        core.app.project.exportProjects(selectedProjects);
      }
      core.app.closeDialog();
    };

    /**
     * Delete selected projects.
     */
    const deleteProjects = () => {
      const selectedProjects: Project[] = dialogState.content.filter(
        (project: Project) => project.state.selected
      );
      if (selectedProjects.length > 0) {
        core.app.project.deleteProjects(selectedProjects);
      }
      core.app.closeDialog();
    };

    return {
      closeDialog: () => core.app.closeDialog(),
      deleteProjects,
      dialogState,
      exportProjects,
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
