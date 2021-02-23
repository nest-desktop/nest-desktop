<template>
  <div class="simulationKernel">
    <v-row class="full-height mr-2" no-gutters>
      <v-col>
        <v-subheader v-text="'Simulation kernel'" />
        <ParameterEdit
          :options="{
            input: 'tickSlider',
            label: 'local number of threads',
            ticks: [1, 2, 4, 6, 8, 16],
          }"
          :value.sync="simulation.kernel.localNumThreads"
          @update:value="paramChange"
        />

        <ParameterEdit
          :options="{
            input: 'tickSlider',
            label: 'simulation resolution',
            ticks: [0.001, 0.01, 0.1, 1, 10],
          }"
          :value.sync="simulation.kernel.resolution"
          @update:value="paramChange"
        />

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
          @update:value="paramChange"
        />

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
          @update:value="paramChange"
        />

        <!-- <v-card flat tile>
          <v-row class="mx-1 my-0" no-gutters>
            <v-col cols="12">
              <v-subheader class="paramLabel" v-text="'random seed'" />
              <v-slider
                :max="10000"
                :min="1"
                @change="paramChange"
                dense
                height="40"
                hide-details
                v-model="simulation.randomSeed"
              >
                <template v-slot:append>
                  <v-text-field
                    @change="paramChange"
                    class="mt-0 pt-0"
                    height="32"
                    hide-details
                    single-line
                    style="width: 60px; font-size:12px"
                    type="number"
                    v-model="simulation.randomSeed"
                  />
                </template>
              </v-slider>
            </v-col>
          </v-row>
        </v-card> -->
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';

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
      simulation: props.simulation as Simulation,
    });

    /**
     * Triggers when parameter is changed.
     */
    const paramChange = () => {
      state.simulation.project.code.generate();
    };

    watch(
      () => props.simulation,
      () => {
        state.simulation = props.simulation as Simulation;
      }
    );

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
