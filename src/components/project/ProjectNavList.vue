<template>
  <div class="projects">
    <!-- <v-toolbar dense flat dark color="secondary">
      Projects
    </v-toolbar> -->

    <v-list dense class="pa-0">
      <v-list-item exact to="/project/">
        <v-list-item-icon>
          <v-icon left v-text="'mdi-plus'" />
        </v-list-item-icon>
        <v-list-item-title>
          New project
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <v-form>
      <v-container class="py-0" v-if="state.app.project" :key="state.projectId">
        <v-text-field
          clearable
          hide-details
          placeholder="Project name"
          title="Rename the current project"
          v-model="state.app.project.name"
        >
          <template v-slot:append-outer>
            <v-row>
              <v-btn
                @click="state.app.project.save()"
                class="mx-2"
                icon
                small
                title="Save the current project"
              >
                <v-icon v-text="'mdi-content-save-outline'" />
              </v-btn>
            </v-row>
          </template>
        </v-text-field>
      </v-container>
    </v-form>

    <v-form>
      <v-container class="py-0">
        <v-text-field
          clearable
          hide-details
          placeholder="Search project"
          prepend-inner-icon="mdi-magnify"
          v-model="state.app.view.project.searchTerm"
        />
      </v-container>
    </v-form>

    <v-list dense two-line>
      <v-list-item
        :key="project.id"
        :to="'/project/' + project.id"
        @click="state.projectId = project.id"
        v-for="project in state.app.view.filteredProjects"
      >
        <v-list-item-content>
          <v-list-item-title v-text="project.name" />
          <!-- <v-list-item-subtitle v-html="timeSince(project.createdAt)" /> -->
          <v-list-item-subtitle>
            {{ project.network.nodes.length }} nodes;
            {{ project.network.connections.length }} connections
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-icon v-if="!project.rev">
          <v-icon v-text="'mdi-flash-off'" />
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';
import core from '@/core/index';

export default Vue.extend({
  name: 'ProjectNavList',
  setup() {
    const state = reactive({
      app: core.app,
      projectId: '',
    });
    const timeSince = date => {
      const seconds = Math.floor((+new Date() - +new Date(date)) / 1000);
      if (seconds < 60) {
        return 'Just now';
      }
      const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
      };
      let counter;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0) {
          if (counter === 1) {
            return counter + ' ' + i + ' ago'; // singular (1 day ago)
          } else {
            return counter + ' ' + i + 's ago'; // plural (2 days ago)
          }
        }
      }
    };

    return {
      state,
    };
  },
});
</script>
