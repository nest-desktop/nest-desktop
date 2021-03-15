<template>
  <div v-if="state.connection">
    <v-menu
      :close-on-content-click="false"
      :position-x="state.position.x"
      :position-y="state.position.y"
      :value="state.show"
      transition="slide-y-transition"
    >
      <v-card tile flat style="min-width:300px">
        <!-- <v-card-title
          :style="{ backgroundColor: state.connection.source.view.color }"
          class="py-1"
          style="color:white; height:40px"
        >
        </v-card-title> -->

        <span v-if="state.content === undefined">
          <v-list dense>
            <v-list-item
              :key="index"
              @click="item.onClick"
              v-for="(item, index) in state.items"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon" />
              </v-list-item-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>

              <v-list-item-action v-show="item.append"
                ><v-icon v-text="'mdi-menu-right'"
              /></v-list-item-action>
            </v-list-item>
          </v-list>
        </span>

        <span v-if="state.content === 'paramsSelect'">
          <v-list dense>
            <v-list-item-group
              @change="selectionChange"
              active-class=""
              multiple
              v-model="state.visibleParams.connection"
            >
              <v-list-item
                :key="param.id"
                class="mx-0"
                style="font-size:12px;"
                v-for="param of state.connection.params"
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
                      :input-value="active"
                      class="shrink mr-2"
                      color="black"
                      hide-details
                    />
                  </v-list-item-action>
                </template>
              </v-list-item>
            </v-list-item-group>

            <v-list-item-group
              @change="selectionChange"
              active-class=""
              multiple
              v-model="state.visibleParams.synapse"
            >
              <v-list-item
                :key="param.id"
                class="mx-0"
                style="font-size:12px;"
                v-for="param of state.connection.synapse.params"
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
                      :input-value="active"
                      class="shrink mr-2"
                      color="black"
                      hide-details
                    />
                  </v-list-item-action>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>

          <v-card-actions>
            <v-btn @click="back" text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-btn @click="hideAllParams" text>none</v-btn>
            <v-btn @click="showAllParams" text>all</v-btn>
          </v-card-actions>
        </span>

        <span v-if="state.content === 'connectionDelete'">
          <v-card-title>
            Are you sure to delete it?
          </v-card-title>

          <v-card-actions>
            <v-btn @click="back" text>
              <v-icon left v-text="'mdi-menu-left'" /> no
            </v-btn>
            <v-btn @click="deleteConnection" text>yes</v-btn>
          </v-card-actions>
        </span>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch, onMounted } from '@vue/composition-api';

import { Connection } from '@/core/connection/connection';
import { ModelParameter } from '@/core/parameter/modelParameter';
import { Parameter } from '@/core/parameter/parameter';

export default Vue.extend({
  name: 'NetworkParamEdit',
  props: {
    connection: Connection,
    position: Object,
  },
  setup(props) {
    const state = reactive({
      content: undefined as string | undefined,
      connection: props.connection as Connection,
      position: props.position,
      visibleParams: { connection: [], synapse: [] },
      show: true,
      items: [
        {
          id: 'paramsSelect',
          icon: 'mdi-checkbox-marked-outline',
          title: 'Set parameter view',
          onClick: () => {
            state.content = 'paramsSelect';
            window.dispatchEvent(new Event('resize'));
          },
          append: true,
        },
        {
          id: 'connectionReverse',
          icon: 'mdi-rotate-3d-variant',
          title: 'Reverse connection',
          onClick: () => {
            state.connection.reverse();
            state.show = false;
          },
          append: false,
        },
        {
          id: 'connectionReverse',
          icon: 'mdi-contrast',
          title: 'Inverse synaptic weight',
          onClick: () => {
            state.connection.synapse.inverseWeight();
            state.show = false;
          },
          append: false,
        },
        {
          id: 'connectionReset',
          icon: 'mdi-restart',
          title: 'Reset connection',
          onClick: () => {
            state.connection.reset();
            state.show = false;
          },
          append: false,
        },
        {
          id: 'connectionDelete',
          icon: 'mdi-trash-can-outline',
          title: 'Delete connection',
          onClick: () => {
            state.content = 'connectionDelete';
          },
          append: false,
        },
      ],
    });

    /**
     * Triggers when parameter is changed.
     */
    const paramChange = () => {
      state.connection.connectionChanges();
    };

    /**
     * Triggers when parameter is changed.
     */
    const selectionChange = () => {
      state.connection.params.forEach(
        (param: Parameter) =>
          (param.visible = state.visibleParams.connection.includes(param.idx))
      );
      state.connection.synapse.params.forEach(
        (param: Parameter) =>
          (param.visible = state.visibleParams.synapse.includes(param.idx))
      );
      state.connection.connectionChanges();
    };

    /**
     * Delete connection.
     */
    const deleteConnection = () => {
      state.show = false;
      state.connection.remove();
    };

    /**
     * Return to main menu content.
     */
    const back = () => {
      state.content = undefined;
    };

    /**
     * Set an array of visible parameter for checkbox.
     */
    const setVisibleParams = () => {
      state.visibleParams.connection = state.connection.params
        .filter((param: ModelParameter) => param.visible)
        .map((param: ModelParameter) => param.idx);
      state.visibleParams.synapse = state.connection.synapse.params
        .filter((param: ModelParameter) => param.visible)
        .map((param: ModelParameter) => param.idx);
    };

    const showAllParams = () => {
      state.connection.showAllParams();
      state.connection.synapse.showAllParams();
      setVisibleParams();
    };

    const hideAllParams = () => {
      state.connection.hideAllParams();
      state.connection.synapse.hideAllParams();
      setVisibleParams();
    };

    onMounted(() => {
      setVisibleParams();
    });

    watch(
      () => [props.connection, props.position],
      () => {
        state.content = undefined;
        state.show = true;
        state.connection = props.connection as Connection;
        state.position = props.position;
      }
    );

    return {
      back,
      deleteConnection,
      hideAllParams,
      paramChange,
      showAllParams,
      selectionChange,
      state,
    };
  },
});
</script>

<style>
.paramLabel {
  color: black;
  font-size: 12px;
  font-weight: 400;
  height: 12px;
  left: -8px;
  line-height: 12px;
  position: absolute;
  top: 2px;
  z-index: 1000;
}

.v-list-item__action {
  margin: 0;
}
</style>
