<template>
  <Card v-if="model" class="node my-1" rounded="1">
    <v-card-title>
      <v-row class="ma-0 text-button">
        <v-avatar>
          <v-icon
            :icon="
              model.elementType == 'synapse' ? 'mdi:mdi-checkbox-multiple-blank-circle-outline' : 'mdi:mdi-content-copy'
            "
          />
        </v-avatar>
        <v-spacer />
        <div class="my-auto" title="New model">
          {{ model.newModelId }}
        </div>
      </v-row>
    </v-card-title>

    <v-card-text class="pa-0">
      <v-list>
        <v-list-item class="paramViewer">
          <v-row no-gutters>
            <v-label>existing model</v-label>
            <v-spacer />
            {{ model.existingModelId }}
          </v-row>
        </v-list-item>
        <template v-if="model.params.hasSomeVisibleParams">
          <ParamViewer
            v-for="(paramId, index) in model.params.visibleParamIds"
            :key="index"
            :param="model.params.get(paramId)"
          />
        </template>
      </v-list>
    </v-card-text>
  </Card>
</template>

<script setup lang="ts">
import { Card } from "@/components";
import { ParamViewer } from "@/parameter/components";

import type { NESTCopyModel } from "../../../types";

defineProps<{ model: NESTCopyModel }>();
</script>
