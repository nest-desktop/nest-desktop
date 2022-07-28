<template>
  <div class="projectMenu">
    <v-menu transition="slide-y-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn @click.prevent icon v-bind="attrs" v-on="on">
          <v-icon class="px-1" small v-text="'mdi-dots-vertical'" />
        </v-btn>
      </template>

      <v-card>
        <span v-if="state.content == null">
          <v-list dense>
            <v-list-item
              :key="index"
              @click="item.onClick"
              v-for="(item, index) in state.items"
            >
              <v-list-item-icon>
                <v-icon right small v-text="item.icon" />
              </v-list-item-icon>
              <v-list-item-title v-text="item.title" />
            </v-list-item>
          </v-list>
        </span>

        <span v-if="state.content === 'projectDelete'">
          <v-card-title v-text="'Are you sure to delete this project?'" />

          <v-card-actions>
            <v-btn @click="state.content = null" outlined small text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-spacer />
            <v-btn @click="deleteProject" outlined small v-text="'Delete'" />
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

export default Vue.extend({
  name: 'ProjectMenu',
  props: {
    projectId: String,
  },
  setup(props, { root }) {
    const projectStore = core.app.project;
    const state = reactive({
      items: [
        {
          id: 'projectReload',
          icon: 'mdi-reload',
          title: 'Reload project',
          onClick: () => {
            state.project.reload();
          },
        },
        {
          id: 'projectDuplicate',
          icon: 'mdi-content-duplicate',
          title: 'Duplicate project',
          onClick: () => {
            const project: Project = state.project.duplicate();
            if (!root.$route.path.endsWith(project.id)) {
              root.$router.push({
                name: 'projectId',
                params: { id: project.id },
              });
            }
          },
        },
        {
          id: 'projectExport',
          icon: 'mdi-export',
          title: 'Export project',
          onClick: () => openDialog('export'),
        },
        {
          id: 'projectDelete',
          icon: 'mdi-delete',
          title: 'Delete project',
          onClick: () => {},
        },
      ],
      project: projectStore.getProject(props.projectId) as Project,
    });

    /**
     * Delete project.
     */
    const deleteProject = () => {
      state.project.delete();
    };

    const openDialog = (action: string = 'export') => {
      state.project.state.reset();
      core.app.openDialog('project', action, [state.project]);
    };

    watch(
      () => props.projectId,
      () => {
        state.project = projectStore.getProject(props.projectId) as Project;
      }
    );

    return { deleteProject, state };
  },
});
</script>
