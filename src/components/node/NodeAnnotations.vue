<template>
  <div class="nodeAnnotations">
    <v-chip
      :color="state.node.view.color"
      :key="annotation"
      @click:close="node.removeAnnotation(annotation)"
      class="ma-1px"
      close
      outlined
      small
      v-for="annotation in node.annotations"
    >
      {{ annotation }}
    </v-chip>

    <v-menu :close-on-content-click="false" v-model="state.opened">
      <template #activator="{ on, attrs }">
        <v-btn icon small title="Add annotation" v-bind="attrs" v-on="on">
          <v-icon small v-text="'mdi-tag-plus-outline'" />
        </v-btn>
      </template>
      <v-card>
        <v-card-text class="ma-0 pa-1">
          <v-text-field
            :append-outer-icon="'mdi-tag-text-outline'"
            @click:append-outer="$event => addText()"
            @change="$event => addText()"
            autofocus
            clearable
            hide-details
            dense
            placeholder="Annotation text"
            variant="underlined"
            v-model="state.text"
          />
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';

import { Node } from '@/core/node/node';

export default Vue.extend({
  name: 'NodeAnnotations',
  props: {
    node: Node,
  },
  setup(props) {
    const state = reactive({
      node: props.node as Node,
      opened: false,
      text: '',
    });

    /**
     * Add text.
     */
    const addText = function () {
      if (state.text.length == 0) return;
      state.node.addAnnotation(state.text);
      state.opened = false;
      state.text = '';
    };

    watch(
      () => props.node,
      () => {
        state.node = props.node as Node;
      }
    );

    return {
      addText,
      state,
    };
  },
});
</script>
