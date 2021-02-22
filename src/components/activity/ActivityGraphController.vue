<template>
  <div class="activityGraphController" v-if="state.graph">
    <v-card tile>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="5">
            <v-subheader>
              Image format
            </v-subheader>
          </v-col>

          <v-col cols="7">
            <v-select
              :items="imageFormats"
              dense
              label="Select image format"
              single-line
              v-model="
                state.graph.activityChartGraph.options.toImageButtonOptions
                  .format
              "
            ></v-select>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="5">
            <v-subheader>
              Image size
            </v-subheader>
          </v-col>

          <v-col cols="3">
            <v-text-field
              dense
              hide-details
              label="width"
              outlined
              single-line
              v-model="
                state.graph.activityChartGraph.options.toImageButtonOptions
                  .width
              "
            />
          </v-col>
          <v-col cols="1" class="py-2 text-center" v-text="'x'" />
          <v-col cols="3">
            <v-text-field
              dense
              hide-details
              label="height"
              outlined
              single-line
              v-model="
                state.graph.activityChartGraph.options.toImageButtonOptions
                  .height
              "
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

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
              <v-list-item
                :key="panel.name"
                @click="state.selectedPanel = panel"
                v-for="panel in state.graph.activityChartGraph.panels"
              >
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
            </transition-group>
          </draggable>
        </v-list>
      </v-card-text>
    </v-card>

    <v-card flat tile v-if="state.selectedPanel">
      <v-card-subtitle v-text="state.selectedPanel.label" />

      <v-card flat tile>
        <v-card-text>
          <v-slider
            :max="5"
            :min="1"
            @change="paramChange"
            label="height factor"
            thumb-label="always"
            v-model="state.selectedPanel.height"
          />
        </v-card-text>
      </v-card>

      <v-card flat tile v-if="state.selectedPanel.config.bins">
        <v-card-text>
          <v-slider
            :label="state.selectedPanel.config.bins.label"
            :max="state.selectedPanel.config.bins.max"
            :min="state.selectedPanel.config.bins.min"
            @change="paramChange"
            thumb-label="always"
            v-model="state.selectedPanel.state.bins"
          />
        </v-card-text>
      </v-card>

      <v-card flat tile v-if="state.selectedPanel.config.binsize">
        <v-card-text>
          <v-slider
            :label="state.selectedPanel.config.binsize.label"
            :max="state.selectedPanel.config.binsize.max"
            :min="state.selectedPanel.config.binsize.min"
            @change="paramChange"
            thumb-label="always"
            v-model="state.selectedPanel.state.binsize"
          />
        </v-card-text>
      </v-card>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, onMounted, watch } from '@vue/composition-api';
import draggable from 'vuedraggable';

import { ActivityGraph } from '@/core/activity/activityGraph';
import { ActivityGraphPanel } from '@/core/activity/plotPanels/activityGraphPanel';

export default Vue.extend({
  name: 'ActivityGraphController',
  components: {
    draggable,
  },
  props: {
    graph: ActivityGraph,
    projectId: String,
    view: String,
  },
  setup(props) {
    const state = reactive({
      graph: props.graph as ActivityGraph | undefined,
      view: props.view,
      selectedPanel: undefined as ActivityGraphPanel | undefined,
    });

    const update = () => {
      state.graph = undefined;
      setTimeout(() => {
        state.graph = props.graph as ActivityGraph;
        state.view = state.graph.project.hasSpatialActivities
          ? props.view
          : 'abstract';
      }, 1);
    };

    const imageFormats: string[] = ['png', 'svg'];

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

    return { imageFormats, paramChange, state };
  },
});
</script>
