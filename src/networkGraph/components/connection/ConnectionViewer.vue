<template>
  <v-expansion-panel elevation="0" rounded="0">
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
      <v-card class="ma-0" variant="flat">
        <v-card-text>
          <v-list>
            <ParamViewer
              v-for="(paramId, index) in connection.paramsVisible"
              :key="index"
              :param="connection.params[paramId] as ConnectionParameter"
            />
            <ParamViewer
              v-for="(paramId, index) in connection.synapse.paramsVisible"
              :key="index"
              :param="connection.synapse.params[paramId] as BaseSynapseParameter"
            />
          </v-list>
        </v-card-text>
      </v-card>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import ParamViewer from "@/components/parameter/ParamViewer.vue";
import type { TConnection } from "@/types";

import ConnectionAvatar from "./ConnectionAvatar.vue";
import type { BaseSynapseParameter } from "@/networkGraph/helpers/synapse/synapseParameter";
import type { ConnectionParameter } from "@/networkGraph/helpers/connection/connectionParameter";

defineProps<{ connection: TConnection }>();
</script>
