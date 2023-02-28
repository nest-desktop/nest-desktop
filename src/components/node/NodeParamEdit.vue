<template>
  <div class="nodeParamEdit" v-if="state.node">
    <template v-if="state.node.model.isMultimeter">
      <v-menu
        :close-on-content-click="false"
        :position-x="state.menu.position.x"
        :position-y="state.menu.position.y"
        :value="state.menu.show"
        transition="slide-y-transition"
      >
        <v-color-picker
          @update:color="updateRecordsColor()"
          flat
          show-swatches
          style="border-radius: 0"
          v-if="state.menu.record"
          v-model="state.menu.record.color"
        />
      </v-menu>

      <v-row no-gutters class="px-2 pt-3 pb-1">
        <v-col>
          <v-select
            :items="state.node.recordables"
            :menu-props="{ offsetY: true }"
            @change="state.node.nodeChanges()"
            attach
            chips
            class="pa-1"
            clearable
            dense
            hide-details
            item-value="groupId"
            label="Record from"
            multiple
            persistent-hint
            return-object
            small
            v-model="state.node.records"
          >
            <template #selection="{ item }">
              <v-chip
                :color="item.color"
                :title="
                  item.labelCapitalize + (item.unit ? ` (${item.unit})` : '')
                "
                @click="e => showColorPopup(e, item)"
                @click:close="
                  () => {
                    state.node.removeRecord(item);
                    state.node.nodeChanges();
                  }
                "
                close
                disable-lookup
                label
                outlined
                small
                style="margin: 1px 2px"
              >
                {{ item.id }}
              </v-chip>
            </template>

            <template #item="{ item }">
              <v-chip
                :color="item.color"
                class="mx-2"
                label
                outlined
                small
                v-text="item.id"
              />
              <div style="font-size: 12px">
                <span v-text="item.labelCapitalize" />
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
      @update:value="state.node.nodeChanges()"
      v-for="param of state.node.filteredParams"
    />

    <v-card flat tile v-if="state.node.modelId === 'cm_default'">
      <span class="mx-2"> Compartments </span>
      <v-card-actions class="justify-space-between">
        <v-item-group class="text-center" mandatory v-model="state.compIdx">
          <v-item
            :key="'comp-' + compartment.idx"
            v-for="compartment of state.node.compartments"
            v-slot="{ active, toggle }"
          >
            <v-chip
              :color="state.node.view.color"
              :input-value="active"
              :label="compartment.parentIdx !== -1"
              :title="compartment.labelFull"
              @click="toggle"
              @click:close="compartment.remove()"
              class="ma-1px"
              close
              outlined
              small
            >
              {{ compartment.label }}
            </v-chip>
          </v-item>
        </v-item-group>
      </v-card-actions>

      <v-card flat tile>
        <v-window v-model="state.compIdx">
          <v-window-item
            :key="compartment.idx"
            v-for="compartment of state.node.compartments"
          >
            <v-card flat tile>
              <ParameterEdit
                :color="state.node.view.color"
                :key="param.id"
                :param="param"
                :value.sync="param.value"
                @update:value="state.node.nodeChanges()"
                v-for="param of compartment.filteredParams"
              />

              <v-card flat tile>
                <span class="mx-2"> Receptors in {{ compartment.label }} </span>
                <v-card-actions class="justify-space-between">
                  <v-item-group
                    class="text-center"
                    mandatory
                    v-model="state.receptorIdx"
                  >
                    <v-item
                      :key="'compartmentReceptor-' + receptor.idx"
                      v-for="receptor of compartment.receptors"
                      v-slot="{ active, toggle }"
                    >
                      <v-chip
                        :color="state.node.view.color"
                        :input-value="active"
                        @click:close="receptor.remove()"
                        @click="toggle"
                        class="ma-1px"
                        close
                        label
                        outlined
                        small
                      >
                        {{ receptor.id }}
                      </v-chip>
                    </v-item>
                  </v-item-group>
                </v-card-actions>
              </v-card>
            </v-card>

            <v-card flat tile>
              <v-window v-model="state.receptorIdx">
                <v-window-item
                  :key="'nodeReceptor' + receptor.idx"
                  v-for="receptor of compartment.receptors"
                >
                  <v-card flat tile>
                    <ParameterEdit
                      :color="state.node.view.color"
                      :key="param.id"
                      :param="param"
                      :value.sync="param.value"
                      @update:value="state.node.nodeChanges()"
                      v-for="param of receptor.filteredParams"
                    />
                  </v-card>
                </v-window-item>
              </v-window>
            </v-card>
          </v-window-item>
        </v-window>
      </v-card>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';

import { Node } from '@/core/node/node';
import { NodeRecord } from '@/core/node/nodeRecord';
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
      compartments: [{ id: 'soma' }, { id: 'dendrite' }],
      compIdx: 0,
      node: props.node as Node,
      menu: {
        position: {
          x: 0,
          y: 0,
        },
        record: null,
        show: false,
      },
      receptorIdx: 0,
    });

    /**
     * Show color popup for record.
     */
    const showColorPopup = function (e: MouseEvent, record: NodeRecord) {
      // https://thewebdev.info/2020/08/13/vuetify%E2%80%8A-%E2%80%8Amenus-and-context-menu/
      e.preventDefault();
      state.menu.show = false;
      state.menu.record = record;
      state.menu.position.x = e.clientX;
      state.menu.position.y = e.clientY;
      this.$nextTick(() => {
        state.menu.show = true;
      });
    };

    /**
     * Triggers when record color is changed.
     */
    const updateRecordsColor = () => {
      state.node.network.project.activityGraph.activityChartGraph.updateRecordsColor();
    };

    /**
     * Reset menu.
     */
    const resetMenu = () => {
      state.menu.show = false;
      state.menu.position.x = 0;
      state.menu.position.y = 0;
      state.menu.record = null;
    };

    const update = () => {
      resetMenu();
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
      showColorPopup,
      state,
      updateRecordsColor,
    };
  },
});
</script>

<style>
.nodeParamEdit .v-slide-group__next--disabled,
.nodeParamEdit .v-slide-group__prev--disabled {
  display: none;
}
</style>
