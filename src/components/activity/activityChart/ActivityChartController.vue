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
        @update:color="paramChange"
        flat
        show-swatches
        style="border-radius: 0"
        v-model="state.menu.record.color"
        v-if="state.menu.record"
      />
    </v-menu>

    <v-toolbar dense flat height="40">
      <v-btn @click="resetPanels" class="mt-1" outlined small>
        <v-icon left v-text="'mdi-reload'" />
        Reset
      </v-btn>

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
            @click="addPanel(model.id)"
            v-for="(model, index) in state.graph.panels[0].modelsAnalog"
          >
            <v-icon left small v-text="model.icon" />
            <v-list-item-title v-text="model.label" />
          </v-list-item>

          <v-subheader style="height: 28px" v-text="'Spikes'" />
          <v-list-item
            :disabled="!state.graph.project.hasSpikeActivities"
            :key="'spikePanel' + index"
            @click="addPanel(model.id)"
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
        <v-sheet
          :key="'panel' + index"
          class="ma-1"
          color="primary"
          outlined
          v-for="(panel, index) in state.graph.panels"
        >
          <v-card class="ml-1" outlined tile>
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

              <span v-if="panel.model.state.records.length > 0">
                <v-select
                  :items="panel.model.state.records"
                  :menu-props="{ offsetY: true }"
                  @change="paramChange()"
                  attach
                  class="pa-1 pt-3"
                  clearable
                  dense
                  hide-details
                  label="Records"
                  multiple
                  persistent-hint
                  return-object
                  small
                  v-model="panel.model.state.events"
                >
                  <template v-slot:selection="{ item }">
                    <v-tooltip bottom>
                      <template #activator="{ on, attrs }">
                        <v-chip
                          :color="item.color"
                          @click="e => showMenu(e, item)"
                          @click:close="
                            () => {
                              panel.model.removeRecord(item);
                              paramChange();
                            }
                          "
                          close
                          disable-lookup
                          outlined
                          label
                          small
                          style="margin: 1px 2px"
                          v-bind="attrs"
                          v-on="on"
                        >
                          {{ item.id }}
                        </v-chip>
                      </template>
                      <div v-text="item.label" />
                    </v-tooltip>
                  </template>

                  <template v-slot:item="{ item }">
                    <v-chip
                      :color="
                        panel.model.state.events.indexOf(item) !== -1
                          ? item.color
                          : 'primary'
                      "
                      class="mx-2"
                      outlined
                      label
                      small
                      v-text="item.id"
                    />
                    <div style="font-size: 12px" v-text="item.label" />
                  </template>
                </v-select>
              </span>
            </v-card-text>
          </v-card>
        </v-sheet>
      </transition-group>
    </draggable>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, onMounted, watch } from '@vue/composition-api';
import draggable from 'vuedraggable';

import { ActivityChartGraph } from '@/core/activity/activityChart/activityChartGraph';
import { Node } from '@/core/node/node';
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
      menu: {
        position: {
          x: 0,
          y: 0,
        },
        record: null,
        show: false,
      },
      color: '#9e9e9e',
      graph: props.graph as ActivityChartGraph | undefined,
    });

    const addPanel = (modelId: string) => {
      state.graph.addPanel({ model: { id: modelId } });
      state.graph.update();
    };

    const resetPanels = () => {
      state.graph.init();
      state.graph.update();
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

    /**
     * Triggers when parameter is changed.
     */
    const paramChange = () => {
      state.graph.updatePanelModels();
      state.graph.update();
    };

    /**
     * Show record menu.
     */
    const showMenu = function (e: MouseEvent, record: Node) {
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
      paramChange,
      projectView,
      resetPanels,
      showMenu,
      state,
    };
  },
});
</script>

<style>
.activityChartController .v-sheet {
  border-color: #e0e0e0 !important;
  border-width: 1px 1px 1px 0;
}
.activityChartController .v-card {
  border-width: 0;
}
</style>
