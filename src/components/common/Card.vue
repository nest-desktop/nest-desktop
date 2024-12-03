<template>
  <v-card
    class="card my-1"
    variant="outlined"
  >
    <slot />
  </v-card>
</template>

<style lang="scss">
.card {
  border-left-width: 4px !important;

  .v-card-text {
    padding: 0;
  }
}
</style>
