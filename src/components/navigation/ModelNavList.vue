<template>
  <div class="models">
    <ModelMenu
      :model="state.modelMenu.model"
      :position="state.modelMenu.position"
      v-if="state.modelMenu.show"
    />

    <v-container class="py-0">
      <v-text-field
        @click:append="clearSearch"
        clearable
        hide-details
        label="Search model"
        prepend-inner-icon="mdi-magnify"
        v-model="appView.state.model.searchTerm"
      >
        <template #prepend>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="model lighten-1"
                dark
                depressed
                fab
                x-small
                v-bind="attrs"
                v-on="on"
              >
                <v-icon v-text="'mdi-filter-outline'" />
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item
                :key="index"
                @click="addFilterTag(tag.value)"
                v-for="(tag, index) in filterTags"
              >
                <v-list-item-title>
                  <v-icon left v-text="tag.icon" />
                  {{ tag.text }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-text-field>
    </v-container>

    <span :key="index" v-for="(tag, index) of filterTags">
      <v-chip
        @click:close="removeFilterTag(tag.value)"
        class="ma-1 mb-0"
        close
        small
        outlined
        v-if="appView.state.model.filterTags.includes(tag.value)"
      >
        <v-icon left small v-text="tag.icon" />
        {{ tag.text }}
      </v-chip>
    </span>

    <v-subheader
      class="my-0 py-0"
      style="font-size: 12px; height: 16px"
      v-text="state.models.length + ' models'"
    />

    <v-list class="pt-0" dense style="fontsize: 14px">
      <v-list-item
        :key="model"
        :title="model"
        :to="'/model/' + model"
        @contextmenu="e => showModelMenu(e, model)"
        v-for="model in state.models"
        v-show="
          appView.state.model.searchTerm
            ? model.includes(appView.state.model.searchTerm)
            : true
        "
      >
        <v-list-item-content>
          <v-list-item-title v-text="model" />
        </v-list-item-content>

        <v-list-item-icon>
          <v-icon
            right
            small
            v-show="appView.hasModel(model)"
            v-text="'mdi-database-outline'"
          />
          <v-icon
            right
            small
            v-show="fileExistGithub(model)"
            v-text="'mdi-github'"
          />
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, onMounted } from '@vue/composition-api';

import core from '@/core';
import ModelMenu from '@/components/model/ModelMenu.vue';

export default Vue.extend({
  name: 'Models',
  components: {
    ModelMenu,
  },
  setup() {
    const appView = core.app.view;
    const state = reactive({
      modelMenu: {
        model: undefined,
        position: { x: 0, y: 0 },
        show: false,
      },
      models: [],
    });

    const filterTags = [
      { icon: 'mdi-database-outline', text: 'Installed', value: 'installed' },
      // { text: 'NEST', value: 'nest' },
      { icon: 'mdi-github', text: 'GitHub', value: 'github' },
      { icon: 'mdi-alpha-n-circle-outline', text: 'Neuron', value: 'neuron' },
      {
        icon: 'mdi-alpha-s-circle-outline',
        text: 'Stimulator',
        value: 'stimulator',
      },
      {
        icon: 'mdi-alpha-r-circle-outline',
        text: 'Recorder',
        value: 'recorder',
      },
      { icon: 'mdi-alpha-s-circle', text: 'Synapse', value: 'synapse' },
    ];

    /**
     * Show model menu.
     */
    const showModelMenu = function (e: MouseEvent, model: string) {
      // https://thewebdev.info/2020/08/13/vuetify%E2%80%8A-%E2%80%8Amenus-and-context-menu/
      e.preventDefault();
      state.modelMenu.show = false;
      state.modelMenu.model = appView.getModel(model);
      state.modelMenu.position.x = e.clientX;
      state.modelMenu.position.y = e.clientY;
      this.$nextTick(() => {
        state.modelMenu.show = true;
      });
    };

    /**
     * Clear search term.
     */
    const clearSearch = () => {
      appView.state.model.searchTerm = '';
    };

    /**
     * Check if file exists on
     */
    const fileExistGithub = (model: string) => {
      return appView.state.model.filesGithub.some((file: string) =>
        file.includes('/' + model)
      );
    };

    /**
     * Add filter tag.
     */
    const addFilterTag = (tag: string) => {
      appView.state.model.filterTags.push(tag);
      update();
    };

    /**
     * Remove filter tag.
     */
    const removeFilterTag = (tag: string) => {
      appView.state.model.filterTags.splice(
        appView.state.model.filterTags.indexOf(tag),
        1
      );
      appView.state.model.filterTags = [...appView.state.model.filterTags];
      update();
    };

    /**
     * Check if model is a neuron.
     */
    const isNeuron = (model: string) =>
      model.startsWith('aiaf') ||
      model.startsWith('gif') ||
      model.startsWith('hh') ||
      model.startsWith('iaf') ||
      model.includes('izhikevich') ||
      model.includes('_cond_') ||
      model.includes('_psc_') ||
      model.includes('_neuron');

    /**
     * Check if model is a recorder.
     */
    const isRecorder = (model: string) =>
      model.endsWith('_detector') ||
      model.endsWith('_recorder') ||
      model.endsWith('meter');

    /**
     * Check if model is a stimulator.
     */
    const isStimulator = (model: string) =>
      model.endsWith('_dilutor') || model.includes('_generator');

    /**
     * Check if model is a synapse.
     */
    const isSynapse = (model: string) =>
      model.endsWith('gap_junction') || model.endsWith('_synapse');

    /**
     * Update models
     */
    const update = () => {
      const filterTags: string[] = appView.state.model.filterTags;
      if (filterTags.includes('installed')) {
        state.models = appView.state.models.map((model: any) => model.id);
      } else if (filterTags.includes('github')) {
        state.models = appView.state.model.filesGithub.map(
          (model: string) => model.split('.json')[0].split('/')[1]
        );
      } else {
        state.models = appView.state.model.modelsNEST;
      }

      if (
        filterTags.includes('neuron') ||
        filterTags.includes('recorder') ||
        filterTags.includes('stimulator') ||
        filterTags.includes('synapse')
      ) {
        let models = [];
        if (filterTags.includes('neuron')) {
          models = models.concat(
            state.models.filter((model: string) => isNeuron(model))
          );
        }
        if (filterTags.includes('recorder')) {
          models = models.concat(
            state.models.filter((model: string) => isRecorder(model))
          );
        }
        if (filterTags.includes('stimulator')) {
          models = models.concat(
            state.models.filter((model: string) => isStimulator(model))
          );
        }
        if (filterTags.includes('synapse')) {
          models = models.concat(
            state.models.filter((model: string) => isSynapse(model))
          );
        }
        models.sort();
        state.models = models;
      }
    };

    onMounted(() => {
      update();
    });

    return {
      appView,
      addFilterTag,
      clearSearch,
      fileExistGithub,
      filterTags,
      removeFilterTag,
      showModelMenu,
      state,
    };
  },
});
</script>
