<template>
  <v-expansion-panel elevation="0" rounded="0">
    <v-expansion-panel-title class="expansion-panel-title">
      <v-row no-gutters>
        <ConnectionAvatar :connection />

        <v-spacer />

        <div class="d-flex justify-center align-center text-grey">
          {{ connection.rule.value }}
        </div>
        <v-spacer />
      </v-row>
    </v-expansion-panel-title>
    <v-expansion-panel-text class="pa-0">
      <v-card class="ma-0" variant="flat">
        <v-card-text>
          <v-list>
            <v-list-item
              :key="index"
              v-for="(param, index) in connection.params"
            >
              {{ param.id }}
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts" setup>
import ConnectionAvatar from "./ConnectionAvatar.vue";
import { TConnection } from "@/types";

defineProps<{ connection: TConnection }>();
</script>
