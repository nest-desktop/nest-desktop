<template>
  <v-row class="mt-1">
    <v-col class="d-flex justify-center" cols="1">
      <v-checkbox inset title="Enable backend" v-model="store.state.enabled" />
    </v-col>

    <v-col cols="11">
      <v-text-field
        :disabled="!store.state.enabled"
        :hide-details="store.state.response.data.length === 0"
        :placeholder="store.defaults"
        :rules="[
          (value) => value.length === 0 || isURL(value) || 'URL is not valid',
        ]"
        @update:focused="updateOnFocus"
        class="my-2"
        density="compact"
        label="URL of backend"
        persistent-placeholder
        v-model="store.state.url"
      >
        <template #append>
          <v-btn @click="store.ping()">
            <template #append>
              <BackendStatusIcon :backend-store="store" size="small" />
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

import { isURL } from "@/utils/urls";
import { TBackendStore } from "@/stores/defineBackendStore";
import BackendStatusIcon from "./iconsets/BackendStatusIcon.vue";

const props = defineProps<{ store: TBackendStore }>();
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
