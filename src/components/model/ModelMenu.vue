<template>
  <div class="modelMenu" v-if="state.model">
    <v-menu
      :close-on-content-click="false"
      :position-x="state.position.x"
      :position-y="state.position.y"
      :value="state.show"
      transition="slide-y-transition"
    >
      <v-card>
        <!-- <v-card-title class="py-1" height="40" v-text="state.model.name" /> -->

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
import { reactive, watch } from '@vue/composition-api';

import { Model } from '@/core/model/model';
import core from '@/core';

export default Vue.extend({
  name: 'ModelMenu',
  props: {
    model: Model,
    position: Object,
  },
  setup(props) {
    const state = reactive({
      content: null,
      model: props.model as Model,
      openModelDialog: false,
      position: props.position,
      show: true,
      items: [
        {
          id: 'modelReload',
          icon: 'mdi-reload',
          title: 'Reload model',
          onClick: () => {
            // state.model.reload();
            state.show = false;
          },
        },
        {
          id: 'modelCopy',
          icon: 'mdi-content-duplicate',
          title: 'Copy model',
          onClick: () => {
            // state.model.copy();
            state.show = false;
          },
        },
        {
          id: 'modelImport',
          icon: 'mdi-import',
          title: 'Import model',
          onClick: () => {
            state.show = false;
            core.app.model.importFromGithub(state.model.id);
          },
        },
        {
          id: 'modelExport',
          icon: 'mdi-export',
          title: 'Export model',
          onClick: () => openDialog('export'),
        },
        {
          id: 'modelDelete',
          icon: 'mdi-delete',
          title: 'Delete model',
          onClick: () => {
            state.content = 'modelDelete';
          },
          append: true,
        },
      ],
    });

    /**
     * Delete model.
     */
    const deleteModel = () => {
      state.model.delete().then(() => {
        state.show = false;
      });
    };

    const update = () => {
      state.content = null;
      state.show = true;
      state.model = props.model as Model;
      state.position = props.position;
    };

    /**
     * Open one of the dialogs to export, import or delete.
     * @param action Dialog to open
     */
    const openDialog = (action: string = 'export') => {
      state.model.resetState();
      core.app.openDialog('model', action, [state.model]);
      state.show = false;
    };

    watch(
      () => props.model,
      () => update()
    );

    return { deleteModel, state };
  },
});
</script>
