<template>
  <v-expansion-panel
    elevation="0"
    rounded="0"
  >
    <v-expansion-panel-title class="expansion-panel-title">
      <v-row>
        <ConnectionAvatar :connection />
        <v-spacer />
        <div class="d-flex justify-center align-center text-grey">
          {{ connection.rule.value }}
        </div>
        <v-spacer />
      </v-row>
    </v-expansion-panel-title>
    <v-expansion-panel-text class="pa-0">
      <v-card
        class="ma-0"
        variant="flat"
      >
        <v-card-text>
          <v-list>
            <ParamViewer
              v-for="(paramId, index) in connection.paramsVisible"
              :key="index"
              :param="connection.params[paramId]"
            />
            <ParamViewer
              v-for="(paramId, index) in connection.synapse.paramsVisible"
              :key="index"
              :param="connection.synapse.params[paramId]"
            />
          </v-list>
        </v-card-text>
      </v-card>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts" setup>
import ConnectionAvatar from "./ConnectionAvatar.vue";
import ParamViewer from "../parameter/ParamViewer.vue";
import { TConnection } from "@/types";

defineProps<{ connection: TConnection }>();
</script>
