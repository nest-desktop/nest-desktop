<template>
  <div class="simulationKernel">
    <v-row class="full-height mr-2" no-gutters>
      <v-col>
        <v-card class="my-4" flat tile>
          <v-subheader v-text="'Simulation'" />
          <ParameterEdit
            :options="{
              input: 'valueSlider',
              label: 'random seed',
              max: 10000,
              min: 1,
              value: 1,
            }"
            :value.sync="simulation.randomSeed"
            class="mx-1"
            @update:value="paramChange"
          />

          <ParameterEdit
            :options="{
              input: 'checkbox',
              label: 'randomize seed',
            }"
            :value.sync="state.randomSeed"
            class="mx-1"
            @update:value="
              state.simulation.updateConfig({ randomSeed: state.randomSeed })
            "
          />
        </v-card>

        <v-card class="my-4" flat tile>
          <v-subheader v-text="'Simulation kernel'" />
          <ParameterEdit
            :options="{
              input: 'tickSlider',
              label: 'local number of threads',
              ticks: [1, 2, 4, 6, 8, 16],
            }"
            :value.sync="simulation.kernel.localNumThreads"
            class="mx-1"
            @update:value="paramChange"
          />

          <ParameterEdit
            :options="{
              input: 'tickSlider',
              label: 'simulation resolution',
              ticks: [0.001, 0.01, 0.1, 1, 10],
            }"
            :value.sync="simulation.kernel.resolution"
            class="mx-1"
            @update:value="paramChange"
          />
        </v-card>

        <v-card class="my-4" flat tile>
          <v-subheader v-text="'Simulation'" />
          <ParameterEdit
            :options="{
              input: 'valueSlider',
              label: 'simulation time',
              max: 10000,
              min: 10,
              step: 10,
              value: 1000,
            }"
            :value.sync="simulation.time"
            class="mx-1"
            @update:value="paramChange"
          />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, onMounted } from '@vue/composition-api';

import { Simulation } from '@/core/simulation/simulation';
import ParameterEdit from '@/components/parameter/ParameterEdit.vue';

export default Vue.extend({
  name: 'SimulationKernel',
  components: {
    ParameterEdit,
  },
  props: {
    simulation: Simulation,
  },
  setup(props) {
    const state = reactive({
      randomSeed: false,
      simulation: props.simulation as Simulation,
    });

    /**
     * Triggers when parameter is changed.
     */
    const paramChange = () => {
      state.simulation.project.code.generate();
    };

    onMounted(() => {
      state.simulation = props.simulation as Simulation;
      state.randomSeed = state.simulation.config.randomSeed;
    });

    return {
      paramChange,
      state,
    };
  },
});
</script>

<style>
.paramLabel {
  color: black;
  font-size: 12px;
  font-weight: 400;
  height: 12px;
  left: -8px;
  line-height: 12px;
  position: absolute;
  top: 2px;
  z-index: 1000;
}
</style>
