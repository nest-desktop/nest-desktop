<template>
  <div class="nodeParamEdit" v-if="state.node">
    <template v-if="state.node.model.isMultimeter()">
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
          v-model="state.menu.record.color"
          v-if="state.menu.record"
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
            <template v-slot:selection="{ item }">
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-chip
                    :color="item.color"
                    @click="e => showColorPopup(e, item)"
                    @click:close="
                      () => {
                        state.node.removeRecord(item);
                        state.node.nodeChanges();
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
                <div style="font-size: 12px">
                  <span v-text="item.label" />
                  <span v-if="item.unit" v-text="` (${item.unit})`" />
                </div>
              </v-tooltip>
            </template>

            <template v-slot:item="{ item }">
              <v-chip
                :color="item.color"
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
      @update:value="state.node.nodeChanges()"
      v-for="param of state.node.filteredParams"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch, onMounted } from '@vue/composition-api';

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
      node: props.node as Node,
      menu: {
        position: {
          x: 0,
          y: 0,
        },
        record: null,
        show: false,
      },
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
