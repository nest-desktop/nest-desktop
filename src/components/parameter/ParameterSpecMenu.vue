<template>
  <v-menu :close-on-content-click="false" :max-width="300">
    <template #activator="{ props }">
      <v-btn color="primary" block flat tile v-bind="props" variant="text">
        <v-row no-gutters>
          {{ param.label }}
          <v-spacer />
          {{ param.type.id }}
        </v-row>
      </v-btn>
    </template>

    <v-card :min-width="300">
      <v-card-text>
        <ParameterSpecEditor :param />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="param.changes()" text="update parameter" />
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts" setup>
import ParameterSpecEditor from "./ParameterSpecEditor.vue";
import { Parameter } from "@/helpers/common/parameter";

defineProps<{ param: Parameter }>();
</script>
