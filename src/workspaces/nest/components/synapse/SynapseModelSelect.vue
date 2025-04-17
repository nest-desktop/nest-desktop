<template>
  <v-select
    v-model="synapse.modelId"
    :item-props="true"
    :items="state.items"
    class="model-select text-primary mx-1"
    density="compact"
    hide-details
    item-title="label"
    item-value="id"
    label="synapse model"
    @click.stop
  >
    <template #item="{ props: itemProps }">
      <v-list-item class="synapse-model-item" @click="select(itemProps)">
        {{ itemProps.title }}

        <template #append>
          <v-btn
            v-if="state.elementType"
            class="icon"
            icon="mdi:mdi-menu-right"
            size="x-small"
            variant="text"
            @click="select(itemProps, true)"
          />
        </template>
      </v-list-item>
    </template>

    <template v-if="state.copied" #append-item>
      <v-divider />
      <v-list density="compact">
        <v-list-item
          v-for="itemProps in state.copied"
          :key="itemProps.id"
          class="synapse-model-item"
          @click="select(itemProps)"
        >
          {{ itemProps.id }}

          <template #append>
            <v-btn
              v-if="state.elementType"
              class="icon"
              icon="mdi:mdi-menu-right"
              size="x-small"
              variant="text"
              @click="select(itemProps, true)"
            />
          </template>
        </v-list-item>
      </v-list>
    </template>
  </v-select>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive } from "vue";

import { BaseNetworkGraph } from "@/helpers/networkGraph/networkGraph";
import { TModel, TSynapse } from "@/types";

import { useNetworkGraphStore } from "@/stores/graph/networkGraphStore";
const networkGraphStore = useNetworkGraphStore();
const graph = computed(() => networkGraphStore.state.graph as BaseNetworkGraph);

const props = defineProps<{ synapse: TSynapse }>();
const synapse = computed(() => props.synapse);

const emit = defineEmits(["openMenu"]);

const state = reactive<{
  items: (TModel | unknown)[];
  copiedModels: (TModel | unknown)[];
}>({
  items: [],
  copiedModels: [],
});

const openMenu = () => emit("openMenu", true);

const select = (selectProps: Record<string, unknown>, open?: boolean) => {
  // synapse.value.view.expandNodePanel();

  synapse.value.modelId = (selectProps.value || selectProps.id) as string;

  nextTick(() => graph.value?.render());
  if (open) openMenu();
};

onMounted(() => {
  state.items = synapse.value.models;
  state.copied = synapse.value.copyModels;
});
</script>

<style lang="scss">
.synapse-model-item {
  .icon {
    display: none;
  }

  &:hover {
    .icon {
      display: block;
    }
  }
}
</style>
