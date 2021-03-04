<template>
  <div
    :key="state.graph.hash"
    class="activityAnimationController"
    v-if="state.graph.activityAnimationGraph.scene"
  >
    <v-card class="ma-1 pa-1" flat tile>
      <v-select
        :items="state.graph.activityAnimationGraph.scenes"
        prepend-inner-icon="mdi-shape"
        class="px-0 my-0"
        item-text="label"
        item-value="idx"
        label="Select a scene"
        hide-details
        v-model="state.graph.activityAnimationGraph.sceneIdx"
      />
    </v-card>

    <v-card flat tile>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="1" class="pa-0">
            <v-btn
              :color="
                state.graph.activityAnimationGraph.config.frames.speed < -1
                  ? 'orange'
                  : 'primary'
              "
              @click="state.graph.activityAnimationGraph.decrement()"
              icon
            >
              <v-icon v-text="'mdi-fast-forward mdi-rotate-180'" />
            </v-btn>
          </v-col>
          <v-spacer />

          <v-col cols="1">
            <v-btn
              :color="
                state.graph.activityAnimationGraph.config.frames.speed === -1
                  ? 'orange'
                  : 'primary'
              "
              @click="state.graph.activityAnimationGraph.playBackward()"
              icon
            >
              <v-icon v-text="'mdi-play mdi-rotate-180'" />
            </v-btn>
          </v-col>
          <v-spacer />

          <v-col cols="1">
            <v-btn
              @click="state.graph.activityAnimationGraph.stepBackward()"
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
                state.graph.activityAnimationGraph.config.frames.speed === 0
                  ? 'orange'
                  : 'primary'
              "
              @click="state.graph.activityAnimationGraph.stop()"
              icon
            >
              <v-icon v-text="'mdi-pause'" />
            </v-btn>
          </v-col>
          <v-spacer />

          <v-col cols="1">
            <v-btn
              @click="state.graph.activityAnimationGraph.step()"
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
                state.graph.activityAnimationGraph.config.frames.speed === 1
                  ? 'orange'
                  : 'primary'
              "
              @click="state.graph.activityAnimationGraph.play()"
              icon
            >
              <v-icon v-text="'mdi-play'" />
            </v-btn>
          </v-col>
          <v-spacer />

          <v-col cols="1">
            <v-btn
              :color="
                state.graph.activityAnimationGraph.config.frames.speed > 1
                  ? 'orange'
                  : 'primary'
              "
              @click="state.graph.activityAnimationGraph.increment()"
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
            input: 'valueSlider',
            min: 1,
            max: state.graph.activityAnimationGraph.frames.length - 1,
            label: 'Current time',
            unit: 'ms',
          }"
          :value.sync="state.graph.activityAnimationGraph.frameIdx"
        />
      </v-card-text>
    </v-card>

    <v-card flat tile>
      <v-subheader v-text="'Frames'" />
      <v-card-text class="pa-0">
        <ParameterEdit
          :options="{
            input: 'valueSlider',
            min: 1,
            max: 60,
            label: 'Frame rate',
            unit: 'fps',
          }"
          :value.sync="state.graph.activityAnimationGraph.config.frames.rate"
        />
      </v-card-text>
    </v-card>

    <v-card flat tile v-if="state.graph.hasAnyAnalogData()">
      <v-subheader v-text="'Colormap'" />
      <v-card-text class="py-0">
        <v-row no-gutters>
          <v-col class="py-0" cols="2">
            <v-text-field
              :step="0.1"
              hide-details
              label="min"
              style="font-size: 13px"
              type="number"
              v-model="state.graph.activityAnimationGraph.config.colorMap.min"
            />
          </v-col>
          <v-spacer />
          <v-col class="py-0" cols="6">
            <v-select
              :items="colorScales"
              hide-details
              style="font-size:13px"
              v-model="state.graph.activityAnimationGraph.config.colorMap.scale"
            >
              <template v-slot:item="{ item }">
                <v-row style="width:200px">
                  <v-col class="py-0" cols="4">
                    <img
                      :src="require(`@/assets/img/colorscales/${item}.png`)"
                      :style="{
                        transform: state.graph.activityAnimationGraph.config
                          .colorMap.reverse
                          ? 'scaleX(-1)'
                          : null,
                      }"
                      height="20"
                      width="100%"
                    />
                  </v-col>
                  <v-col class="py-0" cols="8">
                    {{ item }}
                  </v-col>
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
              v-model="state.graph.activityAnimationGraph.config.colorMap.max"
            />
          </v-col>

          <img
            :src="
              require(`@/assets/img/colorscales/${state.graph.activityAnimationGraph.config.colorMap.scale}.png`)
            "
            :style="{
              transform: state.graph.activityAnimationGraph.config.colorMap
                .reverse
                ? 'scaleX(-1)'
                : null,
            }"
            height="8"
            width="100%"
          />
        </v-row>

        <v-checkbox
          label="Reverse colormap"
          v-model="state.graph.activityAnimationGraph.config.colorMap.reverse"
        />
      </v-card-text>
    </v-card>

    <v-card flat tile>
      <v-subheader v-text="'Objects'" />
      <v-card-text class="pa-0">
        <ParameterEdit
          :options="{
            input: 'valueSlider',
            min: 1,
            max: 20,
            label: 'Grid divisions',
          }"
          :value.sync="state.graph.activityAnimationGraph.config.grid.divisions"
        />

        <ParameterEdit
          :options="{
            input: 'valueSlider',
            min: 1,
            max: 10,
            step: 0.1,
            label: 'Object size',
          }"
          :value.sync="state.graph.activityAnimationGraph.config.objectSize"
        />

        <ParameterEdit
          :options="{
            input: 'valueSlider',
            min: 0,
            max: 1,
            step: 0.01,
            label: 'Object opacity',
          }"
          :value.sync="state.graph.activityAnimationGraph.config.opacity"
        />
      </v-card-text>
    </v-card>

    <v-card flat tile v-if="state.graph.hasAnySpikeData()">
      <v-subheader v-text="'Trail'" />
      <v-card-text>
        <v-row>
          <v-col class="pa-0">
            <ParameterEdit
              :options="{
                input: 'valueSlider',
                min: 0,
                max:
                  state.graph.activityAnimationGraph.config.frames.sampleRate *
                  50,
                step:
                  state.graph.activityAnimationGraph.config.frames.sampleRate,
                label: 'Trail length',
              }"
              :value.sync="
                state.graph.activityAnimationGraph.config.trail.length
              "
            />
          </v-col>
        </v-row>

        <v-checkbox
          :disabled="state.graph.hasAnyAnalogData()"
          hide-details
          label="Trail fading"
          v-model="state.graph.activityAnimationGraph.config.trail.fading"
        />

        <v-select
          :disabled="state.graph.hasAnyAnalogData()"
          :items="['off', 'growing', 'shrinking']"
          hide-details
          label="Trail mode"
          v-model="state.graph.activityAnimationGraph.config.trail.mode"
        />
      </v-card-text>
    </v-card>

    <v-card
      flat
      tile
      v-if="state.graph.activityAnimationGraph.scene.name.includes('box')"
    >
      <v-subheader v-text="'Box'" />
      <v-card-text class="py-0">
        <v-checkbox
          hide-details
          label="Flatten height"
          v-model="state.graph.activityAnimationGraph.config.flatHeight"
        />

        <v-checkbox
          hide-details
          label="Flying Planes"
          v-model="state.graph.activityAnimationGraph.config.flyingBoxes"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive } from '@vue/composition-api';

import { ActivityGraph } from '@/core/activity/activityGraph';
import ParameterEdit from '@/components/parameter/ParameterEdit.vue';

export default Vue.extend({
  name: 'ActivityAnimationController',
  components: {
    ParameterEdit,
  },
  props: {
    graph: ActivityGraph,
    projectId: String,
  },
  setup(props) {
    const state = reactive({
      graph: props.graph as ActivityGraph | undefined,
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

    return { colorScales, state };
  },
});
</script>
