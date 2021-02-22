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

<script lang="ts">
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';

import { Simulation } from '@/core/simulation/simulation';

export default Vue.extend({
  name: 'ProjectMenu',
  props: {
    simulation: Simulation,
    position: Object,
  },
  setup(props) {
    const state = reactive({
      content: null,
      items: [
        {
          icon: 'mdi-reload',
          id: 'simulationAfterChange',
          title: 'Simulate after change',
          onClick: () => {
            state.show = false;
          },
        },
        {
          icon: 'mdi-download',
          id: 'simulationAfterLoad',
          title: 'Simulate after load',
          onClick: () => {
            state.show = false;
          },
        },
        {
          icon: 'mdi-delete',
          id: 'simulationAfterCheckout',
          title: 'Simulation after checkout',
          onClick: () => {
            state.show = false;
          },
        },
      ],
      position: props.position,
      show: true,
      simulation: props.simulation as Simulation,
    });

    watch(
      () => props.simulation,
      () => {
        state.content = null;
        state.show = true;
        state.simulation = props.simulation as Simulation;
        state.position = props.position;
      }
    );

    return { state };
  },
});
</script>
