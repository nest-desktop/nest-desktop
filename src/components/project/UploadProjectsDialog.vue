<template>
  <div class="UploadProjectsDialog">
    <input
      @change="displayProjectsToUpload"
      ref="file"
      style="display: none"
      type="file"
    />

    <v-dialog v-model="state.dialog" max-width="800">
      <v-card>
        <v-card-title
          v-if="state.projects.length !== 0"
          v-text="
            `${state.projects.length} project${
              state.projects.length > 1 ? 's' : ''
            } found.`
          "
        />
        <v-card-title v-else v-text="'No project found.'" />

        <v-card-subtitle
          v-text="'Select to upload.'"
          v-if="state.projects.length !== 0"
        />

        <v-card-text>
          <v-simple-table v-if="state.projects.length !== 0">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Name
                  </th>
                  <th class="text-left">
                    Version
                  </th>
                  <th class="text-left">
                    Created at
                  </th>
                  <th class="text-left">
                    Valid
                  </th>
                  <th>Upload</th>
                </tr>
              </thead>
              <tbody>
                <tr :key="index" v-for="(project, index) in state.projects">
                  <td>
                    {{ project.name }}
                  </td>
                  <td>{{ project.version }}</td>
                  <td>{{ new Date(project.createdAt).toLocaleString() }}</td>
                  <td>
                    <v-icon
                      v-text="project.valid ? 'mdi-check' : 'mdi-cancel'"
                    />
                  </td>
                  <td>
                    <v-checkbox
                      class="ma-0"
                      color="project"
                      hide-details
                      v-model="project.selected"
                    />
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <template v-else>
            Select another file.
          </template>
        </v-card-text>

        <v-card-actions>
          <v-btn @click="openDialogFromFile" text>
            Select file
          </v-btn>
          <v-btn @click="state.dialog = false" text>
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn
            :disabled="state.projects.length === 0"
            @click="uploadProjects"
            text
          >
            <v-icon left v-text="'mdi-upload'" />
            Upload
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';

import { Project } from '@/core/project/project';
import core from '@/core';
import { App } from '@/core/app';

export default Vue.extend({
  name: 'UploadProjectsDialog',
  props: {
    open: Boolean,
  },
  setup(props, { refs }) {
    const state = reactive({
      selectedProjects: [],
      projects: [] as Project[],
      open: props.open,
      dialog: false,
    });

    const app = new App();

    /**
     * Upload projects from files.
     */
    const openDialogFromFile = () => {
      const file = refs.file as any;
      file.click();
    };

    /**
     * Validate projects.
     */
    const validateProject = (project: any) => {
      try {
        new Project(app, project);
        project.valid = true;
      } catch (e) {
        project.valid = false;
      }
    };

    /**
     * Display projects to select for upload.
     */
    const displayProjectsToUpload = () => {
      state.dialog = true;
      const fileReader = new FileReader();
      const file = refs.file as any;
      fileReader.readAsText(file.files[0]);
      fileReader.addEventListener('load', (event: any) => {
        setTimeout(() => {
          const result: any = JSON.parse(event.target.result as string);
          const data = Array.isArray(result) ? result : [result];
          state.projects = [];
          data.forEach((project: any) => {
            if (project.name) {
              state.projects.push(project);
              validateProject(project);
            }
          });
        }, 1);
      });
    };

    /**
     * Upload selected projects.
     */
    const uploadProjects = () => {
      const projects: any[] = state.projects.filter(
        (project: any) => project.selected
      );
      core.app.addProjects(projects).then(() => {
        state.dialog = false;
      });
    };

    watch(
      () => props.open,
      () => {
        openDialogFromFile();
      }
    );

    return {
      displayProjectsToUpload,
      openDialogFromFile,
      state,
      uploadProjects,
    };
  },
});
</script>
