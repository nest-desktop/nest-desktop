<template>
  <v-container>
    <v-card :title="model.label" subtitle="model editor">
      <v-card-text>
        <h3>Code template</h3>
        <codemirror
          ref="codeMirror"
          style="font-size: 0.75rem; width: 100%"
          v-model="model.codeTemplate"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn @click="modelStore.save"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Codemirror } from "vue-codemirror";

import { PyNNModel } from "../helpers/model/model";

import { usePyNNModelStore } from "../store/model/modelStore";
const modelStore = usePyNNModelStore();

const model = computed(() => modelStore.model as PyNNModel);
</script>
