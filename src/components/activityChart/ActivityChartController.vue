<template>
  <div class="activityChartController">
    <!-- <v-menu
      :close-on-content-click="false"
      :position-x="state.menu.position.x"
      :position-y="state.menu.position.y"
      :value="state.menu.show"
    >
      <v-color-picker
        @update:color="graph.updateRecordsColor()"
        flat
        show-swatches
        v-if="state.menu.record"
        v-model="state.menu.record.color"
      />
    </v-menu> -->

    <v-toolbar color="transparent" density="compact">
      <v-btn
        @click="resetPanels()"
        icon="mdi:mdi-reload"
        size="x-small"
        variant="outlined"
      />

      <v-spacer />

      <v-menu :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn
            prepend-icon="mdi:mdi-plus"
            size="small"
            v-bind="props"
            variant="outlined"
          >
            Add panel
          </v-btn>
        </template>

        <activity-chart-panel-menu-popover
          :graph="(graph as ActivityChartGraph)"
          @changed="addPanel"
        />
      </v-menu>
    </v-toolbar>

    <!-- <draggable handle=".handle" v-model="graph.panels"> -->
    <div :key="'panel' + index" v-for="(panel, index) in graph.panels">
      <Card class="mx-1" color="primary">
        <v-card-title class="pa-0">
          <activity-chart-panel-toolbar
            :panel="(panel as ActivityChartPanel)"
          />
        </v-card-title>

        <v-card-text class="pa-0" v-if="panel.state.visible">
          <span v-if="panel.model.state.records.length > 0">
            <v-select
              :items="panel.model.state.records"
              @update:model-value="update(panel)"
              chips
              closable-chips
              :chipsProps="{ variant: 'outlined' }"
              class="pa-1 pt-3"
              clearable
              density="compact"
              item-title="title"
              hide-details
              label="Recorded events"
              multiple
              persistent-hint
              return-object
              v-model="panel.model.state.recordsVisible"
              variant="outlined"
            >
              <template #chip="{ item }">
                <NodeRecordChip :nodeRecord="item.raw as NodeRecord" />
              </template>

              <!-- <template #prepend-item>
                <v-list-item title="Select All" />
                <v-divider />
              </template> -->

              <!-- <template #item="{ item, props }">
                <v-list-item :value="item.value" @click="props.onClick">
                  <template #prepend="{ isSelected }">
                    <NodeAvatar :node="item.value.node" />
                    <v-checkbox-btn :model-value="isSelected" />
                  </template>

                  {{
                    item.value.labelCapitalize +
                    (item.value.unit ? ` (${item.value.unit})` : "")
                  }}

                  <template #append>
                    <node-record-chip :nodeRecord="item.raw.value" />
                  </template>
                </v-list-item>
              </template> -->

              <!-- <template #selection="{ item }">
                <v-chip
                  :color="item.color"
                  :title="
                    item.labelCapitalize + (item.unit ? ` (${item.unit})` : '')
                  "
                  @click="(e) => showColorPopup(e, item)"
                  @click:close="
                    () => {
                      panel.model.removeRecord(item);
                      graph.update();
                    }
                  "
                  close
                  disable-lookup
                  label
                  size="small"
                  style="margin: 1px 2px"
                  variant="outlined"
                >
                  {{ appStore.devMode ? item.groupId : item.id }}
                </v-chip>
              </template> -->

              <!--

              <template #item="{ item }">
                <v-chip
                  :color="item.color"
                  class="mx-2"
                  label
                  size="small"
                  variant="outlined"
                />
                {{ appStore.devMode ? item.groupId : item.id }}
                <div style="font-size: 12px">
                  {{ item.labelCapitalize }}
                  <span v-if="item.unit">(${item.unit})</span>
                </div>
              </template> -->
            </v-select>
          </span>

          <!-- <ParameterEdit
                    :key="'param' + index"
                    :options="param"
                    :value.sync="param.value"
                    @update:value="graph.update()"
                    v-for="(param, index) of panel.model.params"
                  /> -->
        </v-card-text>
      </Card>
    </div>
    <!-- </draggable> -->
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick } from "vue";

import Card from "../common/Card.vue";
import ActivityChartPanelMenuPopover from "./ActivityChartPanelMenuPopover.vue";
import ActivityChartPanelToolbar from "./ActivityChartPanelToolbar.vue";
import NodeRecordChip from "../node/NodeRecordChip.vue";
// import ParameterEdit from "../parameter/ParameterEdit.vue";
import { ActivityChartGraph } from "@/helpers/activityChartGraph/activityChartGraph";
import { ActivityChartPanel } from "@/helpers/activityChartGraph/activityChartPanel";
import { NodeRecord } from "@/helpers/node/nodeRecord";

const props = defineProps<{ graph: ActivityChartGraph }>();
const graph = computed(() => props.graph);

// const state = reactive({
//   color: "#9e9e9e",
//   menu: {
//     position: {
//       x: 0,
//       y: 0,
//     },
//     // record: null as NodeRecord,
//     show: false,
//   },
// });

/**
 * Add panel.
 */
const addPanel = (modelId: string) => {
  graph.value.addPanel({ model: { id: modelId } });
  graph.value.update();
};

/**
 * Reset panels.
 */
const resetPanels = () => {
  graph.value.panels = [];
  graph.value.addPanels();
  graph.value.update();
};

// /**
//  * Show color popup for the selected record.
//  */
// const showColorPopup = function (e: MouseEvent, record: NodeRecord) {
//   // https://thewebdev.info/2020/08/13/vuetify%E2%80%8A-%E2%80%8Amenus-and-context-menu/
//   e.preventDefault();
//   state.menu.show = false;
//   state.menu.record = record;
//   state.menu.position.x = e.clientX;
//   state.menu.position.y = e.clientY;
//   this.$nextTick(() => {
//     state.menu.show = true;
//   });
// };

// /**
//  * Reset menu.
//  */
// const resetMenu = () => {
//   state.menu.show = false;
//   state.menu.position.x = 0;
//   state.menu.position.y = 0;
//   state.menu.record = null as NodeRecord;
// };

const update = (panel: ActivityChartPanel) => {
  nextTick(() => {
    panel.model.init();
    graph.value.update();
  });
};
</script>
