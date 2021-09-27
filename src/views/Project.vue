<template>
  <div class="project-container" v-if="state.project">
    <v-app-bar
      app
      class="no-print"
      clipped-right
      color="project"
      dark
      dense
      flat
    >
      <v-btn-toggle
        @change="updateProjectMode"
        group
        light
        mandatory
        style="margin-left: -16px"
        v-model="core.app.view.project.state.modeIdx"
      >
        <v-tooltip :open-delay="1000" bottom>
          <template #activator="{ on, attrs }">
            <v-btn class="mx-0 px-6" v-bind="attrs" v-on="on">
              <v-col>
                <v-row style="place-content: center">
                  <v-icon v-text="'$network'" />
                </v-row>
                <v-row
                  style="place-content: center; font-size: 10px"
                  v-text="'Editor'"
                />
              </v-col>
            </v-btn>
          </template>
          Construct network
        </v-tooltip>

        <v-menu offset-y open-on-hover>
          <template #activator="{ on, attrs }">
            <v-btn class="mx-0 px-6" v-bind="attrs" v-on="on">
              <v-col>
                <v-row style="place-content: center">
                  <ActivityGraphIcon
                    :project="state.project"
                    v-if="state.project.hasActivities"
                  />
                  <v-icon
                    class="rotate-90"
                    v-else
                    v-text="'mdi-border-style'"
                  />
                </v-row>
                <v-row
                  style="place-content: center; font-size: 10px"
                  v-text="'Explorer'"
                />
              </v-col>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item
              :disabled="!state.project.hasActivities"
              @click="selectActivityGraph('abstract')"
            >
              <v-list-item-icon>
                <ActivityGraphIcon
                  :project="state.project"
                  v-if="state.project.hasActivities"
                />
                <v-icon class="rotate-90" v-else v-text="'mdi-border-style'" />
              </v-list-item-icon>
              <v-list-item-title v-text="'abstract'" />
            </v-list-item>

            <v-list-item
              :disabled="!state.project.hasSpatialActivities"
              @click="selectActivityGraph('spatial')"
            >
              <v-list-item-icon>
                <v-icon v-text="'mdi-axis-arrow'" />
              </v-list-item-icon>
              <v-list-item-title v-text="'spatial'" />
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn class="mx-0 px-6">
          <v-col>
            <v-row style="place-content: center">
              <v-icon v-text="'mdi-book-open-outline'" />
            </v-row>
            <v-row
              style="place-content: center; font-size: 10px"
              v-text="'Lab book'"
            />
          </v-col>
        </v-btn>
      </v-btn-toggle>

      <v-spacer />
      <v-toolbar-title class="mx-2" v-text="state.project.name" />
      <v-spacer />

      <div class="mx-4" style="width: 144px">
        <v-row no-gutters>
          <v-col col="3">
            <v-btn
              :disabled="countBefore() <= 0"
              @click="state.project.network.oldest()"
              dark
              icon
              small
            >
              <v-icon v-text="'mdi-page-first'" />
            </v-btn>
          </v-col>

          <v-col col="3">
            <v-btn
              :disabled="countBefore() <= 0"
              @click="state.project.network.older()"
              dark
              icon
              small
            >
              <v-badge
                :content="countBefore()"
                :value="countBefore()"
                color="project darken-1"
                offset-y="8"
              >
                <v-icon v-text="'mdi-undo-variant'" />
              </v-badge>
            </v-btn>
          </v-col>

          <v-col col="3">
            <v-btn
              :disabled="countAfter() <= 0"
              @click="state.project.network.newer()"
              dark
              icon
              small
            >
              <v-badge
                :content="countAfter()"
                :value="countAfter()"
                color="project darken-1"
                offset-y="8"
              >
                <v-icon v-text="'mdi-redo-variant'" />
              </v-badge>
            </v-btn>
          </v-col>

          <v-col col="3">
            <v-btn
              :disabled="countAfter() <= 0"
              @click="state.project.network.newest()"
              dark
              icon
              small
            >
              <v-icon v-text="'mdi-page-last'" />
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <div @click="core.app.view.project.state.modeIdx = 1">
        <SimulationButton :project="state.project" />
      </div>
    </v-app-bar>

    <v-navigation-drawer
      :mini-variant="!core.app.view.project.state.toolOpened"
      :style="{ transition: state.resizing ? 'initial' : '' }"
      :width="
        core.app.view.project.state.tool !== undefined
          ? core.app.view.project.state.tool.width
          : 0
      "
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
        v-if="core.app.view.project.state.toolOpened"
      />
      <v-row class="fill-height ml-0" no-gutters>
        <v-navigation-drawer
          absolute
          mini-variant
          mobile-breakpoint="64"
          mini-variant-width="64"
          right
        >
          <!-- <v-list nav dense>
            <v-list-item
              @click="core.app.view.project.state.toolOpened = !core.app.view.project.state.toolOpened"
              title="Toggle navigation"
            >
              <v-list-item-icon>
                <v-icon
                  v-text="
                    'mdi-chevron-' + (core.app.view.project.state.toolOpened ? 'right' : 'left')
                  "
                />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="'Close'" />
              </v-list-item-content>
            </v-list-item>
          </v-list> -->

          <v-list nav>
            <v-list-item
              :class="{
                'v-list-item--active':
                  core.app.view.project.state.tool === tool &&
                  core.app.view.project.state.toolOpened,
              }"
              :key="tool.name"
              :title="tool.title"
              @click="selectTool(tool)"
              v-for="tool in core.app.view.project.tools"
              v-show="tool.devMode ? core.app.config.devMode : true"
            >
              <v-list-item-icon>
                <v-list-item-group class="nav-item-right">
                  <span v-if="tool.name !== 'activityEdit'">
                    <v-icon v-text="tool.icon" />
                  </span>
                  <span v-else>
                    <ActivityGraphIcon
                      :project="state.project"
                      :spatial="true"
                      v-if="state.project.hasActivities"
                    />
                    <v-icon
                      class="rotate-90"
                      v-else
                      v-text="'mdi-border-style'"
                    />
                  </span>
                  <div v-text="tool.title" />
                </v-list-item-group>
              </v-list-item-icon>
              <v-list-item-content />
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        <div
          style="width: 100%; padding-right: 64px"
          v-if="core.app.view.project.state.toolOpened"
        >
          <NetworkParamEdit
            :network="state.project.network"
            :projectId="state.projectId"
            v-if="core.app.view.project.state.tool.name === 'networkParamEdit'"
          />

          <SimulationKernel
            :simulation="state.project.simulation"
            v-if="core.app.view.project.state.tool.name === 'simulationKernel'"
          />

          <SimulationCodeEditor
            :code="state.project.code"
            v-if="core.app.view.project.state.tool.name === 'codeEditor'"
          />

          <ActivityChartController
            :graph="state.project.activityGraph"
            v-if="
              core.app.view.project.state.tool.name === 'activityEdit' &&
              core.app.view.project.state.activityGraph === 'abstract'
            "
          />

          <ActivityAnimationController
            :graph="state.project.activityGraph"
            v-if="
              core.app.view.project.state.tool.name === 'activityEdit' &&
              core.app.view.project.state.activityGraph === 'spatial'
            "
          />

          <ActivityStats
            :project="core.app.project"
            v-if="core.app.view.project.state.tool.name === 'activityStats'"
          />

          <v-card
            flat
            tile
            v-if="core.app.view.project.state.tool.name === 'dataJSON'"
          >
            <ProjectRawData :project="state.project" />
          </v-card>
        </div>
      </v-row>
    </v-navigation-drawer>

    <v-main>
      <transition name="fade">
        <div
          :style="{ height: state.networkGraphHeight }"
          ref="networkGraph"
          v-if="[0, 2].includes(core.app.view.project.state.modeIdx)"
        >
          <NetworkGraph :networkHash="state.project.network.hash" />
        </div>
      </transition>

      <transition name="fade">
        <ActivityGraph
          :codeHash="state.project.code.hash"
          :graph="state.project.activityGraph"
          :graphHash="state.project.activityGraph.codeHash"
          :projectId="state.projectId"
          :view="core.app.view.project.state.activityGraph"
          v-if="core.app.view.project.state.modeIdx === 1"
        />
      </transition>

      <transition name="fade">
        <ProjectLabBook
          :hash="state.project.network.hash"
          v-if="core.app.view.project.state.modeIdx === 2"
        />
      </transition>
    </v-main>

    <v-overlay
      :value="state.loading || state.project.simulation.running"
      :z-index="10"
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
import { reactive, watch, onMounted } from '@vue/composition-api';
import axios from 'axios';

import { Project } from '@/core/project/project';
import ActivityGraph from '@/components/activity/ActivityGraph.vue';
import ActivityGraphIcon from '@/components/activity/ActivityGraphIcon.vue';
import ActivityChartController from '@/components/activity/ActivityChartController.vue';
import ActivityAnimationController from '@/components/activity/ActivityAnimationController.vue';
import ActivityStats from '@/components/activity/ActivityStats.vue';
import core from '@/core';
import NetworkGraph from '@/components/network/NetworkGraph.vue';
import NetworkParamEdit from '@/components/network/NetworkParamEdit.vue';
import ProjectLabBook from '@/components/project/ProjectLabBook.vue';
import ProjectRawData from '@/components/project/ProjectRawData.vue';
import SimulationButton from '@/components/simulation/SimulationButton.vue';
import SimulationCodeEditor from '@/components/simulation/SimulationCodeEditor.vue';
import SimulationKernel from '@/components/simulation/SimulationKernel.vue';

export default Vue.extend({
  name: 'Project',
  components: {
    ActivityAnimationController,
    ActivityChartController,
    ActivityGraph,
    ActivityGraphIcon,
    ActivityStats,
    NetworkGraph,
    NetworkParamEdit,
    ProjectLabBook,
    ProjectRawData,
    SimulationButton,
    SimulationCodeEditor,
    SimulationKernel,
  },
  props: {
    id: String,
  },
  setup(props, { root }) {
    const state = reactive({
      error: false,
      loading: false,
      networkGraphHeight: 'calc(100vh - 48px)',
      projectId: props.id as string,
      project: undefined as Project | undefined,
      resizing: false,
      simulationMenu: {
        position: { x: 0, y: 0 },
        show: false,
      },
    });

    /**
     * Load project using query or projectId
     */
    const loadProject = () => {
      // console.log('Load project: ' + id);

      if (root.$route.query.from) {
        // http://localhost:8080/#/project/?from=https://raw.githubusercontent.com/babsey/nest-desktop/master/src/assets/projects/neuron-spike-response.json
        const url: string = root.$route.query.from as string;
        axios.get(url).then((response: any) => {
          const project = core.app.addProjectTemporary(response.data);
          root.$router.replace({ path: `/project/${project.id}` });
        });
      } else {
        state.loading = true;
        core.app.initProject(state.projectId).then(() => {
          state.project = core.app.project;
          if (state.project) {
            updateProjectMode();
            state.project.network.view.reset();
            core.app.view.project.state.activityGraph =
              state.project.network.view.hasPositions()
                ? core.app.view.project.state.activityGraph
                : 'abstract';
            state.loading = false;
            if (state.project.config.simulateAfterLoad) {
              state.project.runSimulation();
            }
          }
        });
      }
    };

    /**
     * Count networks before the current.
     */
    const countBefore = () => {
      return state.project.networkRevisionIdx;
    };

    /**
     * Count networks after the current.
     */
    const countAfter = () => {
      return (
        state.project.networkRevisions.length -
        state.project.networkRevisionIdx -
        1
      );
    };

    /**
     * Select view for activity graph.
     */
    const selectActivityGraph = (mode: string) => {
      core.app.view.project.state.activityGraph = mode;
      core.app.view.project.state.modeIdx = 1;
    };

    /**
     * Set height for network graph.
     */
    const resizeNetworkGraph = () => {
      state.networkGraphHeight =
        core.app.view.project.state.modeIdx === 2
          ? 'calc(30vh)'
          : 'calc(100vh - 48px)';
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 1);
    };

    /**
     * Update view mode of the project.
     */
    const updateProjectMode = () => {
      if ([0, 2].includes(core.app.view.project.state.modeIdx)) {
        core.app.view.project.state.toolOpened = core.app.view.project.state
          .toolOpened
          ? core.app.view.project.state.modeIdx !== 2
          : core.app.view.project.state.toolOpened;
        resizeNetworkGraph();
      }
    };

    /**
     * Select tool for this project.
     */
    const selectTool = (tool: any) => {
      core.app.view.project.state.toolOpened = core.app.view.project.state
        .toolOpened
        ? core.app.view.project.state.tool != tool
        : true;
      core.app.view.project.state.tool = tool;
    };

    /**
     * Handle mouse move on resizing.
     */
    const handleMouseMove = (e: MouseEvent) => {
      window.getSelection().removeAllRanges();
      const width = window.innerWidth - e.clientX;
      if (width >= core.app.view.project.state.tool['minWidth']) {
        core.app.view.project.state.tool['width'] = width;
        window.dispatchEvent(new Event('resize'));
      }
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
      state.projectId = props.id as string;
      loadProject();
    });

    watch(
      () => props.id,
      (id: string) => {
        state.projectId = id;
        loadProject();
      }
    );

    return {
      core,
      countAfter,
      countBefore,
      resizeSidebar,
      selectActivityGraph,
      selectTool,
      state,
      updateProjectMode,
    };
  },
});
</script>

<style>
.project-container .nav-item-right {
  text-align: center;
  width: 100%;
  font-size: 9px;
}

.project-container .resize-handle {
  cursor: ew-resize;
  height: 100vh;
  position: fixed;
  left: 0;
  width: 4px;
  z-index: 10;
}

.rotate-90 {
  transform: rotate(-90deg);
}
</style>
