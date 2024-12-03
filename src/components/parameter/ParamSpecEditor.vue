<template>
  <v-list>
    <v-select
      :items="param.types"
      density="compact"
      v-model="param.typeId"
      hide-details
      item-title="label"
      item-value="id"
      label="Select a parameter type"
      @change="param.changes()"
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
        <v-list-item
          v-bind="props"
          :prepend-icon="item.raw.icon"
        />
      </template>
    </v-select>

    <v-row class="ma-2">
      <v-col
        v-for="spec in param.specs"
        :key="spec.id"
        :cols="12 / param.specs.length"
      >
        <v-text-field
          v-model="spec.value"
          :label="spec.label"
          density="compact"
          hide-details
          type="number"
        />
      </v-col>
    </v-row>
  </v-list>
</template>

<script lang="ts" setup>
import { BaseParameter } from "@/helpers/common/parameter";

defineProps<{ param: BaseParameter }>();
</script>
