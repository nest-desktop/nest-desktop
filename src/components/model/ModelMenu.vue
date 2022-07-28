<template>
  <div class="modelMenu" v-if="state.model">
    <v-menu transition="slide-y-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn @click.prevent icon v-bind="attrs" v-on="on" v-show="state.show">
          <v-icon class="px-1" small v-text="'mdi-dots-vertical'" />
        </v-btn>
      </template>

      <v-card>
        <v-list dense>
          <v-list-item
            :key="index"
            @click="item.onClick"
            v-for="(item, index) in state.items"
            v-show="item.show"
          >
            <v-list-item-icon>
              <v-icon small right v-text="item.icon" />
            </v-list-item-icon>
            <v-list-item-title v-text="item.title" />
          </v-list-item>
        </v-list>

        <span v-if="state.content === 'modelDelete'">
          <v-card-title v-text="'Are you sure to delete this model?'" />

          <v-card-actions>
            <v-btn @click="state.content = null" outlined small text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-spacer />
            <v-btn @click="deleteModel" outlined small v-text="'Delete'" />
          </v-card-actions>
        </span>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';

import { Model } from '@/core/model/model';
import core from '@/core';

export default Vue.extend({
  name: 'ModelMenu',
  props: {
    modelId: String,
  },
  setup(props) {
    const state = reactive({
      items: [
        {
          id: 'modelReload',
          icon: 'mdi-reload',
          title: 'Reload model',
          onClick: () => {
            // state.model.reload();
            // state.show = false;
          },
          show: false,
        },
        {
          id: 'modelCopy',
          icon: 'mdi-content-duplicate',
          title: 'Copy model',
          onClick: () => {
            // state.model.copy();
            // state.show = false;
          },
          show: false,
        },
        {
          id: 'modelImport',
          icon: 'mdi-import',
          title: 'Import model',
          onClick: () => openDialog('import'),
          show: false,
        },
        {
          id: 'modelExport',
          icon: 'mdi-export',
          title: 'Export model',
          onClick: () => openDialog('export'),
          show: false,
        },
        {
          id: 'modelDelete',
          icon: 'mdi-delete',
          title: 'Delete model',
          onClick: () => {},
          show: false,
        },
      ],
      model: core.app.model.getModel(props.modelId) as Model,
      show: false,
    });

    /**
     * Delete model.
     */
    const deleteModel = () => {
      state.model.delete();
    };

    /**
     * Update show state of items.
     */
    const updateItemShow = () => {
      const hasModel = core.app.model.hasModel(state.model.id);
      const fileExistGithub = core.app.model.fileExistGithub(state.model.id);
      state.items[0].show = hasModel;
      state.items[1].show = hasModel;
      state.items[2].show = !hasModel && fileExistGithub;
      state.items[3].show = hasModel;
      state.items[4].show = hasModel;

      state.show = hasModel || fileExistGithub;
    };

    const update = () => {
      state.model = core.app.model.getModel(props.modelId) as Model;
      updateItemShow();
    };

    /**
     * Open one of the dialogs to export, import or delete.
     * @param action Dialog to open
     */
    const openDialog = (action: string = 'export') => {
      state.model.resetState();
      core.app.openDialog('model', action, [state.model]);
    };

    onMounted(() => update());

    watch(
      () => props.modelId,
      () => update()
    );

    return { deleteModel, state };
  },
});
</script>
