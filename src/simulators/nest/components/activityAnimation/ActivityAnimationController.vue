<template>
  <Card class="mx-1" color="primary">
    <v-expansion-panels class="pa-0" variant="accordion">
      <v-expansion-panel density="compact">
        <v-expansion-panel-title
          class="expansion-panel-title d-flex align-center pl-0 pr-2"
        >
          <v-btn-group @click.stop mandatory variant="text">
            <v-btn
              @click="graph.setFirstFrame()"
              icon="mdi:mdi-skip-backward"
              title="set first frame"
            />
            <v-btn
              :active="graph.state.frames.speed < -1"
              @click="graph.decrementFrameSpeed()"
              icon
              title="speed down"
            >
              <v-icon class="mdi-rotate-180" icon="mdi:mdi-fast-forward" />
            </v-btn>
            <v-btn
              :active="graph.state.frames.speed === -1"
              @click="graph.playBackwardFrameAnimation()"
              icon
              title="play backward"
            >
              <v-icon class="mdi-rotate-180" icon="mdi:mdi-play" />
            </v-btn>
            <v-btn
              @click="graph.stepBackwardFrame()"
              icon="mdi:mdi-step-backward"
              title="step backward"
            />
            <v-btn
              :active="graph.state.frames.speed === 0"
              @click="graph.pauseFrameAnimation()"
              icon="mdi:mdi-pause"
              title="pause"
            />
            <v-btn
              @click="graph.stepForwardFrame()"
              icon="mdi:mdi-step-forward"
              title="step forward"
            />
            <v-btn
              :active="graph.state.frames.speed === 1"
              @click="graph.playFrameAnimation()"
              icon="mdi:mdi-play"
              title="play forward"
            />
            <v-btn
              :active="graph.state.frames.speed > 1"
              @click="graph.incrementFrameSpeed()"
              icon="mdi:mdi-fast-forward"
              title="speed up"
            />
            <v-btn
              @click="graph.setLastFrame()"
              icon="mdi:mdi-skip-forward"
              title="set last frame"
            />
          </v-btn-group>
        </v-expansion-panel-title>

        <v-expansion-panel-text class="ma-1">
          <v-list>
            <v-list-item>
              <ValueSlider
                :disabled="graph.state.nSamples === 0"
                :max="graph.state.nSamples"
                :min="0"
                :readonly="graph.state.frames.speed !== 0"
                unit="ms"
                label="Current time"
                v-model="graph.frameIdx"
              />
            </v-list-item>

            <v-list-item>
              <ValueSlider
                :max="60"
                :min="1"
                label="Frame rate"
                unit="fps"
                v-model="graph.state.frames.rate"
              />
            </v-list-item>

            <v-list-item>
              <ValueSlider
                :max="20"
                :min="1"
                label="Grid divisions"
                v-model="graph.state.grid.divisions"
              />
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </Card>
</template>

<script lang="ts" setup>
import Card from "@/components/common/Card.vue";
import ValueSlider from "@/components/controls/ValueSlider.vue";

import { ActivityAnimationGraph } from "../../helpers/activityAnimationGraph/activityAnimationGraph";

defineProps<{ graph: ActivityAnimationGraph }>();
</script>
