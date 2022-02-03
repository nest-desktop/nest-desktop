<template>
  <div class="models">
    <ModelMenu
      :model="state.modelMenu.model"
      :position="state.modelMenu.position"
      v-if="state.modelMenu.show"
    />

    <v-container class="py-0">
      <v-text-field
        @click:append="modelStore.clearSearch"
        clearable
        hide-details
        label="Search model"
        prepend-inner-icon="mdi-magnify"
        v-model="modelStore.state.searchTerm"
      >
        <template #prepend>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn depressed fab v-bind="attrs" v-on="on" x-small>
                <v-icon v-text="'mdi-filter-outline'" />
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item
                :key="index"
                @click="addFilterTag(tag.text.toLowerCase())"
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
        @click:close="removeFilterTag(tag.text.toLowerCase())"
        class="ma-1 mb-0"
        close
        small
        outlined
        v-if="modelStore.state.filterTags.includes(tag.text.toLowerCase())"
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
          modelStore.state.searchTerm
            ? model.includes(modelStore.state.searchTerm)
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
            v-show="modelStore.hasModel(model)"
            v-text="'mdi-database-outline'"
          />
          <v-icon
            right
            small
            v-show="modelStore.fileExistGithub(model)"
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
    const modelStore = core.app.model;
    const state = reactive({
      modelMenu: {
        model: undefined,
        position: { x: 0, y: 0 },
        show: false,
      },
      models: [],
    });

    const filterTags = [
      { icon: 'mdi-database-outline', text: 'Installed' },
      { icon: 'mdi-github', text: 'GitHub' },
      { icon: 'mdi-alpha-n-circle-outline', text: 'Neuron' },
      {
        icon: 'mdi-alpha-s-circle-outline',
        text: 'Stimulator',
      },
      {
        icon: 'mdi-alpha-r-circle-outline',
        text: 'Recorder',
      },
      { icon: 'mdi-alpha-s-circle', text: 'Synapse' },
    ];

    /**
     * Show model menu.
     */
    const showModelMenu = function (e: MouseEvent, model: string) {
      // https://thewebdev.info/2020/08/13/vuetify%E2%80%8A-%E2%80%8Amenus-and-context-menu/
      e.preventDefault();
      state.modelMenu.show = false;
      state.modelMenu.model = core.app.model.getModel(model);
      state.modelMenu.position.x = e.clientX;
      state.modelMenu.position.y = e.clientY;
      this.$nextTick(() => {
        state.modelMenu.show = true;
      });
    };

    /**
     * Add filter tag.
     */
    const addFilterTag = (tag: string) => {
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
     * Update models.
     */
    const update = () => {
      const filterTags: string[] = modelStore.state.filterTags;
      state.models =
        modelStore.state.modelsNEST ||
        modelStore.state.models.map((model: any) => model.id);

      if (filterTags.includes('installed')) {
        let models = modelStore.state.models.map((model: any) => model.id);
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
      modelStore,
      addFilterTag,
      filterTags,
      removeFilterTag,
      showModelMenu,
      state,
    };
  },
});
</script>
