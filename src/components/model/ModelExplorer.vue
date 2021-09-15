<template>
  <div class="modelExplorer" v-if="state.model">
    <v-navigation-drawer
      :width="430 - 56"
      app
      class="no-print"
      clipped
      mobile-breakpoint="56"
      permanent
      right
    >
      <v-card flat>
        <v-card-title v-text="state.model.label || state.modelId" />
        <v-card-text>
          <span v-if="state.model.params.length > 0">
            <ParameterEdit
              :key="param.id"
              :param="param"
              :value.sync="param.value"
              @update:value="paramChange()"
              v-for="param of state.model.params"
            />
          </span>
          <span v-else>
            <v-list dense>
              <v-list-item :key="param.id" v-for="param in state.paramList">
                {{ param.id }} <v-spacer /> {{ param.value }}
              </v-list-item>
            </v-list>
          </span>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>
    <ActivityGraph
      :graph="state.project.activityGraph"
      view="abstract"
      v-if="state.project"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';

import { App } from '@/core/app';
import { Model } from '@/core/model/model';
import { Project } from '@/core/project/project';
import ActivityGraph from '@/components/activity/ActivityGraph.vue';
import ParameterEdit from '@/components/parameter/ParameterEdit.vue';

import core from '@/core';

/**
 * Model explorer shows activity of a neuron model.
 */
export default Vue.extend({
  name: 'ModelExplorer',
  components: {
    ActivityGraph,
    ParameterEdit,
  },
  props: {
    id: String,
  },
  setup(props) {
    const state = reactive({
      model: undefined as Model | undefined,
      modelId: '',
      paramList: [],
      params: {},
      project: undefined as Project | undefined,
      script: '',
    });

    const initProject = () => {
      const data: any = require('@/assets/projects/neuron-spike-response.json');
      state.project = new Project(core.app as App, data);
    };

    const initModel = () => {
      state.project.activityGraph.emptyActivityGraph();
      state.model = core.app.getModel(state.modelId);
      getParamDefaults();
    };

    const getParamDefaults = () => {
      state.model
        .fetchDefaults()
        .then((resp: any) => {
          const responseText = resp.responseText.replace(
            /(NaN|-?Infinity)/g,
            '"$1"'
          );
          state.params = JSON.parse(responseText);
          state.paramList = Object.keys(state.params).map((param: string) => {
            return { id: param, value: state.params[param] };
          });
          paramChange();
        })
        .catch(err => {
          console.log(err);
        });
    };

    const paramChange = () => {
      const elementType: string = state.params['element_type'];
      if (elementType !== 'neuron') {
        return;
      }
      const node = state.project.network.nodes[1];
      node.modelId = state.modelId;
      node.params = state.model.params;
      node.params.forEach(param => (param.visible = true));
      node.nodeChanges();
      state.script = state.project.code.script;
      state.project.runSimulation().then(() => {
        state.project.checkActivities();
      });
    };

    onMounted(() => {
      initProject();
      state.modelId = props.id as string;
      initModel();
    });

    watch(
      () => props.id,
      (id: string) => {
        state.modelId = id as string;
        initModel();
      }
    );
    return { getParamDefaults, paramChange, state };
  },
});
</script>
