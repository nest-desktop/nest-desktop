<template>
  <Card
    class="ma-1"
    color="primary"
  >
    <v-expansion-panels
      class="pa-0"
      variant="accordion"
    >
      <v-expansion-panel density="compact">
        <v-expansion-panel-title
          class="expansion-panel-title d-flex align-center pl-0 pr-2"
        >
          <v-btn-group
            mandatory
            variant="text"
            @click.stop
          >
            <v-btn
              icon="mdi:mdi-skip-backward"
              title="set first frame"
              @click="graph.setFirstFrame()"
            />
            <v-btn
              :active="graph.state.frames.speed < -1"
              icon
              title="speed down"
              @click="graph.decrementFrameSpeed()"
            >
              <v-icon
                class="mdi-rotate-180"
                icon="mdi:mdi-fast-forward"
              />
            </v-btn>
            <v-btn
              :active="graph.state.frames.speed === -1"
              icon
              title="play backward"
              @click="graph.playBackwardFrameAnimation()"
            >
              <v-icon
                class="mdi-rotate-180"
                icon="mdi:mdi-play"
              />
            </v-btn>
            <v-btn
              icon="mdi:mdi-step-backward"
              title="step backward"
              @click="graph.stepBackwardFrame()"
            />
            <v-btn
              :active="graph.state.frames.speed === 0"
              icon="mdi:mdi-pause"
              title="pause"
              @click="graph.pauseFrameAnimation()"
            />
            <v-btn
              icon="mdi:mdi-step-forward"
              title="step forward"
              @click="graph.stepForwardFrame()"
            />
            <v-btn
              :active="graph.state.frames.speed === 1"
              icon="mdi:mdi-play"
              title="play forward"
              @click="graph.playFrameAnimation()"
            />
            <v-btn
              :active="graph.state.frames.speed > 1"
              icon="mdi:mdi-fast-forward"
              title="speed up"
              @click="graph.incrementFrameSpeed()"
            />
            <v-btn
              icon="mdi:mdi-skip-forward"
              title="set last frame"
              @click="graph.setLastFrame()"
            />
          </v-btn-group>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-list density="compact">
            <v-list-item class="pa-0">
              <ValueSlider
                v-model="graph.currentTime"
                :disabled="graph.state.nSamples === 0"
                :max="graph.state.nSamples"
                :min="1"
                class="mt-1"
                label="Current time"
                unit="ms"
              />
            </v-list-item>

            <v-list-item class="pa-0">
              <ValueSlider
                v-model="graph.state.frames.rate"
                :max="60"
                :min="1"
                class="mt-1"
                label="Frame rate"
                unit="fps"
              />
            </v-list-item>

            <v-list-item class="pa-0">
              <ValueSlider
                v-model="graph.state.grid.divisions"
                :max="20"
                :min="1"
                class="mt-1"
                label="Grid divisions"
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
