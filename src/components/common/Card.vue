<template>
  <v-card
    :color="state.color"
    class="card my-1"
    variant="outlined"
  >
    <slot />
  </v-card>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";

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
  // border-top-color: rgba(var(--v-theme-primary), 0.1)!important;
  // border-bottom-color: rgba(var(--v-theme-primary), 0.1)!important;
  // border-right-color: rgba(var(--v-theme-primary), 0.1)!important;
  border-left-width: 4px !important;

  .v-card-text {
    padding: 0
  }
}
</style>
