<template>
  <div class="modelsMenu">
    <v-menu offset-y transition="slide-y-transition">
      <template #activator="{ on, attrs }">
        <v-btn small text v-bind="attrs" v-on="on">
          Models
          <v-icon right v-text="'mdi-menu-down'" />
        </v-btn>
      </template>

      <v-card flat tile>
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
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive } from '@vue/composition-api';

import core from '@/core';

export default Vue.extend({
  name: 'ModelsMenu',
  setup() {
    const state = reactive({
      items: [
        {
          id: 'modelsReload',
          icon: 'mdi-reload',
          title: 'Reload models',
          onClick: () => {
            core.app.model.initModelList();
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
          onClick: () => openDialog('reset'),
        },
      ],
    });

    /**
     * Open a dialog to export, import or delete models..
     * @param action Dialog to open
     */
    const openDialog = (action: string = 'export') => {
      // Reset states for model list.
      core.app.model.resetModelStates();

      const models = action === 'reset' ? [] : core.app.model.state.models;

      // Open dialog for models.
      core.app.openDialog('models', action, { models });
    };

    return {
      openDialog,
      state,
    };
  },
});
</script>
