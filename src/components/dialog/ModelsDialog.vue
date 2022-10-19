<template>
  <div class="ModelsDialog">
    <v-dialog
      max-width="420"
      v-if="appState.dialog.action === 'reload'"
      v-model="appState.dialog.open"
    >
      <v-card>
        <v-card-title v-text="'Are you sure to reload all models?'" />

        <v-card-text>
          The models will be reloaded from the database.
          <br />
          Any unsaved content in models will be deleted!
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog" outlined small text v-text="'cancel'" />
          <v-btn @click="reloadModels" outlined small>
            <v-icon left v-text="'mdi-reload'" />
            reload
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      max-width="480"
      v-else-if="appState.dialog.action === 'reset'"
      v-model="appState.dialog.open"
    >
      <v-card>
        <v-card-title v-text="'Are you sure to reset all models?'" />

        <v-card-text>
          The database for models will be deleted and then reset.
          <br />
          Your personal model changes and imported models will be removed!
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="() => closeDialog()"
            outlined
            small
            text
            v-text="'cancel'"
          />
          <v-btn @click="resetModels()" outlined small>
            <v-icon left v-text="'$mdiDatabaseRefreshOutline'" />
            reset
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      max-width="1024"
      v-else-if="appState.dialog.action === 'import'"
      v-model="appState.dialog.open"
    >
      <ModelsImportDialog />
    </v-dialog>

    <v-dialog max-width="1024" v-else v-model="appState.dialog.open">
      <v-card>
        <v-card-title>
          {{
            appState.dialog.action.charAt(0).toUpperCase() +
            appState.dialog.action.slice(1)
          }}
        </v-card-title>
        <v-card-subtitle
          v-text="`Select projects to ${appState.dialog.action}`"
        >
        </v-card-subtitle>

        <v-card-text>
          <v-simple-table v-if="appState.dialog.data.models.length !== 0">
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
                  v-for="(model, index) in appState.dialog.data.models"
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
            @click="() => closeDialog()"
            outlined
            small
            text
            v-text="'cancel'"
          />
          <v-btn
            :disabled="!appState.dialog.data.models.some(p => p.state.selected)"
            @click="exportModels()"
            outlined
            small
            v-if="appState.dialog.action === 'export'"
          >
            <v-icon left v-text="'mdi-export'" />
            Export
          </v-btn>
          <v-btn
            :disabled="!appState.dialog.data.models.some(p => p.state.selected)"
            @click="deleteModels()"
            outlined
            small
            v-if="appState.dialog.action === 'delete'"
          >
            <v-icon left v-text="'mdi-trash-can-outline'" />
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { Model } from '@/core/model/model';
import core from '@/core';
import ModelsImportDialog from '@/components/dialog/ModelsImportDialog.vue';

export default Vue.extend({
  name: 'ModelsDialog',
  components: {
    ModelsImportDialog,
  },
  setup() {
    const appState = core.app.state;

    /**
     * Export selected models.
     */
    const exportModels = () => {
      const selectedModels: Model[] = appState.dialog.data.models.filter(
        (model: Model) => model.state.selected
      );
      if (selectedModels.length > 0) {
        core.app.model.exportModels(selectedModels);
      }
      core.app.closeDialog();
    };

    /**
     * Delete selected models.
     */
    const deleteModels = () => {
      const selectedModels: Model[] = appState.dialog.data.models.filter(
        (model: Model) => model.state.selected
      );
      if (selectedModels.length > 0) {
        core.app.model.deleteModels(selectedModels);
      }
      core.app.closeDialog();
    };

    /**
     * Reload the models from the database.
     */
    const reloadModels = () => {
      core.app.model.initModelList().then(() => {
        core.app.model.view.redirect();
      });
      core.app.closeDialog();
    };

    /**
     * Reset model database.
     */
    const resetModels = () => {
      core.app.model.resetDatabase();
      core.app.closeDialog();
      reloadModels();
    };

    return {
      appState,
      closeDialog: () => core.app.closeDialog(),
      deleteModels,
      exportModels,
      reloadModels,
      resetModels,
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
