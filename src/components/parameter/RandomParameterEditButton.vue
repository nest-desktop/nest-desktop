<template>
  <div class="randomParameterEdit">
    <v-menu :close-on-content-click="false" :max-width="300">
      <template #activator="{ on, attrs }">
        <v-btn
          block
          color="white"
          depressed
          style="font-size: 10px"
          tile
          v-bind="attrs"
          v-on="on"
        >
          <v-row>
            <span v-text="paramLabel()" />
            <v-spacer />
            <span v-text="state.param.type.id" />
          </v-row>
        </v-btn>
      </template>

      <v-card :min-width="300">
        <v-card-text>
          <NonConstantParameterEdit :param="state.param" />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="state.param.paramChanges()"
            outlined
            small
            v-text="'Update parameter'"
          />
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive } from '@vue/composition-api';

import { ModelParameter } from '@/core/model/modelParameter';
import { NodeParameter } from '@/core/node/nodeParameter';
import { Parameter } from '@/core/parameter/parameter';
import { SynapseParameter } from '@/core/synapse/synapseParameter';
import NonConstantParameterEdit from '@/components/parameter/NonConstantParameterEdit.vue';

export default Vue.extend({
  name: 'RandomParameterEditButton',
  components: {
    NonConstantParameterEdit,
  },
  props: {
    param: [NodeParameter, ModelParameter, Parameter, SynapseParameter],
  },

  setup(props) {
    type parameterTypes =
      | NodeParameter
      | ModelParameter
      | Parameter
      | SynapseParameter
      | undefined;

    const state = reactive({
      param: props.param as parameterTypes,
    });

    /**
     * Label parameter (with unit).
     */
    const paramLabel = () => {
      let label: String =
        `${state.param.options['label']}` || state.param.options.id;
      if (state.param.options.unit) {
        label += ` (${state.param.options['unit']})`;
      }
      return label;
    };

    return { paramLabel, state };
  },
});
</script>
