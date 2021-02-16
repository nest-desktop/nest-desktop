<template>
  <div class="simulationKernel">
    <v-row class="full-height mr-2" no-gutters>
      <v-col>
        <v-subheader v-text="'Simulation kernel'" />
        <v-card flat tile>
          <v-row class="mx-1 my-0" no-gutters>
            <v-col cols="12">
              <v-subheader
                class="paramLabel"
                v-text="'local number of threads'"
              />
              <v-slider
                :max="8"
                :min="1"
                @change="paramChange"
                dense
                height="40"
                hide-details
                v-model="simulation.localNumThreads"
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
                    v-model="simulation.kernel.localNumThreads"
                  />
                </template>
              </v-slider>
            </v-col>
          </v-row>
        </v-card>

        <v-card flat tile>
          <v-row class="mx-1 my-0" no-gutters>
            <v-col cols="12">
              <v-subheader
                class="paramLabel"
                v-text="'simulation resolution'"
              />
              <v-slider
                :max="8"
                :min="1"
                @change="paramChange"
                dense
                height="40"
                hide-details
                v-model="simulation.resolution"
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
                    v-model="simulation.kernel.resolution"
                  />
                </template>
              </v-slider>
            </v-col>
          </v-row>
        </v-card>

        <v-subheader v-text="'Simulation'" />
        <v-card flat tile>
          <v-row class="mx-1 my-0" no-gutters>
            <v-col cols="12">
              <v-subheader class="paramLabel" v-text="'simulation time'" />
              <v-slider
                :max="10000"
                :min="1"
                @change="paramChange"
                dense
                height="40"
                hide-details
                v-model="simulation.time"
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
                    v-model="simulation.time"
                  />
                </template>
              </v-slider>
            </v-col>
          </v-row>
        </v-card>

        <v-card flat tile>
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
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';

export default Vue.extend({
  name: 'SimulationKernel',
  props: {
    simulation: Object,
  },
  setup(props) {
    const state = reactive({
      simulation: props.simulation,
    });

    const paramChange = () => {
      state.simulation.project.code.generate();
    };

    watch(
      () => props.simulation,
      () => {
        state.simulation = props.simulation;
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
