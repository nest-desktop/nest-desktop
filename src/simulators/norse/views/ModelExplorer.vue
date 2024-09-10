<template>
  <v-card :subtitle="model.id" title="Explorer">
    <v-card-text> Text </v-card-text>

    <v-card-actions>
      <v-btn text="action" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { NorseModel } from "../helpers/model/model";
import { TModelStore } from "@/stores/model/defineModelStore";

import { useNorseModelStore } from "../stores/model/modelStore";
const modelStore: TModelStore = useNorseModelStore();

const model = computed(() => modelStore.model as NorseModel);
</script>
