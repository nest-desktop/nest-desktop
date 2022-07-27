<template>
  <div class="AppDialog">
    <span v-if="dialogState.open">
      <ModelsDialog v-if="dialogState.source === 'model'" />
      <ProjectsDialog v-if="dialogState.source === 'project'" />
      <SettingsDialog v-if="dialogState.source === 'settings'" />
    </span>
  </div>
</template>

<script>
import Vue from 'vue';

import core from '@/core';

import ModelsDialog from '@/components/dialog/ModelsDialog.vue';
import ProjectsDialog from '@/components/dialog/ProjectsDialog.vue';
import SettingsDialog from '@/components/dialog/SettingsDialog.vue';

export default Vue.extend({
  name: 'AppDialog',
  components: {
    ModelsDialog,
    ProjectsDialog,
    SettingsDialog,
  },
  setup() {
    return {
      dialogState: core.app.state.dialog,
    };
  },
});
</script>
