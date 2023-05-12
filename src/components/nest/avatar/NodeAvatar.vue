<template>
  <stimulus-avatar
    :color="props.color"
    :label="props.label"
    :size="props.size"
    v-if="props.type === 'stimulus'"
  />
  <recorder-avatar
    :color="props.color"
    :label="props.label"
    :size="props.size"
    v-else-if="props.type === 'recorder'"
  />
  <neuron-avatar
    :color="props.color"
    :label="props.label"
    :size="props.size"
    v-else
  />
</template>

<script lang="ts" setup>
import NeuronAvatar from "@/components/nest/avatar/NeuronAvatar.vue";
import RecorderAvatar from "@/components/nest/avatar/RecorderAvatar.vue";
import StimulusAvatar from "@/components/nest/avatar/StimulusAvatar.vue";

const props = defineProps({
  color: { type: String, default: "primary" },
  label: { type: String, default: "" },
  type: { type: String, default: "" },
  size: { type: String, default: "40px" },
});
</script>
