<template>
  <div class="projectsMenuContent">
    <v-menu offset-y transition="slide-y-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn small text v-bind="attrs" v-on="on">
          Projects
          <v-icon right v-text="'mdi-menu-down'" />
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item
          :key="index"
          :to="item.to"
          @click="item.onClick"
          v-for="(item, index) in state.items"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon" />
          </v-list-item-icon>
          <v-list-item-title v-text="item.title" />
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive } from '@vue/composition-api';

import core from '@/core';

export default Vue.extend({
  name: 'ProjectsMenuContent',
  setup(_, { root }) {
    const state = reactive({
      items: [
        {
          id: 'projectsReload',
          icon: 'mdi-reload',
          title: 'Reload projects',
          onClick: () => {
            core.app.project.initProjectList();
          },
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
          title: 'Reset all projects',
          onClick: () => openDialog('reset'),
        },
      ],
    });

    /**
     * Open a dialog to export, import or delete projects.
     * @param action Dialog to open
     */
    const openDialog = (action: string = 'export') => {

      // Reset states for project list.
      core.app.project.resetProjectStates();

      const projects =
        action === 'reset' ? [] : core.app.project.state.projects;

      // Open dialog for projects.
      core.app.openDialog('projects', action, { projects });
    };

    return {
      openDialog,
      state,
    };
  },
});
</script>
