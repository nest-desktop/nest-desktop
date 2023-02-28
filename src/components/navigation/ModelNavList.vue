<template>
  <div class="modelNavList">
    <v-toolbar
      absolute
      extended
      extension-height="96"
      flat
      height="48"
      width="296"
      style="width: calc(100% - 64px - 1px)"
    >
      <v-row style="padding-top: 6px">
        <v-btn
          :key="index"
          :title="item.title"
          :to="item.to"
          @click="item.onClick"
          class="flex-grow-1 ma-0 pa-0"
          exact
          style="min-width: auto"
          text
          tile
          v-for="(item, index) in state.items"
        >
          <v-icon v-text="item.icon" />
        </v-btn>
      </v-row>
    </v-toolbar>

    <v-toolbar
      absolute
      flat
      height="96"
      style="margin-top: 52px; width: calc(100% - 64px - 1px)"
    >
      <div style="width: 100%">
        <v-row class="ma-0" style="height: 96px">
          <v-text-field
            @change="update"
            @click:append="clearSearch"
            append-icon="mdi-magnify"
            clearable
            hide-details
            label="Search model"
            v-model="modelStore.state.searchTerm"
          />
          <div style="width: 100%">
            <v-menu offset-y>
              <template #activator="{ on, attrs }">
                <v-btn
                  depressed
                  icon
                  small
                  title="Filter models by tags"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon v-text="'mdi-filter-variant'" />
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item
                  :disabled="modelStore.state.filterTags.includes(tag.text)"
                  :key="'menuItem-' + tag.text"
                  @click="addFilterTag(tag.text.toLowerCase())"
                  v-for="tag in filterTags"
                >
                  <v-list-item-title>
                    <v-icon left v-text="tag.icon" />
                    {{ tag.text }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <span v-if="modelStore.state.filterTags.length > 0">
              <span :key="'chip-' + tag.text" v-for="tag of filterTags">
                <v-chip
                  @click:close="removeFilterTag(tag.text.toLowerCase())"
                  class="ma-1 mb-0"
                  close
                  outlined
                  small
                  v-if="
                    modelStore.state.filterTags.includes(tag.text.toLowerCase())
                  "
                >
                  <v-icon left small v-text="tag.icon" />
                  {{ tag.text }}
                </v-chip>
              </span>
            </span>
            <span class="text-caption" v-else> No filter tag </span>
          </div>
        </v-row>
      </div>
    </v-toolbar>

    <div
      style="
        height: calc(100vh - 148px - 24px);
        margin-top: 148px;
        overflow-y: hidden;
      "
    >
      <v-card flat tile>
        <v-list class="pt-0" dense style="fontsize: 14px">
          <v-subheader
            class="my-0 py-0"
            style="font-size: 12px; height: 16px"
            v-text="
              state.models.length +
              ' model' +
              (state.models.length != 1 ? 's' : '')
            "
          />
          <v-virtual-scroll
            :height="state.height"
            :items="state.models"
            bench="1"
            item-height="60"
          >
            <template #default="{ item }">
              <v-list-item
                :key="item"
                :title="item"
                :to="'/model/' + item"
                class="modelItem"
                two-line
              >
                <v-list-item-content>
                  <v-list-item-title v-text="item" />
                  <v-list-item-subtitle>
                    <v-icon left small v-text="getIcon(item)" />
                    {{ getElementType(item) }}
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-icon class="icon my-4">
                  <v-icon
                    small
                    v-show="modelStore.hasModel(item)"
                    v-text="'mdi-database-outline'"
                  />
                  <v-icon
                    small
                    v-show="modelStore.fileExistGithub(item)"
                    v-text="'mdi-github'"
                  />
                </v-list-item-icon>

                <v-list-item-action class="action">
                  <ModelMenu :modelId="item" />
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-list>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  onBeforeUnmount,
  onMounted,
  reactive,
  watch,
} from '@vue/composition-api';

import { Model } from '@/core/model/model';
import core from '@/core';

import ModelMenu from '@/components/navigation/ModelMenu.vue';

export default Vue.extend({
  name: 'Models',
  components: {
    ModelMenu,
  },
  setup() {
    const modelStore = core.app.model;
    const state = reactive({
      filterTagIdx: {
        neuron: 2,
        stimulator: 3,
        recorder: 4,
        synapse: 5,
      },
      height: 0,
      items: [
        {
          id: 'modelsReload',
          icon: 'mdi-reload',
          title: 'Reload all models',
          onClick: () => {
            openDialog('reload');
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
      models: [],
    });

    const filterTags = [
      { icon: 'mdi-database-outline', text: 'Installed' },
      { icon: 'mdi-github', text: 'GitHub' },
      { icon: 'mdi-alpha-n-box-outline', text: 'Neuron' },
      {
        icon: 'mdi-alpha-r-box-outline',
        text: 'Recorder',
      },
      {
        icon: 'mdi-alpha-s-box-outline',
        text: 'Stimulator',
      },
      { icon: 'mdi-alpha-s-circle-outline', text: 'Synapse' },
    ];

    /**
     * Add filter tag.
     */
    const addFilterTag = (tag: string) => {
      if (modelStore.state.filterTags.includes(tag)) {
        return;
      }
      modelStore.state.filterTags.push(tag);
      update();
    };

    /**
     * Remove filter tag.
     */
    const removeFilterTag = (tag: string) => {
      modelStore.state.filterTags.splice(
        modelStore.state.filterTags.indexOf(tag),
        1
      );
      modelStore.state.filterTags = [...modelStore.state.filterTags];
      update();
    };

    /**
     * Check if model is a neuron.
     */
    const isNeuron = (model: string) =>
      model.includes('cond') ||
      model.includes('neuron') ||
      model.includes('psc') ||
      model.includes('izhikevich') ||
      model.includes('transformer') ||
      model.startsWith('aiaf') ||
      model.startsWith('cm') ||
      model.startsWith('gauss') ||
      model.startsWith('gif') ||
      model.startsWith('hh') ||
      model.startsWith('iaf') ||
      model.startsWith('lin') ||
      model.startsWith('sigmoid') ||
      model.startsWith('tanh') ||
      model.startsWith('threshold');

    /**
     * Check if model is a recorder.
     */
    const isRecorder = (model: string) =>
      model.endsWith('detector') ||
      model.endsWith('recorder') ||
      model.endsWith('meter');

    /**
     * Check if model is a stimulator.
     */
    const isStimulator = (model: string) =>
      model.includes('dilutor') || model.includes('generator');

    /**
     * Check if model is a synapse.
     */
    const isSynapse = (model: string) =>
      model.includes('gap_junction') ||
      model.includes('_synapse') ||
      model.includes('_connection');

    /**
     * Get element type based on model name.
     */
    const getElementType = (model: string) => {
      let typeName = 'other';
      if (isNeuron(model)) {
        typeName = 'neuron';
      } else if (isRecorder(model)) {
        typeName = 'recorder';
      } else if (isStimulator(model)) {
        typeName = 'stimulator';
      } else if (isSynapse(model)) {
        typeName = 'synapse';
      }
      return typeName;
    };

    /**
     * Get icon.
     */
    const getIcon = (model: string) => {
      const filterTagIdx = {
        neuron: 2,
        recorder: 3,
        stimulator: 4,
        synapse: 5,
      };

      const elementType = filterTagIdx[getElementType(model)];
      return elementType ? filterTags[elementType].icon : '';
    };

    /**
     * Clear search.
     */
    const clearSearch = () => {
      modelStore.clearSearch();
      update();
    };

    /**
     * Set height on resize.
     */
    const onResize = () => {
      state.height = window.innerHeight - 148 - 24 - 16;
    };

    /**
     * Update models.
     */
    const update = () => {
      state.models = [
        ...(modelStore.state.modelsNEST.length > 0
          ? modelStore.state.modelsNEST
          : modelStore.state.models.map((model: any) => model.id)),
      ];

      const filterTags: string[] = modelStore.state.filterTags;
      if (filterTags.includes('installed')) {
        let models = modelStore.state.models.map((model: Model) => model.id);
        state.models = state.models.filter((model: string) =>
          models.includes(model)
        );
      }
      if (filterTags.includes('github')) {
        let models = modelStore.state.filesGithub.map(
          (model: string) => model.split('.json')[0].split('/')[1]
        );
        state.models = state.models.filter((model: string) =>
          models.some((modelGroup: string) => model.startsWith(modelGroup))
        );
      }

      if (
        filterTags.includes('neuron') ||
        filterTags.includes('recorder') ||
        filterTags.includes('stimulator') ||
        filterTags.includes('synapse')
      ) {
        let models: any[] = [];
        if (filterTags.includes('neuron')) {
          models.push(state.models.filter((model: string) => isNeuron(model)));
        }
        if (filterTags.includes('recorder')) {
          models.push(
            state.models.filter((model: string) => isRecorder(model))
          );
        }
        if (filterTags.includes('stimulator')) {
          models.push(
            state.models.filter((model: string) => isStimulator(model))
          );
        }
        if (filterTags.includes('synapse')) {
          models.push(state.models.filter((model: string) => isSynapse(model)));
        }
        models = models.flat();
        models.sort();
        state.models = models;
      }

      if (modelStore.state.searchTerm) {
        state.models = state.models.filter((model: string) =>
          model.includes(modelStore.state.searchTerm)
        );
      }
    };

    /**
     * Open a dialog to export, import or delete models
     * @param action Dialog to open
     */
    const openDialog = (action: string = 'export') => {
      // Reset states for model list.
      core.app.model.resetModelStates();

      const models =
        action === 'reset' || action === 'reload'
          ? []
          : core.app.model.state.models;

      // Open dialog for models.
      core.app.openDialog('models', action, { models });
    };

    onMounted(() => {
      onResize();
      window.addEventListener('resize', onResize);
      update();
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', onResize);
    });

    watch(() => modelStore.state.models, update);

    return {
      addFilterTag,
      clearSearch,
      filterTags,
      getElementType,
      getIcon,
      modelStore,
      removeFilterTag,
      state,
      update,
    };
  },
});
</script>

<style>
.modelNavList .modelItem .action {
  display: none;
}

.modelNavList .modelItem:hover .action {
  display: block;
}

.modelNavList .modelItem .icon {
  display: flex;
  margin-bottom: 0;
}

.modelNavList .modelItem:hover .icon {
  display: none;
}
</style>
