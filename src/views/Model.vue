<template>
  <div class="modelView" v-if="modelView">
    <v-app-bar app class="no-print" clipped-right color="model" dark dense flat>
      <v-tabs
        :show-arrows="false"
        align-with-title
        color="secondary"
        icons-and-text
        style="flex: 0 1 auto; width: 278px"
        v-model="modelView.modeIdx"
      >
        <v-tooltip :open-delay="1000" bottom>
          <template #activator="{ on, attrs }">
            <v-tab class="ma-0" v-bind="attrs" v-on="on">
              <div class="tab-text" v-text="'Doc'" />
              <v-icon v-text="'mdi-text-box-outline'" />
            </v-tab>
          </template>
          View model documentation
        </v-tooltip>

        <v-menu :disabled="!modelView.isNeuron()" offset-y open-on-hover>
          <template #activator="{ on, attrs }">
            <v-tab :disabled="!modelView.isNeuron()" v-bind="attrs" v-on="on">
              <div class="tab-text" v-text="'Explorer'" />
              <v-icon v-text="'mdi-chart-scatter-plot'" />
            </v-tab>
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
            <v-tab v-bind="attrs" v-on="on">
              <div class="tab-text" v-text="'Editor'" />
              <v-icon v-text="'mdi-pencil'" />
            </v-tab>
          </template>
          Edit model
        </v-tooltip>
      </v-tabs>

      <v-spacer />
      <v-toolbar-title
        :key="modelView.state.model.label"
        class="mx-2"
        v-if="modelView.state.model"
        v-text="modelView.state.model.label || modelView.state.model.id"
      />
      <v-spacer />

      <div class="mx-4" style="width: 144px" />

      <div @click="modelView.modeIdx = 1" class="mx-1">
        <SimulationButton
          :disabled="!modelView.isNeuron()"
          :project="modelView.state.project"
        />
      </div>

      <v-card color="model" flat to="/settings">
        <div class="d-flex flex-column">
          <BackendStatus :backend="{ id: 'nestSimulator', text: 'NEST' }" />
        </div>
      </v-card>
    </v-app-bar>

    <v-navigation-drawer
      :mini-variant="!modelView.state.toolOpened"
      :style="{ transition: state.resizing ? 'initial' : '' }"
      :width="modelView.state.tool ? modelView.state.tool.width : 0"
      app
      class="no-print"
      clipped
      mobile-breakpoint="64"
      mini-variant-width="64"
      permanent
      right
    >
      <div
        @mousedown="resizeSidebar"
        class="resize-handle"
        v-if="modelView.state.toolOpened"
      />
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
          class="controller"
          style="padding-right: 64px; width: 100%"
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
            tile
            v-if="
              modelView.state.tool.name === 'modelParameterInput' &&
              modelView.state.model
            "
          >
            <v-card-text v-if="modelView.state.model.params">
              <ParameterEdit
                :key="param.id"
                :param="param"
                :value.sync="param.value"
                @update:value="modelView.updateProject()"
                v-for="param of modelView.state.model.params"
              />
            </v-card-text>
          </v-card>

          <SimulationCodeEditor
            :code="modelView.state.project.code"
            style="height: 100%"
            v-if="
              modelView.state.tool.name === 'modelSimulationCode' &&
              modelView.state.project
            "
          />
        </div>
      </v-row>
    </v-navigation-drawer>

    <v-main>
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

    <v-overlay
      :value="
        modelView.state.project.simulation.running &&
        !projectView.state.project.code.state.codeInsite
      "
    >
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
import { onMounted, reactive, watch } from '@vue/composition-api';

import BackendStatus from '@/components/BackendStatus.vue';
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
    BackendStatus,
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
    const modelView = core.app.model.view;
    const projectView = core.app.project.view;
    const state = reactive({
      resizing: false,
    });
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
        id: 'model-f-i-curve',
        name: 'F-I curve',
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

    /**
     * Handle mouse move on resizing.
     * @param e MouseEvent from which the x position is taken
     */
    const handleMouseMove = (e: MouseEvent) => {
      window.getSelection().removeAllRanges();
      const width = window.innerWidth - e.clientX;
      if (width === modelView.state.tool['minWidth']) {
        return;
      }
      modelView.state.tool['width'] =
        width > modelView.state.tool['minWidth']
          ? width
          : modelView.state.tool['minWidth'];
      window.dispatchEvent(new Event('resize'));
    };

    /**
     * Handle mouse up on resizing.
     */
    const handleMouseUp = () => {
      state.resizing = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.dispatchEvent(new Event('resize'));
    };

    /**
     * Resize sidebar.
     */
    const resizeSidebar = () => {
      state.resizing = true;
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
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
    return { modelView, projects, projectView, resizeSidebar, state };
  },
});
</script>

<style>
.modelView .controller {
  height: calc(100vh - 48px);
  overflow-y: hidden;
  padding-right: 64px;
  width: 100%;
}

.modelView .nav-item-right {
  font-size: 9px;
  text-align: center;
  width: 100%;
}

.modelView .resize-handle {
  cursor: ew-resize;
  height: 100vh;
  left: 0;
  position: fixed;
  width: 4px;
  z-index: 10;
}

.modelView .tab-text {
  font-size: 10px;
  margin-bottom: 2px !important;
}
</style>
