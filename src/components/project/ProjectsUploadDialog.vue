<template>
  <div class="ProjectsUploadDialog">
    <v-dialog v-model="state.dialog" max-width="1024">
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
          v-text="'Select projects to upload.'"
          v-if="state.projects.length !== 0"
        />

        <v-card-text>
          <v-row>
            <v-col cols="2">
              <v-btn-toggle mandatory v-model="state.source">
                <v-btn
                  :key="item.value"
                  :title="item.value"
                  :value="item.value"
                  v-for="item in state.items"
                >
                  <v-icon v-text="item.icon" />
                </v-btn>
              </v-btn-toggle>
            </v-col>
            <v-col class="pa-3" cols="10">
              <!-- <input
                @change="fetchProjectsFromFile"
                ref="file"
                type="file"
                v-show="state.source === 'file'"
              /> -->
              <v-file-input
                @change="fetchProjectsFromFile"
                label="File input"
                truncate-length="100"
                v-show="state.source === 'file'"
              />
              <v-text-field
                @change="fetchProjectsFromUrl"
                class="pt-2"
                clearable
                dense
                full-width
                label="Enter url"
                prepend-icon="mdi-web"
                small
                v-show="state.source === 'url'"
              />
            </v-col>
          </v-row>

          <v-simple-table v-if="state.projects.length !== 0">
            <template #default>
              <thead>
                <tr>
                  <th v-text="'Name'" />
                  <th v-text="'Created at'" />
                  <th v-text="'Version'" />
                  <th class="text-center" v-text="'Valid'" />
                  <th class="text-center" v-text="'Selected'" />
                </tr>
              </thead>
              <tbody>
                <tr :key="index" v-for="(project, index) in state.projects">
                  <td v-text="project.name" />
                  <td>
                    <span
                      v-if="project.createdAt"
                      v-text="new Date(project.createdAt).toLocaleString()"
                    />
                    <span v-else v-text="'undefined'" />
                  </td>
                  <td v-text="project.version" />
                  <td class="text-center">
                    <v-icon
                      :color="project.valid ? 'green' : 'red'"
                      v-text="project.valid ? 'mdi-check' : 'mdi-cancel'"
                    />
                  </td>
                  <td class="text-center">
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
          <template v-else> Select another file. </template>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="state.dialog = false" text v-text="'Cancel'" />
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
import axios from 'axios';

import { Project } from '@/core/project/project';
import core from '@/core';
import { App } from '@/core/app';

export default Vue.extend({
  name: 'ProjectsUploadDialog',
  props: {
    open: Boolean,
  },
  setup(props) {
    const state = reactive({
      dialog: false,
      items: [
        { icon: 'mdi-paperclip', value: 'file' },
        { icon: 'mdi-web', value: 'url' },
      ],
      open: props.open,
      projects: [] as Project[],
      selectedProjects: [],
      source: 'file',
    });

    const app = new App();

    /**
     * Validate projects.
     */
    const validateProject = (project: any) => {
      try {
        new Project(app, project);
        project.valid =
          project.network.nodes.length > 0 &&
          project.network.connections.length > 0;
      } catch (e) {
        project.valid = false;
      }
    };

    /**
     * Fetch projects from url.
     */
    const fetchProjectsFromUrl = (url: string) => {
      state.projects = [];
      axios.get(url).then((response: any) => {
        const data: any = response.data;
        const projects: any[] = Array.isArray(data) ? data : [data];
        projects.forEach((project: any) => {
          if (project.name) {
            state.projects.push(project);
            validateProject(project);
          }
        });
      });
    };

    /**
     * Fetch projects from file.
     */
    const fetchProjectsFromFile = (file: any) => {
      state.projects = [];
      const fileReader = new FileReader();
      fileReader.readAsText(file);
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
        state.dialog = props.open as boolean;
      }
    );

    return {
      fetchProjectsFromFile,
      fetchProjectsFromUrl,
      state,
      uploadProjects,
    };
  },
});
</script>
