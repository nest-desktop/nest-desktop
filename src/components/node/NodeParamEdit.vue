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
                    label
                    outlined
                    small
                    style="margin: 1px 2px"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ item.id }}
                  </v-chip>
                </template>
                <div style="font-size: 12px">
                  <span v-text="item.labelCapitalize" />
                  <span v-if="item.unit" v-text="` (${item.unit})`" />
                </div>
              </v-tooltip>
            </template>

            <template v-slot:item="{ item }">
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
      <v-card-actions class="justify-space-between">
        <v-tabs
          height="28"
          style="width: calc(100% - 56px)"
          v-model="state.tab"
        >
          <v-tab
            :key="compartment.idx"
            class="ma-0 ma-2px pa-1 text-overline"
            style="min-width: 0"
            v-for="compartment of state.node.compartments"
          >
            <span v-text="compartment.label" />
          </v-tab>
        </v-tabs>

        <div style="swidth: 56px">
          <v-btn
            @click="removeLastCompartment()"
            icon
            small
            text
            title="Remove last compartment"
            v-if="state.node.compartments.length > 1"
          >
            <v-icon small v-text="'mdi-minus'" />
          </v-btn>

          <v-btn
            @click="addCompartment()"
            icon
            small
            text
            title="Add compartment"
          >
            <v-icon small v-text="'mdi-plus'" />
          </v-btn>
        </div>
      </v-card-actions>

      <v-tabs-items v-model="state.tab">
        <v-tab-item
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
              v-for="param of compartment.params"
            />

            <v-select
              :items="state.node.model.receptors"
              :value="compartment.receptor"
              @change="receptor => updateReceptor(compartment, receptor)"
              class="pa-2"
              dense
              hide-details
              item-text="label"
              item-value="id"
              label="Receptor type"
              return-object
            />

            <div v-if="compartment.receptor">
              <ParameterEdit
                :color="state.node.view.color"
                :key="param.id"
                :param="param"
                :value.sync="param.value"
                @update:value="state.node.nodeChanges()"
                v-for="param of compartment.receptor.params"
              />
            </div>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';

import { ModelReceptor } from '@/core/model/modelReceptor/modelReceptor';
import { Node } from '@/core/node/node';
import { NodeCompartment } from '@/core/node/nodeCompartment/nodeCompartment';
import { NodeReceptor } from '@/core/node/nodeReceptor/nodeReceptor';
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
      tab: null,
      window: 0,
    });

    /**
     * Add compartent to the list.
     */
    const addCompartment = () => {
      state.node.addCompartment();
      state.node.nodeChanges();
    };

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
     * Remove last compartent from the list.
     */
    const removeLastCompartment = () => {
      const comp = state.node.compartments[state.node.compartments.length - 1];
      removeReceptor(comp.idx);
      comp.remove();
      state.node.nodeChanges();
    };

    /**
     * Remove receptor from the list.
     */
    const removeReceptor = (compIdx: number) => {
      if (state.node.receptors.length === 0) {
        return;
      }
      const receptor = state.node.receptors.find(
        (receptor: NodeReceptor) => receptor.compIdx === compIdx
      );
      if (receptor != undefined) {
        receptor.remove();
      }
      state.node.nodeChanges();
    };

    /**
     * Update receptor when another is selected.
     */
    const updateReceptor = (
      comp: NodeCompartment,
      modelReceptor: ModelReceptor
    ) => {
      removeReceptor(comp.idx);

      const receptor = modelReceptor.toJSON();
      receptor.compIdx = comp.idx;
      state.node.addReceptor(receptor);
      state.node.nodeChanges();
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
      addCompartment,
      removeLastCompartment,
      showColorPopup,
      state,
      updateReceptor,
      updateRecordsColor,
    };
  },
});
</script>
