<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useTheme } from "vuetify";
import { useAppStore } from "./store/appStore";

onMounted(() => {
  const theme = useTheme();
  const appStore = useAppStore();
  theme.global.name.value = appStore.darkMode ? "dark" : "light";
});
</script>

<style lang="scss">
@media print {
  // html,
  // body {
  //   // width: 210mm;
  //   // height: 297mm;
  // }

  @page {
    size: landscape;
    margin: 0;
  }
  /* ... the rest of the rules ... */
}
</style>
