<template>
  <div class="simulationKernel">
    <v-row class="full-height" no-gutters>
      <v-col>
        <v-card class="ma-2px" outlined tile>
          <v-sheet color="primary">
            <v-card class="ml-1" flat tile>
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
                  Simulation kernel
                  <v-spacer />
                </v-btn>
              </v-card-title>

              <v-card-text class="pa-0">
                <ParameterEdit
                  :options="options.threadSettings"
                  :value.sync="simulation.kernel.localNumThreads"
                  @update:value="paramChange"
                  class="mx-1 py-2"
                />

                <ParameterEdit
                  :options="options.resolutionSettings"
                  :value.sync="simulation.kernel.resolution"
                  @update:value="paramChange"
                  class="mx-1 py-2"
                />

                <ParameterEdit
                  :options="options.rngSeedSettings"
                  :value.sync="simulation.kernel.rngSeed"
                  @update:value="paramChange"
                  class="mx-1 py-1"
                />

                <ParameterEdit
                  :options="options.autoRNGSeedSettings"
                  :value.sync="state.autoRNGSeed"
                  class="mx-1"
                  @update:value="updateAutoRNGSeed"
                />
              </v-card-text>
            </v-card>
          </v-sheet>
        </v-card>

        <v-card class="ma-2px" outlined tile>
          <v-sheet color="primary">
            <v-card class="ml-1" flat tile>
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
                  Simulation
                  <v-spacer />
                </v-btn>
              </v-card-title>

              <v-card-text class="pa-0">
                <ParameterEdit
                  :options="options.simulationTimeSettings"
                  :value.sync="simulation.time"
                  @update:value="paramChange"
                  class="mx-1 py-2"
                />
              </v-card-text>
            </v-card>
          </v-sheet>
        </v-card>
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
    const options = {
      autoRNGSeedSettings: {
        input: 'checkbox',
        label: 'randomize seed',
      },
      resolutionSettings: {
        id: 'simulationResolution',
        input: 'tickSlider',
        label: 'simulation resolution',
        ticks: [0.01, 0.1, 1, 10],
        unit: 'ms',
        iconSize: 'large',
        rules: [
          [
            'value < 1',
            'Small simulation resolution produces many data points which could cause a high system load and thus freezes and lags!',
            'warning',
          ],
        ],
      },
      rngSeedSettings: {
        input: 'valueSlider',
        label: 'seed of the random number generator',
        max: 1000,
        min: 1,
        value: 1,
      },
      simulationTimeSettings: {
        id: 'simulationTime',
        input: 'valueSlider',
        label: 'simulation time',
        max: 2000,
        min: 0,
        unit: 'ms',
        value: 1000,
        iconSize: 'large',
        rules: [
          [
            'value >= 2000',
            'Large simulation time produces many data points which could cause a high system load and thus freezes and lags!',
            'warning',
          ],
        ],
      },
      threadSettings: {
        input: 'tickSlider',
        label: 'local number of threads',
        ticks: [1, 2, 4, 8],
      },
    };
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

    /**
     * Updates when the usage of automatic RNG seed is switched on/off.
     */
    function updateAutoRNGSeed() {
      state.simulation.kernel.updateConfig({
        autoRNGSeed: state.autoRNGSeed,
      });
    }

    onMounted(() => {
      state.simulation = props.simulation as Simulation;
      state.autoRNGSeed = state.simulation.kernel.config.autoRNGSeed;
    });

    return {
      options,
      paramChange,
      projectView,
      state,
      updateAutoRNGSeed,
    };
  },
});
</script>
