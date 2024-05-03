<template>
  <v-navigation-drawer location="right" permanent rail>
    <v-tabs
      :model-value="modelStore.state.controller.view"
      :mandatory="false"
      color="primary"
      direction="vertical"
      stacked
    >
      <v-tab
        v-for="(item, index) in items"
        :key="index"
        :ripple="false"
        :value="modelStore.state.controller.open ? item.id : null"
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
    :model-value="modelStore.state.controller.open"
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
