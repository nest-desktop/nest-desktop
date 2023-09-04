<template>
  <codemirror
    :extensions="extensions"
    ref="codeMirror"
    style="font-size: 0.75rem; width: 100%"
    v-model="projectStore.project.simulation.code.script"
  />
</template>

<script lang="ts" setup>
import { tooltips } from "@codemirror/view";
import { autocompletion } from "@codemirror/autocomplete";
import { python } from "@codemirror/lang-python";
// import { oneDark } from "@codemirror/theme-one-dark";

import { nestCompletions } from "@nest/codemirror/nestCompletion";
import { nestRandomCompletions } from "@nest/codemirror/nestRandomCompletion";
import { nestSpatialCompletions } from "@nest/codemirror/nestSpatialCompletion";
import { nestSpatialDistributionsCompletions } from "@nest/codemirror/nestSpatialDistributionsCompletion";

import { useNESTProjectStore } from "@nest/store/project/nestProjectStore";
const projectStore = useNESTProjectStore();

const extensions = [
  tooltips({
    position: "absolute",
  }),
  python(),
  autocompletion({
    override: [
      nestCompletions,
      nestRandomCompletions,
      nestSpatialCompletions,
      nestSpatialDistributionsCompletions,
    ],
  }),
  // oneDark,
];
</script>

<style lang="scss">
.px-1px {
  padding-left: 1px;
  padding-right: 1px;
}
</style>
