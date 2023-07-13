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
      <v-btn
        @click="resetPanels"
        class="mt-1"
        icon="mdi-reload"
        size="small"
        variant="outlined"
      />

      <v-spacer />
      <v-menu left offset-y>
        <template #activator="{ props }">
          <v-btn class="mt-1" icon="mdi-plus" size="small" variant="outlined" v-bind="props">
            <v-icon left>mdi-plus</v-icon>
            Add panel
          </v-btn>
        </template>
        <!-- <ActivityChartPanelMenuPopover
          :graph="state.graph"
          @changed="addPanel"
        /> -->
      </v-menu>
    </v-toolbar>

    <!-- <draggable handle=".handle" v-model="state.graph.panels"> -->
    <transition-group>
      <div :key="'panel' + index" v-for="(panel, index) in state.graph.panels">
        <v-card class="ma-2px" rounded="0" variant="outlined">
          <v-sheet color="primary">
            <v-card class="ml-1" flat rounded="0">
              <v-card-title class="pa-0">
                <!-- <ActivityChartPanelToolbar :panel="panel" style="width: 100%" /> -->
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
                    density="compact"
                    hide-details
                    item-value="groupId"
                    label="Recorded events"
                    multiple
                    persistent-hint
                    return-object
                    size="small"
                    v-model="panel.model.state.recordsVisible"
                  >
                    <template #selection="{ item }">
                      <v-chip
                        :color="item.color"
                        :title="
                          item.labelCapitalize +
                          (item.unit ? ` (${item.unit})` : '')
                        "
                        @click="(e) => showColorPopup(e, item)"
                        @click:close="
                          () => {
                            panel.model.removeRecord(item);
                            state.graph.update();
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
                    </template>

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
                    </template>
                  </v-select>
                </span>
                <!-- <ParameterEdit
                    :key="'param' + index"
                    :options="param"
                    :value.sync="param.value"
                    @update:value="state.graph.update()"
                    v-for="(param, index) of panel.model.params"
                  /> -->
              </v-card-text>
            </v-card>
          </v-sheet>
        </v-card>
      </div>
    </transition-group>
    <!-- </draggable> -->
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, watch } from "vue";
// import draggable from "vuedraggable";

import { useAppStore } from "@/store/appStore";

import { ActivityChartGraph } from "@nest/graph/activityGraph/activityChartGraph";
import { NodeRecord } from "@nest/core/node/nodeRecord";
// import ActivityChartPanelMenuPopover from "@/components/activity/activityChart/ActivityChartPanelMenuPopover.vue";
// import ActivityChartPanelToolbar from "@/components/activity/activityChart/ActivityChartPanelToolbar.vue";
// import ParameterEdit from "@/components/parameter/ParameterEdit.vue";

const props = defineProps({
  graph: ActivityChartGraph,
});

const appStore = useAppStore();

const state = reactive({
  color: "#9e9e9e",
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
</script>
