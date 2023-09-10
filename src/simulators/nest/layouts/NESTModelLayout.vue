<template>
  <model-nav :store="modelDBStore" />

  <model-bar :model="model" color="orange">
    <template #prependTabs>
      <v-tab
        :to="{ name: 'nestModelDoc', params: { modelId: model.id } }"
        size="small"
        title="Read documentation"
      >
        <v-icon icon="mdi-text-box-outline" />
        <span class="text-no-wrap"> Doc </span>
      </v-tab>
    </template>
  </model-bar>

  <model-controller :store="modelStore" />

  <router-view name="model" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ModelBar from "@/components/model/ModelBar.vue";
import ModelController from "@/components/model/ModelController.vue";
import ModelNav from "@/components/model/ModelNav.vue";

import { NESTModel } from "../helpers/model/nestModel";

import { useNESTModelStore } from "../store/model/nestModelStore";
const modelStore = useNESTModelStore();

import { useNESTModelDBStore } from "../store/model/nestModelDBStore";
const modelDBStore = useNESTModelDBStore();

const model = computed(() => modelStore.model as NESTModel);
</script>
