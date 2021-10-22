<template>
  <div class="ModelsDialog">
    <v-dialog v-model="appView.state.dialog.open" max-width="1024">
      <span v-if="appView.state.dialog.action === 'import'">
        <ModelsImport />
      </span>
      <span v-else>
        <v-card>
          <v-card-title
            v-text="`Select models to ${appView.state.dialog.action}.`"
            v-if="appView.state.dialog.content.length !== 0"
          />

          <v-card-text>
            <v-simple-table v-if="appView.state.dialog.content.length !== 0">
              <template #default>
                <thead>
                  <tr>
                    <th v-text="'Model name'" />
                    <th v-text="'Element type'" />
                    <th class="text-center" v-text="'Selected'" />
                  </tr>
                </thead>
                <tbody>
                  <tr
                    :key="index"
                    v-for="(model, index) in appView.state.dialog.content"
                  >
                    <td v-text="model.label" />
                    <td v-text="model.elementType" />
                    <td class="text-center">
                      <v-checkbox
                        class="my-0 mx-auto"
                        color="model"
                        hide-details
                        v-model="model.state.selected"
                      />
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              @click="appView.state.dialog.open = false"
              outlined
              small
              text
              v-text="'Cancel'"
            />
            <v-btn
              :disabled="
                !appView.state.dialog.content.some(p => p.state.selected)
              "
              @click="exportModels"
              outlined
              small
              v-if="appView.state.dialog.action === 'export'"
            >
              <v-icon left v-text="'mdi-export'" />
              Export
            </v-btn>
            <v-btn
              :disabled="
                !appView.state.dialog.content.some(p => p.state.selected)
              "
              @click="deleteModels"
              outlined
              small
              v-if="appView.state.dialog.action === 'delete'"
            >
              <v-icon left v-text="'mdi-trash-can-outline'" />
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </span>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { Model } from '@/core/model/model';
import core from '@/core';
import ModelsImport from '@/components/model/ModelsImport.vue';

export default Vue.extend({
  name: 'ModelsDialog',
  components: {
    ModelsImport,
  },
  setup() {
    const appView = core.app.view;

    /**
     * Export models.
     */
    const exportModels = () => {
      const selectedModels: Model[] = appView.state.dialog.content.filter(
        (model: Model) => model.state.selected
      );
      if (selectedModels.length > 0) {
        appView.exportModels(selectedModels);
      }
      appView.state.dialog.open = false;
    };

    /**
     * Delete models.
     */
    const deleteModels = () => {
      const selectedModels: Model[] = appView.state.dialog.content.filter(
        (model: Model) => model.state.selected
      );
      if (selectedModels.length > 0) {
        appView.deleteModels(selectedModels);
      }
      appView.state.dialog.open = false;
    };

    return {
      appView,
      exportModels,
      deleteModels,
    };
  },
});
</script>

<style>
.v-input__slot {
  align-items: center;
  justify-content: center;
}
</style>
