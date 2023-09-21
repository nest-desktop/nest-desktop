<template>
  <v-row>
    <v-col cols="1">
      <v-checkbox v-model="store.enabled" />
    </v-col>
    <v-col cols="11">
      <v-text-field
        :disabled="!store.enabled"
        :placeholder="store.defaults.url"
        :rules="[
          (value) => value.length === 0 || isURL(value) || 'URL is not valid',
        ]"
        @update:focused="updateOnFocus"
        class="my-2"
        density="compact"
        label="URL of backend"
        persistent-placeholder
        v-model="store.url"
        variant="outlined"
      >
        <template #append>
          <v-btn @click="store.ping()" variant="outlined">
            <template #append>
              <v-icon
                icon="mdi-circle"
                :color="store.session.isOK ? 'green' : 'red'"
              />
            </template>
            ping
          </v-btn>
        </template>

        <template #details>
          <div v-if="store.session.isOK && store.session.isValid">
            {{ store.session.response.data }}
          </div>
          <div v-else>
            {{ store.session.error }}
          </div>
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
    if (store.value.url == null || store.value.url.length === 0) {
      store.value.reset();
    }
    store.value.ping();
  }
};
</script>
