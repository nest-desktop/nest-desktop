<template>
  <div class="projects">
    <!-- <v-toolbar dense flat dark color="secondary">
      Projects
    </v-toolbar> -->

    <v-list dense class="pa-0">
      <v-list-item to="/project/new">
        <v-list-item-icon>
          <v-icon>mdi-plus</v-icon>
        </v-list-item-icon>
        New project
      </v-list-item>
    </v-list>

    <v-form>
      <v-container class="py-0">
        <v-text-field
          clearable
          hide-details
          label="Search project"
          prepend-inner-icon="mdi-magnify"
        />
      </v-container>
    </v-form>

    <v-list dense two-line>
      <v-list-item
        :key="project.id"
        :to="'/project/' + project.id"
        v-for="project in core.app.projects"
      >
        <v-list-item-content>
          <v-list-item-title v-text="project.name" />
          <!-- <v-list-item-subtitle v-html="timeSince(project.createdAt)" /> -->
          <v-list-item-subtitle>
            {{ project.network.nodes.length }} nodes;
            {{ project.network.connections.length }} connections
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import Vue from 'vue';
import core from '@/core/index';

export default Vue.extend({
  name: 'ProjectNavList',
  setup() {
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
      core,
      timeSince,
    };
  },
});
</script>
