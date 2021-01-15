<template>
  <div class="project-container" v-if="state.project">
    <v-app-bar app clipped-left clipped-right color="project" dark dense flat>
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
        <v-icon class="ma-2">mdi-brain</v-icon>
      </v-toolbar-title>

      <v-btn-toggle class="ma-2" group light mandatory v-model="state.modeIdx">
        <v-btn class="mx-0 px-6">
          <v-col>
            <v-row style="place-content: center;">
              <v-icon>$network</v-icon>
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
                  <v-icon>mdi-chart-line</v-icon>
                </v-row>
                <v-row style="place-content: center; font-size:10px">
                  Explorer
                </v-row>
              </v-col>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item>
              <v-list-item-icon>
                <v-icon v-text="'mdi-chart-scatter-plot'" />
              </v-list-item-icon>
              <v-list-item-title>
                abstract
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon v-text="'mdi-axis-arrow'" />
              </v-list-item-icon>
              <v-list-item-title>
                spatial
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn class="mx-0 px-6">
          <v-col>
            <v-row style="place-content: center;">
              <v-icon>mdi-eye-outline</v-icon>
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
      <div class="mx-4" style="width:176px">
        <v-row no-gutters>
          <v-col col="3">
            <v-btn
              :disabled="countBefore() <= 0"
              @click="state.project.network.oldest()"
              fab
              light
              small
            >
              <v-icon>mdi-page-first</v-icon>
            </v-btn>
          </v-col>

          <v-col col="3">
            <v-btn
              :disabled="countBefore() <= 0"
              @click="state.project.network.older()"
              fab
              light
              small
            >
              <v-badge
                :content="countBefore()"
                :value="countBefore()"
                color="project"
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
              fab
              light
              small
            >
              <v-badge
                :content="countAfter()"
                :value="countAfter()"
                color="project"
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
              fab
              light
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

      <v-btn @click="state.project.runSimulation()" outlined>
        <v-icon left>mdi-play</v-icon>
        Simulate
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      :mini-variant="!core.app.view.project.toolOpened"
      :width="core.app.view.project.toolMode === 'codeEditor' ? '568' : '377.6'"
      app
      clipped
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
              @click="
                core.app.view.project.toolOpened = !core.app.view.project
                  .toolOpened
              "
              title="Toggle navigation"
            >
              <v-list-item-icon>
                <v-icon
                  v-text="
                    'mdi-chevron-' +
                      (core.app.view.project.toolOpened ? 'right' : 'left')
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
                'v-list-item--active':
                  core.app.view.project.toolMode === tool.name &&
                  core.app.view.project.toolOpened,
              }"
              :key="tool.name"
              :title="tool.title"
              @click="onClick(tool.name)"
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

        <div
          style="width:100%; padding-right:48px"
          v-if="core.app.view.project.toolOpened"
        >
          <networkParamsSelect
            :network="state.project.network"
            v-if="core.app.view.project.toolMode === 'networkParamSelect'"
          />

          <NetworkParamsEdit
            :projectId="state.projectId"
            :network="state.project.network"
            v-if="core.app.view.project.toolMode === 'networkParamEdit'"
          />

          <SimulationCodeEditor
            :code="state.project.code"
            v-if="core.app.view.project.toolMode === 'codeEditor'"
          />
        </div>
      </v-row>
    </v-navigation-drawer>

    <v-main>
      <span style="position:absolute;" class="ma-1">
        {{ state.project.network.view.selectedNode }}
      </span>
      <NetworkGraph :projectId="state.projectId" v-if="state.modeIdx === 0" />

      <ActivityGraph
        :graph="state.project.activityGraph"
        v-if="state.modeIdx === 1"
      />
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

<script>
import Vue from 'vue';
import { reactive, watch, onMounted } from '@vue/composition-api';
import ActivityGraph from '@/components/activity/ActivityGraph.vue';
import NetworkParamsEdit from '@/components/network/NetworkParamsEdit.vue';
import NetworkParamsSelect from '@/components/network/NetworkParamsSelect.vue';
import NetworkGraph from '@/components/network/NetworkGraph.vue';
import SimulationCodeEditor from '@/components/simulation/SimulationCodeEditor.vue';
import core from '@/core/index';

export default Vue.extend({
  name: 'Project',
  components: {
    ActivityGraph,
    NetworkParamsEdit,
    NetworkParamsSelect,
    NetworkGraph,
    SimulationCodeEditor,
  },
  props: {
    id: String,
  },
  setup(props) {
    const state = reactive({
      projectId: props.id,
      project: null,
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
        },
        { icon: 'mdi-xml', name: 'codeEditor', title: 'Code' },
        { icon: 'mdi-chart-line', name: 'activityEdit', title: 'Activity' },
      ],
      modeIdx: 0,
    });

    const loadProject = id => {
      // console.log('Load project: ' + id);
      core.app.initProject(id).then(() => {
        state.project = core.app.project;
        state.project.network.view.reset();
      });
    };

    const onClick = tool => {
      state.project.app.view.setProjectTool(tool);
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

    onMounted(() => {
      loadProject(props.id);
    });

    watch(
      () => props.id,
      id => {
        state.projectId = id;
        loadProject(id);
      }
    );

    return { core, countBefore, countAfter, onClick, state };
  },
});
</script>
