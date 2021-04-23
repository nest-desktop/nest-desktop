<template>
  <div class="nodeModelSelect">
    <v-menu :close-on-content-click="false" tile>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :height="40"
          block
          class="nodeModel"
          dark
          text
          tile
          v-bind="attrs"
          v-on="on"
        >
          {{ state.node.model.label }}
          <v-spacer />
          <v-icon class="modelEdit" right v-text="'mdi-pencil'" />
        </v-btn>
      </template>

      <v-card style="min-width:300px" tile>
        <v-card-title class="pa-0" style="color:white; height:40px">
          <v-overflow-btn
            :items="state.node.models"
            class="ma-0"
            dense
            editable
            hide-details
            item-text="label"
            item-value="id"
            style="font-weight:700"
            tile
            v-model="state.node.modelId"
          />
        </v-card-title>

        <v-list dense>
          <v-list-item-group
            @change="selectionChange"
            active-class=""
            multiple
            v-model="state.visibleParams"
          >
            <v-list-item
              :key="param.id"
              class="mx-0"
              style="font-size:12px;"
              v-for="param of state.node.params"
            >
              <template v-slot:default="{ active }">
                <v-list-item-content style="padding: 4px">
                  <v-row no-gutters>
                    {{ param.options.label }}
                    <v-spacer />
                    {{ param.toJSON().value }}
                    {{ param.options.unit }}
                  </v-row>
                </v-list-item-content>

                <v-list-item-action style="margin: 4px 0">
                  <v-checkbox
                    :color="node.view.color"
                    :input-value="active"
                    hide-details
                  />
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';

import { Node } from '@/core/node/node';
import { ModelParameter } from '@/core/parameter/modelParameter';

export default Vue.extend({
  name: 'NodeModelSelect',
  props: {
    node: Node,
  },
  setup(props) {
    const state = reactive({
      node: props.node as Node,
      visibleParams: [],
    });

    /**
     * Triggers when parameter is changed.
     */
    const selectionChange = () => {
      state.node.params.forEach(
        (param: ModelParameter) =>
          (param.visible = state.visibleParams.includes(param.idx))
      );
      state.node.nodeChanges();
    };

    watch(
      () => props.node,
      () => {
        state.node = props.node as Node;
        state.visibleParams = state.node.filteredParams.map(
          (param: ModelParameter) => param.idx
        );
      }
    );

    return {
      selectionChange,
      state,
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
</style>
