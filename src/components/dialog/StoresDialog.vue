<template>
  <v-card flat title="Stores" width="400">
    <v-sheet class="pa-2" color="warning">
      <v-row>
        <v-col cols="1" class="d-flex">
          <v-icon class="ma-auto" icon="mdi:mdi-alert-outline" />
        </v-col>
        <v-col cols="11">
          Data can be lost! Please watch your actions.
        </v-col>
      </v-row>
    </v-sheet>
    <v-expansion-panels flat variant="accordion">
      <v-expansion-panel>
        <v-expansion-panel-title>
          App configs
          <v-spacer />
          <v-btn @click.stop size="x-small" icon="mdi:mdi-refresh" variant="text" />
          <v-btn @click.stop="clearLocalStorage()" size="x-small" icon="mdi:mdi-trash-can-outline" variant="text" />
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-list density="compact" style="font-size:13px">
            <v-list-item :key="index" v-for="config,index in configs">
              {{ config }}
              <template #append>
                <v-btn size="x-small" icon="mdi:mdi-refresh" variant="text" />
                <v-btn size="x-small" icon="mdi:mdi-trash-can-outline" variant="text" />
              </template>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title>
          Database
          <v-spacer />
          <v-btn @click.stop size="x-small" icon="mdi:mdi-refresh" variant="text" />
          <v-btn @click.stop size="x-small" icon="mdi:mdi-trash-can-outline" variant="text" />
        </v-expansion-panel-title>


        <v-expansion-panel-text>
          <v-card>
            <v-card-text>
              <v-select
                :items="simulatorItems"
                density="compact"
                hide-details
                item-value="id"
                label="Simulators"
                v-model="simulator"
              />

              <v-list>
                <v-list-item
                  :key="index"
                  v-for="(database, index) in simulators[simulator].databases"
                >
                  {{ database }}
                  <template #append>
                    <v-btn @click.stop="destroyDatabase(database)" icon="mdi:mdi-trash-can-outline"  size="x-small" variant="text" />
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import PouchDB from "pouchdb";

import { confirmDialog } from "@/helpers/common/confirmDialog";
import { simulators } from "@/simulators";

// import { useAppStore } from "@/stores/appStore";
// const appStore = useAppStore();

const simulatorItems = computed(() => Object.values(simulators));


const simulator = ref("nest");

const configs = [
  "App", "Connection", "Network", "NetworkGraph", "Node", "NodeRecord", "Simulation",
]


const clearLocalStorage = () => localStorage.clear();

const destroyDatabase = (name: string) => {
  confirmDialog({
      title: "Destroy database",
      text: "Are you sure to destroy database?",
    }).then((response: boolean) => {
    if (response) {
      const db = new PouchDB(name);
      db.destroy().then(() => {
        const url = new URL(location.href)
        location.replace(url.origin);
      });
    }
  })
}
</script>