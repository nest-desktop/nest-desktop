<template>
  <v-select
    v-model="node.modelId"
    :item-props="true"
    :items="state.items"
    :label="state.elementType + ' model'"
    class="model-select text-primary mx-1"
    density="compact"
    hide-details
    item-title="label"
    item-value="id"
    @click.stop
  >
    <template #item="{ props: itemProps }">
      <v-list-item class="node-model-item" @click="select(itemProps)">
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

    <template v-if="state.elementType" #prepend-item>
      <v-list-item
        @click="
          () => {
            state.elementType = '';
            state.items = elementTypes;
          }
        "
      >
        Other element types

        <template #prepend>
          <v-icon icon="mdi:mdi-menu-left" />
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive } from "vue";

import { BaseNetworkGraph } from "@/helpers/networkGraph/networkGraph";
import { TModel, TNode } from "@/types";

import { useNetworkGraphStore } from "@/stores/graph/networkGraphStore";
const networkGraphStore = useNetworkGraphStore();
const graph = computed(() => networkGraphStore.state.graph as BaseNetworkGraph);

const props = defineProps<{
  elementTypes?: { title: string; value: string }[];
  node: TNode;
}>();
const node = computed(() => props.node);
const elementTypes = computed(
  () =>
    props.elementTypes || [
      { title: "neuron", value: "neuron" },
      { title: "recorder", value: "recorder" },
      { title: "stimulator", value: "stimulator" },
    ],
);

const emit = defineEmits(["openMenu"]);

const state = reactive<{
  elementType: string;
  items: (TModel | unknown)[];
}>({
  elementType: "",
  items: [],
});

const openMenu = () => emit("openMenu", true);

const select = (selectProps: Record<string, unknown>, open?: boolean) => {
  node.value.view.expandNodePanel();

  const elementTypesValues = elementTypes.value.map((elementType) => elementType.value);

  if (elementTypesValues.includes(selectProps.value as string)) {
    state.elementType = selectProps.value as string;
    state.items = node.value.network.getNodeModelsByElementType(state.elementType);
  } else {
    node.value.modelId = selectProps.value as string;
  }

  nextTick(() => graph.value?.render());
  if (open) openMenu();
};

onMounted(() => {
  state.items = node.value.models;
  state.elementType = node.value.elementType;
});
</script>

<style lang="scss">
.node-model-item {
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
