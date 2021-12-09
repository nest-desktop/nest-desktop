<template>
  <div class="simulationKernel">
    <v-row class="full-height" no-gutters>
      <v-col>
        <v-sheet class="ma-1" color="primary" outlined>
          <v-card class="ml-1" outlined tile>
            <v-card-title class="pa-0">
              <v-btn
                :dark="projectView.config.coloredToolbar"
                :ripple="false"
                :text="!projectView.config.coloredToolbar"
                block
                flat
                color="primary"
                depressed
                height="40"
                tile
              >
                simulation kernel
                <v-spacer />
              </v-btn>
            </v-card-title>

            <v-card-text class="pa-0">
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
                  unit: 'ms',
                  rules: [
                    [
                      'value < 1',
                      'Small simulation resolution produces many data points which could cause a high system load and thus freezes and lags!',
                      'warning',
                    ],
                  ],
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
                class="mx-1 py-1"
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
        </v-sheet>

        <v-sheet class="ma-1" color="primary" outlined>
          <v-card class="ml-1" outlined tile>
            <v-card-title class="pa-0">
              <v-btn
                :dark="projectView.config.coloredToolbar"
                :ripple="false"
                :text="!projectView.config.coloredToolbar"
                block
                color="primary"
                depressed
                height="40"
                tile
              >
                simulation
                <v-spacer />
              </v-btn>
            </v-card-title>

            <v-card-text class="pa-0">
              <ParameterEdit
                :options="{
                  id: 'simulationTime',
                  input: 'valueSlider',
                  label: 'simulation time',
                  max: 2000,
                  min: 0,
                  unit: 'ms',
                  value: 1000,
                  rules: [
                    [
                      'value >= 2000',
                      'Large simulation time produces many data points which could cause a high system load and thus freezes and lags!',
                      'warning',
                    ],
                  ],
                }"
                :value.sync="simulation.time"
                @update:value="paramChange"
                class="mx-1 py-2"
              />
            </v-card-text>
          </v-card>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, onMounted } from '@vue/composition-api';

import { Simulation } from '@/core/simulation/simulation';
import core from '@/core';
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
    const projectView = core.app.project.view;
    const state = reactive({
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
      projectView,
      state,
    };
  },
});
</script>

<style>
.simulationKernel .v-sheet {
  border-color: #e0e0e0 !important;
  border-width: 1px 1px 1px 0;
}
.simulationKernel .v-card {
  border-width: 0;
}
</style>
