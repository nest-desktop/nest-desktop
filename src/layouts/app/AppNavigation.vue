<template>
  <v-tabs
    :model-value="navStore.view"
    :mandatory="false"
    color="primary"
    direction="vertical"
    stacked
    width="64"
  >
    <v-tab
      :ripple="false"
      :title="item.title"
      :to="item.path"
      @click.stop="navStore.toggle(item)"
      class="justify-center"
      height="72"
      minWidth="0"
      :key="index"
      v-for="(item, index) in navItems"
      v-show="item.simulator === appStore.simulator"
    >
      <v-icon :icon="item.icon" class="ma-1" size="large" />
      <span style="font-size: 9px"> {{ item.title }}</span>
    </v-tab>
  </v-tabs>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/store/appStore";
import { useNavStore } from "@/store/navStore";

const appStore = useAppStore();
const navStore = useNavStore();

const navItems = [
  {
    icon: "nest:network",
    id: "nestProject",
    path: "/nest/project",
    simulator: "nest",
    title: "NEST Project",
  },
  {
    icon: "nest:logo",
    id: "nestModel",
    path: "/nest/model",
    simulator: "nest",
    title: "Model",
  },
  {
    icon: "nest:network",
    id: "norseProject",
    path: "/norse/project",
    simulator: "norse",
    title: "Norse Project",
  },
];
</script>
