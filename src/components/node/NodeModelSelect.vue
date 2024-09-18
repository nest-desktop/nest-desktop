<template>
  <v-select
    :item-props="true"
    :items="state.items"
    :label="state.elementType + ' model'"
    @click.stop
    class="model-select text-primary mx-1"
    density="compact"
    hide-details
    item-title="label"
    item-value="id"
    v-model="node.modelId"
  >
    <template #item="{ props }">
      <v-list-item @click="select(props)" class="node-model-item">
        {{ props.title }}

        <template #append>
          <v-btn
            @click.stop="select(props, true)"
            class="icon"
            icon="mdi:mdi-menu-right"
            size="x-small"
            v-if="state.elementType"
            variant="text"
          />
        </template>
      </v-list-item>
    </template>

    <template #prepend-item v-if="state.elementType">
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

<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";

import { TModel, TNode } from "@/types";

const props = defineProps<{ node: TNode }>();
const node = computed(() => props.node);

const emit = defineEmits(["openMenu"]);

const state = reactive<{
  elementType: string;
  items: (TModel | any)[];
}>({
  elementType: "",
  items: [],
});

const elementTypes = [
  { title: "neuron", value: "neuron" },
  { title: "recorder", value: "recorder" },
  { title: "stimulator", value: "stimulator" },
];

const openMenu = () => emit("openMenu", true);

const select = (props: Record<string, unknown>, open?: boolean) => {
  node.value.view.expandNodePanel();

  if (["neuron", "recorder", "stimulator"].includes(props.value as string)) {
    state.elementType = props.value as string;
    state.items =
      node.value.network.project.modelDBStore.getModelsByElementType(
        state.elementType
      );
  } else {
    node.value.modelId = props.value as string;
  }

  if (open) {
    openMenu();
  }
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
