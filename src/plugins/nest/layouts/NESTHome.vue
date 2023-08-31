<template>
  <v-container>
    <v-card class="ma-auto" width="400">
      <v-card-title class="text-center">
        <v-img :src="nestLogo" />
      </v-card-title>

      <v-list lines="two" nav>
        <v-list-item to="/nest/project">
          <template #prepend>
            <v-icon icon="mdi-plus" />
          </template>
          New project
        </v-list-item>
        <v-divider />
        <v-list-subheader>Existing projects</v-list-subheader>
        <v-list-item
          :key="index"
          :subtitle="`${project.network.nodes.length} nodes, ${project.network.connections.length} connections`"
          :title="project.name"
          :to="'/nest/project/' + project._id"
          v-for="(project, index) in projectDBStore.projects"
        />
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import nestLogo from "@/assets/img/logo/nest-logo.svg";

import { useProjectDBStore } from "@nest/store/project/projectDBStore";
const projectDBStore = useProjectDBStore();
//
</script>
