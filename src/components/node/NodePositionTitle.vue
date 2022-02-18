<template>
  <div class="NodePositionTitle">
    <v-row no-gutters v-if="!state.loading">
      <span v-text="'Positions'" />
      <v-spacer />
      <v-chip
        :title="state.spatial.positions.name"
        class="mx-1"
        label
        outlined
        small
      >
        <v-icon
          small
          v-text="
            state.spatial.positions.name === 'grid'
              ? '$dotsGrid'
              : '$diceMultipleOutline'
          "
        />
      </v-chip>
      <v-chip
        class="mx-1"
        label
        outlined
        small
        v-if="state.spatial.positions.name === 'free'"
        v-text="state.spatial.positions.numDimensions + 'D'"
      />
      <v-chip
        class="mx-1"
        label
        outlined
        small
        v-if="state.spatial.positions.name === 'grid'"
        v-text="state.spatial.positions.shape"
      />
      <v-chip
        class="mx-1"
        label
        outlined
        small
        v-if="state.spatial.positions.name === 'free'"
        v-text="state.spatial.node.size"
      />
      <v-chip
        class="mx-1"
        label
        outlined
        small
        v-if="state.spatial.positions.edgeWrap"
      >
        <v-icon small v-text="'mdi-format-text-wrapping-wrap'" />
      </v-chip>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';

import { NodeSpatial } from '@/core/node/nodeSpatial/nodeSpatial';

export default Vue.extend({
  name: 'NodePosition',
  props: {
    spatial: NodeSpatial,
  },
  setup(props) {
    const state = reactive({
      loading: false,
      spatial: props.spatial as NodeSpatial,
    });

    watch(
      () => [props.spatial],
      () => {
        state.loading = true;
        setTimeout(() => {
          state.spatial = props.spatial as NodeSpatial;
          state.loading = false;
        }, 1);
      }
    );

    return {
      state,
    };
  },
});
</script>
