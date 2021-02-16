<template>
  <div class="simulationMenu">
    <v-menu
      :close-on-content-click="false"
      :position-x="state.position.x"
      :position-y="state.position.y"
      :value="state.show"
      transition="slide-y-transition"
    >
      <v-card>
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
    simulation: Object,
    position: Object,
  },
  setup(props, { root }) {
    const state = reactive({
      content: null,
      simulation: props.simulation,
      position: props.position,
      show: true,
      items: [
        {
          id: 'simulationAfterChange',
          icon: 'mdi-reload',
          title: 'Simulate after change',
          onClick: () => {
            state.project.reload();
            state.show = false;
          },
        },
        {
          id: 'simulationAfterLoad',
          icon: 'mdi-download',
          title: 'Simulate after load',
          onClick: () => {
            state.project.download();
            state.show = false;
          },
        },
        {
          id: 'simulationAfterCheckout',
          icon: 'mdi-delete',
          title: 'Simulation after checkout',
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
      () => props.simulation,
      () => {
        state.content = null;
        state.show = true;
        state.simulation = props.simulation;
        state.position = props.position;
      }
    );

    return { state };
  },
});
</script>
