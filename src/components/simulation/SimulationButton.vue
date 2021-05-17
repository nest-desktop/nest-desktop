<template>
  <div class="simulationButton">
    <v-menu :close-on-content-click="false" offset-y v-model="state.showMenu">
      <template #activator="{}">
        <v-btn
          :loading="state.project.simulation.running"
          @click="simulate"
          @contextmenu="showMenu"
          outlined
        >
          <v-icon left>mdi-play</v-icon>
          Simulate
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item
          :key="index"
          @click="item.onClick"
          v-for="(item, index) in state.items"
        >
          <v-list-item-title v-text="item.title" />

          <v-list-item-action v-show="item.append">
            <v-icon small v-text="'mdi-menu-right'" />
          </v-list-item-action>

          <v-list-item-action v-if="item.input === 'checkbox'">
            <v-checkbox
              :input-value="state.projectConfig[item.value]"
              color="black"
            />
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, onMounted, watch } from '@vue/composition-api';

import { Project } from '@/core/project/project';

export default Vue.extend({
  name: 'SimulationButton',
  props: {
    project: Project,
  },
  setup(props) {
    const state = reactive({
      items: [
        {
          id: 'simulateAfterChange',
          input: 'checkbox',
          title: 'Simulate after change',
          value: 'simulateAfterChange',
          onClick: () => {
            state.projectConfig.simulateAfterChange =
              !state.projectConfig.simulateAfterChange;
            state.project.updateConfig(state.projectConfig);
          },
        },
        {
          id: 'simulateAfterLoad',
          input: 'checkbox',
          title: 'Simulate after load',
          value: 'simulateAfterLoad',
          onClick: () => {
            state.projectConfig.simulateAfterLoad =
              !state.projectConfig.simulateAfterLoad;
            state.project.updateConfig(state.projectConfig);
          },
        },
        {
          id: 'simulateAfterCheckout',
          input: 'checkbox',
          title: 'Simulate after checkout',
          value: 'simulateAfterCheckout',
          onClick: () => {
            state.projectConfig.simulateAfterCheckout =
              !state.projectConfig.simulateAfterCheckout;
            state.project.updateConfig(state.projectConfig);
          },
        },
      ],
      project: props.project as Project,
      showMenu: false,
      projectConfig: {
        simulateAfterChange: false,
        simulateAfterLoad: false,
        simulateAfterCheckout: false,
      },
    });

    /**
     * Show simulation context menu.
     */
    const showMenu = (e: MouseEvent) => {
      e.preventDefault();
      state.showMenu = false;
      setTimeout(() => {
        state.showMenu = true;
      });
    };

    /**
     * Start simulation.
     */
    const simulate = () => {
      state.project.runSimulation();
    };

    onMounted(() => {
      state.project = props.project as Project;
      state.projectConfig = state.project.config;
    });

    watch(
      () => props.project,
      () => {
        state.project = props.project as Project;
        state.projectConfig = state.project.config;
      }
    );

    return { showMenu, simulate, state };
  },
});
</script>
