<template>
  <v-expansion-panel density="compact" flat>
    <v-expansion-panel-title>
      <v-row class="text-button">
        <NodeAvatar :node="layer.activity.recorder" />
        <v-spacer />
        {{ layer.activity.recorder.model.state.label }}
        <v-spacer />
      </v-row>

      <!-- <template #actions>
        <v-icon
          @click.stop="() => (layer.state.visible = !layer.state.visible)"
          :icon="layer.state.visible ? 'mdi-eye' : 'mdi-eye-off'"
        />
      </template> -->
    </v-expansion-panel-title>

    <v-expansion-panel-text class="px-1 py-0">
      <v-card flat>
        <v-select
          v-model="layer.modelSelected"
          :items="layer.models"
          class="my-2"
          density="compact"
          hide-details
          label="select geometry model"
          prepend-inner-icon="mdi-shape"
          return-object
          @update:model-value="update"
        />
      </v-card>

      <v-card v-if="layer.activity.recorder.model.isAnalogRecorder" flat rounded="0">
        <span v-if="layer.state.records.length > 0">
          <v-select
            v-model="layer.state.record"
            :items="layer.state.records"
            attach
            chips
            class="pa-1 pt-3"
            density="compact"
            hide-details
            item-value="groupId"
            label="recorded events"
            persistent-hint
            return-object
            @update:model-value="update"
          >
            <template #selection="{ item }">
              <v-chip :color="item.raw.state.color" class="mx-2" disable-lookup label size="small">
                {{ item.raw.id }}
              </v-chip>
              <div style="font-size: 12px">
                {{ item.raw.label }}
                <span v-if="item.raw.unit"> ({{ item.raw.unit }})</span>
              </div>
            </template>

            <template #item="{ item }">
              <v-list-item>
                <template #prepend>
                  <v-chip :color="item.raw.state.color" class="mx-2" label size="small">
                    {{ item.raw.id }}
                  </v-chip>
                </template>
                {{ item.raw.label }}
                <span v-if="item.raw.unit"> ({{ item.raw.unit }})</span>
              </v-list-item>
            </template>
          </v-select>
        </span>

        <v-card v-if="layer.state.record" flat>
          <v-btn-group class="pt-2 px-1" style="width: 100%">
            <v-text-field
              v-model="layer.state.record.state.colorMap.min"
              :label="`min [${layer.state.record.unit}]`"
              :step="0.1"
              density="compact"
              hide-details
              rounded="e-0"
              style="flex-grow: 0"
              type="number"
              width="100"
              @update:model-value="update"
            />

            <v-select
              v-model="layer.state.record.state.colorMap.scale"
              :items="colorScales"
              density="compact"
              label="color map"
              hide-details
              rounded="0"
              @update:model-value="update"
            >
              <template #item="{ item, props: itemProps }">
                <v-list-item v-bind="itemProps">
                  <template #append>
                    <img
                      :class="{ 'flip-h': layer.state.record.state.colorMap.reverse }"
                      :src="imageUrl(item.value)"
                      alt="img"
                      height="12"
                      width="72"
                    />
                  </template>
                </v-list-item>
              </template>

              <template #append-inner>
                <img
                  :class="{ 'flip-h': layer.state.record.state.colorMap.reverse }"
                  :src="imageUrl(layer.state.record.state.colorMap.scale)"
                  alt="img"
                  height="12"
                  width="72"
                />
              </template>
            </v-select>

            <v-text-field
              v-model="layer.state.record.state.colorMap.max"
              :label="`max [${layer.state.record.unit}]`"
              :step="0.1"
              density="compact"
              hide-details
              rounded="s-0"
              style="flex-grow: 0"
              type="number"
              width="100"
              @update:model-value="update"
            />
          </v-btn-group>

          <v-checkbox
            v-model="layer.state.record.state.colorMap.reverse"
            color="accent"
            density="compact"
            label="reverse colormap"
            @update:model-value="update"
          />
        </v-card>
      </v-card>

      <!-- <v-card flat rounded="0">
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
      </v-card> -->

      <v-card v-if="layer.activity.recorder.model.isSpikeRecorder" flat title="Trail">
        <v-list>
          <v-list-item>
            <ValueSlider
              v-model="layer.state.trail.length"
              :max="layer.graph.state.frames.sampleRate * 50"
              :min="0"
              :step="layer.graph.state.frames.sampleRate"
              label="trail length"
            />
          </v-list-item>

          <v-list-item>
            <v-checkbox v-model="layer.state.trail.fading" hide-details label="trail fading" />
          </v-list-item>

          <v-list-item>
            <v-select
              v-model="layer.state.trail.mode"
              :items="['off', 'growing', 'shrinking']"
              class="mt-2"
              density="compact"
              hide-details
              label="trail mode"
            />
          </v-list-item>
        </v-list>
      </v-card>

      <v-card v-if="layer.modelSelected?.value.includes('box')" flat subtitle="box style">
        <v-card-text class="py-0">
          <v-checkbox v-model="layer.state.object.flatHeight" hide-details density="compact" label="flatten height" />

          <v-checkbox v-model="layer.state.object.flyingBoxes" hide-details density="compact" label="flying planes" />
        </v-card-text>
      </v-card>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts" setup>
import { computed, nextTick } from "vue";

import NodeAvatar from "@/components/node/avatar/NodeAvatar.vue";
import ValueSlider from "@/components/controls/ValueSlider.vue";

import { ActivityAnimationLayer } from "../../helpers/activityGraph/activityAnimationGraph/activityAnimationLayer";

const props = defineProps<{ layer: ActivityAnimationLayer }>();
const layer = computed(() => props.layer);

const colorScales: string[] = [
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

// https://stackoverflow.com/questions/66419471/vue-3-vite-dynamic-image-src
const imageUrl = (name: string) => new URL(`/src/assets/img/colorscales/${name}.png`, import.meta.url).href;

const update = () => {
  nextTick(() => layer.value.renderFrame());
};
</script>

<style lang="scss">
.flip-h {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}
</style>
