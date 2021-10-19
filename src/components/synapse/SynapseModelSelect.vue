<template>
  <div class="synapseModelSelect" v-if="state.synapse">
    <v-menu :close-on-content-click="false" tile v-model="state.opened">
      <template #activator="{ on, attrs }">
        <v-btn
          :height="40"
          block
          class="synapseModel"
          text
          tile
          v-bind="attrs"
          v-on="on"
        >
          <span v-text="state.synapse.model.label" />
          <v-spacer />
          <v-icon class="modelEdit" right v-text="'mdi-pencil'" />
          <v-chip
            label
            outlined
            small
            v-if="state.synapse.connection.network.project.app.config.devMode"
            v-text="state.synapse.connection.hash.slice(0, 6)"
          />
        </v-btn>
      </template>

      <v-card style="min-width: 300px" tile>
        <v-card-title class="pa-0" style="height: 40px">
          <v-overflow-btn
            :items="state.synapse.models"
            @change="update()"
            class="ma-0"
            dense
            editable
            filled
            hide-details
            item-text="label"
            item-value="id"
            style="font-weight: 700"
            tile
            v-model="state.synapse.modelId"
          />
        </v-card-title>

        <v-card-text class="ma-0 pa-0">
          <v-list class="no-highlight" dense>
            <v-list-item-group
              @change="selectionChange"
              active-class=""
              multiple
              v-model="state.visibleParams"
            >
              <v-list-item
                :key="param.idx"
                class="mx-0"
                style="font-size: 12px"
                v-for="param of state.synapse.params"
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
                      :color="synapse.connection.source.view.color"
                      :input-value="param.visible"
                      :value="param.visible"
                      hide-details
                    />
                  </v-list-item-action>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>
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
import { reactive, watch, onMounted } from '@vue/composition-api';

import { Synapse } from '@/core/synapse/synapse';
import { ModelParameter } from '@/core/parameter/modelParameter';

export default Vue.extend({
  name: 'SynapseModelSelect',
  props: {
    synapse: Synapse,
  },
  setup(props) {
    const state = reactive({
      opened: false,
      synapse: props.synapse as Synapse,
      visibleParams: [],
    });

    /**
     * Triggers when parameter is changed.
     */
    const selectionChange = () => {
      state.synapse.params.forEach(
        (param: ModelParameter) =>
          (param.visible = state.visibleParams.includes(param.idx))
      );
      state.synapse.synapseChanges();
    };

    /**
     * Update states.
     */
    const update = () => {
      state.synapse = props.synapse as Synapse;
      state.visibleParams = state.synapse.params
        .filter((param: ModelParameter) => param.visible)
        .map((param: ModelParameter) => param.idx);
    };

    /**
     * Hide all parameters.
     */
    const hideAllParams = () => {
      state.synapse.hideAllParams();
      state.synapse.synapseChanges();
      update();
    };

    /**
     * Show all parameters.
     */
    const showAllParams = () => {
      state.synapse.showAllParams();
      state.synapse.synapseChanges();
      update();
    };

    onMounted(() => {
      update();
    });

    watch(
      () => props.synapse,
      () => update()
    );

    return {
      hideAllParams,
      showAllParams,
      selectionChange,
      state,
      update,
    };
  },
});
</script>

<style>
.synapseModel .modelEdit {
  display: none;
}

.synapseModel:hover .modelEdit {
  display: block;
}

.no-highlight .v-list-item--active::before {
  opacity: 0 !important;
}
</style>
