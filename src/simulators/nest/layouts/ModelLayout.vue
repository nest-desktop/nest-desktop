<template>
  <ModelNav :modelDBStore />

  <ModelBar :model="modelStore.model" color="nest-model">
    <template #prependTabs>
      <v-tab
        :to="{
          name: 'nestModelDoc',
          params: { modelId: modelStore.model.id },
        }"
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
import ModelBar from "@/components/model/ModelBar.vue";
import ModelController from "@/components/model/ModelController.vue";
import ModelNav from "@/components/model/ModelNav.vue";
import { TModelDBStore } from "@/stores/model/defineModelDBStore";
import { TModelStore } from "@/stores/model/defineModelStore";

import { useNESTModelStore } from "../stores/model/modelStore";
const modelStore: TModelStore = useNESTModelStore();

import { useNESTModelDBStore } from "../stores/model/modelDBStore";
const modelDBStore: TModelDBStore = useNESTModelDBStore();
</script>
