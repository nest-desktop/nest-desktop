<template>
  <v-card
    class="card"
    color="primary"
    variant="outlined"
    rounded="0"
    :style="{ borderLeftColor: state.color }"
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
  border-left-width: 4px !important;
}
</style>
