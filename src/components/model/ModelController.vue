<template>
  <v-navigation-drawer location="right" permanent rail rail-width="64">
    <v-tabs
      :model-value="modelStore.controllerView"
      :mandatory="false"
      color="primary"
      direction="vertical"
      stacked
      width="64"
    >
      <v-tab
        :key="index"
        :ripple="false"
        :value="modelStore.controllerOpen ? item.id : null"
        @click.stop="modelStore.toggle(item)"
        class="justify-center"
        height="72"
        min-width="0"
        v-for="(item, index) in items"
      >
        <v-icon :icon="item.icon" class="ma-1" size="large" />
        <span style="font-size: 9px">{{ item.id }}</span>
      </v-tab>
    </v-tabs>
  </v-navigation-drawer>

  <v-navigation-drawer
    :model-value="modelStore.controllerOpen"
    location="right"
    permanent
  >
    <template v-if="modelStore.state.controllerView === 'defaults'">
      defaults
    </template>

    <template v-if="modelStore.state.controllerView === 'model'">
      model
    </template>

    <template v-if="modelStore.state.controllerView === 'code'">
      code
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed } from "vue";

// import { useAppStore } from "@/stores/appStore";
// const appStore = useAppStore();

const props = defineProps({
  store: { required: true, type: Object },
});

const modelStore = computed(() => props.store);

const items = [
  {
    id: "defaults",
    icon: "mdi-format-list-numbered-rtl",
    title: "View defaults",
  },
  { id: "model", icon: "mdi-tune-variant", title: "Edit model" },
  { id: "code", icon: "mdi-xml" },
];
</script>
