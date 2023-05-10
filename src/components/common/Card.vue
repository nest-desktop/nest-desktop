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

<style lang="scss">
.card {
  border-color: rgb(var(--v-theme-secondary));
  border-left-width: 4px !important;
}
</style>
