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
      :key="index"
      :ripple="false"
      :title="item.title"
      :to="item.path"
      @click.stop="navStore.toggle(item)"
      class="justify-center"
      height="72"
      minWidth="0"
      v-for="(item, index) in navItems"
    >
      <v-icon :icon="item.icon" class="ma-1" size="large" />
      <span style="font-size: 9px"> {{ item.title }}</span>
    </v-tab>
  </v-tabs>
</template>

<script lang="ts" setup>
import { useNavStore } from "@/store/navStore";
const navStore = useNavStore();

const navItems = [
  {
    id: "project",
    icon: "nest:network",
    title: "Project",
    path: "/nest/project",
  },
  {
    id: "model",
    icon: "nest:logo",
    title: "Model",
    path: "/nest/model",
  },
];

</script>
