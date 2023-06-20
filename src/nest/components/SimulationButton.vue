<template>
  <div class="simulationButton">
    <v-menu :close-on-content-click="false" offset-y>
      <template #activator="{ props }">
        <div class="btn-split text-no-wrap">
          <v-btn
            :disabled="state.disabled"
            :loading="projectStore.project.simulation.state.running"
            @click="projectStore.project.startSimulation()"
            class="btn-main"
            variant="outlined"
            title="Simulate"
            prepend-icon="mdi-play"
          >
            <span v-if="projectStore.project.simulation.code.runSimulation">
              Simulate
            </span>
            <span v-else>Prepare</span>
          </v-btn>

          <v-btn class="btn-append" variant="outlined" v-bind="props">
            <v-icon icon="mdi-menu-down" />
          </v-btn>
        </div>
      </template>

      <v-list density="compact">
        <v-list-item
          :key="index"
          @click="item.onClick"
          v-for="(item, index) in state.items"
          v-show="item.show()"
        >
          <template #prepend="{ isActive }">
            <v-list-item-action start>
              <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
            </v-list-item-action>
          </template>

          <v-list-item-title> {{ item.title }} </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { useProjectStore } from "../store/project/projectStore";

const projectStore = useProjectStore();

const props = defineProps({
  disabled: Boolean,
});

const state = reactive({
  disabled: props.disabled,
  items: [
    {
      id: "simulateAfterChange",
      input: "checkbox",
      title: "Simulate after change",
      value: "simulateAfterChange",
      show: () => true,
      onClick: () => {
        // state.projectConfig.simulateAfterChange =
        //   !state.projectConfig.simulateAfterChange;
        // projectView.updateConfig(state.projectConfig);
      },
    },
    {
      id: "simulateAfterLoad",
      input: "checkbox",
      title: "Simulate after load",
      value: "simulateAfterLoad",
      show: () => true,
      onClick: () => {
        // state.projectConfig.simulateAfterLoad =
        //   !state.projectConfig.simulateAfterLoad;
        // projectView.updateConfig(state.projectConfig);
      },
    },
    {
      id: "simulateAfterCheckout",
      input: "checkbox",
      title: "Simulate after checkout",
      value: "simulateAfterCheckout",
      show: () => true,
      onClick: () => {
        // state.projectConfig.simulateAfterCheckout =
        //   !state.projectConfig.simulateAfterCheckout;
        // projectView.updateConfig(state.projectConfig);
      },
    },
  ],
  // project: props.project as Project,
  // projectConfig: projectView.config,
});
</script>

<style style="scss">
.simulationButton .btn-split {
  display: inline-block;

  .btn-main {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .btn-prepend {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    min-width: 35px !important;
    padding: 0 !important;
  }

  .btn-append {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    min-width: 35px !important;
    padding: 0 !important;
  }
}
</style>
