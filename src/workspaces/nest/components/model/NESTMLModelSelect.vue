<template>
  <v-select
    v-model="model.templateName"
    :items
    density="compact"
    hide-details
    label="model template"
    max-width="400"
    item-props="{ prependIcon: 'mdi:mdi-file-upload-outline' }"
    @update:model-value="loadFromFile()"
  >
    <template #append-item>
      <v-list-item prepend-icon="mdi:mdi-github" title="load from Github" @click="loadFromGithub()" />
    </template>
  </v-select>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted } from "vue";
import { createDialog } from "vuetify3-dialog";

import { loadText } from "@/utils/fetch";

import { NESTModel } from "../../helpers/model/model";
import ImportNESTMLFromGithubDialog from "../dialog/ImportNESTMLFromGithubDialog.vue";

const emit = defineEmits(["update:model-value"]);
const props = defineProps<{ model: NESTModel }>();

const model = computed(() => props.model as NESTModel);

const items = [
  "iaf_psc_alpha_neuron",
  "iaf_cond_alpha_neuron",
  "izhikevich_neuron",
  "hh_psc_alpha_neuron",
  "static_synapse",
];

const loadFromFile = () => {
  nextTick(() => {
    loadText(`assets/workspaces/nest/models/nestml/${model.value.templateName}.nestml`).then((text: string) => {
      model.value.emptyParams();
      model.value.nestmlScript = text;
      emit("update:model-value");
    });
  });
};

const loadFromGithub = () => {
  createDialog({
    customComponent: {
      component: ImportNESTMLFromGithubDialog,
      props: { elementType: model.value.elementType },
    },
    dialogOptions: {
      width: "1280px",
    },
    text: "",
    title: "",
  }).then(
    // @ts-expect-error Types of parameters 'response' and 'value' are incompatible.
    (response: { elementType: string; modelId: string; script: string }) => {
      if (response) {
        // model.value.elementType = response.elementType as TElementType;
        model.value.templateName = response.modelId;
        model.value.nestmlScript = response.script;
        model.value.emptyParams();
        emit("update:model-value");
      }
    },
  );
};

onMounted(() => {
  if (model.value.templateName && model.value.nestmlScript.length === 0) {
    loadFromFile();
  }
});
</script>
