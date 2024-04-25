<template>
  <Card>
    <v-card-title class="pa-0">
      <v-btn
        :color="layer.activity.recorder.view.color"
        :height="48"
        :ripple="false"
        @click="() => (layer.state.visible = !layer.state.visible)"
        block
        rounded="0"
      >
        <v-row>
          <v-col cols="3">{{ layer.activity.recorder.view.label }}</v-col>
          <v-col cols="7">{{ layer.activity.recorder.model.label }}</v-col>
          <v-col cols="2">
            <v-icon
              :icon="layer.state.visible ? 'mdi-eye' : 'mdi-eye-off'"
              class="mx-1"
              right
              size="small"
            />
          </v-col>
        </v-row>
      </v-btn>
    </v-card-title>

    <v-card-text class="px-1 py-0" v-if="layer.state.visible">
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

      <v-card
        flat
        rounded="0"
        v-if="layer.activity.recorder.model.isAnalogRecorder"
      >
        <span v-if="layer.state.records.length > 0">
          <v-select
            :items="layer.state.records"
            @change="
              () => {
                // panel.model.init();
                layer.graph.update();
              }
            "
            attach
            chips
            class="pa-1 pt-3"
            density="compact"
            hide-details
            item-value="groupId"
            label="Recorded events"
            persistent-hint
            return-object
            size="small"
            v-model="layer.state.record"
          >
            <template #selection="{ item }">
              <v-chip
                :color="item.raw.color"
                class="mx-2"
                disable-lookup
                label
                size="small"
                variant="outlined"
              >
                {{ item.raw.id }}
              </v-chip>
              <div style="font-size: 12px">
                {{ item.raw.label }}
                <span v-if="item.raw.unit"> ({{ item.raw.unit }})</span>
              </div>
            </template>

            <template #item="{ item }">
              <v-chip
                :color="item.raw.color"
                class="mx-2"
                label
                size="small"
                variant="outlined"
              >
                {{ item.raw.id }}
              </v-chip>
              <div style="font-size: 12px">
                {{ item.raw.label }}
                <span v-if="item.raw.unit"> ({{ item.raw.unit }})</span>
              </div>
            </template>
          </v-select>
        </span>

        <v-card flat tile v-if="layer.state.record">
          <v-card-text class="px-1 py-0">
            <v-row no-gutters>
              <v-col class="py-0" cols="2">
                <v-text-field
                  :label="`min (${layer.state.record.unit})`"
                  :step="0.1"
                  hide-details
                  style="font-size: 13px"
                  type="number"
                  v-model="layer.state.record.colorMap.min"
                />
              </v-col>
              <v-spacer />
              <v-col class="py-0" cols="6">
                <v-select
                  :items="colorScales"
                  hide-details
                  style="font-size: 13px"
                  v-model="layer.state.record.colorMap.scale"
                >
                  <template #item="{ item }">
                    <v-row style="width: 200px">
                      <v-col class="py-0" cols="4">
                        <img
                          :src="require(`@/assets/img/colorscales/${item}.png`)"
                          height="20"
                          width="100%"
                        />
                      </v-col>
                      <v-col class="py-0" cols="8">{{ item }}</v-col>
                    </v-row>
                  </template>
                </v-select>
              </v-col>
              <v-spacer />
              <v-col class="py-0" cols="2">
                <v-text-field
                  :label="`max (${layer.state.record.unit})`"
                  :step="0.1"
                  hide-details
                  style="font-size: 13px"
                  type="number"
                  v-model="layer.state.record.colorMap.max"
                />
              </v-col>

              <img
                :src="
                  require(`@/assets/img/colorscales/${layer.state.record.colorMap.scale}.png`)
                "
                height="8"
                width="100%"
              />
            </v-row>

            <v-checkbox
              color="accent"
              density="compact"
              label="Reverse colormap"
              v-model="layer.state.record.colorMap.reverse"
            />
          </v-card-text>
        </v-card>
      </v-card>

      <v-card flat rounded="0">
        <v-card-text class="pa-0">
          <ValueSlider
            :max="10"
            :min="1"
            :step="0.1"
            :value="layer.config.object.size"
            label="Object size"
          />

          <ValueSlider
            :max="1"
            :min="0"
            :step="0.01"
            :value="layer.config.object.opacity"
            label="Object opacity"
          />
        </v-card-text>
      </v-card>

      <v-card
        flat
        subtitle="Trail"
        v-if="layer.activity.recorder.model.isSpikeRecorder"
      >
        <v-card-text>
          <v-row>
            <v-col class="pa-0">
              <ValueSlider
                :max="layer.graph.config.frames.sampleRate * 50"
                :min="0"
                :step="layer.graph.config.frames.sampleRate"
                label="Trail length"
                v-model="layer.config.trail.length"
              />
            </v-col>
          </v-row>

          <v-checkbox
            hide-details
            label="Trail fading"
            v-model="layer.config.trail.fading"
          />

          <v-select
            :items="['off', 'growing', 'shrinking']"
            hide-details
            label="Trail mode"
            v-model="layer.config.trail.mode"
          />
        </v-card-text>
      </v-card>

      <v-card
        flat
        subtitle="Box style"
        v-if="layer.modelSelected?.label.includes('box')"
      >
        <v-card-text class="py-0">
          <v-checkbox
            hide-details
            density="compact"
            label="Flatten height"
            v-model="layer.config.object.flatHeight"
          />

          <v-checkbox
            hide-details
            density="compact"
            label="Flying planes"
            v-model="layer.config.object.flyingBoxes"
          />
        </v-card-text>
      </v-card>
    </v-card-text>
  </Card>
</template>

<script lang="ts" setup>
import Card from "@/components/common/Card.vue";
import ValueSlider from "@/components/controls/ValueSlider.vue";

import { ActivityAnimationLayer } from "../../helpers/activityAnimationGraph/activityAnimationLayer";

defineProps<{ layer: ActivityAnimationLayer }>();

const colorScales: String[] = [
  "BrBG",
  "PRGn",
  "PiYG",
  "PuOr",
  "RdBu",
  "RdGy",
  "RdYlBu",
  "RdYlGn",
  "Spectral",
  "Blues",
  "Greens",
  "Greys",
  "Oranges",
  "Purples",
  "Reds",
  "Turbo",
  "Viridis",
  "Inferno",
  "Magma",
  "Plasma",
  "Cividis",
  "Warm",
  "Cool",
  "CubehelixDefault",
  "BuGn",
  "BuPu",
  "GnBu",
  "OrRd",
  "PuBuGn",
  "PuBu",
  "PuRd",
  "RdPu",
  "YlGnBu",
  "YlGn",
  "YlOrBr",
  "YlOrRd",
  "Rainbow",
  "Sinebow",
];
</script>
