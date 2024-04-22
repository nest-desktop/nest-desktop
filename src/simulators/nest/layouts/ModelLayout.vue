<template>
  <ModelNav :modelDBStore />

  <ModelBar :model color="nest-model">
    <template #prependTabs>
      <v-tab
        :to="{ name: 'nestModelDoc', params: { modelId: model.id } }"
        size="small"
        title="Read documentation"
      >
        <v-icon icon="mdi:mdi-text-box-outline" />
        <span class="text-no-wrap">Doc</span>
      </v-tab>
    </template>
  </ModelBar>

  <ModelController :modelStore />

  <router-view name="model" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ModelBar from "@/components/model/ModelBar.vue";
import ModelController from "@/components/model/ModelController.vue";
import ModelNav from "@/components/model/ModelNav.vue";

import { NESTModel } from "../helpers/model/model";

import { useNESTModelStore } from "../stores/model/modelStore";
const modelStore = useNESTModelStore();

import { useNESTModelDBStore } from "../stores/model/modelDBStore";
const modelDBStore = useNESTModelDBStore();

const model = computed(() => modelStore.model as NESTModel);
</script>
