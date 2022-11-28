<template>
  <div class="projectNavList">
    <v-toolbar
      absolute
      extended
      flat
      height="48"
      width="296"
      style="width: calc(100% - 64px - 1px)"
    >
      <v-row style="padding-top: 6px">
        <v-btn
          :key="index"
          :title="item.title"
          :to="item.to"
          @click="item.onClick"
          class="flex-grow-1 ma-0 pa-0"
          exact
          style="min-width: auto"
          text
          tile
          v-for="(item, index) in state.items"
        >
          <v-icon v-text="item.icon" />
        </v-btn>
      </v-row>
    </v-toolbar>

    <v-toolbar
      absolute
      flat
      height="48"
      style="margin-top: 52px; width: calc(100% - 64px - 1px)"
    >
      <div style="width: 100%">
        <v-row class="ma-0">
          <v-text-field
            clearable
            hide-details
            label="Search project"
            append-icon="mdi-magnify"
            v-model="projectStore.state.searchTerm"
          />
        </v-row>
      </div>
    </v-toolbar>

    <div
      flat
      style="
        height: calc(100vh - 24px - 96px - 4px);
        margin-top: 100px;
        overflow-y: hidden;
      "
    >
      <v-card flat tile>
        <v-list :key="projectStore.state.numLoaded" class="pt-0" dense two-line>
          <v-subheader
            class="my-0 py-0"
            style="font-size: 12px; height: 16px"
            v-text="
              projectStore.filteredProjects.length +
              ' project' +
              (projectStore.filteredProjects.length != 1 ? 's' : '')
            "
          />
          <v-virtual-scroll
            :height="state.height"
            :items="projectStore.filteredProjects"
            bench="1"
            item-height="64"
          >
            <template #default="{ item }">
              <v-list-item
                :key="item.id"
                :title="item.name"
                :to="'/project/' + item.id"
                class="projectItem"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.name }}
                    <span
                      style="font-size: 9px"
                      v-if="appConfig.devMode && item.version"
                    >
                      ({{ item.version }})
                    </span>
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{ item.network.nodes.length }} nodes,
                    {{ item.network.connections.length }} connections
                  </v-list-item-subtitle>

                  <v-list-item-subtitle
                    v-if="item.doc && item.state.activities.hasSomeEvents"
                  >
                    <ActivityGraphIcon :project="item" append />
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action class="mx-1">
                  <div v-if="item.doc">
                    <v-row no-gutters>
                      <div style="width: 36px">
                        <ProjectMenu :projectId="item.id" class="action" />
                      </div>

                      <v-btn
                        @click="e => saveProject(e, item)"
                        :disabled="!item.state.changes"
                        icon
                      >
                        <v-icon
                          v-if="item.state.changes"
                          v-text="'mdi-content-save-alert-outline'"
                        />
                        <v-icon
                          v-else
                          v-text="'mdi-content-save-check-outline'"
                        />
                      </v-btn>
                    </v-row>
                  </div>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-list>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onBeforeUnmount, onMounted, reactive } from '@vue/composition-api';

import core from '@/core';
import ActivityGraphIcon from '@/components/activity/ActivityGraphIcon.vue';
import ProjectMenu from '@/components/navigation/ProjectMenu.vue';

import { Project } from '@/core/project/project';

export default Vue.extend({
  name: 'ProjectNavList',
  components: {
    ActivityGraphIcon,
    ProjectMenu,
  },
  setup(_, { root }) {
    const projectStore = core.app.project;

    const state = reactive({
      height: 0,
      items: [
        {
          id: 'newProject',
          icon: 'mdi-plus',
          title: 'New project',
          to: '/project/',
          onClick: () => {},
        },
        {
          id: 'projectsReload',
          icon: 'mdi-reload',
          title: 'Reload all projects from the database',
          onClick: () => openDialog('reload'),
        },
        {
          id: 'projectsExport',
          icon: 'mdi-export',
          title: 'Export projects',
          onClick: () => openDialog('export'),
        },
        {
          id: 'projectsImport',
          icon: 'mdi-import',
          title: 'Import projects',
          onClick: () => openDialog('import'),
        },
        {
          id: 'projectsDelete',
          icon: 'mdi-trash-can-outline',
          title: 'Delete projects',
          onClick: () => openDialog('delete'),
        },
        {
          id: 'projectsReset',
          icon: '$mdiDatabaseRefreshOutline',
          title: 'Reset all projects in the database',
          onClick: () => openDialog('reset'),
        },
      ],
      project: null,
    });

    /**
     * Open a dialog to export, import or delete projects.
     * @param action Dialog to open
     */
    const openDialog = (action: string = 'export') => {
      // Reset states for project list.
      core.app.project.resetProjectStates();

      const projects: (Project | any)[] =
        action === 'reset' || action === 'reload'
          ? []
          : core.app.project.state.projects;

      // Open dialog for projects.
      core.app.openDialog('projects', action, { projects });
    };

    /**
     * Save project.
     * @param e Mouse event to prevent defaults
     * @param project Project object
     */
    const saveProject = (e: MouseEvent, project: Project) => {
      e.preventDefault();
      project.save();
    };

    /**
     * Set height on resize.
     */
    const onResize = () => {
      state.height = window.innerHeight - 24 - 96 - 4 - 16;
    };

    onMounted(() => {
      onResize();
      window.addEventListener('resize', onResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', onResize);
    });

    return {
      appConfig: core.app.config,
      projectStore,
      saveProject,
      state,
    };
  },
});
</script>

<style>
.projectNavList .projectItem .action {
  display: none;
}

.projectNavList .projectItem:hover .action {
  display: block;
}
</style>
