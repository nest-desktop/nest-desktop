<template>
  <div class="simulationButton">
    <div class="btn-split text-no-wrap">
      <v-btn
        :disabled="simulation.state.running"
        :loading="simulation.state.running"
        @click="projectStore.startSimulation()"
        class="btn-main"
        variant="outlined"
        title="Simulate"
        prepend-icon="mdi-play"
      >
        <span v-if="simulation.code.runSimulation"> Simulate </span>
        <span v-else>Prepare</span>
      </v-btn>

      <v-btn class="btn-append" variant="outlined">
        <v-icon icon="mdi-menu-down" />

        <v-menu :close-on-content-click="false" activator="parent">
          <v-list density="compact">
            <v-list-item
              :key="index"
              @click="item.onClick"
              v-for="(item, index) in state.items"
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
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";

import { NESTSimulation } from "@nest/helpers/simulation/nestSimulation";

import { useNESTProjectStore } from "@nest/store/project/nestProjectStore";
const projectStore = useNESTProjectStore();

const props = defineProps({
  disabled: Boolean,
});

const simulation = computed(
  () => projectStore.project.simulation as NESTSimulation
);

const state = reactive({
  disabled: false,
  items: [
    {
      id: "simulateAfterChange",
      variant: "checkbox",
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
      variant: "checkbox",
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
      variant: "checkbox",
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

onMounted(() => {
  state.disabled = props.disabled || false
})
</script>

<style lang="scss">
.simulationButton {
  .btn-split {
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
}
</style>
