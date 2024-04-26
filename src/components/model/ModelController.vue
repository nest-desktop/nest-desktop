<template>
  <v-navigation-drawer location="right" permanent rail rail-width="64">
    <v-tabs
      :model-value="modelStore.controller.view"
      :mandatory="false"
      color="primary"
      direction="vertical"
      stacked
      width="64"
    >
      <v-tab
        v-for="(item, index) in items"
        :key="index"
        :ripple="false"
        :value="modelStore.controller.open ? item.id : null"
        class="justify-center"
        height="72"
        min-width="0"
        @click.stop="modelStore.toggle(item)"
      >
        <v-icon :icon="item.icon" class="ma-1" size="large" />
        <span style="font-size: 9px">{{ item.id }}</span>
      </v-tab>
    </v-tabs>
  </v-navigation-drawer>

  <v-navigation-drawer
    :model-value="modelStore.controller.open"
    location="right"
    permanent
  >
    <template v-if="modelStore.state.controller.view === 'defaults'">
      defaults
    </template>

    <template v-if="modelStore.state.controller.view === 'model'">
      model
    </template>

    <template v-if="modelStore.state.controller.view === 'code'">
      code
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { Store } from "pinia";

// import { useAppStore } from "@/stores/appStore";
// const appStore = useAppStore();

defineProps<{ modelStore: Store<any, any> }>();

const items = [
  {
    id: "defaults",
    icon: "mdi:mdi-format-list-numbered-rtl",
    title: "View defaults",
  },
  { id: "model", icon: "mdi:mdi-tune-variant", title: "Edit model" },
  { id: "code", icon: "mdi:mdi-xml" },
];
</script>
