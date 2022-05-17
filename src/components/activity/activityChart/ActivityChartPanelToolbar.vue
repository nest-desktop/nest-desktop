<template>
  <div class="activityChartPanelToolbar" v-if="state.panel">
    <v-menu offset-y>
      <template #activator="{ on, attrs }">
        <v-btn
          :color="state.color"
          :dark="projectView.config.coloredToolbar"
          :text="!projectView.config.coloredToolbar"
          block
          depressed
          height="40"
          tile
          v-bind="attrs"
          v-on="on"
        >
          <v-icon class="handle" left v-text="panel.model.icon" />
          {{ state.panel.model.label }}
          <v-spacer />
        </v-btn>
        <span class="icons">
          <v-icon
            :dark="projectView.config.coloredToolbar"
            @click="panel.toggleVisible()"
            class="mx-1"
            right
            small
            v-text="panel.state.visible ? 'mdi-eye' : 'mdi-eye-off'"
          />
          <v-icon
            :dark="projectView.config.coloredToolbar"
            @click="panel.decreaseHeight()"
            class="mx-1"
            right
            small
            v-text="'mdi-minus'"
          />
          <v-icon
            :dark="projectView.config.coloredToolbar"
            @click="panel.increaseHeight()"
            class="mx-1"
            right
            small
            v-text="'mdi-plus'"
          />
          <v-icon
            :dark="projectView.config.coloredToolbar"
            @click="panel.remove()"
            class="mx-1"
            right
            small
            v-text="'mdi-trash-can-outline'"
          />
        </span>
      </template>
      <v-list dense>
        <v-subheader style="height: 28px" v-text="'Analog signals'" />
        <v-list-item
          :disabled="!state.panel.graph.project.state.hasAnalogActivities"
          :key="'analogPanel' + index"
          @click="selectModel(model.id)"
          v-for="(model, index) in state.panel.modelsAnalog"
        >
          <v-icon left small v-text="model.icon" />
          <v-list-item-title v-text="model.label" />
        </v-list-item>

        <v-subheader style="height: 28px" v-text="'Spikes'" />
        <v-list-item
          :disabled="!state.panel.graph.project.state.hasSpikeActivities"
          :key="'spikePanel' + index"
          @click="selectModel(model.id)"
          v-for="(model, index) in state.panel.modelsSpike"
        >
          <v-icon left small v-text="model.icon" />
          <v-list-item-title v-text="model.label" />
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';

import { ActivityChartPanel } from '@/core/activity/activityChart/activityChartPanel';
import core from '@/core';

export default Vue.extend({
  name: 'ActivityChartPanelToolbar',
  props: {
    panel: ActivityChartPanel,
  },
  setup(props) {
    const projectView = core.app.project.view;
    const state = reactive({
      color: '#9e9e9e',
      panel: props.panel as ActivityChartPanel | undefined,
    });

    const selectModel = (modelId: string) => {
      state.panel.selectModel(modelId, state.panel.model.toJSON());
      state.panel.graph.update();
    };

    /**
     * Update activity graph controller.
     */
    const update = () => {
      state.panel = undefined;
      setTimeout(() => {
        state.panel = props.panel as ActivityChartPanel;
      }, 1);
    };

    onMounted(() => {
      update();
    });

    watch(
      () => props.panel,
      () => {
        update();
      }
    );

    return { projectView, selectModel, state };
  },
});
</script>

<style>
.activityChartPanelToolbar .icons {
  display: none;
  line-height: 36px;
  position: absolute;
  right: 4px;
  top: 0;
}
.activityChartPanelToolbar:hover .icons {
  display: block;
}
</style>
