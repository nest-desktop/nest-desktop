<template>
  <v-container class="sandbox">
    <v-navigation-drawer permanent>
      <v-list density="compact">
        <v-list-item
          :key="index"
          :to="'#' + component.title"
          :active="false"
          v-for="(component, index) in components"
          v-scroll-to="'#' + component.title"
        >
          {{ component.title }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <sandbox-alert id="alert" />
    <sandbox-button id="button" />
    <sandbox-button-toggle id="button-toggle" />
    <sandbox-card id="card" />
    <sandbox-color-picker id="color-picker" />
    <sandbox-item-group id="item-group" />
    <sandbox-node id="node" />
    <sandbox-slider id="slider" />
    <sandbox-tabs id="tabs" />
  </v-container>
</template>

<script lang="ts" setup>
import SandboxAlert from "@/components/sandbox/SandboxAlert.vue";
import SandboxButton from "@/components/sandbox/SandboxButton.vue";
import SandboxButtonToggle from "@/components/sandbox/SandboxButtonToggle.vue";
import SandboxCard from "@/components/sandbox/SandboxCard.vue";
import SandboxColorPicker from "@/components/sandbox/SandboxColorPicker.vue";
import SandboxItemGroup from "@/components/sandbox/SandboxItemGroup.vue";
import SandboxNode from "@/components/sandbox/SandboxNode.vue";
import SandboxSlider from "@/components/sandbox/SandboxSlider.vue";
import SandboxTabs from "@/components/sandbox/SandboxTabs.vue";

const components = [
  { title: "alert", component: SandboxAlert },
  { title: "button", component: SandboxButton },
  { title: "button-toggle", component: SandboxButtonToggle },
  { title: "card" },
  { title: "color-picker" },
  { title: "item-group" },
  { title: "node" },
  { title: "slider" },
  { title: "tabs" },
];
</script>

<style lang="scss">
.sandbox .v-card {
  margin: 4px;
}
</style>
