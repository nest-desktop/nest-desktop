<template>
  <v-container class="sandbox">
    <v-navigation-drawer permanent>
      <v-list nav density="compact">
        <v-list-item
          :key="component"
          :title="component"
          :to="`${component}`"
          :value="component"
          v-for="(_, component) in components"
        />
      </v-list>
    </v-navigation-drawer>

    <component :is="components[currentComponent]" class="component" />
  </v-container>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

import SandboxAlert from "@/components/sandbox/SandboxAlert.vue";
import SandboxButton from "@/components/sandbox/SandboxButton.vue";
import SandboxButtonToggle from "@/components/sandbox/SandboxButtonToggle.vue";
import SandboxCard from "@/components/sandbox/SandboxCard.vue";
import SandboxColorPicker from "@/components/sandbox/SandboxColorPicker.vue";
import SandboxDataTable from "@/components/sandbox/SandboxDataTable.vue";
import SandboxImportJSON from "@/components/sandbox/SandboxImportJSON.vue";
import SandboxItemGroup from "@/components/sandbox/SandboxItemGroup.vue";
import SandboxSlider from "@/components/sandbox/SandboxSlider.vue";
import SandboxTabs from "@/components/sandbox/SandboxTabs.vue";
import SandboxToast from "@/components/sandbox/SandboxToast.vue";

const props = defineProps({
  component: { type: String, default: "alert" },
});

const currentComponent = ref("");

const components: any = {
  alert: SandboxAlert,
  button: SandboxButton,
  buttonToggle: SandboxButtonToggle,
  card: SandboxCard,
  colorPicker: SandboxColorPicker,
  dataTable: SandboxDataTable,
  importJSON: SandboxImportJSON,
  itemGroup: SandboxItemGroup,
  slider: SandboxSlider,
  tabs: SandboxTabs,
  toast: SandboxToast,
};

watch(
  () => props.component,
  () => (currentComponent.value = props.component)
);
</script>

<style lang="scss">
.sandbox .v-card {
  margin: 4px;
}
</style>
