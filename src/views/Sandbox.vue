<template>
  <v-container class="sandbox">
    <v-navigation-drawer permanent>
      <v-list nav density="compact">
        <v-list-item
          v-for="(_, componentItem) in components"
          :key="componentItem"
          :title="componentItem"
          :to="`${componentItem}`"
          :value="componentItem"
        />
      </v-list>
    </v-navigation-drawer>

    <component :is="components[currentComponent]" class="component" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import {
  SandboxAlert,
  SandboxButton,
  SandboxButtonToggle,
  SandboxCard,
  SandboxColorPicker,
  // SandboxConfig,
  SandboxDataTable,
  SandboxImportJSON,
  SandboxItemGroup,
  SandboxTabs,
} from "@/components/sandbox";

const props = defineProps({ component: { type: String, default: "alert" } });

const currentComponent = ref("");

const components: Record<string, object> = {
  alert: SandboxAlert,
  button: SandboxButton,
  buttonToggle: SandboxButtonToggle,
  card: SandboxCard,
  colorPicker: SandboxColorPicker,
  dataTable: SandboxDataTable,
  importJSON: SandboxImportJSON,
  itemGroup: SandboxItemGroup,
  tabs: SandboxTabs,
};

watch(
  () => props.component,
  () => (currentComponent.value = props.component),
);
</script>

<style lang="scss">
.sandbox .v-card {
  margin: 4px;
}
</style>
