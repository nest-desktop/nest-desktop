<template>
  <div class="projectView" v-if="projectView.state.project">
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
        @change="() => projectView.updateProjectMode()"
        group
        light
        mandatory
        style="margin-left: -16px"
        v-model="projectView.state.modeIdx"
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
                    :project="projectView.state.project"
                    v-if="projectView.state.project.hasActivities"
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
              :disabled="!projectView.state.project.hasActivities"
              @click="projectView.selectActivityGraph('abstract')"
            >
              <v-list-item-icon>
                <ActivityGraphIcon
                  :project="projectView.state.project"
                  fixed
                  v-if="projectView.state.project.hasActivities"
                />
                <v-icon class="rotate-90" v-else v-text="'mdi-border-style'" />
              </v-list-item-icon>
              <v-list-item-title v-text="'abstract'" />
            </v-list-item>

            <v-list-item
              :disabled="!projectView.state.project.hasSpatialActivities"
              @click="projectView.selectActivityGraph('spatial')"
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
      <v-toolbar-title class="mx-2" v-text="projectView.state.project.name" />
      <v-spacer />

      <div class="mx-4" style="width: 144px">
        <v-row no-gutters>
          <v-col col="3">
            <v-btn
              :disabled="projectView.countBefore() <= 0"
              @click="projectView.state.project.network.oldest()"
              dark
              icon
              small
            >
              <v-icon v-text="'mdi-page-first'" />
            </v-btn>
          </v-col>

          <v-col col="3">
            <v-btn
              :disabled="projectView.countBefore() <= 0"
              @click="projectView.state.project.network.older()"
              dark
              icon
              small
            >
              <v-badge
                :content="projectView.countBefore()"
                :value="projectView.countBefore()"
                color="project darken-1"
                offset-y="8"
              >
                <v-icon v-text="'mdi-undo-variant'" />
              </v-badge>
            </v-btn>
          </v-col>

          <v-col col="3">
            <v-btn
              :disabled="projectView.countAfter() <= 0"
              @click="projectView.state.project.network.newer()"
              dark
              icon
              small
            >
              <v-badge
                :content="projectView.countAfter()"
                :value="projectView.countAfter()"
                color="project darken-1"
                offset-y="8"
              >
                <v-icon v-text="'mdi-redo-variant'" />
              </v-badge>
            </v-btn>
          </v-col>

          <v-col col="3">
            <v-btn
              :disabled="projectView.countAfter() <= 0"
              @click="projectView.state.project.network.newest()"
              dark
              icon
              small
            >
              <v-icon v-text="'mdi-page-last'" />
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <div @click="projectView.state.modeIdx = 1">
        <SimulationButton :project="projectView.state.project" />
      </div>
    </v-app-bar>

    <v-navigation-drawer
      :mini-variant="!projectView.state.toolOpened"
      :style="{ transition: state.resizing ? 'initial' : '' }"
      :width="
        projectView.state.tool !== undefined ? projectView.state.tool.width : 0
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
        v-if="projectView.state.toolOpened"
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
              @click="projectView.state.toolOpened = !projectView.state.toolOpened"
              title="Toggle navigation"
            >
              <v-list-item-icon>
                <v-icon
                  v-text="
                    'mdi-chevron-' + (projectView.state.toolOpened ? 'right' : 'left')
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
                  projectView.state.tool === tool &&
                  projectView.state.toolOpened,
              }"
              :key="tool.name"
              :title="tool.title"
              @click="projectView.selectTool(tool)"
              v-for="tool in projectView.tools"
              v-show="tool.devMode ? appView.app.config.devMode : true"
            >
              <v-list-item-icon>
                <v-list-item-group class="nav-item-right">
                  <span v-if="tool.name !== 'activityEdit'">
                    <v-icon v-text="tool.icon" />
                  </span>
                  <span v-else>
                    <ActivityGraphIcon
                      :project="projectView.state.project"
                      v-if="projectView.state.project.hasActivities"
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
          v-if="projectView.state.toolOpened"
        >
          <NetworkParamEdit
            :network="projectView.state.project.network"
            :projectId="projectView.state.projectId"
            v-if="projectView.state.tool.name === 'networkParamEdit'"
          />

          <SimulationKernel
            :simulation="projectView.state.project.simulation"
            v-if="projectView.state.tool.name === 'simulationKernel'"
          />

          <SimulationCodeEditor
            :code="projectView.state.project.code"
            v-if="projectView.state.tool.name === 'codeEditor'"
          />

          <ActivityChartController
            :graph="projectView.state.project.activityGraph"
            v-if="
              projectView.state.tool.name === 'activityEdit' &&
              projectView.state.activityGraph === 'abstract'
            "
          />

          <ActivityAnimationController
            :graph="projectView.state.project.activityGraph"
            v-if="
              projectView.state.tool.name === 'activityEdit' &&
              projectView.state.activityGraph === 'spatial'
            "
          />

          <ActivityStats
            :project="projectView.state.project"
            v-if="projectView.state.tool.name === 'activityStats'"
          />

          <v-card flat tile v-if="projectView.state.tool.name === 'dataJSON'">
            <ProjectRawData :project="projectView.state.project" />
          </v-card>
        </div>
      </v-row>
    </v-navigation-drawer>

    <v-main>
      <transition name="fade">
        <div
          :style="{ height: projectView.state.networkGraphHeight }"
          ref="networkGraph"
          v-if="[0, 2].includes(projectView.state.modeIdx)"
        >
          <NetworkEditor
            :networkHash="projectView.state.project.network.hash"
          />
        </div>
      </transition>

      <transition name="fade">
        <ActivityGraph
          :codeHash="projectView.state.project.code.hash"
          :graph="projectView.state.project.activityGraph"
          :graphHash="projectView.state.project.activityGraph.codeHash"
          :view="projectView.state.activityGraph"
          v-if="projectView.state.modeIdx === 1"
        />
      </transition>

      <transition name="fade">
        <ProjectLabBook v-if="projectView.state.modeIdx === 2" />
      </transition>
    </v-main>

    <v-overlay
      :value="state.loading || projectView.state.project.simulation.running"
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

import ActivityGraph from '@/components/activity/ActivityGraph.vue';
import ActivityGraphIcon from '@/components/activity/ActivityGraphIcon.vue';
import ActivityChartController from '@/components/activity/ActivityChartController.vue';
import ActivityAnimationController from '@/components/activity/ActivityAnimationController.vue';
import ActivityStats from '@/components/activity/ActivityStats.vue';
import core from '@/core';
import NetworkEditor from '@/components/network/NetworkEditor.vue';
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
    NetworkEditor,
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
    const appView = core.app.view;
    const projectView = core.app.projectView;
    const state = reactive({
      error: false,
      loading: false,
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
          const project = appView.addProjectTemporary(response.data);
          root.$router.replace({ path: `/project/${project.id}` });
        });
      } else {
        state.loading = true;
        projectView.init().then(() => {
          state.loading = false;
        });
      }
    };

    /**
     * Handle mouse move on resizing.
     * @param e MouseEvent from which the x position is taken
     */
    const handleMouseMove = (e: MouseEvent) => {
      window.getSelection().removeAllRanges();
      const width = window.innerWidth - e.clientX;
      if (width === projectView.state.tool['minWidth']) {
        return;
      }
      projectView.state.tool['width'] =
        width > projectView.state.tool['minWidth']
          ? width
          : projectView.state.tool['minWidth'];
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
      projectView.state.projectId = props.id as string;
      loadProject();
    });

    watch(
      () => props.id,
      (id: string) => {
        projectView.state.projectId = id;
        loadProject();
      }
    );

    return {
      appView,
      projectView,
      resizeSidebar,
      state,
    };
  },
});
</script>

<style>
.projectView .nav-item-right {
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
