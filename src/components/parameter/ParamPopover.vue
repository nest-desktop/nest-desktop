<template>
  <v-btn
    icon
    size="small"
    variant="text"
  >
    <v-icon icon="mdi:mdi-pencil" />

    <v-menu
      :close-on-content-click="false"
      :max-width="300"
      activator="parent"
    >
      <v-card
        :width="400"
        variant="outlined"
      >
        <v-card-text>
          <ParameterSpecEditor :param />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            text="update parameter"
            @click="param.changes()"
          />
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-btn>
</template>

<script lang="ts" setup>
import ParameterSpecEditor from "./ParamSpecEditor.vue";
import { TParameter } from "@/types";

defineProps<{ param: TParameter }>();
</script>
