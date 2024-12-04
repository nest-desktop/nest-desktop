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

<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";

import { TModel, TNode } from "@/types";

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

const select = (props: Record<string, unknown>, open?: boolean) => {
  node.value.view.expandNodePanel();

  const elementTypesValues = elementTypes.value.map((elementType) => elementType.value);

  if (elementTypesValues.includes(props.value as string)) {
    state.elementType = props.value as string;
    state.items = node.value.network.getModelsByElementType(state.elementType);
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
