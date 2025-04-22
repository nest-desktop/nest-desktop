<template>
  <div :id="intf.id" ref="el" class="baklava-node-interface" :class="classes">
    <div
      v-if="intf.port"
      class="__port"
      :class="{ '--selected': temporaryConnection?.from === intf }"
      @pointerover="startHover"
      @pointerout="endHover"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUpdated, Ref, ref } from "vue";
import { AbstractCodeNode, NodeInterface } from "@baklavajs/core";
import { Components, useGraph, useViewModel } from "@baklavajs/renderer-vue";

import { useTemporaryConnection } from "@baklavajs/renderer-vue"; // "../../helpers/codeGraph/temporaryConnection";

const props = defineProps<{
  node: AbstractCodeNode;
  intf: NodeInterface;
}>();

const { viewModel } = useViewModel();
const { hoveredOver, temporaryConnection } = useTemporaryConnection();

const el = ref<HTMLElement | null>(null) as Ref<HTMLElement>;

const isConnected = computed(() => props.intf.connectionCount > 0);
const classes = computed(() => ({
  "--connected": isConnected.value,
}));

const startHover = () => {
  hoveredOver(props.intf);
};
const endHover = () => {
  hoveredOver(undefined);
};

const onRender = () => {
  if (el.value) {
    viewModel.value.hooks.renderInterface.execute({ intf: props.intf, el: el.value });
  }
};

onMounted(onRender);
onUpdated(onRender);
</script>
