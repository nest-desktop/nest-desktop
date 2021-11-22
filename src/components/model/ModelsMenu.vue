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
        <span v-if="state.content == null">
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
            The cookie containing the local models will be deleted.
            <br />
            All of your personal changes and all imported models will be
            removed.
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

import core from '@/core';

export default Vue.extend({
  name: 'ModelsMenu',
  props: {
    position: Object,
  },
  setup(props) {
    const state = reactive({
      content: undefined,
      position: props.position,
      show: true,
      items: [
        {
          id: 'modelsReload',
          icon: 'mdi-reload',
          title: 'Reload models',
          onClick: () => {
            core.app.model.initModelList();
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
      state.show = false;
      core.app.model.resetDatabase().then(() => {
        reset();
      });
    };

    /**
     * Open one of the dialogs to export, import or delete.
     * @param action Dialog to open
     */
    const openDialog = (action: string = 'export') => {
      core.app.model.resetModelStates();
      core.app.openDialog('model', action, core.app.model.state.models);
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
      reset,
      resetModels,
      state,
    };
  },
});
</script>
