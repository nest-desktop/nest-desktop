<template>
  <v-spacer />

  <v-btn
    @click.stop="() => nestSimulatorStore.backend.check()"
    size="x-small"
    variant="text"
  >
    {{ appStore.simulator }}
    <v-icon
      :color="nestSimulatorStore.backend.state.ready ? 'green' : 'red'"
      class="mx-1"
      icon="mdi-circle"
    />
  </v-btn>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/store/appStore";
import { useNESTSimulatorStore } from "@nest/store/backends/nestSimulatorStore";

const appStore = useAppStore();
const nestSimulatorStore = useNESTSimulatorStore();
nestSimulatorStore.backend.check()

</script>
