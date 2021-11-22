<template>
  <div class="activityGraphIcon" v-if="state.project">
    <span v-if="state.append">
      <v-icon
        class="mx-1"
        small
        v-show="state.project.hasSpatialActivities"
        v-text="'mdi-axis-arrow'"
      />
      <v-icon
        class="mx-1"
        small
        v-show="state.project.hasAnalogActivities"
        v-text="'mdi-chart-bell-curve-cumulative'"
      />
      <v-icon
        class="mx-1"
        small
        v-show="state.project.hasSpikeActivities"
        v-text="'mdi-chart-scatter-plot'"
      />
    </span>
    <span v-else>
      <v-icon
        v-if="
          state.project.hasSpatialActivities &&
          !state.fixed &&
          state.project.app.project.view.state.activityGraph === 'spatial'
        "
        v-text="'mdi-axis-arrow'"
      />
      <v-icon
        v-else-if="state.project.hasAnalogActivities"
        v-text="'mdi-chart-bell-curve-cumulative'"
      />
      <v-icon
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
    append: Boolean,
    fixed: Boolean,
    project: Project,
  },
  setup(props) {
    const state = reactive({
      append: false,
      fixed: false,
      project: undefined as Project,
    });

    const update = () => {
      state.append = props.append as boolean;
      state.fixed = props.fixed as boolean;
      state.project = props.project as Project;
    };

    onMounted(() => update());

    watch(
      () => [props.project],
      () => update()
    );

    return { state };
  },
});
</script>
