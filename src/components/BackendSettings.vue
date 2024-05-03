<template>
  <v-row class="mt-1">
    <v-col class="d-flex justify-center" cols="2">
      <div>
        <v-switch inset title="Enable backend" v-model="store.state.enabled" />
      </div>
    </v-col>
    <v-col cols="10">
      <v-text-field
        :disabled="!store.state.enabled"
        :hide-details="store.state.response.data.length === 0"
        :placeholder="store.state.defaults.url"
        :rules="[
          (value) => value.length === 0 || isURL(value) || 'URL is not valid',
        ]"
        @update:focused="updateOnFocus"
        class="my-2"
        density="compact"
        label="URL of backend"
        persistent-placeholder
        v-model="store.state.url"
        variant="outlined"
      >
        <template #append>
          <v-btn @click="store.ping()" variant="outlined">
            <template #append>
              <v-icon
                :color="store.isOK ? 'green' : 'red'"
                icon="mdi:mdi-circle"
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
import { Store } from "pinia";
import { computed } from "vue";

import { isURL } from "@/utils/urls";

const props = defineProps<{ store: Store<any, any> }>();
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
