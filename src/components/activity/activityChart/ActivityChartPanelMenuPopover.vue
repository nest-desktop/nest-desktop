<template>
  <div class="activityChartPanelMenuPopover" v-if="state.graph">
    <v-card>
      <v-list
        dense
        v-show="state.graph.project.state.activities.hasSomeAnalogRecorders"
      >
        <v-subheader style="height: 28px" v-text="'Analog signals'" />
        <v-list-item
          :key="'analogPanel' + index"
          @click="selectModel(model.id)"
          v-for="(model, index) in state.graph.modelsAnalog"
        >
          <v-icon left small v-text="model.icon" />
          <v-list-item-title v-text="model.label" />
        </v-list-item>
      </v-list>

      <v-list
        dense
        v-show="state.graph.project.state.activities.hasSomeSpikeRecorders"
      >
        <v-subheader style="height: 28px" v-text="'Spike activity'" />
        <v-list-item
          :key="'spikePanel' + index"
          @click="selectModel(model.id)"
          v-for="(model, index) in state.graph.modelsSpike"
        >
          <v-icon left small v-text="model.icon" />
          <v-list-item-title v-text="model.label" />
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';
import { ActivityChartGraph } from '@/core/activity/activityChart/activityChartGraph';
export default Vue.extend({
  name: 'activityChartPanelMenuPopover',
  props: {
    graph: ActivityChartGraph,
  },
  setup(props, { emit }) {
    const state = reactive({
      graph: props.graph as ActivityChartGraph | undefined,
    });

    /**
     * Select panel model.
     */
    const selectModel = (modelId: string) => {
      emit('changed', modelId);
    };

    watch(
      () => props.graph,
      () => {
        state.graph = props.graph as ActivityChartGraph;
      }
    );

    return { selectModel, state };
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
