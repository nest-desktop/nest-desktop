<template>
  <v-container>
    <v-card>
      <v-card-title> Editor </v-card-title>
      <v-card-subtitle>{{ props.modelId }} </v-card-subtitle>

      <v-card-text>
        <codemirror
          ref="codeMirror"
          style="font-size: 0.75rem; width: 100%"
          v-model="model.codeTemplate"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn @click="norseModelStore.save"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Codemirror } from "vue-codemirror";

import { useNorseModelStore } from "@norse/store/model/norseModelStore";
const norseModelStore = useNorseModelStore();

const props = defineProps({
  modelId: String,
});


const model = computed(() => norseModelStore.model)
</script>
