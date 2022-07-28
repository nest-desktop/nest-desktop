<template>
  <div class="projectMenu" v-if="state.projectId">
    <v-dialog max-width="480" v-model="state.dialog">
      <v-card>
        <v-card-title v-text="'Are you sure to delete it?'" />

        <v-card-text v-if="state.project">
          <v-list dense>
            <v-subheader>Project: {{ state.project.name }} </v-subheader>
            <v-list-item
              :key="connection.idx"
              v-for="connection in state.project.network.connections"
            >
              {{ connection.source.model.label }} ->
              {{ connection.target.model.label }}
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="state.dialog = false"
            outlined
            small
            text
            v-text="'cancel'"
          />
          <v-btn @click="deleteProject" outlined small v-text="'Delete'" />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-menu transition="slide-y-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn @click.prevent icon v-bind="attrs" v-on="on">
          <v-icon class="px-1" small v-text="'mdi-dots-vertical'" />
        </v-btn>
      </template>

      <v-card>
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
      dialog: false,
      items: [
        {
          id: 'projectReload',
          icon: 'mdi-reload',
          title: 'Reload project',
          onClick: () => {
            const project = projectStore.getProject(state.projectId) as Project;
            project.reload();
          },
        },
        {
          id: 'projectDuplicate',
          icon: 'mdi-content-duplicate',
          title: 'Duplicate project',
          onClick: () => {
            const project = projectStore.getProject(state.projectId) as Project;
            const newProject: Project = project.duplicate();
            if (!root.$route.path.endsWith(newProject.id)) {
              root.$router.push({
                name: 'projectId',
                params: { id: newProject.id },
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
          onClick: () => openDialog('delete'),
        },
      ],
      project: null as Project,
      projectId: props.projectId,
    });

    /**
     * Delete project.
     */
    const deleteProject = () => {
      state.project.delete();
    };

    const openDialog = (action: string = 'export') => {
      if (action === 'delete') {
        state.project = projectStore.getProject(props.projectId) as Project;
        state.dialog = true;
      } else {
        const project = projectStore.getProject(props.projectId) as Project;
        project.state.reset();
        core.app.openDialog('projects', action, { projects: [project] });
      }
    };

    watch(
      () => props.projectId,
      () => {
        state.projectId = props.projectId;
      }
    );

    return { deleteProject, state };
  },
});
</script>
