<template>
  <div class="ModelsDialog">
    <v-dialog v-model="state.dialog" max-width="1024">
      <v-card>
        <v-card-title
          v-text="`Select models to ${state.action}.`"
          v-if="state.models.length !== 0"
        />

        <v-card-text>
          <v-simple-table v-if="state.models.length !== 0">
            <template #default>
              <thead>
                <tr>
                  <th v-text="'Model name'" />
                  <th v-text="'Element type'" />
                  <th class="text-center" v-text="'Selected'" />
                </tr>
              </thead>
              <tbody>
                <tr :key="index" v-for="(model, index) in state.models">
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
            @click="state.dialog = false"
            outlined
            small
            text
            v-text="'Cancel'"
          />
          <v-btn
            :disabled="!state.models.some(p => p.state.selected)"
            @click="exportModels"
            outlined
            small
            v-if="state.action === 'export'"
          >
            <v-icon left v-text="'mdi-export'" />
            Export
          </v-btn>
          <v-btn
            :disabled="!state.models.some(p => p.state.selected)"
            @click="deleteModels"
            outlined
            small
            v-if="state.action === 'delete'"
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
import { reactive, watch } from '@vue/composition-api';

import { Model } from '@/core/model/model';
import core from '@/core';

export default Vue.extend({
  name: 'ModelsDialog',
  props: {
    action: String,
    open: Boolean,
    models: Array,
  },
  setup(props) {
    const state = reactive({
      action: 'export',
      dialog: false,
      models: props.models as Model[],
    });

    /**
     * Export models.
     */
    const exportModels = () => {
      const models: any[] = state.models
        .filter((model: Model) => model.state.selected)
        .map((model: Model) => {
          model.state.selected = false;
          const modelData: any = model.toJSON();
          return modelData;
        });
      core.app.download(models, models.length === 1 ? 'model' : 'models');
      state.dialog = false;
    };

    /**
     * Delete models.
     */
    const deleteModels = () => {
      const modelIds: string[] = state.models
        .filter((model: Model) => model.state.selected)
        .map((model: Model) => {
          model.state.selected = false;
          return model.id;
        });
      core.app.deleteModels(modelIds).then(() => {
        core.app.updateModels();
        state.dialog = false;
      });
    };

    watch(
      () => [props.action, props.open],
      () => {
        state.models = props.models as Model[];
        state.action = props.action as string;
        state.dialog = true;
      }
    );

    return {
      exportModels,
      deleteModels,
      state,
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
