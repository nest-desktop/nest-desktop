<template>
  <v-list>
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

    <v-row class="ma-2">
      <v-col
        :cols="12 / param.specs.length"
        :key="spec.id"
        v-for="spec in param.specs"
      >
        <v-text-field
          :label="spec.label"
          density="compact"
          hide-details
          type="number"
          v-model="spec.value"
        />
      </v-col>
    </v-row>
  </v-list>
</template>

<script lang="ts" setup>
import { BaseParameter } from "@/helpers/common/parameter";

defineProps<{ param: BaseParameter }>();
</script>
