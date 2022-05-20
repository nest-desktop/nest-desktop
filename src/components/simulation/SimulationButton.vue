<template>
  <div class="simulationButton">
    <v-menu :close-on-content-click="false" offset-y v-model="state.showMenu">
      <template #activator="{}">
        <v-btn
          :disabled="state.disabled"
          :loading="state.project.simulation.state.running"
          @click="state.project.startSimulation()"
          @contextmenu="showMenu"
          outlined
        >
          <v-icon left>mdi-play</v-icon>
          <span
            v-if="state.project.simulation.code.runSimulation"
            v-text="'Simulate'"
          />
          <span v-else v-text="'Prepare'" />
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item
          :key="index"
          @click="item.onClick"
          v-for="(item, index) in state.items"
          v-show="item.show()"
        >
          <v-list-item-title v-text="item.title" />

          <v-list-item-action v-show="item.append">
            <v-icon small v-text="'mdi-menu-right'" />
          </v-list-item-action>

          <v-list-item-action v-if="item.input === 'checkbox'">
            <v-checkbox
              :input-value="state.projectConfig[item.value]"
              color="accent"
            />
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';

import core from '@/core';
import { Project } from '@/core/project/project';

export default Vue.extend({
  name: 'SimulationButton',
  props: {
    project: Project,
    disabled: Boolean,
  },
  setup(props) {
    const projectView = core.app.project.view;
    const state = reactive({
      disabled: props.disabled,
      items: [
        {
          id: 'simulateAfterChange',
          input: 'checkbox',
          title: 'Simulate after change',
          value: 'simulateAfterChange',
          show: () => true,
          onClick: () => {
            state.projectConfig.simulateAfterChange =
              !state.projectConfig.simulateAfterChange;
            projectView.updateConfig(state.projectConfig);
          },
        },
        {
          id: 'simulateAfterLoad',
          input: 'checkbox',
          title: 'Simulate after load',
          value: 'simulateAfterLoad',
          show: () => true,
          onClick: () => {
            state.projectConfig.simulateAfterLoad =
              !state.projectConfig.simulateAfterLoad;
            projectView.updateConfig(state.projectConfig);
          },
        },
        {
          id: 'simulateAfterCheckout',
          input: 'checkbox',
          title: 'Simulate after checkout',
          value: 'simulateAfterCheckout',
          show: () => true,
          onClick: () => {
            state.projectConfig.simulateAfterCheckout =
              !state.projectConfig.simulateAfterCheckout;
            projectView.updateConfig(state.projectConfig);
          },
        },
      ],
      project: props.project as Project,
      showMenu: false,
      projectConfig: projectView.config,
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

    const update = () => {
      state.disabled = props.disabled;
      state.project = props.project as Project;
      state.projectConfig = projectView.config;
    };

    onMounted(() => update());

    watch(
      () => [props.disabled, props.project],
      () => update()
    );

    return { showMenu, state };
  },
});
</script>
