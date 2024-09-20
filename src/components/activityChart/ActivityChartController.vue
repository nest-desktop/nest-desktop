<template>
  <div class="activityChartController">
    <v-toolbar color="transparent" density="compact">
      <v-btn
        @click="graph.resetPanels()"
        icon="mdi:mdi-reload"
        size="x-small"
      />

      <v-btn class="mx-2" prepend-icon="mdi:mdi-plus" size="small">
        Add panel
        <v-menu :close-on-content-click="false" activator="parent">
          <ActivityChartPanelMenuPopover
            :graph="(graph as ActivityChartGraph)"
            @changed="addPanel"
          />
        </v-menu>
      </v-btn>

      <v-spacer />

      <v-icon class="ma-auto" icon="mdi:mdi-format-color-fill" />

      <v-btn-toggle
        @update:model-value="update()"
        class="mx-2"
        density="compact"
        v-model="graph.state.traceColor"
      >
        <v-btn
          :key="index"
          :text="traceColor"
          :value="traceColor"
          size="small"
          v-for="(traceColor, index) in traceColors"
        />
      </v-btn-toggle>
    </v-toolbar>

    <!-- <draggable handle=".handle" v-model="graph.panels"> -->
    <div :key="'panel' + index" v-for="(panel, index) in graph.panels">
      <Card class="mx-1" color="primary">
        <ActivityChartPanelToolbar :panel="(panel as ActivityChartPanel)" />

        <v-card-text class="pa-0" v-if="panel.state.visible">
          <span v-if="panel.model.state.records.length > 0">
            <v-select
              :items="panel.model.state.records"
              @update:model-value="update()"
              class="pa-1 pt-3"
              chips
              clearable
              density="compact"
              item-title="title"
              item-value="groupId"
              hide-details
              label="Recorded events"
              multiple
              persistent-hint
              v-model="panel.model.state.recordsVisible"
            >
              <template #chip="{ item }">
                <NodeRecordChip
                  :nodeRecord="(panel.model.getNodeRecord(item.value) as NodeRecord)"
                  v-if="panel.model.getNodeRecord(item.value)"
                />
              </template>

              <template #item="{ item, props }">
                <v-list-item v-bind="props" density="compact" title="">
                  <v-checkbox
                    :label="item.title"
                    :model-value="
                      panel.model.state.recordsVisible.includes(item.value)
                    "
                    density="compact"
                    hide-details
                  >
                    <template #append>
                      <NodeRecordChip
                        :nodeRecord="(panel.model.getNodeRecord(item.value) as NodeRecord)"
                        class="my-auto"
                        v-if="panel.model.getNodeRecord(item.value)"
                      />
                    </template>
                  </v-checkbox>
                </v-list-item>
              </template>

              <template #prepend-item>
                <v-list-item
                  @click="selectAllNodeRecords(panel)"
                  title="Select All"
                />
                <v-divider />
              </template>

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
                />
                {{ appStore.devMode ? item.groupId : item.id }}
                <div style="font-size: 12px">
                  {{ item.labelCapitalize }}
                  <span v-if="item.unit">(${item.unit})</span>
                </div>
              </template> -->
            </v-select>
          </span>

          <v-list>
            <ParamListItem
              :key="index"
              :model-value="param.value"
              :param
              @update:model-value="graph.update()"
              v-for="(param, index) of panel.model.filteredParams"
            >
              <template #append />
            </ParamListItem>
          </v-list>
        </v-card-text>
      </Card>
    </div>
    <!-- </draggable> -->
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick } from "vue";

import ActivityChartPanelMenuPopover from "./ActivityChartPanelMenuPopover.vue";
import ActivityChartPanelToolbar from "./ActivityChartPanelToolbar.vue";
import Card from "../common/Card.vue";
import NodeRecordChip from "../node/NodeRecordChip.vue";
import { ActivityChartGraph } from "@/helpers/activityChartGraph/activityChartGraph";
import { ActivityChartPanel } from "@/helpers/activityChartGraph/activityChartPanel";
import { NodeRecord } from "@/helpers/node/nodeRecord";
import ParamListItem from "../parameter/ParamListItem.vue";

const props = defineProps<{ graph: ActivityChartGraph }>();
const graph = computed(() => props.graph);

const traceColors = ["node", "record", "trace"];

/**
 * Add panel.
 */
const addPanel = (modelId: string) => {
  graph.value.addPanel({ model: { id: modelId } });
  graph.value.update();
};

const selectAllNodeRecords = (panel: ActivityChartPanel) => {
  panel.model.selectAllNodeRecords();
  graph.value.update();
};

const update = () =>
  // panel: ActivityChartPanel
  {
    nextTick(() => {
      // panel.model.init();
      graph.value.update();
    });
  };
</script>
