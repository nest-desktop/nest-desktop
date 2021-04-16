<template>
  <div class="projectsMenu">
    <ProjectsUploadDialog :open="state.openUploadDialog" />
    <ProjectsDialog
      :action="state.projectDialogAction"
      :open="state.openProjectsDialog"
      :projects="state.projects"
    />

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
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';

import { Project } from '@/core/project/project';
import core from '@/core';
import ProjectsDialog from '@/components/project/ProjectsDialog.vue';
import ProjectsUploadDialog from '@/components/project/ProjectsUploadDialog.vue';

export default Vue.extend({
  name: 'ProjectsMenu',
  components: {
    ProjectsDialog,
    ProjectsUploadDialog,
  },
  props: {
    position: Object,
  },
  setup(props) {
    const state = reactive({
      content: null,
      selectedProjects: [],
      projects: core.app.projects as Project[],
      position: props.position,
      show: true,
      openUploadDialog: false,
      openProjectsDialog: false,
      projectDialogAction: 'download',
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
            state.projects.forEach((project: Project) => {
              project.view.resetState();
            });
            state.projectDialogAction = 'download';
            state.openProjectsDialog = true;
            state.show = false;
          },
        },
        {
          id: 'projectsUpload',
          icon: 'mdi-upload',
          title: 'Upload projects',
          onClick: () => {
            state.openUploadDialog = true;
            state.show = false;
          },
        },
        {
          id: 'projectsDelete',
          icon: 'mdi-trash-can-outline',
          title: 'Delete projects',
          onClick: () => {
            state.projects.forEach((project: Project) => {
              project.view.resetState();
            });
            state.projectDialogAction = 'delete';
            state.openProjectsDialog = true;
            state.show = false;
          },
        },
        {
          id: 'projectsReset',
          icon: '$mdiDatabaseRefreshOutline',
          title: 'Reset projects',
          onClick: () => {
            state.content = 'projectsReset';
          },
          append: true,
        },
      ],
    });

    /**
     * Reset states.
     */
    const reset = () => {
      state.content = null;
      state.selectedProjects = [];
    };

    /**
     * Reset project database.
     */
    const resetProjects = () => {
      state.show = false;
      core.app.resetProjectDatabase().then(() => {
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

    return {
      reset,
      resetProjects,
      state,
    };
  },
});
</script>
