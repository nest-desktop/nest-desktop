<template>
  <div class="projectsMenu">
    <v-menu
      :close-on-content-click="false"
      :position-x="state.position.x"
      :position-y="state.position.y"
      :value="state.show"
      transition="slide-y-transition"
    >
      <v-card tile flat style="min-width: 300px">
        <span v-if="state.content == null">
          <v-list dense>
            <v-list-item
              :key="index"
              @click="item.onClick"
              v-for="(item, index) in state.items"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon" />
              </v-list-item-icon>
              <v-list-item-title v-text="item.title" />

              <v-list-item-action v-show="item.append">
                <v-icon small v-text="'mdi-menu-right'" />
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </span>

        <span v-if="state.content === 'projectsReset'">
          <v-card-title v-text="'Are you sure to reset all projects?'" />

          <v-card-text>
            The database for projects will be deleted and then reset.
            <br />
            All current projects will be lost.
          </v-card-text>

          <v-card-actions>
            <v-btn @click="reset" outlined small text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-spacer />
            <v-btn @click="resetProjects" outlined small v-text="'Reset'" />
          </v-card-actions>
        </span>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';

import core from '@/core';

export default Vue.extend({
  name: 'ProjectsMenu',
  components: {},
  props: {
    position: Object,
  },
  setup(props) {
    const state = reactive({
      content: null,
      selectedProjects: [],
      position: props.position,
      show: true,
      items: [
        {
          id: 'projectsReload',
          icon: 'mdi-reload',
          title: 'Reload projects',
          onClick: () => {
            core.app.project.initProjectList();
            state.show = false;
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
      core.app.project.resetDatabase().then(() => {
        reset();
      });
    };

    /**
     * Open one of the dialogs to export, import or delete.
     * @param action Dialog to open
     */
    const openDialog = (action: string = 'export') => {
      core.app.project.resetProjectStates();
      core.app.openDialog('project', action, core.app.project.state.projects);
      state.show = false;
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
