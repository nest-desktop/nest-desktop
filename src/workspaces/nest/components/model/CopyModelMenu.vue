<template>
  <v-card flat style="min-width: 300px">
    <!-- <v-card-title class="pa-0">
      <v-row no-gutters>
        <v-col cols="12">
          <NodeModelSelect :node="node" />
        </v-col>
      </v-row>
    </v-card-title> -->

    <span v-if="state.content == undefined">
      <v-list density="compact">
        <v-list-item v-for="(item, index) in items" v-show="item.show()" :key="index" v-bind="item">
          <template #append>
            <template v-if="item.append">
              <v-icon icon="mdi:mdi-menu-right" size="small" />
            </template>

            <!-- <template v-if="item.input === 'checkbox'">
              <v-checkbox
                :color="node.view.color"
                :input-value="state[item.value]"
              />
            </template>

            <template v-if="item.input === 'switch'">
              <v-switch
                :color="node.view.color"
                :value="state[item.value]"
                dense
                hide-details
              />
            </template> -->
          </template>

          <template #prepend>
            <v-icon v-bind="item.icon" />
          </template>
        </v-list-item>
      </v-list>
    </span>

    <span>
      <v-dialog :value="state.dialog" width="80%">
        <ModelDocumentation :model-id="model.existingModelId" />
      </v-dialog>
    </span>
  </v-card>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";

import ModelDocumentation from "../../views/ModelDoc.vue";
import { NESTCopyModel } from "../../helpers/model/copyModel";
import { confirmDialog } from "@/helpers/common/confirmDialog";

const props = defineProps<{ model: NESTCopyModel }>();
const model = computed(() => props.model);

const state = reactive<{
  content: string | undefined;
  dialog: boolean;
  show: boolean;
  spatialNode: boolean;
}>({
  content: undefined as string | undefined,
  dialog: false,
  show: false,
  spatialNode: false,
});

const items = [
  {
    icon: {
      class: "mdi-flip-h",
      icon: "mdi:mdi-reload",
    },
    id: "resetParams",
    onClick: () => {
      model.value.resetParams();
    },
    append: false,
    show: () => true,
    title: "Reset all parameters",
  },
  {
    icon: { icon: "mdi:mdi-information-outline" },
    id: "modelDoc",
    onClick: () => {
      state.dialog = true;
    },
    show: () => model.value.existingModelId !== "voltmeter",
    title: "Model documentation",
  },
  {
    icon: { icon: "mdi:mdi-trash-can-outline" },
    id: "copyModelDelete",
    onClick: () => {
      confirmDialog({
        text: "Are you sure to delete copied model?",
        title: "Delete copied model?",
      }).then((answer: boolean) => {
        if (answer) model.value.remove();
      });
    },
    show: () => true,
    title: "Delete copied model",
  },
];
</script>
