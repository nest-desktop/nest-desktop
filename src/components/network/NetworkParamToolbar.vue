<template>
  <div class="networkParamToolbar" v-if="state.network">
    <v-toolbar class="toolbar" dense flat height="40" max-height="40">
      <span class="d-flex">
        <v-btn-toggle
          dense
          group
          mandatory
          tile
          v-model="state.network.state.elementTypeIdx"
        >
          <v-btn
            :key="'elementType-' + item"
            class="flex-grow-1 ma-0"
            height="40"
            v-for="item in state.network.state.elementTypes.slice(0, 4)"
          >
            <span class="d-flex flex-column">
              <v-icon
                small
                style="width: auto"
                v-text="state.network.state.icons[item].tab"
              />
              <span class="mt-1" style="font-size: 7px" v-text="item" />
            </span>
          </v-btn>

          <v-divider class="mx-1" vertical />

          <v-btn
            :key="'elementType-' + item"
            class="flex-grow-1 ma-0"
            height="40"
            v-for="item in state.network.state.elementTypes.slice(4, 5)"
          >
            <span class="d-flex flex-column">
              <v-icon
                small
                style="width: auto"
                v-text="state.network.state.icons[item].tab"
              />
              <span class="mt-1" style="font-size: 7px" v-text="item" />
            </span>
          </v-btn>

          <v-divider class="mx-1" vertical />

          <v-menu :close-on-content-click="false" :max-height="600" offset-y>
            <template #activator="{ on, attrs }">
              <v-btn
                class="flex-grow-1 ma-0"
                height="40"
                v-bind="attrs"
                v-on="on"
              >
                <span class="d-flex flex-column">
                  <v-icon
                    small
                    style="width: auto"
                    v-text="'mdi-checkbox-marked-outline'"
                  />
                  <span class="mt-1" style="font-size: 7px" v-text="'custom'" />
                </span>
              </v-btn>
            </template>

            <v-card :width="280">
              <v-card-text class="pa-0">
                <v-list class="no-highlight" dense>
                  <v-list-item v-if="state.network.models.length > 0">
                    <v-list-item-content>
                      <v-list-item-title v-text="'models'" />
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-row>
                        <span
                          :key="'model-' + elementType"
                          v-for="elementType in state.network.state.elementTypes.slice(
                            0,
                            4
                          )"
                        >
                          <v-tooltip :open-delay="1000" top>
                            <template #activator="{ on, attrs }">
                              <v-btn
                                @click="toggleModels(elementType)"
                                class="mx-0"
                                icon
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-icon v-text="modelIcon(elementType)" />
                              </v-btn>
                            </template>
                            <span v-text="elementType" />
                          </v-tooltip>
                        </span>
                        <span :key="'model-synapse'">
                          <v-tooltip :open-delay="1000" top>
                            <template #activator="{ on, attrs }">
                              <v-btn
                                @click="toggleModels('synapse')"
                                class="mx-0"
                                icon
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-icon v-text="modelIcon('synapse')" />
                              </v-btn>
                            </template>
                            <span v-text="'synapse'" />
                          </v-tooltip>
                        </span>
                      </v-row>
                    </v-list-item-action>
                  </v-list-item>

                  <v-list-item v-if="state.network.nodes.length > 0">
                    <v-list-item-content>
                      <v-list-item-title v-text="'nodes'" />
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-row>
                        <span
                          :key="'node-' + elementType"
                          v-for="elementType in state.network.state.elementTypes.slice(
                            0,
                            4
                          )"
                        >
                          <v-tooltip :open-delay="1000" top>
                            <template #activator="{ on, attrs }">
                              <v-btn
                                @click="toggleNodes(elementType)"
                                class="mx-0"
                                icon
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-icon v-text="nodeIcon(elementType)" />
                              </v-btn>
                            </template>
                            <span v-text="elementType" />
                          </v-tooltip>
                        </span>
                      </v-row>
                    </v-list-item-action>
                  </v-list-item>

                  <v-list-item v-if="state.network.connections.length > 0">
                    <v-list-item-content>
                      <v-list-item-title v-text="'connections'" />
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-row>
                        <span
                          :key="'connection-' + elementType"
                          v-for="elementType in state.network.state.elementTypes.slice(
                            0,
                            4
                          )"
                        >
                          <v-tooltip :open-delay="1000" bottom>
                            <template #activator="{ on, attrs }">
                              <v-btn
                                @click="toggleConnections(elementType)"
                                class="mx-0"
                                icon
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-icon v-text="connectionIcon(elementType)" />
                              </v-btn>
                            </template>
                            <span v-text="elementType" />
                          </v-tooltip>
                        </span>
                      </v-row>
                    </v-list-item-action>
                  </v-list-item>

                  <template v-if="state.network.models.length > 0">
                    <v-divider />
                    <v-subheader v-text="'Models'" />
                    <v-list-item-group
                      @change="modelDisplayChange"
                      multiple
                      v-model="state.network.state.displayIdx.models"
                    >
                      <draggable
                        handle=".handle"
                        v-model="state.network.models"
                      >
                        <transition-group>
                          <v-list-item
                            :key="'model' + model.idx"
                            v-for="model in state.network.models"
                          >
                            <template #default="{ active }">
                              <v-icon
                                class="handle"
                                title="Drag to change order of models"
                                v-text="'mdi-drag-vertical'"
                              />
                              <v-list-item-content
                                class="pa-1"
                                v-text="model.new"
                              />
                              <v-list-item-action class="my-1">
                                <v-checkbox
                                  :input-value="active"
                                  hide-details
                                />
                              </v-list-item-action>
                            </template>
                          </v-list-item>
                        </transition-group>
                      </draggable>
                    </v-list-item-group>
                  </template>

                  <template v-if="state.network.nodes.length > 0">
                    <v-divider />
                    <v-subheader v-text="'Nodes'" />
                    <v-list-item-group
                      @change="nodeDisplayChange"
                      multiple
                      v-model="state.network.state.displayIdx.nodes"
                    >
                      <draggable handle=".handle" v-model="state.network.nodes">
                        <transition-group>
                          <v-list-item
                            :key="'node' + node.idx"
                            v-for="node in state.network.nodes"
                          >
                            <template #default="{ active }">
                              <v-icon
                                :color="node.view.color"
                                class="handle"
                                title="Drag to change order of nodes"
                                v-text="'mdi-drag-vertical'"
                              />
                              <v-list-item-content
                                class="pa-1"
                                v-text="node.view.label"
                              />
                              <v-list-item-action class="my-1">
                                <v-checkbox
                                  :color="node.view.color"
                                  :input-value="active"
                                  hide-details
                                />
                              </v-list-item-action>
                            </template>
                          </v-list-item>
                        </transition-group>
                      </draggable>
                    </v-list-item-group>
                  </template>

                  <template v-if="state.network.connections.length > 0">
                    <v-divider />
                    <v-subheader v-text="'Connections'" />
                    <v-list-item-group
                      @change="connectionDisplayChange"
                      multiple
                      v-model="state.network.state.displayIdx.connections"
                    >
                      <draggable
                        handle=".handle"
                        v-model="state.network.connections"
                      >
                        <transition-group>
                          <v-list-item
                            :key="'connection' + connection.idx"
                            v-for="connection in state.network.connections"
                          >
                            <template #default="{ active }">
                              <v-icon
                                :color="connection.source.view.color"
                                class="handle"
                                title="Drag to change order of connections"
                                v-text="'mdi-drag-vertical'"
                              />
                              <v-list-item-content class="pa-1">
                                <v-row no-gutters>
                                  {{ connection.source.view.label }}
                                  <v-icon small v-text="'mdi-arrow-right'" />
                                  {{ connection.target.view.label }}
                                </v-row>
                              </v-list-item-content>

                              <v-list-item-action class="my-1">
                                <v-checkbox
                                  :color="connection.source.view.color"
                                  :input-value="active"
                                  hide-details
                                />
                              </v-list-item-action>
                            </template>
                          </v-list-item>
                        </transition-group>
                      </draggable>
                    </v-list-item-group>
                  </template>
                </v-list>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-btn-toggle>
      </span>
    </v-toolbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';
import draggable from 'vuedraggable';

import { Connection } from '@/core/connection/connection';
import { CopyModel } from '@/core/model/copyModel';
import { Network } from '@/core/network/network';
import { Node } from '@/core/node/node';
import core from '@/core';

export default Vue.extend({
  name: 'NetworkParamsEdit',
  components: {
    draggable,
  },
  props: {
    projectId: String,
  },
  setup(props) {
    const projectView = core.app.project.view;
    const state = reactive({
      network: projectView.state.project.network as Network,
    });

    /**
     * Checkbox icon for element type connection.
     */
    const connectionIcon = (elementType: string = '') => {
      const icon = state.network.state.icons[elementType];
      const connections = ['', 'all'].includes(elementType)
        ? state.network.connections
        : (state.network.connections.filter(
            (connection: Connection) =>
              connection.source.model.elementType === elementType
          ) as Connection[]);
      const visibleConnections = connections.filter(
        (connection: Connection) => connection.view.visible
      ) as Connection[];
      if (
        visibleConnections.length === connections.length &&
        connections.length !== 0
      )
        return icon.on;
      if (visibleConnections.length > 0 || connections.length === 0)
        return 'mdi-minus-box-outline';
      return icon.off;
    };

    /**
     * Update the visibility state of the connections.
     */
    const connectionDisplayChange = () => {
      state.network.connections.forEach(
        (connection: Connection) =>
          (connection.view.visible =
            state.network.state.displayIdx.connections.includes(connection.idx))
      );
    };

    /**
     * Update the visibility state of the models.
     */
    const modelDisplayChange = () => {
      state.network.models.forEach(
        (model: CopyModel) =>
          (model.state.visible = state.network.state.displayIdx.models.includes(
            model.idx
          ))
      );
    };

    /**
     * Checkbox icon for node element type.
     */
    const modelIcon = (elementType: string = '') => {
      const icon = state.network.state.icons[elementType];
      const models = ['', 'all'].includes(elementType)
        ? state.network.models
        : (state.network.models.filter(
            (model: CopyModel) => model.elementType === elementType
          ) as CopyModel[]);
      const visibleModels = models.filter(
        (model: CopyModel) => model.state.visible
      ) as CopyModel[];
      if (visibleModels.length === models.length && models.length !== 0)
        return icon.on;
      if (visibleModels.length > 0 || models.length === 0)
        return 'mdi-minus-box-outline';
      return icon.off;
    };

    /**
     * Update the visibility state of the nodes.
     */
    const nodeDisplayChange = () => {
      state.network.nodes.forEach(
        (node: Node) =>
          (node.view.visible = state.network.state.displayIdx.nodes.includes(
            node.idx
          ))
      );
    };

    /**
     * Checkbox icon for node element type.
     */
    const nodeIcon = (elementType: string = '') => {
      const icon = state.network.state.icons[elementType];
      const nodes = ['', 'all'].includes(elementType)
        ? state.network.nodes
        : (state.network.nodes.filter(
            (node: Node) => node.model.elementType === elementType
          ) as Node[]);
      const visibleNodes = nodes.filter(
        (node: Node) => node.view.visible
      ) as Node[];
      if (visibleNodes.length === nodes.length && nodes.length !== 0)
        return icon.on;
      if (visibleNodes.length > 0 || nodes.length === 0)
        return 'mdi-minus-box-outline';
      return icon.off;
    };

    /**
     * Update the visibility state of connections with type 'elementType'.
     * @param elementType Type of the connections
     */
    const toggleConnections = (elementType: string = '') => {
      const connections = ['', 'all'].includes(elementType)
        ? state.network.connections
        : (state.network.connections.filter(
            (connection: Connection) =>
              connection.source.model.elementType === elementType
          ) as Connection[]);
      const visible: boolean =
        connections.filter((connection: Connection) => connection.view.visible)
          .length !== connections.length;
      connections.forEach(
        (connection: Connection) => (connection.view.visible = visible)
      );
      update();
    };

    /**
     * Update the visibility state of models with type 'elementType'.
     * @param elementType Type of the models
     */
    const toggleModels = (elementType: string = '') => {
      const models = ['', 'all'].includes(elementType)
        ? state.network.models
        : (state.network.models.filter(
            (model: CopyModel) => model.elementType === elementType
          ) as CopyModel[]);
      const visible: boolean =
        models.filter((model: CopyModel) => model.state.visible).length !==
        models.length;
      models.forEach((model: CopyModel) => (model.state.visible = visible));
      update();
    };

    /**
     * Update the visibility state of nodes with type 'elementType'.
     * @param elementType Type of the nodes
     */
    const toggleNodes = (elementType: string = '') => {
      const nodes = ['', 'all'].includes(elementType)
        ? state.network.nodes
        : (state.network.nodes.filter(
            (node: Node) => node.model.elementType === elementType
          ) as Node[]);
      const visible: boolean =
        nodes.filter((node: Node) => node.view.visible).length !== nodes.length;
      nodes.forEach((node: Node) => (node.view.visible = visible));
      update();
    };

    const update = () => {
      state.network.state.displayIdx.models = state.network.models
        .filter((model: CopyModel) => model.state.visible)
        .map((model: CopyModel) => model.idx);
      state.network.state.displayIdx.nodes = state.network.nodes
        .filter((node: Node) => node.view.visible)
        .map((node: Node) => node.idx);
      state.network.state.displayIdx.connections = state.network.connections
        .filter((connection: Connection) => connection.view.visible)
        .map((connection: Connection) => connection.idx);
    };

    onMounted(() => {
      update();
    });

    watch(
      () => [props.projectId, projectView.state.project.network.state.hash],
      () => {
        state.network = projectView.state.project.network as Network;
        update();
      }
    );

    return {
      connectionDisplayChange,
      connectionIcon,
      modelIcon,
      nodeIcon,
      nodeDisplayChange,
      modelDisplayChange,
      projectView,
      state,
      toggleConnections,
      toggleModels,
      toggleNodes,
    };
  },
});
</script>

<style>
.networkParamToolbar .toolbar {
  position: absolute;
  top: 0px;
  z-index: 1;
}

.v-image__image--preload {
  filter: none;
  --webkit-filter: none;
}
.v-banner__wrapper {
  padding: 0 !important;
}
.no-highlight .v-list-item--active::before {
  opacity: 0 !important;
}
.v-list-item .handle {
  opacity: 0;
}
.v-list-item:hover .handle {
  opacity: 1;
}
</style>
