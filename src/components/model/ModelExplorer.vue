<template>
  <div class="modelExplorer" v-if="modelView.state.model">
    <ActivityGraph
      :codeHash="modelView.state.project.code.hash"
      :graph="modelView.state.project.activityGraph"
      :graphHash="modelView.state.project.activityGraph.codeHash"
      v-if="modelView.state.project"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import ActivityGraph from '@/components/activity/ActivityGraph.vue';
import core from '@/core';

/**
 * Model explorer shows activity of a neuron model.
 */
export default Vue.extend({
  name: 'ModelExplorer',
  components: {
    ActivityGraph,
  },
  setup() {
    const modelView = core.app.model.view;
    return { modelView };
  },
});
</script>
