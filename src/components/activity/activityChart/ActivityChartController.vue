<template>
  <div class="activityChartController" v-if="state.graph">
    <v-menu
      :close-on-content-click="false"
      :position-x="state.menu.position.x"
      :position-y="state.menu.position.y"
      :value="state.menu.show"
      transition="slide-y-transition"
    >
      <v-color-picker
        @update:color="state.graph.updateRecordsColor()"
        flat
        show-swatches
        style="border-radius: 0"
        v-if="state.menu.record"
        v-model="state.menu.record.color"
      />
    </v-menu>

    <v-toolbar dense flat height="40">
      <v-btn @click="resetPanels" class="mt-1" outlined small>
        <v-icon left v-text="'mdi-reload'" />
        Reset
      </v-btn>

      <v-spacer />
      <v-menu left offset-y>
        <template #activator="{ on, attrs }">
          <v-btn class="mt-1" outlined small v-bind="attrs" v-on="on">
            <v-icon left v-text="'mdi-plus'" />
            Add panel
          </v-btn>
        </template>
        <v-list dense>
          <v-subheader style="height: 28px" v-text="'Analog signals'" />
          <v-list-item
            :disabled="
              !state.graph.project.state.activities.hasSomeAnalogRecorders
            "
            :key="'analogPanel' + index"
            @click="addPanel(model.id)"
            v-for="(model, index) in state.graph.panel.modelsAnalog"
          >
            <v-icon left small v-text="model.icon" />
            <v-list-item-title v-text="model.label" />
          </v-list-item>

          <v-subheader style="height: 28px" v-text="'Spikes'" />
          <v-list-item
            :disabled="!state.graph.project.state.activities.hasSomeSpikeRecorders"
            :key="'spikePanel' + index"
            @click="addPanel(model.id)"
            v-for="(model, index) in state.graph.panel.modelsSpike"
          >
            <v-icon class="mr-2" small v-text="model.icon" />
            <v-list-item-title v-text="model.label" />
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <draggable handle=".handle" v-model="state.graph.panels">
      <transition-group>
        <div
          :key="'panel' + index"
          v-for="(panel, index) in state.graph.panels"
        >
          <v-card class="ma-2px" outlined tile>
            <v-sheet color="primary">
              <v-card class="ml-1" flat tile>
                <v-card-title class="pa-0">
                  <ActivityChartPanelToolbar
                    :panel="panel"
                    style="width: 100%"
                  />
                </v-card-title>

                <v-card-text class="pa-0" v-if="panel.state.visible">
                  <span v-if="panel.model.state.records.length > 0">
                    <v-select
                      :items="panel.model.state.records"
                      :menu-props="{ offsetY: true }"
                      @change="
                        () => {
                          panel.model.init();
                          state.graph.update();
                        }
                      "
                      attach
                      chips
                      class="pa-1 pt-3"
                      clearable
                      dense
                      hide-details
                      item-value="groupId"
                      label="Recorded events"
                      multiple
                      persistent-hint
                      return-object
                      small
                      v-model="panel.model.state.recordsVisible"
                    >
                      <template v-slot:selection="{ item }">
                        <v-tooltip bottom>
                          <template #activator="{ on, attrs }">
                            <v-chip
                              :color="item.color"
                              @click="e => showColorPopup(e, item)"
                              @click:close="
                                () => {
                                  panel.model.removeRecord(item);
                                  state.graph.update();
                                }
                              "
                              close
                              disable-lookup
                              label
                              outlined
                              small
                              style="margin: 1px 2px"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <span
                                v-text="
                                  projectView.app.config.devMode
                                    ? item.groupId
                                    : item.id
                                "
                              />
                            </v-chip>
                          </template>
                          <div style="font-size: 12px">
                            <span v-text="item.labelCapitalize" />
                            <span v-if="item.unit" v-text="` (${item.unit})`" />
                          </div>
                        </v-tooltip>
                      </template>

                      <template v-slot:item="{ item }">
                        <v-chip
                          :color="item.color"
                          class="mx-2"
                          label
                          outlined
                          small
                          v-text="
                            projectView.app.config.devMode
                              ? item.groupId
                              : item.id
                          "
                        />
                        <div style="font-size: 12px">
                          <span v-text="item.labelCapitalize" />
                          <span v-if="item.unit" v-text="` (${item.unit})`" />
                        </div>
                      </template>
                    </v-select>
                  </span>
                  <ParameterEdit
                    :key="'param' + index"
                    :options="param"
                    :value.sync="param.value"
                    @update:value="state.graph.update()"
                    v-for="(param, index) of panel.model.params"
                  />
                </v-card-text>
              </v-card>
            </v-sheet>
          </v-card>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';
import draggable from 'vuedraggable';

import { ActivityChartGraph } from '@/core/activity/activityChart/activityChartGraph';
import { NodeRecord } from '@/core/node/nodeRecord';
import ActivityChartPanelToolbar from '@/components/activity/activityChart/ActivityChartPanelToolbar.vue';
import core from '@/core';
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
      menu: {
        position: {
          x: 0,
          y: 0,
        },
        record: null,
        show: false,
      },
    });

    /**
     * Add panel.
     */
    const addPanel = (modelId: string) => {
      state.graph.addPanel({ model: { id: modelId } });
      state.graph.update();
    };

    /**
     * Reset panels.
     */
    const resetPanels = () => {
      state.graph.init();
      state.graph.update();
    };

    /**
     * Show color popup for the selected record.
     */
    const showColorPopup = function (e: MouseEvent, record: NodeRecord) {
      // https://thewebdev.info/2020/08/13/vuetify%E2%80%8A-%E2%80%8Amenus-and-context-menu/
      e.preventDefault();
      state.menu.show = false;
      state.menu.record = record;
      state.menu.position.x = e.clientX;
      state.menu.position.y = e.clientY;
      this.$nextTick(() => {
        state.menu.show = true;
      });
    };

    /**
     * Reset menu.
     */
    const resetMenu = () => {
      state.menu.show = false;
      state.menu.position.x = 0;
      state.menu.position.y = 0;
      state.menu.record = null;
    };

    /**
     * Update activity graph controller.
     */
    const update = () => {
      resetMenu();
      state.graph = undefined;
      setTimeout(() => {
        state.graph = props.graph as ActivityChartGraph;
      }, 1);
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

    return {
      addPanel,
      projectView,
      resetPanels,
      showColorPopup,
      state,
    };
  },
});
</script>
