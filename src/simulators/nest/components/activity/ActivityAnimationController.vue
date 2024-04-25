<template>
  <Card class="mx-1" color="primary">
    <v-expansion-panels class="pa-0">
      <v-expansion-panel density="compact">
        <v-expansion-panel-title
          class="expansion-panel-title d-flex align-center"
        >
          <v-btn-toggle @click.stop mandatory variant="text">
            <v-btn
              :color="graph.config.frames.speed < -1 ? 'orange' : 'primary'"
              @click="graph.decrementFrameSpeed()"
              icon
              title="speed down"
            >
              <v-icon class="mdi-rotate-180" icon="mdi:mdi-fast-forward" />
            </v-btn>
            <v-btn
              :color="graph.config.frames.speed === -1 ? 'orange' : 'primary'"
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
              :color="graph.config.frames.speed === 0 ? 'orange' : 'primary'"
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
              :color="graph.config.frames.speed === 1 ? 'orange' : 'primary'"
              @click="graph.playFrameAnimation()"
              icon="mdi:mdi-play"
              title="play forward"
            />
            <v-btn
              :color="graph.config.frames.speed > 1 ? 'orange' : 'primary'"
              @click="graph.incrementFrameSpeed()"
              icon="mdi-fast-forward"
              title="speed up"
            />
          </v-btn-toggle>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-list>
            <v-list-item>
              <ValueSlider
                :disabled="graph.state.nSamples === 0"
                :max="graph.state.nSamples"
                :min="0"
                :readonly="graph.config.frames.speed !== 0"
                unit="ms"
                label="Current time"
                v-model="graph.state.frameIdx"
              />
            </v-list-item>

            <v-list-item>
              <ValueSlider
                :max="60"
                :min="1"
                label="Frame rate"
                unit="fps"
                v-model="graph.config.frames.rate"
              />
            </v-list-item>

            <v-list-item>
              <ValueSlider
                :max="20"
                :min="1"
                label="Grid divisions"
                v-model="graph.config.grid.divisions"
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
