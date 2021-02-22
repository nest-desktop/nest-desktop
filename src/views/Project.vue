<template>
  <div class="project-container" v-if="state.project">
    <SimulationMenu
      :simulation="state.project.simulation"
      :position="state.simulationMenu.position"
      v-if="state.simulationMenu.show"
    />

    <v-app-bar
      app
      class="no-print"
      clipped-left
      clipped-right
      color="project"
      dark
      dense
      flat
    >
      <!-- <v-tabs hide-slider optional style="max-width:270px">
        <v-tab>
          <v-icon color="accent" large>mdi-brain</v-icon>
          <v-icon style="position:absolute; bottom: 5px; right: 15px"
            >mdi-pen</v-icon
          >
        </v-tab>
        <v-tab>
          <v-icon color="accent" large>mdi-brain</v-icon>
          <v-icon style="position:absolute; bottom: 5px; right: 15px"
            >mdi-play</v-icon
          ></v-tab
        >
        <v-tab>
          <v-icon color="accent" large>mdi-brain</v-icon>
          <v-icon style="position:absolute; bottom: 5px; right: 15px"
            >mdi-eye</v-icon
          ></v-tab
        >
      </v-tabs> -->

      <v-toolbar-title>
        <v-icon class="ma-2" v-text="'mdi-brain'" />
      </v-toolbar-title>

      <v-btn-toggle
        :value="state.modeIdx"
        @change="e => selectMode(e)"
        class="ma-2"
        group
        light
        mandatory
      >
        <v-btn class="mx-0 px-6">
          <v-col>
            <v-row style="place-content: center;">
              <v-icon v-text="'$network'" />
            </v-row>
            <v-row style="place-content: center; font-size:10px">
              Editor
            </v-row>
          </v-col>
        </v-btn>

        <v-menu open-on-hover offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" class="mx-0 px-6">
              <v-col>
                <v-row style="place-content: center;">
                  <v-icon v-text="'mdi-chart-scatter-plot'" />
                </v-row>
                <v-row style="place-content: center; font-size:10px">
                  Explorer
                </v-row>
              </v-col>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item
              :disabled="!state.project.hasActivities"
              @click="selectActivityGraph('abstract')"
            >
              <v-list-item-icon>
                <v-icon v-text="'mdi-chart-scatter-plot'" />
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
            <v-row style="place-content: center;">
              <v-icon v-text="'mdi-book-open-outline'" />
            </v-row>
            <v-row style="place-content: center; font-size:10px">
              Lab book
            </v-row>
          </v-col>
        </v-btn>
      </v-btn-toggle>

      <v-toolbar-title>
        {{ state.project.name }}
      </v-toolbar-title>

      <v-spacer />
      <div class="mx-4" style="width:144px">
        <v-row no-gutters>
          <v-col col="3">
            <v-btn
              :disabled="countBefore() <= 0"
              @click="state.project.network.oldest()"
              dark
              icon
              small
            >
              <v-icon>mdi-page-first</v-icon>
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
                <v-icon>mdi-undo-variant</v-icon>
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
                <v-icon>mdi-redo-variant</v-icon>
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
              <v-icon>mdi-page-last</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <v-chip
        class="mx-2"
        outlined
        small
        v-text="state.project.network.hash.slice(0, 6)"
      />

      <v-btn
        @click="simulate"
        @contextmenu="e => showSimulationMenu(e)"
        outlined
      >
        <v-icon left>mdi-play</v-icon>
        Simulate
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      :mini-variant="!state.toolOpened"
      :width="state.tool.width"
      app
      class="no-print"
      clipped
      floating
      mobile-breakpoint="56"
      permanent
      right
    >
      <v-row class="fill-height ml-0" no-gutters>
        <v-navigation-drawer
          absolute
          mini-variant
          mobile-breakpoint="56"
          mini-variant-width="56"
          right
        >
          <v-list nav dense>
            <v-list-item
              @click="state.toolOpened = !state.toolOpened"
              title="Toggle navigation"
            >
              <v-list-item-icon>
                <v-icon
                  v-text="
                    'mdi-chevron-' + (state.toolOpened ? 'right' : 'left')
                  "
                />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="'Close'" />
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-list dense nav>
            <v-list-item
              :class="{
                'v-list-item--active': state.tool === tool && state.toolOpened,
              }"
              :key="tool.name"
              :title="tool.title"
              @click="selectTool(tool)"
              v-for="tool in state.tools"
            >
              <v-list-item-icon>
                <v-list-item-group
                  style="text-align:center; width:100%; font-size: 7px"
                >
                  <v-icon small v-text="tool.icon" />
                  <div v-text="tool.title" />
                </v-list-item-group>
              </v-list-item-icon>
              <v-list-item-content />
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        <div style="width:100%; padding-right:56px" v-if="state.toolOpened">
          <networkParamsSelect
            :network="state.project.network"
            v-if="state.tool.name === 'networkParamSelect'"
          />

          <NetworkParamsEdit
            :network="state.project.network"
            :projectId="state.projectId"
            v-if="state.tool.name === 'networkParamEdit'"
          />

          <SimulationKernel
            :simulation="state.project.simulation"
            v-if="core.app.view.project.toolMode === 'simulationKernel'"
          />

          <SimulationCodeEditor
            :code="state.project.code"
            v-if="state.tool.name === 'codeEditor'"
          />

          <ActivityGraphController
            :graph="state.project.activityGraph"
            :projectId="state.project.id"
            :view="state.activityGraph"
            v-if="state.tool.name === 'activityEdit'"
          />

          <span v-if="state.tool.name === 'activityStats'">
            <ActivityStats :project="core.app.project" />
          </span>
        </div>
      </v-row>
    </v-navigation-drawer>

    <v-main>
      <div style="position:absolute; right: 0; z-index:1000; cursor: pointer">
        <v-alert
          :max-width="500"
          @click="state.error = false"
          dark
          class="ma-1"
          color="orange darken-3"
          dense
          icon="mdi-fire"
          transition="slide-x-reverse-transition"
          v-model="state.error"
          v-text="state.project.errorMessage"
        />
      </div>

      <transition name="fade">
        <div
          :style="{ height: state.networkGraphHeight }"
          v-if="[0, 2].includes(state.modeIdx)"
        >
          <NetworkGraph :projectId="state.projectId" />
        </div>
      </transition>

      <transition name="fade">
        <ActivityGraph
          :graph="state.project.activityGraph"
          :projectId="state.projectId"
          :view="state.activityGraph"
          v-if="state.modeIdx === 1"
        />
      </transition>

      <transition name="fade">
        <LabBook
          :hash="state.project.network.hash"
          v-if="state.modeIdx === 2"
        />
      </transition>
    </v-main>

    <v-overlay :value="state.project.simulation.running">
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
import ActivityGraphController from '@/components/activity/ActivityGraphController.vue';
import ActivityStats from '@/components/activity/ActivityStats.vue';
import core from '@/core/index';
import LabBook from '@/components/network/LabBook.vue';
import NetworkGraph from '@/components/network/NetworkGraph.vue';
import NetworkParamsEdit from '@/components/network/NetworkParamsEdit.vue';
import NetworkParamsSelect from '@/components/network/NetworkParamsSelect.vue';
import SimulationCodeEditor from '@/components/simulation/SimulationCodeEditor.vue';
import SimulationKernel from '@/components/simulation/SimulationKernel.vue';
import SimulationMenu from '@/components/simulation/SimulationMenu.vue';

export default Vue.extend({
  name: 'Project',
  components: {
    ActivityGraph,
    ActivityGraphController,
    ActivityStats,
    LabBook,
    NetworkParamsEdit,
    NetworkParamsSelect,
    NetworkGraph,
    SimulationCodeEditor,
    SimulationKernel,
    SimulationMenu,
  },
  props: {
    id: String,
  },
  setup(props, { root }) {
    const state = reactive({
      activityGraph: 'abstract',
      error: false,
      modeIdx: 0,
      networkGraphHeight: 'calc(100vh - 48px)',
      projectId: props.id as string,
      project: undefined as Project | undefined,
      simulationMenu: {
        position: { x: 0, y: 0 },
        show: false,
      },
      toolOpened: false,
      tool: undefined,
      tools: [
        // {
        //   icon: '$network',
        //   name: 'networkParamSelect',
        //   title: 'Network',
        // },
        {
          icon: '$network',
          name: 'networkParamEdit',
          title: 'Network',
          width: '378',
        },
        {
          icon: 'mdi-engine-outline',
          name: 'simulationKernel',
          title: 'Kernel',
        },
        { icon: 'mdi-xml', name: 'codeEditor', title: 'Code', width: '568' },
        {
          icon: 'mdi-chart-scatter-plot',
          name: 'activityEdit',
          title: 'Activity',
          width: '378',
        },
        {
          icon: 'mdi-table-large',
          name: 'activityStats',
          title: 'Statistics',
          width: '500',
        },
      ],
    });

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
        core.app.initProject(state.projectId).then(() => {
          state.project = core.app.project;
          if (state.project) {
            state.project.network.view.reset();
          }
        });
      }
    };

    const countBefore = () => {
      return state.project.networkRevisionIdx;
    };

    const countAfter = () => {
      return (
        state.project.networkRevisions.length -
        state.project.networkRevisionIdx -
        1
      );
    };

    const selectActivityGraph = (mode: string) => {
      state.activityGraph = mode;
      state.modeIdx = 1;
    };

    const selectMode = (modeIdx: number) => {
      if ([0, 2].includes(modeIdx)) {
        state.toolOpened = state.toolOpened ? modeIdx != 2 : state.toolOpened;
        state.networkGraphHeight =
          modeIdx == 2 ? 'calc(30vh)' : 'calc(100vh - 48px)';
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 1);
      }
      setTimeout(() => {
        state.modeIdx = modeIdx;
      }, 10);
    };

    const selectTool = (tool: any) => {
      state.toolOpened = state.toolOpened ? state.tool != tool : true;
      state.tool = tool;
    };

    const reset = () => {
      state.modeIdx = 0;
      state.activityGraph = 'abstract';
      state.toolOpened = false;
      state.tool = state.tools[0];
    };

    const showSimulationMenu = function(e) {
      // https://thewebdev.info/2020/08/13/vuetify%E2%80%8A-%E2%80%8Amenus-and-context-menu/
      e.preventDefault();
      state.simulationMenu.show = false;
      state.simulationMenu.position.x = e.clientX;
      state.simulationMenu.position.y = e.clientY;
      this.$nextTick(() => {
        state.simulationMenu.show = true;
      });
    };

    const simulate = () => {
      state.error = false;
      state.project.runSimulation().then(resp => {
        switch (resp.status) {
          case 0:
            state.project.errorMessage =
              'NEST Server not found. See NEST Desktop documentation for details.';
            state.error = true;
            break;
          case 200:
            state.modeIdx = 1;
            state.error = false;
            break;
          case 400:
            state.error = true;
            break;
        }
      });
    };

    onMounted(() => {
      reset();
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
      selectActivityGraph,
      selectMode,
      selectTool,
      showSimulationMenu,
      simulate,
      state,
    };
  },
});
</script>
