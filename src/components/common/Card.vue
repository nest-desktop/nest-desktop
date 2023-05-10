<template>
  <v-card
    :style="{ borderLeftColor: state.color }"
    class="card"
    color="primary"
    rounded="0"
    variant="outlined"
  >
    <slot />
  </v-card>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { reactive } from "vue";

const props = defineProps(["color"]);

const state = reactive({
  color: "blue",
});

onMounted(() => {
  state.color = props.color;
});
</script>

<style>
.card {
  border-color: #ccc;
  border-left-width: 4px !important;
}
</style>
