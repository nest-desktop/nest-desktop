<template>
  <stimulator-avatar
    :color="props.color"
    :label="props.label"
    :size="props.size"
    v-if="props.elementType === 'stimulator'"
  />
  <recorder-avatar
    :color="props.color"
    :label="props.label"
    :size="props.size"
    v-else-if="props.elementType === 'recorder'"
  />
  <neuron-avatar
    :color="props.color"
    :label="props.label"
    :size="props.size"
    :weight="props.weight"
    v-else
  />
</template>

<script lang="ts" setup>
import NeuronAvatar from "./NeuronAvatar.vue";
import RecorderAvatar from "./RecorderAvatar.vue";
import StimulatorAvatar from "./StimulatorAvatar.vue";

const props = defineProps({
  color: { type: String, default: "primary" },
  label: { type: String, default: "" },
  elementType: { type: String, default: "neuron" },
  size: { type: String, default: "40px" },
  weight: {type: String, default: "default"},
});
</script>
