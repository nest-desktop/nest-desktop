<template>
  <div class="settingNavList">
    <v-row no-gutters>
      <v-col>
        <v-list dense>
          <v-list-item
            :key="setting"
            :to="'/setting/' + setting"
            v-for="setting in settings"
            v-text="setting"
          >
            <v-list-item-content>
              <v-list-item-title v-text="setting" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'SettingNavList',
  setup() {
    return {
      settings: ['app', 'backend', 'model', 'project'],
    };
  },
});
</script>
