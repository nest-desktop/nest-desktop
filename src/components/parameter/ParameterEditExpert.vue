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
            <span v-text="state.param.type" />
          </v-row>
        </v-btn>
      </template>

      <v-card>
        <v-list dense>
          <v-list-item>
            <v-select
              :items="state.param.getTypes()"
              item-text="value"
              dense
              hide-details
              label="Select a parameter type"
              v-model="state.param.type"
            >
              <template slot="selection" slot-scope="data">
                <v-icon
                  left
                  v-if="data.item.value === 'constant'"
                  v-text="'mdi-numeric'"
                />
                <v-icon
                  left
                  v-else
                  v-text="
                    data.item.value.startsWith('spatial')
                      ? 'mdi-map'
                      : 'mdi-dice-multiple'
                  "
                />
                {{ data.item.value }}
              </template>
              <template slot="item" slot-scope="data">
                <v-icon
                  left
                  v-if="data.item.value === 'constant'"
                  v-text="'mdi-numeric'"
                />
                <v-icon
                  left
                  v-else
                  v-text="
                    data.item.value.startsWith('spatial')
                      ? 'mdi-arrow-expand-horizontal'
                      : '$diceMultipleOutline'
                  "
                />
                {{ data.item.value }}
              </template>
            </v-select>
          </v-list-item>

          <template v-if="state.param.isConstant()">
            <v-list-item>
              <v-row>
                <v-col class="py-0">
                  <v-text-field
                    hide-details
                    style="font-size: 13px"
                    v-model="state.param.value"
                  />
                </v-col>
              </v-row>
            </v-list-item>
          </template>

          <template v-else>
            <v-list-item>
              <v-row>
                <v-col
                  :cols="12 / state.param.specs.length"
                  :key="spec.id"
                  class="py-0"
                  v-for="spec in state.param.specs"
                >
                  <v-text-field
                    :label="spec.id"
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
          </template>
        </v-list>

        <v-card-actions>
          <v-btn @click="updateParam" outlined v-text="'Update parameter'" />
          <!-- <v-spacer />
          <v-btn :title="state.node.spatial.positions.pos" icon>
            <v-icon v-text="'mdi-map-outline'" />
          </v-btn> -->
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
