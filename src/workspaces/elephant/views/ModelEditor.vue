<template>
  <v-card :title="currentModel.state.label" subtitle="model editor">
    <v-card-text>
      <h3>Code template</h3>
      <codemirror ref="codeMirror" v-model="currentModel.codeTemplate" style="font-size: 0.75rem; width: 100%" />
    </v-card-text>

    <v-card-actions>
      <v-btn text="save" @click="modelStore.saveModel()" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { Codemirror } from "vue-codemirror";

import { currentModel, useElephantModelStore } from "../stores/model/modelStore";
const modelStore = useElephantModelStore();
</script>
