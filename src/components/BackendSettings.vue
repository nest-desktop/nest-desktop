<template>
  <v-row class="mt-1">
    <v-col
      class="d-flex justify-center"
      cols="1"
    >
      <v-checkbox
        v-model="store.state.enabled"
        inset
        title="Enable backend"
      />
    </v-col>

    <v-col cols="11">
      <v-text-field
        :disabled="!store.state.enabled"
        :hide-details="store.state.response.data.length === 0"
        :placeholder="store.defaults"
        v-model="store.state.url"
        :rules="[
          (value) => value.length === 0 || isURL(value) || 'URL is not valid',
        ]"
        class="my-2"
        density="compact"
        label="URL of backend"
        persistent-placeholder
        @update:focused="updateOnFocus"
      >
        <template #append>
          <v-btn @click="store.ping()">
            <template #append>
              <BackendStatusIcon
                :backend-store="store"
                size="small"
              />
            </template>
            ping
          </v-btn>
        </template>

        <template #details>
          <span v-if="store.isOK && store.isValid">
            Response:
            {{ store.state.response.data }}
          </span>
          <span v-else>
            Error:
            {{ store.state.error }}
          </span>
        </template>
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import BackendStatusIcon from "./iconsets/BackendStatusIcon.vue";
import { TStore } from "@/types";
import { isURL } from "@/utils/urls";

const props = defineProps<{ store: TStore }>();
const store = computed(() => props.store);

const updateOnFocus = (focus: boolean) => {
  if (!focus) {
    if (store.value.state.url == null || store.value.state.url.length === 0) {
      store.value.resetURL();
    }
    store.value.ping();
  }
};
</script>
