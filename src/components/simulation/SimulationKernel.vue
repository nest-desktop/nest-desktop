<template>
  <div class="simulationKernel">
    <v-row class="full-height" no-gutters>
      <v-col>
        <v-card class="mb-1" flat tile>
          <v-btn
            :color="state.color"
            block
            dark
            depressed
            tile
            v-text="'simulation kernel'"
          />

          <v-card-text
            :style="{
              borderLeft: `4px solid ${state.color}`,
            }"
            class="pa-0"
          >
            <ParameterEdit
              :options="{
                input: 'tickSlider',
                label: 'local number of threads',
                ticks: [1, 2, 4, 8],
              }"
              :value.sync="simulation.kernel.localNumThreads"
              @update:value="paramChange"
              class="mx-1 py-2"
            />

            <ParameterEdit
              :options="{
                id: 'simulationResolution',
                input: 'tickSlider',
                label: 'simulation resolution',
                ticks: [0.01, 0.1, 1, 10],
              }"
              :value.sync="simulation.kernel.resolution"
              @update:value="paramChange"
              class="mx-1 py-2"
            />

            <ParameterEdit
              :options="{
                input: 'valueSlider',
                label: 'seed of the random number generator',
                max: 1000,
                min: 1,
                value: 1,
              }"
              :value.sync="simulation.kernel.rngSeed"
              @update:value="paramChange"
              class="mx-1 pa-1"
            />

            <ParameterEdit
              :options="{
                input: 'checkbox',
                label: 'randomize seed',
              }"
              :value.sync="state.autoRNGSeed"
              class="mx-1"
              @update:value="
                state.simulation.kernel.updateConfig({
                  autoRNGSeed: state.autoRNGSeed,
                })
              "
            />
          </v-card-text>
        </v-card>

        <v-card class="mb-1" flat tile>
          <v-btn
            :color="state.color"
            block
            dark
            depressed
            tile
            v-text="'Simulation'"
          />
          <v-card-text
            :style="{
              borderLeft: `4px solid ${state.color}`,
            }"
            class="pa-0"
          >
            <ParameterEdit
              :options="{
                id: 'simulationTime',
                input: 'valueSlider',
                label: 'simulation time',
                max: 2000,
                min: 1,
                value: 1000,
              }"
              :value.sync="simulation.time"
              @update:value="paramChange"
              class="mx-1 py-2"
            />
          </v-card-text>
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
      color: '#9e9e9e',
      autoRNGSeed: false,
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
      state.autoRNGSeed = state.simulation.kernel.config.autoRNGSeed;
    });

    return {
      paramChange,
      state,
    };
  },
});
</script>
