<template>
  <div class="modelsMenu">
    <v-menu
      :close-on-content-click="false"
      :position-x="state.position.x"
      :position-y="state.position.y"
      :value="state.show"
      transition="slide-y-transition"
    >
      <v-card tile flat style="min-width: 300px">
        <span v-if="state.content === null">
          <v-list dense>
            <v-list-item
              :key="index"
              @click="item.onClick"
              v-for="(item, index) in state.items"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon" />
              </v-list-item-icon>
              <v-list-item-title v-text="item.title" />

              <v-list-item-action v-show="item.append">
                <v-icon small v-text="'mdi-menu-right'" />
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </span>

        <span v-if="state.content === 'modelsReset'">
          <v-card-title v-text="'Are you sure to reset all models?'" />

          <v-card-text>
            The database for models will be deleted and then reset.
            <br />
            All current models will be lost.
          </v-card-text>

          <v-card-actions>
            <v-btn @click="reset" outlined small text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-spacer />
            <v-btn @click="resetModels" outlined small v-text="'Reset'" />
          </v-card-actions>
        </span>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';

import { Model } from '@/core/model/model';
import core from '@/core';
import ModelsDialog from '@/components/model/ModelsDialog.vue';
import ModelsImportDialog from '@/components/model/ModelsImportDialog.vue';

export default Vue.extend({
  name: 'ModelsMenu',
  components: {
    ModelsDialog,
    ModelsImportDialog,
  },
  props: {
    position: Object,
  },
  setup(props) {
    const appView = core.app.view;
    const state = reactive({
      content: null,
      position: props.position,
      show: true,
      modelDialogAction: 'export',
      items: [
        {
          id: 'modelsReload',
          icon: 'mdi-reload',
          title: 'Reload models',
          onClick: () => {
            appView.updateModels();
            state.show = false;
          },
        },
        {
          id: 'modelsExport',
          icon: 'mdi-export',
          title: 'Export models',
          onClick: () => openDialog('export'),
        },
        {
          id: 'modelsImport',
          icon: 'mdi-import',
          title: 'Import models',
          onClick: () => openDialog('import'),
        },
        {
          id: 'modelsDelete',
          icon: 'mdi-trash-can-outline',
          title: 'Delete models',
          onClick: () => openDialog('delete'),
        },
        {
          id: 'modelsReset',
          icon: '$mdiDatabaseRefreshOutline',
          title: 'Reset all models',
          onClick: () => {
            state.content = 'modelsReset';
          },
          append: true,
        },
      ],
    });

    /**
     * Reset states.
     */
    const reset = () => {
      state.content = null;
    };

    /**
     * Reset model database.
     */
    const resetModels = () => {
      core.app.resetModelDatabase().then(() => {
        appView.updateModels();
        state.show = false;
        reset();
      });
    };

    const openDialog = (action: string = 'export') => {
      appView.state.models.forEach((model: Model) => model.resetState());
      appView.state.dialog.source = 'model';
      appView.state.dialog.action = action;
      appView.state.dialog.content = appView.state.models;
      appView.state.dialog.open = true;
      state.show = false;
    };

    watch(
      () => props.position,
      () => {
        state.show = false;
        reset();
        state.position = props.position;
        state.show = true;
      }
    );

    return {
      appView,
      reset,
      resetModels,
      state,
    };
  },
});
</script>
