<template>
  <div class="nodeParamEdit" v-if="state.node">
    <template v-if="state.node.model.existing === 'multimeter'">
      <v-row no-gutters class="px-2 pt-3 pb-1">
        <v-col>
          <v-select
            :color="node.view.color"
            :items="node.recordables"
            :menu-props="{ offsetY: true }"
            @change="paramChange()"
            attach
            class="pa-1"
            clearable
            dense
            hide-details
            item-value="id"
            label="Record from"
            multiple
            persistent-hint
            small
            v-model="state.node.records"
          >
            <template v-slot:selection="{ item }">
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-chip
                    :color="state.node.view.color"
                    @click:close="
                      () => {
                        state.node.removeRecord(item.id);
                        paramChange();
                      }
                    "
                    close
                    disable-lookup
                    outlined
                    label
                    small
                    style="margin: 1px 2px"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ item.id }}
                  </v-chip>
                </template>
                <span v-text="item.label" />
                <span v-if="item.unit" v-text="` (${item.unit})`" />
              </v-tooltip>
            </template>

            <template v-slot:item="{ item }">
              <v-chip
                :color="
                  state.node.records.indexOf(item.id) !== -1
                    ? state.node.view.color
                    : 'primary'
                "
                class="mx-2"
                outlined
                label
                small
                v-text="item.id"
              />
              <div style="font-size: 12px">
                <span v-text="item.label" />
                <span v-if="item.unit" v-text="` (${item.unit})`" />
              </div>
            </template>
          </v-select>
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
