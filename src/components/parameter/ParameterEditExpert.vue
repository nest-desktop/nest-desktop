<template>
  <div class="randomParameterEdit">
    <v-menu :close-on-content-click="false" :max-width="300">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="white"
          block
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

      <v-card>
        <v-list dense>
          <v-list-item>
            <v-select
              :items="state.param.types"
              @change="updateParam"
              item-text="label"
              item-value="id"
              dense
              hide-details
              label="Select a parameter type"
              v-model="state.param.type"
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

          <v-list-item>
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
                  type="number"
                  style="font-size: 13px"
                  v-model="spec.value"
                />
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-btn @click="updateParam" outlined v-text="'Update parameter'" />
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive } from '@vue/composition-api';

import { ModelParameter } from '@/core/parameter/modelParameter';
import { Parameter } from '@/core/parameter/parameter';

export default Vue.extend({
  name: 'RandomParameterEdit',
  props: {
    param: [ModelParameter, Parameter],
  },
  setup(props, { emit }) {
    const state = reactive({
      param: props.param as ModelParameter | Parameter,
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

    const updateParam = () => {
      if (!state.param.isConstant()) {
        state.param.specs.forEach((p: any) => (p.value = parseFloat(p.value)));
      }
      emit('update:param', state.param);
    };

    return { paramLabel, state, updateParam };
  },
});
</script>
