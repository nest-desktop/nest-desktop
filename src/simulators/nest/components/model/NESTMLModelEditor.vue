<template>
  <v-card class="my-2" flat>
    <v-toolbar color="transparent" density="compact">
      <v-select
        :items
        @update:model-value="loadFromFile"
        density="compact"
        hide-details
        max-width="400"
        item-props="{ prependIcon: 'mdi:mdi-file-upload-outline' }"
        v-model="state.filename"
      >
        <template #append-item>
          <v-list-item
            @click="loadFromGithub()"
            prepend-icon="mdi:mdi-github"
            title="Load from Github"
          />
        </template>
      </v-select>

      <v-spacer />

      <NESTModuleCombobox
        @click.stop
        @update:model-value="updateModules()"
        chips
        max-width="400"
        multiple
        v-model="state.selectedModules"
      />
    </v-toolbar>

    <v-card-text>
      <codemirror v-model="model.nestmlScript" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, watch } from "vue";
import { createDialog } from "vuetify3-dialog";

// import { TModelStore } from "@/stores/model/defineModelStore";
import { loadText } from "@/utils/fetch";

import NESTMLScriptDialog from "../dialog/NESTMLScriptDialog.vue";
import NESTModuleCombobox from "../module/NESTModuleCombobox.vue";
import { NESTModel } from "../../helpers/model/model";
import { updateSimulationModules } from "../../stores/model/modelStore";

// import { useNESTModelStore } from "../../stores/model/modelStore";
// const modelStore: TModelStore = useNESTModelStore();

import { IModule, useNESTModuleStore } from "../../stores/moduleStore";
const moduleStore = useNESTModuleStore();

// import { useNESTMLServerStore } from "../../stores/backends/nestmlServerStore";
// const nestmlServerStore = useNESTMLServerStore();

const props = defineProps<{ model: NESTModel }>();
const model = computed(() => props.model as NESTModel);

const state = reactive<{
  filename: string;
  selectedModules: IModule[];
}>({
  filename: "",
  selectedModules: moduleStore.state.modules.filter((module: IModule) =>
    module.models.includes(model.value.id)
  ),
});

const items = [
  "iaf_psc_alpha_neuron",
  "iaf_cond_alpha_neuron",
  "hh_psc_alpha_neuron",
  "static_synapse",
];

const loadFromFile = () => {
  nextTick(() => {
    loadText(`/assets/simulators/nest/nestml/${state.filename}.nestml`).then(
      (text: string) => (model.value.nestmlScript = text)
    );
  });
};

const loadFromGithub = () => {
  createDialog({
    title: "",
    text: "",
    customComponent: {
      component: NESTMLScriptDialog,
      props: { elementType: model.value.elementType },
    },
    dialogOptions: {
      width: "1280px",
    },
  }).then((response: any) => {
    if (response) {
      model.value.nestmlScript = response.script;
      model.value.elementType = response.elementType;
    }
  });
};

const update = () => {
  state.selectedModules = moduleStore.state.modules.filter((module: IModule) =>
    module.models.includes(model.value.id)
  );
};

const updateModules = () => {
  moduleStore.state.modules.forEach((module: IModule) => {
    nextTick(() => {
      if (
        state.selectedModules.includes(module) &&
        !module.models.includes(model.value.id) &&
        model.value.nestmlScript.length > 0
      ) {
        module.models.push(model.value.id);
      } else if (
        !state.selectedModules.includes(module) &&
        module.models.includes(model.value.id)
      ) {
        module.models.splice(module.models.indexOf(model.value.id), 1);
      }

      updateSimulationModules();
    });
  });
};

onMounted(update);

watch(() => props.model, update);
</script>
