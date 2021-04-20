<template>
  <div class="ProjectsDialog">
    <v-dialog v-model="state.dialog" max-width="1024">
      <v-card>
        <v-card-title
          v-text="`Select projects to ${state.action}.`"
          v-if="state.projects.length !== 0"
        />

        <v-card-text>
          <v-simple-table v-if="state.projects.length !== 0">
            <template v-slot:default>
              <thead>
                <tr>
                  <th v-text="'Name'" />
                  <th v-text="'Created at'" />
                  <th class="text-center" v-text="'Selected'" />
                  <th
                    class="text-center"
                    v-if="state.action === 'download'"
                    v-text="'Activities'"
                  />
                </tr>
              </thead>
              <tbody>
                <tr :key="index" v-for="(project, index) in state.projects">
                  <td v-text="project.name" />
                  <td v-text="new Date(project.createdAt).toLocaleString()" />
                  <td class="text-center">
                    <v-checkbox
                      class="my-0 mx-auto"
                      color="project"
                      hide-details
                      v-model="project.view.selected"
                    />
                  </td>
                  <td class="text-center" v-if="state.action === 'download'">
                    <v-checkbox
                      :disabled="!project.hasActivities"
                      @change="
                        value => {
                          project.view.state.selected = value;
                        }
                      "
                      class="ma-0"
                      color="project"
                      hide-details
                      v-model="project.view.withActivities"
                    />
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="state.dialog = false" text v-text="'Cancel'" />
          <v-btn
            :disabled="state.projects.length === 0"
            @click="downloadProjects"
            text
            v-if="state.action === 'download'"
          >
            <v-icon left v-text="'mdi-download'" />
            Download
          </v-btn>
          <v-btn
            :disabled="state.projects.length === 0"
            @click="deleteProjects"
            text
            v-if="state.action === 'delete'"
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
import { reactive, watch } from '@vue/composition-api';

import { Activity } from '@/core/activity/activity';
import { Project } from '@/core/project/project';
import core from '@/core';

export default Vue.extend({
  name: 'ProjectsDownloadDialog',
  props: {
    action: String,
    open: Boolean,
    projects: Array,
  },
  setup(props) {
    const state = reactive({
      action: 'download',
      dialog: false,
      projects: props.projects as Project[],
    });

    /**
     * Download projects.
     */
    const downloadProjects = () => {
      const projects: any[] = state.projects
        .filter((project: Project) => project.view.selected)
        .map((project: Project) => {
          const projectData: any = project.toJSON();
          if (project.view.withActivities) {
            projectData.activities = project.activities.map(
              (activity: Activity) => activity.toJSON()
            );
          }
          project.view.resetState();
          return projectData;
        });
      core.app.download(
        projects,
        projects.length === 1 ? 'project' : 'projects'
      );
      state.dialog = false;
    };

    /**
     * Delete projects.
     */
    const deleteProjects = () => {
      const projectIds: string[] = state.projects
        .filter((project: Project) => project.view.selected)
        .map((project: Project) => {
          project.view.resetState();
          return project.id;
        });
      core.app.deleteProjects(projectIds).then(() => {
        core.app.updateProjects();
        state.dialog = false;
      });
    };

    watch(
      () => [props.action, props.open],
      () => {
        state.projects = props.projects as Project[];
        state.action = props.action as string;
        state.dialog = true;
      }
    );

    return {
      console,
      downloadProjects,
      deleteProjects,
      state,
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
