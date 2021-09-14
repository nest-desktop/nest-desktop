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
import axios from 'axios';

import { App } from '@/core/app';
import { Model } from '@/core/model/model';
import { Project } from '@/core/project/project';
import ActivityGraph from '@/components/activity/ActivityGraph.vue';
import ParameterEdit from '@/components/parameter/ParameterEdit.vue';

import core from '@/core';

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
      modelId: '',
      model: undefined as Model | undefined,
      project: undefined as Project | undefined,
      params: {},
      paramList: [],
    });

    const initProject = () => {
      const data: any = require('@/assets/projects/neuron-spike-response.json');
      state.project = new Project(core.app as App, data);
    };

    const initModel = (id: string) => {
      state.project.activityGraph.emptyActivityGraph();
      state.modelId = id;
      state.model = core.app.getModel(state.modelId);
      getParamDefaults().then(() => {
        const elementType: string = state.params['element_type'];
        if (elementType !== 'neuron') {
          return;
        }
        const node = state.project.network.nodes[1];
        node.modelId = state.modelId;
        state.project.runSimulation();
      });
    };

    const getParamDefaults = () => {
      return new Promise((resolve, reject) => {
        state.model
          .fetchDefaults()
          .then((resp: any) => {
            state.params = JSON.parse(resp.responseText);
            state.paramList = Object.keys(state.params).map((param: string) => {
              return { id: param, value: state.params[param] };
            });
            resolve(true);
          })
          .catch(() => {
            reject(true);
          });
      });
    };

    const paramChange = () => {
      const node = state.project.network.nodes[1];
      node.params = state.model.params;
      node.params.forEach(param => (param.visible = true));
      node.nodeChanges();
      state.project.runSimulation();
    };

    onMounted(() => {
      initProject();
      initModel(props.id as string);
    });

    watch(
      () => props.id,
      (id: string) => {
        initModel(id as string);
      }
    );
    return { getParamDefaults, paramChange, state };
  },
});
</script>
