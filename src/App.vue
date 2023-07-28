<template>
  <router-view />
</template>

<script lang="ts" setup>
//
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
