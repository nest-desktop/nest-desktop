<template>
  <div class="simulationButton">
    <v-menu :close-on-content-click="false" offset-y>
      <template #activator="{ on }">
        <div class="btn-split text-no-wrap">
          <v-btn
            :disabled="state.disabled"
            :loading="state.project.simulation.state.running"
            @click="state.project.startSimulation()"
            class="btn-main"
            outlined
            title="Simulate"
          >
            <v-icon center>mdi-play</v-icon>
            <span class="d-none d-lg-flex">
              <span
                v-if="state.project.simulation.code.runSimulation"
                v-text="'Simulate'"
              />
              <span v-else v-text="'Prepare'" />
            </span>
          </v-btn>
          <v-btn class="btn-append" outlined v-on="on">
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </div>
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

import { Project } from '@/core/project/project';
import core from '@/core';

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
      projectConfig: projectView.config,
    });

    const update = () => {
      state.disabled = props.disabled;
      state.project = props.project as Project;
      state.projectConfig = projectView.config;
    };

    onMounted(update);

    watch(
      () => [props.disabled, props.project],
      () => update()
    );

    return { state };
  },
});
</script>

<style>
.simulationButton .btn-split {
  display: inline-block;
}
.simulationButton .btn-split .btn-main {
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.simulationButton .btn-split .btn-prepend {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  min-width: 35px !important;
  padding: 0 !important;
}

.simulationButton .btn-split .btn-append {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  min-width: 35px !important;
  padding: 0 !important;
}
</style>
