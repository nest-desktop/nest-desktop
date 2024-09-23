<template>
  <v-select
    :items
    @update:model-value="loadFromFile()"
    density="compact"
    hide-details
    max-width="400"
    label="model template"
    item-props="{ prependIcon: 'mdi:mdi-file-upload-outline' }"
    v-model="modelId"
  >
    <template #append-item>
      <v-list-item
        @click="loadFromGithub()"
        prepend-icon="mdi:mdi-github"
        title="Load from Github"
      />
    </template>
  </v-select>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from "vue";
import { createDialog } from "vuetify3-dialog";

import { loadText } from "@/utils/fetch";

import { NESTModel } from "../../helpers/model/model";
import ImportNESTMLFromGithubDialog from "../dialog/ImportNESTMLFromGithubDialog.vue";
import { TElementType } from "@/helpers/model/model";

const emit = defineEmits(["update:model-value"]);
const props = defineProps<{ model: NESTModel; modelValue?: string }>();

const modelId = ref(props.modelValue || "");
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
    loadText(`/assets/simulators/nest/nestml/${modelId.value}.nestml`).then(
      (text: string) => {
        model.value.nestmlScript = text;
        emit("update:model-value");
      }
    );
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
    // @ts-ignore
    (response: { elementType: string; modelId: string; script: string }) => {
      if (response) {
        model.value.nestmlScript = response.script;
        model.value.elementType = response.elementType as TElementType;
        modelId.value = response.modelId;
        emit("update:model-value");
      }
    }
  );
};

onMounted(() => {
  if (modelId.value) {
    loadFromFile();
  }
});
</script>
