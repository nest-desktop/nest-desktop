<template>
  <div class="settings">
    <v-app-bar app clipped-left color="setting" dark dense flat>
      <v-toolbar-title>
        <v-icon class="ma-2">mdi-cogs</v-icon>
        Settings
      </v-toolbar-title>
    </v-app-bar>

    <v-container>
      <v-list class="pa-0" dense>
        <v-list-item
          :key="setting"
          @click="() => alert('bla')"
          v-for="setting in settings"
          v-text="setting"
        >
          <v-list-item-content>
            <v-list-item-title v-text="setting" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "Settings",
  data: () => ({
    settings: ["App", "NEST Server", "Model", "Project"]
  })
});
</script>
