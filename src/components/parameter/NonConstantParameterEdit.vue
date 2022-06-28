<template>
  <div class="nonConstantParameterEdit">
    <v-list class="pa-0" dense>
      <v-list-item class="pa-0">
        <v-select
          :items="state.param.types"
          @change="updateParam"
          dense
          hide-details
          item-text="label"
          item-value="id"
          label="Select a parameter type"
          v-model="state.param.typeId"
        >
          <template slot="selection" slot-scope="data">
            <v-icon left v-text="data.item.icon" />
            {{ data.item.label }}
          </template>
          <template slot="item" slot-scope="data">
            <v-icon left v-text="data.item.icon" />
            {{ data.item.label }}
          </template>
        </v-select>
      </v-list-item>

      <v-list-item class="pa-0">
        <v-row>
          <v-col
            :cols="12 / state.param.specs.length"
            :key="spec.id"
            class="py-0"
            v-for="spec in state.param.specs"
          >
            <v-text-field
              :label="spec.label"
              :max="spec.max"
              :min="spec.min"
              :step="spec.step"
              hide-details
              style="font-size: 13px"
              type="number"
              v-model="spec.value"
            />
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive } from '@vue/composition-api';

import { ModelParameter } from '@/core/model/modelParameter';
import { NodeParameter } from '@/core/node/nodeParameter';
import { Parameter } from '@/core/parameter/parameter';
import { SynapseParameter } from '@/core/synapse/synapseParameter';

export default Vue.extend({
  name: 'nonConstantParameterEdit',
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
     * Update parameters.
     *
     * @remarks
     * It emits the update:params event.
     */
    const updateParam = () => {
      if (!state.param.isConstant) {
        state.param.specs.forEach((p: any) => (p.value = parseFloat(p.value)));
      }
      state.param.paramChanges()
    };

    return { state, updateParam };
  },
});
</script>
