<template>
  <div class="modelMenu" v-if="state.modelId">
    <v-dialog max-width="480" v-model="state.dialog">
      <v-card>
        <v-card-title v-text="'Are you sure to delete it?'" />

        <v-card-text v-if="state.model">
          <v-list dense>
            <v-subheader>Model: {{ state.model.label }} </v-subheader>
            <v-list-item :key="param.id" v-for="param in state.model.params">
              {{ param.label }} ({{ param.id }}) <v-spacer /> {{ param.value }}
              {{ param.unit }}
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="state.dialog = false"
            outlined
            small
            text
            v-text="'cancel'"
          />
          <v-btn @click="deleteModel" outlined small v-text="'delete'" />
        </v-card-actions>
      </v-card>
    </v-dialog>

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
      dialog: false,
      items: [
        {
          id: 'modelImport',
          icon: 'mdi-import',
          title: 'Import model',
          onClick: () => openDialog('import'),
          show: false,
        },
        // {
        //   id: 'modelReload',
        //   icon: 'mdi-reload',
        //   title: 'Reload model',
        //   onClick: () => {
        //     // state.model.reload();
        //     // state.show = false;
        //   },
        //   show: false,
        // },
        // {
        //   id: 'modelCopy',
        //   icon: 'mdi-content-duplicate',
        //   title: 'Copy model',
        //   onClick: () => {
        //      state.model.copy();
        //   },
        //   show: false,
        // },
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
          onClick: () => openDialog('delete'),
          show: false,
        },
      ],
      model: null as Model,
      modelId: props.modelId,
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
      const hasModel = core.app.model.hasModel(state.modelId);
      const fileExistGithub = core.app.model.fileExistGithub(state.modelId);
      state.items[0].show = !hasModel && fileExistGithub;
      state.items.slice(1).forEach(item => (item.show = hasModel));
      state.show = hasModel || fileExistGithub;
    };

    const update = () => {
      state.modelId = props.modelId;
      updateItemShow();
    };

    /**
     * Open one of the dialogs to export, import or delete.
     * @param action Dialog to open
     */
    const openDialog = (action: string = 'export') => {
      if (action === 'delete') {
        state.model = core.app.model.getModel(state.modelId) as Model;
        state.dialog = true;
      } else {
        const model = core.app.model.getModel(state.modelId) as Model;
        model.resetState();
        core.app.openDialog('models', action, { models: [model] });
      }
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
