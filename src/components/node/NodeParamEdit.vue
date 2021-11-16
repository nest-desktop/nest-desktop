<template>
  <div class="nodeParamEdit" v-if="state.node">
    <template v-if="node.model.existing === 'multimeter'">
      <v-row no-gutters>
        <v-col>
          <v-select
            :color="node.view.color"
            :item-text="
              item => item.label + (item.unit ? ` (${item.unit})` : '')
            "
            :items="node.recordables"
            @change="paramChange()"
            attach
            class="ma-0 pt-4 px-1"
            dense
            hide-details
            item-value="id"
            label="Record from"
            multiple
            persistent-hint
            v-model="state.node.records"
          />
        </v-col>
      </v-row>
    </template>

    <ParameterEdit
      :color="state.node.view.color"
      :key="param.id"
      :param="param"
      :value.sync="param.value"
      @update:value="paramChange()"
      v-for="param of state.node.filteredParams"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch, onMounted } from '@vue/composition-api';

import { Node } from '@/core/node/node';
import ParameterEdit from '@/components/parameter/ParameterEdit.vue';

export default Vue.extend({
  name: 'NodeParamEdit',
  components: {
    ParameterEdit,
  },
  props: {
    node: Node,
  },
  setup(props) {
    const state = reactive({
      node: props.node as Node,
    });

    /**
     * Triggers when node parameter is changed.
     */
    const paramChange = () => {
      state.node.nodeChanges();
    };

    const update = () => {
      state.node = props.node as Node;
    };

    onMounted(() => {
      update();
    });

    watch(
      () => props.node,
      () => {
        state.node = props.node as Node;
        update();
      }
    );

    return {
      paramChange,
      state,
    };
  },
});
</script>
