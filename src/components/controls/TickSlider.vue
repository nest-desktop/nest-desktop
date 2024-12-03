<template>
  <v-slider
    v-model="tickIdx"
    :max
    :min="0"
    :ticks
    append-icon="mdi:mdi-plus"
    class="mx-1 py-3 tick-slider"
    color="grey"
    hide-details
    prepend-icon="mdi:mdi-minus"
    show-ticks="always"
    step="1"
    style="position: relative"
    thumb-size="16"
    track-size="2"
    @click:append="increment"
    @click:prepend="decrement"
  >
    <template #append>
      <div class="unit">
        {{ props.unit }}
      </div>
    </template>

    <template #tick-label="{ index }">
      <div class="label">
        {{ state.ticks[index] }}
      </div>
    </template>
  </v-slider>
</template>

<script lang="ts" setup>
import { computed, reactive, onMounted, watch } from "vue";

interface IProps {
  modelValue: number | string;
  tickLabels?: (number | string)[];
  unit?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: 0,
  tickLabels: () => [""],
  unit: "",
});
const emit = defineEmits(["update:modelValue"]);

const state = reactive<{
  tickIdx: number;
  ticks: Record<string, number | string>;
}>({
  tickIdx: 0,
  ticks: {},
});

const tickIdx = computed({
  get: () => state.tickIdx,
  set: (value: number) => {
    state.tickIdx = value;
    emit("update:modelValue", state.ticks[state.tickIdx]);
  },
});

const ticks = computed(() =>
  Object.keys(state.ticks).map((tick: string) => JSON.parse(tick))
);

const max = computed(() => ticks.value.length - 1);

const decrement = () => {
  if (state.tickIdx <= 0) return;
  tickIdx.value -= 1;
};

const increment = () => {
  if (state.tickIdx >= ticks.value.length - 1) return;
  tickIdx.value += 1;
};

const init = () => {
  state.ticks = {};
  props.tickLabels.forEach((value: number | string, index: number) => {
    state.ticks[index] = value;
  });
  update();
};

const update = () => {
  state.tickIdx = 0;
  props.tickLabels.forEach((value: number | string, index: number) => {
    if (props.modelValue === value) {
      state.tickIdx = index;
    }
  });
};

watch(() => [props.modelValue], update);
onMounted(init);
</script>

<style lang="scss">
.tick-slider {
  .mdi-minus,
  .mdi-plus {
    opacity: 0 !important;
  }

  .unit {
    position: absolute;
    pointer-events: none;
    opacity: 0.6;
  }

  .v-input__append,
  .v-input__prepend,
  .v-slider-track__ticks {
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  }

  .v-slider-track__ticks {
    font-size: 13px;
  }

  .v-input__details {
    padding-top: 16px;
  }

  .v-slider__label {
    font-size: 15px;
    left: 0;
    pointer-events: none;
    position: absolute;
    top: -6px;
  }

  &:hover {
    .mdi-minus,
    .mdi-plus {
      opacity: 0.6 !important;
    }

    .unit {
      opacity: 0;
    }
  }
}
</style>
