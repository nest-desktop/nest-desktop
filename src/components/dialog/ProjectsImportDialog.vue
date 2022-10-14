<template>
  <div class="ProjectsImportDialog">
    <v-card>
      <v-card-title v-text="'Import projects'" />
      <v-card-subtitle v-text="'Select source and file'" />

      <v-card-text>
        <v-row class="mb-1">
          <v-col cols="3">
            <v-select
              :items="state.items"
              dense
              label="Source"
              v-model="state.source"
            >
              <template slot="selection" slot-scope="data">
                <v-icon left v-text="data.item.icon" />
                Import from {{ data.item.text }}
              </template>
              <template slot="item" slot-scope="data">
                <v-icon left v-text="data.item.icon" />
                {{ data.item.text }}
              </template>
            </v-select>
          </v-col>
          <v-col class="pa-3" cols="9">
            <v-row v-show="state.source === 'github'">
              <v-col cols="6">
                <v-select
                  :disabled="state.trees.length === 0"
                  :items="state.trees"
                  @change="getFilesFromGithub"
                  dense
                  label="Path"
                  prepend-icon="mdi-github"
                  v-model="state.selectedTree"
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  :disabled="state.files.length === 0"
                  :items="state.files"
                  @change="getProjectsFromGithub"
                  dense
                  label="File"
                  v-model="state.selectedFile"
                />
              </v-col>
            </v-row>
            <v-file-input
              @change="getProjectsFromDrive"
              dense
              label="File"
              title="Click to select a file"
              truncate-length="100"
              v-show="state.source === 'drive'"
            />
            <v-text-field
              @change="getProjectsFromUrl"
              class="ma-0 pa-0"
              clearable
              dense
              flat
              full-width
              label="URL"
              prepend-icon="mdi-web"
              title="Please enter the project's URL"
              v-show="state.source === 'url'"
            />
          </v-col>
        </v-row>

        <span v-if="state.projects.length !== 0">
          <span
            v-text="
              `${state.projects.length} project${
                state.projects.length > 1 ? 's' : ''
              } found. Select projects to import:`
            "
          />

          <v-simple-table>
            <thead>
              <tr>
                <th v-text="'Project name'" />
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
          </v-simple-table>
        </span>

        <span v-else v-text="'No projects found'" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          @click="() => closeDialog()"
          outlined
          small
          text
          v-text="'Cancel'"
        />
        <v-btn
          :disabled="!state.projects.some(p => p.selected)"
          @click="importProjects"
          outlined
          small
        >
          <v-icon left v-text="'mdi-import'" />
          Import
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive } from '@vue/composition-api';
import axios from 'axios';

import { App } from '@/core/app';
import { Project } from '@/core/project/project';
import core from '@/core';

export default Vue.extend({
  name: 'ProjectsImportDialog',
  setup() {
    const state = reactive({
      dialog: false,
      items: [
        {
          icon: 'mdi-paperclip',
          text: 'drive',
          value: 'drive',
        },
        {
          icon: 'mdi-github',
          text: 'GitHub',
          value: 'github',
        },
        {
          icon: 'mdi-web',
          text: 'URL',
          value: 'url',
        },
      ],
      files: [],
      projects: [],
      selectedFile: {},
      selectedProjects: [],
      selectedTree: {},
      source: '',
      trees: [],
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
      } catch {
        project.valid = false;
      }
    };

    /**
     * Fetch projects and validate them.
     */
    const fetchProjects = (data: any) => {
      const projects: any[] = Array.isArray(data) ? data : [data];
      state.projects = [];
      projects.forEach((project: any) => {
        if (project.name) {
          state.projects.push(project);
          validateProject(project);
        }
      });
    };

    /**
     * Get projects from drive.
     */
    const getProjectsFromDrive = (file: any) => {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.addEventListener('load', (event: any) =>
        fetchProjects(JSON.parse(event.target.result as string))
      );
    };

    /**
     * Get trees from github.
     */
    const getTreesFromGithub = () => {
      state.selectedFile = {};
      state.trees = [];
      const url =
        'https://api.github.com/repos/nest-desktop/nest-desktop-projects/git/trees/main?recursive=true';
      axios.get(url).then((response: any) => {
        state.trees = response.data.tree
          .filter((d: any) => d.type === 'tree')
          .map((d: any) => {
            return {
              text: d.path,
              value: d,
            };
          });
      });
    };

    /**
     * Get files from github.
     */
    const getFilesFromGithub = (tree: any) => {
      state.files = [];
      const url =
        'https://api.github.com/repos/nest-desktop/nest-desktop-projects/git/trees/' +
        tree.sha;
      axios.get(url).then((response: any) => {
        state.files = response.data.tree
          .filter((d: any) => d.type === 'blob' && d.path.endsWith('.json'))
          .map((d: any) => {
            return {
              text: d.path,
              value: d,
            };
          });
      });
    };

    /**
     * Get projects from URL.
     */
    const getProjectsFromUrl = (url: string) => {
      axios.get(url).then((response: any) => fetchProjects(response.data));
    };

    /**
     * Get projects from github.
     */
    const getProjectsFromGithub = () => {
      if (!Object.keys(state.selectedTree).includes('path')) {
        return;
      }
      const url = `https://raw.githubusercontent.com/nest-desktop/nest-desktop-projects/main/${state.selectedTree['path']}/${state.selectedFile['path']}`;
      getProjectsFromUrl(url);
    };

    /**
     * Import selected projects.
     */
    const importProjects = () => {
      const projects: any[] = state.projects.filter(
        (project: any) => project.selected
      );
      core.app.project.importProjects(projects);
      core.app.closeDialog();
    };

    onMounted(() => getTreesFromGithub());

    return {
      closeDialog: () => core.app.closeDialog(),
      getFilesFromGithub,
      getProjectsFromGithub,
      getProjectsFromDrive,
      getProjectsFromUrl,
      importProjects,
      state,
    };
  },
});
</script>
