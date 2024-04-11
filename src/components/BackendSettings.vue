<template>
  <v-row class="mt-1">
    <v-col class="d-flex justify-center" cols="2">
      <div>
        <v-switch
          inset
          title="Enable backend"
          v-model="store.backendConfigStore.state.enabled"
        />
      </div>
    </v-col>
    <v-col cols="10">
      <v-text-field
        :disabled="!store.backendConfigStore.state.enabled"
        :hide-details="store.state.response.data.length === 0"
        :placeholder="store.backendConfigStore.state.defaults.url"
        :rules="[
          (value) => value.length === 0 || isURL(value) || 'URL is not valid',
        ]"
        @update:focused="updateOnFocus"
        class="my-2"
        density="compact"
        label="URL of backend"
        persistent-placeholder
        v-model="store.backendConfigStore.state.url"
        variant="outlined"
      >
        <template #append>
          <v-btn @click="store.ping()" variant="outlined">
            <template #append>
              <v-icon
                icon="mdi:mdi-circle"
                :color="store.isOK ? 'green' : 'red'"
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

import { isURL } from "@/utils/urls";

const props = defineProps(["store"]);
const store = computed(() => props.store);

const updateOnFocus = (focus: boolean) => {
  if (!focus) {
    if (
      store.value.backendConfigStore.state.url == null ||
      store.value.backendConfigStore.state.url.length === 0
    ) {
      store.value.backendConfigStore.reset();
    }
    store.value.ping();
  }
};
</script>
