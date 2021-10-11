<template>
  <div class="modelView" v-if="modelView">
    <v-app-bar app class="no-print" clipped-right color="model" dark dense flat>
      <v-btn-toggle
        group
        light
        mandatory
        style="margin-left: -16px"
        v-model="modelView.modeIdx"
      >
        <v-tooltip :open-delay="1000" bottom>
          <template #activator="{ on, attrs }">
            <v-btn class="mx-0 px-6" v-bind="attrs" v-on="on">
              <v-col>
                <v-row style="place-content: center">
                  <v-icon v-text="'mdi-text-box-outline'" />
                </v-row>
                <v-row
                  style="place-content: center; font-size: 10px"
                  v-text="'Doc'"
                />
              </v-col>
            </v-btn>
          </template>
          View model documentation
        </v-tooltip>

        <!-- <v-tooltip :open-delay="1000" bottom>
          <template #activator="{ on, attrs }">
            <v-btn class="mx-0 px-6" v-bind="attrs" v-on="on">
              <v-col>
                <v-row style="place-content: center">
                  <v-icon v-text="'mdi-chart-line'" />
                </v-row>
                <v-row
                  style="place-content: center; font-size: 10px"
                  v-text="'Explorer'"
                />
              </v-col>
            </v-btn>
          </template>
          Explore model
        </v-tooltip> -->

        <v-menu :disabled="!modelView.isNeuron()" offset-y open-on-hover>
          <template #activator="{ on, attrs }">
            <v-btn
              :disabled="!modelView.isNeuron()"
              class="mx-0 px-6"
              v-bind="attrs"
              v-on="on"
            >
              <v-col>
                <v-row style="place-content: center">
                  <v-icon v-text="'mdi-chart-scatter-plot'" />
                </v-row>
                <v-row
                  style="place-content: center; font-size: 10px"
                  v-text="'Explorer'"
                />
              </v-col>
            </v-btn>
          </template>

          <v-list dense>
            <span>
              <v-list-item
                :key="project.id"
                @click="modelView.selectProject(project.id)"
                v-for="project in projects"
              >
                <v-list-item-icon>
                  <v-icon v-text="project.icon" />
                </v-list-item-icon>
                <v-list-item-title v-text="project.name" />
              </v-list-item>
            </span>
          </v-list>
        </v-menu>

        <v-tooltip :open-delay="1000" bottom>
          <template #activator="{ on, attrs }">
            <v-btn class="mx-0 px-6" v-bind="attrs" v-on="on">
              <v-col>
                <v-row style="place-content: center">
                  <v-icon v-text="'mdi-pencil'" />
                </v-row>
                <v-row
                  style="place-content: center; font-size: 10px"
                  v-text="'Editor'"
                />
              </v-col>
            </v-btn>
          </template>
          Edit model
        </v-tooltip>
      </v-btn-toggle>

      <v-spacer />
      <v-toolbar-title
        :key="modelView.state.model.label"
        class="pl-12"
        v-if="modelView.state.model"
        v-text="modelView.state.model.label || modelView.state.model.id"
      />
      <v-spacer />

      <div @click="modelView.modeIdx = 1">
        <SimulationButton
          :disabled="!modelView.isNeuron()"
          :project="modelView.state.project"
        />
      </div>
    </v-app-bar>

    <v-main>
      <v-navigation-drawer
        :mini-variant="!modelView.state.toolOpened"
        :width="modelView.state.tool ? modelView.state.tool.width : 0"
        app
        class="no-print"
        clipped
        mobile-breakpoint="64"
        mini-variant-width="64"
        permanent
        right
      >
        <v-row class="fill-height ml-0" no-gutters>
          <v-navigation-drawer
            absolute
            mini-variant
            mobile-breakpoint="64"
            mini-variant-width="64"
            right
          >
            <v-list nav>
              <v-list-item
                :class="{
                  'v-list-item--active':
                    modelView.state.tool === tool && modelView.state.toolOpened,
                }"
                :disabled="tool.disabled"
                :key="tool.name"
                :title="tool.title"
                @click="modelView.selectTool(tool)"
                v-for="tool in modelView.tools"
                v-show="tool.devMode ? modelView.app.config.devMode : true"
              >
                <v-list-item-icon>
                  <v-list-item-group class="nav-item-right">
                    <v-icon v-text="tool.icon" />
                    <div v-text="tool.title" />
                  </v-list-item-group>
                </v-list-item-icon>
                <v-list-item-content />
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <div
            style="width: 100%; padding-right: 64px"
            v-if="modelView.state.tool && modelView.state.toolOpened"
          >
            <transition name="fade">
              <v-card
                :key="modelView.state.defaults.model"
                flat
                v-if="
                  modelView.state.tool.name === 'modelParameterDefaults' &&
                  modelView.state.params
                "
              >
                <v-card-text class="pa-0">
                  <v-list dense>
                    <v-list-item
                      :key="param.id"
                      v-for="param in modelView.state.params"
                    >
                      {{ param.id }} <v-spacer /> {{ param.value }}
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </transition>

            <v-card
              flat
              v-if="
                modelView.state.tool.name === 'modelParameterInput' &&
                modelView.state.model
              "
            >
              <v-card-text v-if="modelView.state.model.params">
                <ParameterEdit
                  @change="modelView.updateProject()"
                  :key="param.id"
                  :param="param"
                  :value.sync="param.value"
                  v-for="param of modelView.state.model.params"
                />
              </v-card-text>
            </v-card>

            <SimulationCodeEditor
              :code="modelView.state.project.code"
              v-if="
                modelView.state.tool.name === 'modelSimulationCode' &&
                modelView.state.project
              "
            />
          </div>
        </v-row>
      </v-navigation-drawer>

      <transition name="fade">
        <ModelDocumentation
          :id="modelView.state.modelId"
          v-if="modelView.modeIdx === 0"
        />
      </transition>

      <transition name="fade">
        <ModelExplorer
          :id="modelView.state.modelId"
          :params="modelView.state.params"
          v-if="modelView.modeIdx === 1"
        />
      </transition>

      <transition name="fade">
        <ModelEditor
          :id="modelView.state.modelId"
          v-if="modelView.modeIdx === 2"
        />
      </transition>
    </v-main>

    <v-overlay :value="modelView.state.project.simulation.running">
      <v-progress-circular
        :size="70"
        :width="7"
        color="amber"
        dark
        indeterminate
      />
    </v-overlay>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, watch } from '@vue/composition-api';

import core from '@/core';
import ModelDocumentation from '@/components/model/ModelDocumentation.vue';
import ModelEditor from '@/components/model/ModelEditor.vue';
import ModelExplorer from '@/components/model/ModelExplorer.vue';
import ParameterEdit from '@/components/parameter/ParameterEdit.vue';
import SimulationButton from '@/components/simulation/SimulationButton.vue';
import SimulationCodeEditor from '@/components/simulation/SimulationCodeEditor.vue';

export default Vue.extend({
  name: 'Model',
  components: {
    ModelDocumentation,
    ModelEditor,
    ModelExplorer,
    ParameterEdit,
    SimulationButton,
    SimulationCodeEditor,
  },
  props: {
    id: String,
  },
  setup(props) {
    const modelView = core.app.modelView;
    const projects = [
      {
        id: 'model-step-current-up-down',
        name: 'step current (up/down)',
        icon: 'mdi-chart-line',
      },
      {
        id: 'model-current-steps',
        name: 'current steps',
        icon: 'mdi-chart-line',
      },
      {
        id: 'model-spikes-up-down',
        name: 'spikes (up/down)',
        icon: 'mdi-chart-line',
      },
      {
        id: 'model-regular-spikes-steps',
        name: 'regular spikes steps',
        icon: 'mdi-chart-line',
      },
      {
        id: 'model-poisson-spikes-steps',
        name: 'Poisson spikes steps',
        icon: 'mdi-chart-line',
      },
      {
        id: 'spike-activity',
        name: 'spike activity',
        icon: 'mdi-chart-scatter-plot',
      },
    ];

    /**
     * Update model view.
     */
    const update = (id: string) => {
      modelView.initModel(id);
    };

    onMounted(() => {
      modelView.resetTool();
      update(props.id as string);
    });

    watch(
      () => props.id,
      id => {
        update(id as string);
      }
    );
    return { modelView, projects };
  },
});
</script>

<style>
.modelView .nav-item-right {
  text-align: center;
  width: 100%;
  font-size: 9px;
}
</style>
