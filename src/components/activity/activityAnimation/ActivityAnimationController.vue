<template>
  <div class="activityAnimationController">
    <v-card class="ma-2px" outlined tile>
      <v-sheet color="primary">
        <v-card class="ml-1 pb-1" flat tile>
          <v-card flat tile>
            <v-card-text>
              <v-row no-gutters>
                <v-col cols="1" class="pa-0">
                  <v-btn
                    :color="
                      state.graph.config.frames.speed < -1
                        ? 'orange'
                        : 'primary'
                    "
                    @click="state.graph.decrementFrameSpeed()"
                    icon
                  >
                    <v-icon v-text="'mdi-fast-forward mdi-rotate-180'" />
                  </v-btn>
                </v-col>
                <v-spacer />

                <v-col cols="1">
                  <v-btn
                    :color="
                      state.graph.config.frames.speed === -1
                        ? 'orange'
                        : 'primary'
                    "
                    @click="state.graph.playBackwardFrameAnimation()"
                    icon
                  >
                    <v-icon v-text="'mdi-play mdi-rotate-180'" />
                  </v-btn>
                </v-col>
                <v-spacer />

                <v-col cols="1">
                  <v-btn
                    @click="state.graph.stepBackwardFrame()"
                    color="primary"
                    icon
                  >
                    <v-icon v-text="'mdi-step-backward'" />
                  </v-btn>
                </v-col>
                <v-spacer />

                <v-col cols="1">
                  <v-btn
                    :color="
                      state.graph.config.frames.speed === 0
                        ? 'orange'
                        : 'primary'
                    "
                    @click="state.graph.pauseFrameAnimation()"
                    icon
                  >
                    <v-icon v-text="'mdi-pause'" />
                  </v-btn>
                </v-col>
                <v-spacer />

                <v-col cols="1">
                  <v-btn
                    @click="state.graph.stepForwardFrame()"
                    color="primary"
                    icon
                  >
                    <v-icon v-text="'mdi-step-forward'" />
                  </v-btn>
                </v-col>
                <v-spacer />

                <v-col cols="1">
                  <v-btn
                    :color="
                      state.graph.config.frames.speed === 1
                        ? 'orange'
                        : 'primary'
                    "
                    @click="state.graph.playFrameAnimation()"
                    icon
                  >
                    <v-icon v-text="'mdi-play'" />
                  </v-btn>
                </v-col>
                <v-spacer />

                <v-col cols="1">
                  <v-btn
                    :color="
                      state.graph.config.frames.speed > 1 ? 'orange' : 'primary'
                    "
                    @click="state.graph.incrementFrameSpeed()"
                    icon
                  >
                    <v-icon v-text="'mdi-fast-forward'" :rotate="180" />
                  </v-btn>
                </v-col>

                <v-spacer />
              </v-row>
            </v-card-text>
          </v-card>

          <v-card flat tile>
            <v-card-text class="pa-0">
              <ParameterEdit
                :options="{
                  disabled: state.graph.state.nSamples === 0,
                  iconSize: 'small',
                  input: 'valueSlider',
                  label: 'Current time',
                  max: state.graph.state.nSamples,
                  min: 0,
                  readonly: state.graph.config.frames.speed !== 0,
                  rules: [
                    ['true', 'Please pause to select a time point!', 'info'],
                  ],
                  unit: 'ms',
                }"
                :value.sync="state.graph.state.frameIdx"
              />
            </v-card-text>
          </v-card>

          <v-card flat tile>
            <v-card-text class="pa-0">
              <ParameterEdit
                :options="{
                  input: 'valueSlider',
                  min: 1,
                  max: 60,
                  label: 'Frame rate',
                  unit: 'fps',
                }"
                :value.sync="state.graph.config.frames.rate"
              />
            </v-card-text>
          </v-card>

          <!-- <v-card flat tile>
            <v-card-text class="pa-0">
              <ParameterEdit
                :options="{
                  input: 'valueSlider',
                  min: 1,
                  max: 20,
                  label: 'Grid divisions',
                }"
                :value.sync="state.graph.config.grid.divisions"
              />
            </v-card-text>
          </v-card> -->
        </v-card>
      </v-sheet>
    </v-card>

    <v-card
      :key="layer.activity.hash"
      class="ma-2px"
      outlined
      tile
      v-for="layer in state.graph.layers"
    >
      <v-sheet :color="layer.node.color">
        <v-card class="ml-1 pb-1" flat tile>
          <v-card-title class="pa-0">
            <v-btn
              :color="layer.activity.recorder.view.color"
              :dark="projectView.config.coloredToolbar"
              :height="48"
              :ripple="false"
              :text="!projectView.config.coloredToolbar"
              block
              depressed
              tile
            >
              <v-row>
                <v-col cols="3" v-text="layer.activity.recorder.view.label" />
                <v-col cols="9" v-text="layer.activity.recorder.model.label" />
              </v-row>
            </v-btn>
          </v-card-title>

          <v-card-text class="px-1 py-0">
            <v-card flat tile>
              <v-select
                :items="layer.models"
                class="px-0 my-0"
                hide-details
                item-text="label"
                item-value="id"
                label="Select geometry model"
                prepend-inner-icon="mdi-shape"
                return-object
                v-model="layer.modelSelected"
              />
            </v-card>

            <v-card flat tile v-if="layer.activity.hasAnalogData()">
              <v-card-text class="px-1 py-0">
                <v-row no-gutters>
                  <v-col class="py-0" cols="2">
                    <v-text-field
                      :step="0.1"
                      hide-details
                      label="min"
                      style="font-size: 13px"
                      type="number"
                      v-model="layer.colorMap.min"
                    />
                  </v-col>
                  <v-spacer />
                  <v-col class="py-0" cols="6">
                    <v-select
                      :items="colorScales"
                      hide-details
                      style="font-size: 13px"
                      v-model="layer.colorMap.scale"
                    >
                      <template #item="{ item }">
                        <v-row style="width: 200px">
                          <v-col class="py-0" cols="4">
                            <img
                              :src="
                                require(`@/assets/img/colorscales/${item}.png`)
                              "
                              :style="{
                                transform: layer.colorMap.reverse
                                  ? 'scaleX(-1)'
                                  : null,
                              }"
                              height="20"
                              width="100%"
                            />
                          </v-col>
                          <v-col class="py-0" cols="8" v-text="item" />
                        </v-row>
                      </template>
                    </v-select>
                  </v-col>
                  <v-spacer />
                  <v-col class="py-0" cols="2">
                    <v-text-field
                      :step="0.1"
                      hide-details
                      label="max"
                      style="font-size: 13px"
                      type="number"
                      v-model="layer.colorMap.max"
                    />
                  </v-col>

                  <img
                    :src="
                      require(`@/assets/img/colorscales/${layer.colorMap.scale}.png`)
                    "
                    :style="{
                      transform: layer.colorMap.reverse ? 'scaleX(-1)' : null,
                    }"
                    height="8"
                    width="100%"
                  />
                </v-row>

                <v-checkbox
                  color="accent"
                  dense
                  label="Reverse colormap"
                  v-model="layer.colorMap.reverse"
                />
              </v-card-text>
            </v-card>

            <v-card flat tile>
              <v-card-text class="pa-0">
                <ParameterEdit
                  :options="{
                    input: 'valueSlider',
                    min: 1,
                    max: 10,
                    step: 0.1,
                    label: 'Object size',
                  }"
                  :value.sync="layer.object.size"
                />

                <ParameterEdit
                  :options="{
                    input: 'valueSlider',
                    min: 0,
                    max: 1,
                    step: 0.01,
                    label: 'Object opacity',
                  }"
                  :value.sync="layer.object.opacity"
                />
              </v-card-text>
            </v-card>

            <v-card flat tile v-if="layer.activity.hasSpikeData()">
              <v-subheader v-text="'Trail'" />
              <v-card-text>
                <v-row>
                  <v-col class="pa-0">
                    <ParameterEdit
                      :options="{
                        input: 'valueSlider',
                        min: 0,
                        max: state.graph.config.frames.sampleRate * 50,
                        step: state.graph.config.frames.sampleRate,
                        label: 'Trail length',
                      }"
                      :value.sync="layer.trail.length"
                    />
                  </v-col>
                </v-row>

                <v-checkbox
                  :disabled="layer.activity.hasAnalogData()"
                  hide-details
                  label="Trail fading"
                  v-model="layer.trail.fading"
                />

                <v-select
                  :disabled="layer.activity.hasAnalogData()"
                  :items="['off', 'growing', 'shrinking']"
                  hide-details
                  label="Trail mode"
                  v-model="layer.trail.mode"
                />
              </v-card-text>
            </v-card>

            <v-card flat tile v-if="layer.modelSelected.label.includes('box')">
              <v-subheader v-text="'Box'" />
              <v-card-text class="py-0">
                <v-checkbox
                  hide-details
                  dense
                  label="Flatten height"
                  v-model="layer.object.flatHeight"
                />

                <v-checkbox
                  hide-details
                  dense
                  label="Flying Planes"
                  v-model="layer.object.flyingBoxes"
                />
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-sheet>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';

import core from '@/core';
import { ActivityAnimationGraph } from '@/core/activity/activityAnimation/activityAnimationGraph';
import ParameterEdit from '@/components/parameter/ParameterEdit.vue';

export default Vue.extend({
  name: 'ActivityAnimationController',
  components: {
    ParameterEdit,
  },
  props: {
    graph: ActivityAnimationGraph,
    projectId: String,
  },
  setup(props) {
    const projectView = core.app.project.view;
    const state = reactive({
      graph: props.graph as ActivityAnimationGraph | undefined,
    });

    const colorScales: String[] = [
      'BrBG',
      'PRGn',
      'PiYG',
      'PuOr',
      'RdBu',
      'RdGy',
      'RdYlBu',
      'RdYlGn',
      'Spectral',
      'Blues',
      'Greens',
      'Greys',
      'Oranges',
      'Purples',
      'Reds',
      'Turbo',
      'Viridis',
      'Inferno',
      'Magma',
      'Plasma',
      'Cividis',
      'Warm',
      'Cool',
      'CubehelixDefault',
      'BuGn',
      'BuPu',
      'GnBu',
      'OrRd',
      'PuBuGn',
      'PuBu',
      'PuRd',
      'RdPu',
      'YlGnBu',
      'YlGn',
      'YlOrBr',
      'YlOrRd',
      'Rainbow',
      'Sinebow',
    ];

    watch(
      () => props.graph,
      () => {
        state.graph = props.graph as ActivityAnimationGraph;
      }
    );

    return { colorScales, projectView, state };
  },
});
</script>
