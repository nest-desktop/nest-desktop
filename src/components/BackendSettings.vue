<template>
  <v-row>
    <v-col cols="1">
      <v-checkbox v-model="store.enabled" />
    </v-col>
    <v-col cols="11">
      <v-text-field
        :disabled="!store.enabled"
        class="my-2"
        density="compact"
        label="URL of backend"
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

const props = defineProps(["store"]);
const store = computed(() => props.store);
</script>
