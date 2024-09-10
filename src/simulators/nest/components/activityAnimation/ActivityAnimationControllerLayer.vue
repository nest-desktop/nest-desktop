<template>
  <v-expansion-panel density="compact" elevation="1" tile>
    <v-expansion-panel-title>
      <v-row class="text-button">
        <NodeAvatar :node="layer.activity.recorder" />
        <v-spacer />
        {{ layer.activity.recorder.model.label }}
        <v-spacer />
      </v-row>

      <template #actions>
        <v-icon
          @click.stop="() => (layer.state.visible = !layer.state.visible)"
          :icon="layer.state.visible ? 'mdi-eye' : 'mdi-eye-off'"
        />
      </template>
    </v-expansion-panel-title>

    <v-expansion-panel-text class="px-1 py-0">
      <v-card flat tile>
        <v-select
          :items="layer.models"
          class="my-2"
          density="compact"
          hide-details
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
                :color="item.raw.state.color"
                class="mx-2"
                disable-lookup
                label
                size="small"
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
                :color="item.raw.state.color"
                class="mx-2"
                label
                size="small"
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
                          alt="colorscale"
                          height="20"
                          width="100%"
                        />
                      </v-col>
                      <v-col :text="item" class="py-0" cols="8" />
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
                alt="colorscale"
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
            :value="layer.state.object.size"
            label="Object size"
          />

          <ValueSlider
            :max="1"
            :min="0"
            :step="0.01"
            :value="layer.state.object.opacity"
            label="Object opacity"
          />
        </v-card-text>
      </v-card>

      <v-card
        flat
        title="Trail"
        v-if="layer.activity.recorder.model.isSpikeRecorder"
      >
        <v-list>
          <v-list-item>
            <ValueSlider
              :max="layer.graph.state.frames.sampleRate * 50"
              :min="0"
              :step="layer.graph.state.frames.sampleRate"
              label="Trail length"
              v-model="layer.state.trail.length"
            />
          </v-list-item>

          <v-list-item>
            <v-checkbox
              hide-details
              label="Trail fading"
              v-model="layer.state.trail.fading"
            />
          </v-list-item>

          <v-list-item>
            <v-select
              :items="['off', 'growing', 'shrinking']"
              class="mt-2"
              density="compact"
              hide-details
              label="Trail mode"
              v-model="layer.state.trail.mode"
            />
          </v-list-item>
        </v-list>
      </v-card>

      <v-card
        flat
        subtitle="Box style"
        v-if="layer.modelSelected?.value.includes('box')"
      >
        <v-card-text class="py-0">
          <v-checkbox
            hide-details
            density="compact"
            label="Flatten height"
            v-model="layer.state.object.flatHeight"
          />

          <v-checkbox
            hide-details
            density="compact"
            label="Flying planes"
            v-model="layer.state.object.flyingBoxes"
          />
        </v-card-text>
      </v-card>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts" setup>
import NodeAvatar from "@/components/node/avatar/NodeAvatar.vue";
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
