<template>
  <div class="activityChartController" v-if="state.graph">
    <v-toolbar dense flat height="40">
      <v-spacer />
      <v-menu offset-y left>
        <template #activator="{ on, attrs }">
          <v-btn class="mt-1" outlined small v-bind="attrs" v-on="on">
            <v-icon left v-text="'mdi-plus'" />
            Add panel
          </v-btn>
        </template>
        <v-list dense>
          <v-subheader style="height: 28px" v-text="'Analog signals'" />
          <v-list-item
            :disabled="!state.graph.project.hasAnalogActivities"
            :key="'analogPanel' + index"
            @click="addPanel({ id: model.id })"
            v-for="(model, index) in state.graph.panels[0].modelsAnalog"
          >
            <v-icon left small v-text="model.icon" />
            <v-list-item-title v-text="model.label" />
          </v-list-item>

          <v-subheader style="height: 28px" v-text="'Spikes'" />
          <v-list-item
            :disabled="!state.graph.project.hasSpikeActivities"
            :key="'spikePanel' + index"
            @click="addPanel({ id: model.id })"
            v-for="(model, index) in state.graph.panels[0].modelsSpike"
          >
            <v-icon class="mr-2" small v-text="model.icon" />
            <v-list-item-title v-text="model.label" />
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <draggable handle=".handle" v-model="state.graph.panels">
      <transition-group>
        <v-card
          :key="'panel' + index"
          :style="{
            borderLeft: `4px solid ${state.color}`,
          }"
          class="ma-1"
          outlined
          tile
          v-for="(panel, index) in state.graph.panels"
        >
          <v-card-title class="pa-0">
            <ActivityChartPanelToolbar :panel="panel" style="width: 100%" />
          </v-card-title>

          <v-card-text class="pa-0" v-if="panel.state.visible">
            <ParameterEdit
              :key="'param' + index"
              :options="param"
              :value.sync="param.value"
              @update:value="paramChange"
              v-for="(param, index) of panel.model.params"
            />

            <span v-if="panel.model.activityType !== 'spike'">
              <v-subheader
                class="ma-0"
                style="height: 28px"
                v-text="'Data sources'"
              />
              <div
                class="px-1 pb-1 flex"
                :key="activity.idx"
                v-for="activity in panel.model.activities"
              >
                <v-checkbox
                  :color="activity.recorder.view.color"
                  :key="record + activity.idx"
                  :label="record"
                  :value="record"
                  @change="paramChange"
                  class="ma-0 pa-0"
                  dense
                  hide-details
                  v-for="record in activity.records"
                  v-model="panel.model.state.records[activity.idx]"
                />
              </div>
            </span>
          </v-card-text>
        </v-card>
      </transition-group>
    </draggable>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, onMounted, watch } from '@vue/composition-api';
import draggable from 'vuedraggable';

import { ActivityChartGraph } from '@/core/activity/activityChart/activityChartGraph';
import core from '@/core';
import ActivityChartPanelToolbar from '@/components/activity/activityChart/ActivityChartPanelToolbar.vue';
import ParameterEdit from '@/components/parameter/ParameterEdit.vue';

export default Vue.extend({
  name: 'ActivityChartController',
  components: {
    ActivityChartPanelToolbar,
    draggable,
    ParameterEdit,
  },
  props: {
    graph: ActivityChartGraph,
  },
  setup(props) {
    const projectView = core.app.project.view;
    const state = reactive({
      color: '#9e9e9e',
      graph: props.graph as ActivityChartGraph | undefined,
    });

    const addPanel = (panel: any) => {
      state.graph.addPanel(panel);
      state.graph.update();
    };

    /**
     * Update activity graph controller.
     */
    const update = () => {
      state.graph = undefined;
      setTimeout(() => {
        state.graph = props.graph as ActivityChartGraph;
      }, 1);
    };

    /**
     * Triggers when parameter is changed.
     */
    const paramChange = () => {
      state.graph.updatePanelModels();
      state.graph.update();
    };

    onMounted(() => {
      update();
    });

    watch(
      () => props.graph,
      () => {
        update();
      }
    );

    return { addPanel, paramChange, projectView, state };
  },
});
</script>
