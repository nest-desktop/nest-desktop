<template>
  <div class="ProjectsLoadDialog">
    <v-dialog v-model="state.dialog" max-width="1024">
      <v-card>
        <v-card-title v-text="'Import projects'" />
        <v-card-subtitle v-text="'Select a source'" />

        <v-card-text>
          <v-row class="mb-1">
            <v-col cols="2">
              <v-btn-toggle
                class="mt-3"
                dense
                group
                mandatory
                v-model="state.source"
              >
                <v-btn
                  :key="item.value"
                  :title="item.title"
                  :value="item.value"
                  v-for="item in state.items"
                >
                  <v-icon v-text="item.icon" />
                </v-btn>
              </v-btn-toggle>
            </v-col>
            <v-col class="pa-3" cols="10">
              <v-row v-show="state.source === 'github'">
                <v-col cols="6">
                  <v-select
                    :disabled="state.trees.length === 0"
                    :items="state.trees"
                    @change="getFilesFromGithub"
                    label="Select path"
                    prepend-icon="mdi-github"
                    v-model="state.selectedTree"
                  />
                </v-col>
                <v-col cols="6">
                  <v-select
                    :disabled="state.files.length === 0"
                    :items="state.files"
                    @change="getProjectsFromGithub"
                    label="Select file"
                    v-model="state.selectedFile"
                  />
                </v-col>
              </v-row>
              <v-file-input
                @change="getProjectsFromFile"
                label="File input"
                truncate-length="100"
                v-show="state.source === 'file'"
              />
              <v-text-field
                @change="getProjectsFromUrl"
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

          <span v-if="state.projects.length !== 0">
            <span
              v-text="
                `${state.projects.length} project${
                  state.projects.length > 1 ? 's' : ''
                } found. Select projects to import.`
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
            @click="state.dialog = false"
            outlined
            small
            text
            v-text="'Cancel'"
          />
          <v-btn
            :disabled="!state.projects.some(p => p.selected)"
            @click="loadProjects"
            outlined
            small
          >
            <v-icon left v-text="'mdi-import'" />
            Import
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
  name: 'ProjectsLoadDialog',
  props: {
    open: Boolean,
  },
  setup(props) {
    const state = reactive({
      dialog: false,
      items: [
        {
          icon: 'mdi-paperclip',
          title: 'Load projects from file',
          value: 'file',
        },
        {
          icon: 'mdi-github',
          title:
            'Load projects from github repo (nest-desktop/nest-desktop-projects)',
          value: 'github',
        },
        { icon: 'mdi-web', title: 'Load projects from url', value: 'url' },
      ],
      files: [],
      open: props.open,
      projects: [] as Project[],
      selectedFile: {},
      selectedProjects: [],
      selectedTree: {},
      source: 'file',
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
      } catch (e) {
        project.valid = false;
      }
    };

    /**
     * Fetch projects and validate them.
     */
    const fetchProjects = (data: any) => {
      const projects: any[] = Array.isArray(data) ? data : [data];
      projects.forEach((project: any) => {
        if (project.name) {
          state.projects.push(project);
          validateProject(project);
        }
      });
    };

    /**
     * Get projects from file.
     */
    const getProjectsFromFile = (file: any) => {
      state.projects = [];
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
      state.trees = [];
      const url =
        'https://api.github.com/repos/nest-desktop/nest-desktop-projects/git/trees/main?recursive=true';
      axios.get(url).then((response: any) => {
        state.trees = response.data.tree
          .filter((d: any) => d.type === 'tree')
          .map((d: any) => {
            return { text: d.path, value: d };
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
            return { text: d.path, value: d };
          });
      });
    };

    /**
     * Get projects from url.
     */
    const getProjectsFromUrl = (url: string) => {
      state.projects = [];
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
     * Load selected projects.
     */
    const loadProjects = () => {
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
        getTreesFromGithub();
      }
    );

    return {
      getFilesFromGithub,
      getProjectsFromGithub,
      getProjectsFromFile,
      getProjectsFromUrl,
      loadProjects,
      state,
    };
  },
});
</script>
