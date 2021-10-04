<template>
  <div class="activityGraphIcon">
    <span v-if="state.small">
      <v-icon
        :small="state.small"
        v-show="state.project.hasAnalogActivities"
        v-text="'mdi-chart-bell-curve-cumulative'"
      />
      <v-icon
        :small="state.small"
        v-show="state.project.hasSpikeActivities"
        v-text="'mdi-chart-scatter-plot'"
      />
      <v-icon
        :small="state.small"
        v-show="state.project.hasSpatialActivities"
        v-text="'mdi-axis-arrow'"
      />
    </span>
    <span v-else>
      <v-icon
        :small="state.small"
        v-if="
          state.spatial &&
          state.project.hasSpatialActivities &&
          state.project.app.view.project.state.activityGraph === 'spatial'
        "
        v-text="'mdi-axis-arrow'"
      />
      <v-icon
        :small="state.small"
        v-else-if="state.project.hasAnalogActivities"
        v-text="'mdi-chart-bell-curve-cumulative'"
      />
      <v-icon
        :small="state.small"
        v-else-if="state.project.hasSpikeActivities"
        v-text="'mdi-chart-scatter-plot'"
      />
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, onMounted, watch } from '@vue/composition-api';

import { Project } from '@/core/project/project';

export default Vue.extend({
  name: 'ActivityGraphIcon',
  props: {
    project: Project,
    small: Boolean,
    spatial: Boolean,
  },
  setup(props) {
    const state = reactive({
      project: undefined as Project,
      small: false,
      spatial: false,
    });

    onMounted(() => {
      state.project = props.project as Project;
      state.small = props.small as boolean;
      state.spatial = props.spatial as boolean;
    });

    watch(
      () => [props.project],
      project => {
        state.project = props.project as Project;
        state.small = props.small as boolean;
        state.spatial = props.spatial as boolean;
      }
    );

    return { state };
  },
});
</script>
