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

      <v-btn-toggle dense group class="ma-2">
        <v-btn outlined text>
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>

        <v-btn outlined text>
          <v-icon>mdi-chart-line</v-icon>
        </v-btn>

        <v-btn outlined text>
          <v-icon>mdi-eye-outline</v-icon>
        </v-btn>
      </v-btn-toggle>

      <v-toolbar-title>
        {{ state.project.name }}
      </v-toolbar-title>

      <v-spacer />

      <div class="mx-4">
        <v-btn class="ma-1" outlined small text>
          <v-icon>mdi-page-first</v-icon>
        </v-btn>

        <v-btn class="ma-1" outlined small text>
          <v-badge offset-y="8" content="6">
            <v-icon>mdi-undo-variant</v-icon>
          </v-badge>
        </v-btn>

        <v-btn class="ma-1" outlined small text>
          <v-badge color="accent" offset-y="8" content="6">
            <v-icon>mdi-redo-variant</v-icon>
          </v-badge>
        </v-btn>

        <v-btn class="ma-1" outlined small text>
          <v-icon>mdi-page-last</v-icon>
        </v-btn>
      </div>

      <v-btn :loading="state.loading" @click="simulate" outlined>
        <v-icon>mdi-play</v-icon>
        Simulate
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      :mini-variant="state.miniVariant"
      app
      clipped
      mobile-breakpoint="56"
      permanent
      right
      :width="state.tool === 'simulationCodeEditor' ? '520' : '360'"
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
              @click="state.miniVariant = !state.miniVariant"
              title="Toggle navigation"
            >
              <v-list-item-icon>
                <v-icon
                  v-text="
                    'mdi-chevron-' + (state.miniVariant ? 'left' : 'right')
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
              :key="tool.id"
              :title="tool.title"
              v-for="tool in state.tools"
              @click="onClick(tool)"
            >
              <v-list-item-icon>
                <v-list-item-group
                  style="margin-top:-2px; text-align:center; width:100%; font-size: 7px"
                >
                  <v-icon small v-text="tool.icon" />
                  <div v-text="tool.title" />
                </v-list-item-group>
              </v-list-item-icon>
              <v-list-item-content />
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        <div style="width:100%; padding-right:56px" v-show="!state.miniVariant">
          <networkParamSelect
            :network="state.project.network"
            v-if="state.tool === 'networkParamSelect'"
          />
          <NetworkEdit
            :network="state.project.network"
            v-if="state.tool === 'networkEdit'"
          />
          <SimulationCodeEditor
            :code="state.project.code"
            v-if="state.tool === 'simulationCodeEditor'"
          />
        </div>
      </v-row>
    </v-navigation-drawer>

    <v-main>
      <NetworkGraph
        :projectId="state.project.id"
        :network="state.project.network"
      />
    </v-main>
  </div>
</template>

<script>
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';
import NetworkEdit from '@/components/network/NetworkEdit';
import NetworkParamSelect from '@/components/network/NetworkParamSelect';
import NetworkGraph from '@/components/network/NetworkGraph';
import SimulationCodeEditor from '@/components/simulation/SimulationCodeEditor';
import core from '@/core/index';

export default Vue.extend({
  name: 'Project',
  props: {
    id: String,
  },
  components: {
    NetworkEdit,
    NetworkParamSelect,
    NetworkGraph,
    SimulationCodeEditor,
  },
  setup(props) {
    const state = reactive({
      loading: false,
      miniVariant: false,
      project: null,
      tool: 'networkEdit',
      tools: [
        {
          icon: 'mdi-checkbox-marked-outline',
          name: 'networkParamSelect',
          title: 'Network',
        },
        { icon: 'mdi-tune', name: 'networkEdit', title: 'Network' },
        { icon: 'mdi-chart-line', name: 'activityEdit', title: 'Activity' },
        { icon: 'mdi-xml', name: 'simulationCodeEditor', title: 'Code' },
      ],
    });
    const loadProject = id => {
      core.app.initProject(id).then(() => {
        if (core.app.project) {
          state.project = core.app.project;
        }
      });
    };
    watch(
      () => props.id,
      id => {
        loadProject(id);
      }
    );
    const onClick = e => {
      state.tool = e.name;
    };
    const simulate = () => {
      state.loading = true;
      setTimeout(() => {
        state.loading = false;
      }, 2000);
    };
    loadProject(props.id);
    return { onClick, simulate, state };
  },
});
</script>
