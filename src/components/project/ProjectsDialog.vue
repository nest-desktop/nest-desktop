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
            <template #default>
              <thead>
                <tr>
                  <th v-text="'Project name'" />
                  <th v-text="'Created at'" />
                  <th class="text-center" v-text="'Selected'" />
                  <th
                    class="text-center"
                    v-if="state.action === 'export'"
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
                  <td v-if="state.action === 'export'">
                    <v-row>
                      <v-col class="py-4" cols="4">
                        <ActivityGraphIcon :project="project" :small="true" />
                      </v-col>
                      <v-col cols="4">
                        <v-checkbox
                          :disabled="!project.hasActivities"
                          class="ma-0"
                          color="project"
                          hide-details
                          v-model="project.view.withActivities"
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
            @click="state.dialog = false"
            outlined
            small
            text
            v-text="'Cancel'"
          />
          <v-btn
            :disabled="!state.projects.some(p => p.view.selected)"
            @click="exportProjects"
            outlined
            small
            v-if="state.action === 'export'"
          >
            <v-icon left v-text="'mdi-export'" />
            Export
          </v-btn>
          <v-btn
            :disabled="!state.projects.some(p => p.view.selected)"
            @click="deleteProjects"
            outlined
            small
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
import ActivityGraphIcon from '@/components/activity/ActivityGraphIcon.vue';

export default Vue.extend({
  name: 'ProjectsDialog',
  components: {
    ActivityGraphIcon,
  },
  props: {
    action: String,
    open: Boolean,
    projects: Array,
  },
  setup(props) {
    const state = reactive({
      action: 'export',
      dialog: false,
      projects: props.projects as Project[],
    });

    /**
     * Export projects.
     */
    const exportProjects = () => {
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
      exportProjects,
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
