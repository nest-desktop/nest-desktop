<template>
  <div class="projectsMenu">
    <v-menu
      :close-on-content-click="false"
      :position-x="state.position.x"
      :position-y="state.position.y"
      :value="state.show"
      transition="slide-y-transition"
    >
      <v-card tile flat style="min-width:300px">
        <span v-if="state.content === null">
          <v-list dense>
            <v-list-item
              :key="index"
              @click="item.onClick"
              v-for="(item, index) in state.items"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon" />
              </v-list-item-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>

              <v-list-item-action v-show="item.append">
                <v-icon small v-text="'mdi-menu-right'" />
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </span>

        <span v-if="state.content === 'projectsReset'">
          <v-card-title>
            Are you sure?
          </v-card-title>

          <v-card-text>
            The database for projects will be deleted and then reset.
            <br />
            All current projects will be lost.
          </v-card-text>

          <v-card-actions>
            <v-btn @click="reset" text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-btn @click="resetProjects" color="warning" dark>
              reset
            </v-btn>
          </v-card-actions>
        </span>

        <span
          v-if="['projectsDownload', 'projectsDelete'].includes(state.content)"
        >
          <v-card-subtitle>
            Select projects
          </v-card-subtitle>

          <v-list dense>
            <v-list-item-group v-model="state.selectedProjects" multiple>
              <v-list-item :key="project.id" v-for="project of state.projects">
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox :input-value="active"></v-checkbox>
                  </v-list-item-action>

                  <v-list-item-content>
                    {{ project.name }}
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>

          <v-card-actions>
            <v-btn @click="reset" text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-btn
              @click="downloadProjects"
              text
              v-if="state.content === 'projectsDownload'"
            >
              download
            </v-btn>
            <v-btn
              @click="deleteProjects"
              color="warning"
              dark
              v-if="state.content === 'projectsDelete'"
            >
              delete
            </v-btn>
          </v-card-actions>
        </span>

        <span v-if="state.content === 'projectsUpload'">
          <v-card-subtitle>
            Upload projects from
          </v-card-subtitle>
          <v-list dense>
            <v-list-item>
              <v-list-item-icon left>
                <v-icon v-text="'mdi-file'" />
              </v-list-item-icon>
              file
            </v-list-item>
            <v-list-item>
              <v-list-item-icon left>
                <v-icon v-text="'mdi-web'" />
              </v-list-item-icon>
              web
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-btn @click="reset" text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
          </v-card-actions>
        </span>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';

import core from '@/core/index';

export default Vue.extend({
  name: 'ProjectsMenu',
  props: {
    position: Object,
  },
  setup(props, { root }) {
    const state = reactive({
      content: null,
      selectedProjects: [],
      projects: core.app.projects,
      position: props.position,
      show: true,
      items: [
        {
          id: 'projectsReload',
          icon: 'mdi-reload',
          title: 'Reload projects',
          onClick: () => {
            core.app.updateProjects();
            state.show = false;
          },
        },
        {
          id: 'projectsDownload',
          icon: 'mdi-download',
          title: 'Download projects',
          onClick: () => {
            state.content = 'projectsDownload';
          },
          append: true,
        },
        {
          id: 'projectsUpload',
          icon: 'mdi-upload',
          title: 'Upload projects',
          onClick: () => {
            state.content = 'projectsUpload';
          },
          append: true,
        },
        {
          id: 'projectsDelete',
          icon: 'mdi-delete',
          title: 'Delete projects',
          onClick: () => {
            state.content = 'projectsDelete';
          },
          append: true,
        },
        {
          id: 'projectsReset',
          icon: 'mdi-database-refresh',
          title: 'Reset projects',
          onClick: () => {
            state.content = 'projectsReset';
          },
          append: true,
        },
      ],
    });

    const reset = () => {
      state.content = null;
      state.selectedProjects = [];
    };

    const resetProjects = () => {
      state.show = false;
      core.app.resetProjectDatabase().then(() => {
        core.app.updateProjects();
        reset();
      });
    };

    const downloadProjects = () => {
      state.show = false;
      const projectIds = state.projects
        .filter((project, idx) => state.selectedProjects.includes(idx))
        .map(project => project.id);
      core.app.downloadProjects(projectIds).then(() => {
        reset();
      });
    };

    const deleteProjects = () => {
      state.show = false;
      const projectIds = state.projects
        .filter((project, idx) => state.selectedProjects.includes(idx))
        .map(project => project.id);
      core.app.deleteProjects(projectIds).then(() => {
        core.app.updateProjects();
        reset();
      });
    };

    watch(
      () => props.position,
      () => {
        state.show = false;
        reset();
        state.position = props.position;
        state.show = true;
      }
    );

    return { deleteProjects, downloadProjects, reset, resetProjects, state };
  },
});
</script>
