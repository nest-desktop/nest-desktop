<template>
  <div class="nodeModelSelect">
    <v-menu :close-on-content-click="false" tile v-model="state.opened">
      <template #activator="{ on, attrs }">
        <v-btn
          :color="state.node.view.color"
          :dark="projectView.config.coloredToolbar"
          :height="40"
          :text="!projectView.config.coloredToolbar"
          block
          class="nodeModel"
          depressed
          tile
          v-bind="attrs"
          v-on="on"
        >
          <span v-text="state.node.model.label" />
          <v-spacer />
          <v-chip
            label
            outlined
            small
            v-if="state.node.network.project.app.config.devMode"
            v-text="state.node.shortHash"
          />
          <v-icon class="modelEdit" right small v-text="'mdi-pencil'" />
        </v-btn>
      </template>

      <v-card style="min-width: 300px" tile>
        <v-card-title class="pa-0" style="height: 40px">
          <v-overflow-btn
            :items="state.node.models"
            @change="updateOnModelChange()"
            class="ma-0"
            dense
            editable
            filled
            hide-details
            item-text="label"
            item-value="id"
            style="font-weight: 700"
            tile
            v-model="state.node.modelId"
          />
        </v-card-title>

        <v-card-text class="ma-0 pa-0">
          <v-list class="no-highlight" dense>
            <v-list-item-group
              @change="paramChange"
              active-class=""
              multiple
              v-model="state.visibleParams"
            >
              <v-list-item
                :key="param.idx"
                class="mx-0"
                style="font-size: 12px"
                v-for="param of state.node.params"
              >
                <template #default="">
                  <v-list-item-content class="pa-1">
                    <v-row no-gutters>
                      <v-col
                        class="d-flex justify-space-between"
                        v-html="param.labelRow"
                      />
                    </v-row>
                  </v-list-item-content>

                  <v-list-item-action class="my-1">
                    <v-checkbox
                      :color="state.node.view.color"
                      :input-value="param.visible"
                      :value="param.visible"
                      hide-details
                    />
                  </v-list-item-action>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>

          <v-card flat tile v-if="state.node.modelId === 'cm_default'">
            <span class="mx-2"> Compartments </span>
            <v-card-actions class="justify-space-between">
              <v-item-group
                class="text-center"
                mandatory
                v-model="state.compIdx"
              >
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

              <span>
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      small
                      text
                      title="Add compartment"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon small v-text="'mdi-plus'" />
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item @click="addCompartment({ parentIdx: -1 })">
                      <v-list-item-title v-text="'Soma'" />
                    </v-list-item>
                    <v-list-item
                      :key="'modelCompartment-' + comp.idx"
                      @click="addCompartment({ parentIdx: comp.idx })"
                      v-for="comp in state.node.compartments"
                    >
                      <v-list-item-title v-text="`Dendrite to ${comp.label}`" />
                    </v-list-item>
                  </v-list>
                </v-menu>
              </span>
            </v-card-actions>

            <v-card flat tile>
              <v-window v-model="state.compIdx">
                <v-window-item
                  :key="compartment.idx"
                  v-for="compartment of state.node.compartments"
                >
                  <v-card flat tile>
                    <v-list class="no-highlight" dense>
                      <v-list-item-group
                        @change="compartmentParamChange"
                        active-class=""
                        multiple
                      >
                        <v-list-item
                          :key="param.idx"
                          class="mx-0"
                          style="font-size: 12px"
                          v-for="param of compartment.params"
                        >
                          <template #default="">
                            <v-list-item-content class="pa-1">
                              <v-row no-gutters>
                                {{ param.options.label }}
                                <v-spacer />
                                {{ param.toJSON().value }}
                                {{ param.options.unit }}
                              </v-row>
                            </v-list-item-content>

                            <v-list-item-action class="my-1">
                              <v-checkbox
                                :color="state.node.view.color"
                                :input-value="param.visible"
                                :value="param.visible"
                                hide-details
                              />
                            </v-list-item-action>
                          </template>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>

                    <v-card flat tile>
                      <span class="mx-2">
                        Receptors in {{ compartment.label }}
                      </span>
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

                        <span>
                          <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                icon
                                small
                                text
                                title="Add receptor"
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-icon small v-text="'mdi-plus'" />
                              </v-btn>
                            </template>
                            <v-list dense>
                              <v-list-item
                                :key="'modelReceptor-' + receptor.id"
                                @click="addReceptor(compartment, receptor)"
                                v-for="receptor in state.node.model.receptors"
                              >
                                <v-list-item-title v-text="receptor.id" />
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </span>
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
                          <v-list class="no-highlight" dense>
                            <v-list-item-group
                              @change="receptorParamChange"
                              active-class=""
                              multiple
                            >
                              <v-list-item
                                :key="param.idx"
                                class="mx-0"
                                style="font-size: 12px"
                                v-for="param of receptor.params"
                              >
                                <template #default="">
                                  <v-list-item-content class="pa-1">
                                    <v-row no-gutters>
                                      {{ param.options.label }}
                                      <v-spacer />
                                      {{ param.toJSON().value }}
                                      {{ param.options.unit }}
                                    </v-row>
                                  </v-list-item-content>

                                  <v-list-item-action class="my-1">
                                    <v-checkbox
                                      :color="state.node.view.color"
                                      :input-value="param.visible"
                                      :value="param.visible"
                                      hide-details
                                    />
                                  </v-list-item-action>
                                </template>
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </v-card>
                      </v-window-item>
                    </v-window>
                  </v-card>
                </v-window-item>
              </v-window>
            </v-card>
          </v-card>
        </v-card-text>

        <v-card-actions>
          <v-btn
            @click="state.opened = false"
            outlined
            small
            text
            title="Close menu"
            v-text="'close'"
          />
          <v-spacer />
          <v-btn
            @click="hideAllParams()"
            outlined
            small
            text
            title="Hide all parameters"
            v-text="'none'"
          />
          <v-btn
            @click="showAllParams()"
            outlined
            small
            text
            title="Show all parameters"
            v-text="'all'"
          />
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';

import { ModelReceptor } from '@/core/model/modelReceptor/modelReceptor';
import { Node } from '@/core/node/node';
import { NodeCompartment } from '@/core/node/nodeCompartment/nodeCompartment';
import { NodeCompartmentParameter } from '@/core/node/nodeCompartment/nodeCompartmentParameter';
import { NodeParameter } from '@/core/node/nodeParameter';
import { NodeReceptorParameter } from '@/core/node/nodeReceptor/nodeReceptorParameter';
import core from '@/core';

export default Vue.extend({
  name: 'NodeModelSelect',
  props: {
    node: Node,
  },
  setup(props) {
    const projectView = core.app.project.view;
    const state = reactive({
      compIdx: 0,
      node: props.node as Node,
      opened: false,
      receptorIdx: 0,
    });

    /**
     * Add compartment to the list.
     */
    const addCompartment = (comp: any) => {
      state.node.addCompartment(comp);
      state.node.nodeChanges();
    };

    /**
     * Add receptor to the list.
     */
    const addReceptor = (
      comp: NodeCompartment,
      modelReceptor: ModelReceptor
    ) => {
      comp.addReceptor(modelReceptor.toJSON());
      state.node.nodeChanges();
    };

    /**
     * Updates the visibility status of every parameter of the current node.
     * @param visibleParamIdx Array of all visible parameter indices
     */
    const paramChange = (visibleParamIdx: number[] = []) => {
      state.node.params.forEach(
        (param: NodeParameter) =>
          (param.state.visible = visibleParamIdx.includes(param.idx))
      );
      state.node.nodeChanges();
    };

    /**
     * Updates the visibility status of every parameter of the currently
     * selected compartment.
     * @param visibleParamIdx Array of all visible parameter indices
     */
    const compartmentParamChange = (visibleParamIdx: number[] = []) => {
      state.node.compartments[state.compIdx].params.forEach(
        (param: NodeCompartmentParameter) =>
          (param.state.visible = visibleParamIdx.includes(param.idx))
      );
      state.node.nodeChanges();
    };

    /**
     * Updates the visibility status of every parameter of the currently
     * selected receptor.
     * @param visibleParamIdx Array of all visible parameter indices
     */
    const receptorParamChange = (visibleParamIdx: number[] = []) => {
      state.node.compartments[state.compIdx].receptors[
        state.receptorIdx
      ].params.forEach(
        (param: NodeReceptorParameter) =>
          (param.state.visible = visibleParamIdx.includes(param.idx))
      );
      state.node.nodeChanges();
    };

    /**
     * Update when node model is changed.
     */
    const updateOnModelChange = () => {
      update();
    };

    /**
     * Update states.
     */
    const update = () => {
      state.node = props.node as Node;
    };

    /**
     * Hide all parameters.
     */
    const hideAllParams = () => {
      state.node.hideAllParams();
      state.node.nodeChanges();
      update();
    };

    /**
     * Show all parameters.
     */
    const showAllParams = () => {
      state.node.showAllParams();
      state.node.nodeChanges();
      update();
    };

    onMounted(() => {
      update();
    });

    watch(
      () => props.node,
      () => update()
    );

    return {
      addCompartment,
      addReceptor,
      compartmentParamChange,
      hideAllParams,
      paramChange,
      projectView,
      receptorParamChange,
      showAllParams,
      state,
      update,
      updateOnModelChange,
    };
  },
});
</script>

<style>
.nodeModel .modelEdit {
  display: none;
}

.nodeModel:hover .modelEdit {
  display: block;
}

.no-highlight .v-list-item--active::before {
  opacity: 0 !important;
}
</style>
