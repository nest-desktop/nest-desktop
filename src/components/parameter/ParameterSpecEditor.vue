<template>
  <v-list class="pa-0" density="compact">
    <v-list-item class="px-0">
      <v-select
        :items="param.types"
        @change="param.changes()"
        density="compact"
        hide-details
        item-title="label"
        item-value="id"
        label="Select a parameter type"
        v-model="param.typeId"
      >
        <!-- <template slot="selection" slot-scope="data">
            <v-icon :icon="data.item.icon" left />
            {{ data.item.label }}
          </template>
          <template slot="item" slot-scope="data">
            <v-icon :icon="data.item.icon" left />
            {{ data.item.label }}
          </template> -->
        <template #item="{ item, props }">
          <v-list-item v-bind="props" :prepend-icon="item.raw.icon" />
        </template>
      </v-select>
    </v-list-item>

    <v-list-item class="px-0 pt-5">
      <v-row>
        <v-col
          :cols="12 / param.specs.length"
          :key="spec.id"
          class="py-0"
          v-for="spec in param.specs"
        >
          <v-text-field
            :label="spec.label"
            density="compact"
            hide-details
            style="font-size: 13px"
            type="number"
            v-model="spec.value"
          />
        </v-col>
      </v-row>
    </v-list-item>
  </v-list>
</template>

<script lang="ts" setup>
import { Parameter } from "@/helpers/common/parameter";

defineProps<{ param: Parameter }>();
</script>
