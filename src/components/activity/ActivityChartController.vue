<template>
  <div class="activityChartController" v-if="state.graph">
    <v-card flat tile>
      <v-card-actions>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              :disabled="
                state.graph.activityChartGraph.panelsInvisible.length === 0
              "
              block
              outlined
              v-bind="attrs"
              v-on="on"
            >
              Add panel
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              :key="index"
              @click="state.graph.activityChartGraph.addPanel(panel)"
              v-for="(panel, index) in state.graph.activityChartGraph
                .panelsInvisible"
            >
              <v-list-item-title v-text="panel.label" />
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-actions>

      <v-card-text class="pa-0">
        <v-list dense>
          <draggable v-model="state.graph.activityChartGraph.panels">
            <transition-group>
              <v-sheet
                :color="
                  state.selectedPanel === panel ? 'amber lighten-3' : 'white'
                "
                :key="panel.name"
                v-for="panel in state.graph.activityChartGraph.panels"
              >
                <v-list-item @click="state.selectedPanel = panel">
                  <v-list-item-icon>
                    <v-icon v-text="panel.icon" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>
                      {{ panel.label }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      @click="state.graph.activityChartGraph.removePanel(panel)"
                      icon
                      small
                    >
                      <v-icon v-text="'mdi-close'" />
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-sheet>
            </transition-group>
          </draggable>
        </v-list>
      </v-card-text>
    </v-card>

    <v-card flat tile v-if="state.selectedPanel">
      <v-card-text>
        <ParameterEdit
          :options="{
            input: 'tickSlider',
            label: 'panel height factor',
            ticks: [1, 2, 3, 4, 5],
          }"
          :value.sync="state.selectedPanel.height"
          @update:value="paramChange"
        />

        <ParameterEdit
          :options="state.selectedPanel.state.bins"
          :value.sync="state.selectedPanel.state.bins.value"
          @update:value="paramChange"
          v-if="state.selectedPanel.state.bins"
        />

        <ParameterEdit
          :options="state.selectedPanel.state.binsize"
          :value.sync="state.selectedPanel.state.binsize.value"
          @update:value="paramChange"
          v-if="state.selectedPanel.state.binsize"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, onMounted, watch } from '@vue/composition-api';
import draggable from 'vuedraggable';

import { ActivityGraph } from '@/core/activity/activityGraph';
import { ActivityGraphPanel } from '@/core/activity/plotPanels/activityGraphPanel';
import ParameterEdit from '@/components/parameter/ParameterEdit.vue';

export default Vue.extend({
  name: 'ActivityChartController',
  components: {
    draggable,
    ParameterEdit,
  },
  props: {
    graph: ActivityGraph,
  },
  setup(props) {
    const state = reactive({
      graph: props.graph as ActivityGraph | undefined,
      selectedPanel: undefined as ActivityGraphPanel | undefined,
    });

    /**
     * Update activity graph controller.
     */
    const update = () => {
      state.selectedPanel = undefined;
      state.graph = undefined;
      setTimeout(() => {
        state.graph = props.graph as ActivityGraph;
      }, 1);
    };

    /**
     * Triggers when parameter is changed.
     */
    const paramChange = () => {
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

    return { paramChange, state };
  },
});
</script>
