<template>
  <div class="projectMenu" v-if="state.project">
    <v-menu
      :close-on-content-click="false"
      :position-x="state.position.x"
      :position-y="state.position.y"
      :value="state.show"
      transition="slide-y-transition"
    >
      <v-card>
        <!-- <v-card-title class="py-1" height="40" v-text="state.project.name" /> -->

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
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';

export default Vue.extend({
  name: 'ProjectMenu',
  props: {
    project: Object,
    position: Object,
  },
  setup(props, { root }) {
    const state = reactive({
      content: null,
      project: props.project,
      position: props.position,
      show: true,

      items: [
        {
          id: 'projectReload',
          icon: 'mdi-reload',
          title: 'Reload project',
          onClick: () => {
            state.project.reload();
            state.show = false;
          },
        },
        {
          id: 'projectDownload',
          icon: 'mdi-download',
          title: 'Download project',
          onClick: () => {
            state.project.download();
            state.show = false;
          },
        },
        {
          id: 'projectDelete',
          icon: 'mdi-delete',
          title: 'Delete project',
          onClick: () => {
            state.project.delete().then(() => {
              state.project.app.updateProjects();
            });
            state.show = false;
          },
        },
      ],
    });

    const back = () => {
      state.content = null;
    };

    watch(
      () => props.project,
      () => {
        state.content = null;
        state.show = true;
        state.project = props.project;
        state.position = props.position;
      }
    );

    return { state };
  },
});
</script>
