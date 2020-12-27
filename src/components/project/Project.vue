<template>
  <div class="projectx">
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
        {{ state.projectName }}
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

    <NetworkGraph
      v-if="state.projectId.length > 0"
      :projectId="state.projectId"
    />

    <v-navigation-drawer
      app
      clipped
      mini-variant
      mobile-breakpoint="56"
      permament
      right
    >
      <v-list nav>
        <v-list-item
          :key="tool.id"
          :title="tool.title"
          v-for="tool in state.tools"
          @click="onClick"
        >
          <v-list-item-icon>
            <v-list-item-group style="margin-top:-5px">
              <v-icon v-text="tool.icon" />
              <div style="font-size:7px">{{ tool.title }}</div>
            </v-list-item-group>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="tool.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import Vue from "vue";
import { reactive, watch } from "@vue/composition-api";
import NetworkGraph from "@/components/network/NetworkGraph";
import core from "@/core/index";

export default Vue.extend({
  name: "Project",
  props: {
    id: String
  },
  components: {
    NetworkGraph
  },
  setup(props) {
    const state = reactive({
      tools: [
        { icon: "fa-project-diagram", name: "network", title: "Network" },
        { icon: "fa-chart-line", name: "activity", title: "Activity" },
        { icon: "mdi-xml", name: "code", title: "Code" }
      ],
      projectName: "",
      projectId: "",
      loading: false,
    });
    const loadProject = id => {
      core.app.initProject(id).then(() => {
        if (core.app.project) {
          state.projectId = core.app.project.id;
          state.projectName = core.app.project.name;
        }
      });
    };
    watch(
      () => props.id,
      id => {
        loadProject(id);
      }
    );
    const onClick = () => {
      console.log("bla bla");
    };
    const simulate = () => {
      state.loading = true
      setTimeout(() => {state.loading = false}, 2000)
    }
    loadProject(props.id);
    return { onClick, simulate, state };
  }
});
</script>
