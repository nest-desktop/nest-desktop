<template>
  <div class="settings">
    <v-list dense>
      <v-list-item
        :key="setting"
        v-for="setting in settings"
        v-text="setting"
        :to="'/setting/' + setting"
      >
        <v-list-item-content>
          <v-list-item-title v-text="setting" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
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
