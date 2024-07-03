<template>
  <v-card class="my-2" flat>
    <v-toolbar color="transparent" density="compact">
      <v-select
        :items="state.githubTags"
        @update:model-value="fetchElementTypes()"
        class="mx-2"
        density="compact"
        hide-details
        item-title="name"
        item-value="name"
        label="Select a tag"
        v-model="state.githubTag"
        variant="outlined"
      />

      <v-select
        :items="state.elementTypes"
        @update:model-value="fetchModels"
        class="mx-2"
        density="compact"
        hide-details
        item-title="path"
        item-value="path"
        label="Select an element type"
        v-model="state.elementType"
        variant="outlined"
      />

      <v-select
        :disabled="state.models.length === 0"
        :items="state.models"
        class="mx-2"
        density="compact"
        hide-details
        item-title="path"
        item-value="path"
        label="Select a nestml file"
        v-model="state.model"
        variant="outlined"
      />

      <v-btn
        @click="loadNESTMLScript"
        icon="mdi:mdi-cloud-arrow-down-outline"
        title="Load nestml script"
        size="small"
      />

      <v-spacer />

      <v-btn @click="getParams" class="mx-1" variant="outlined">
        get params
      </v-btn>

      <template #append>
        <NESTModuleSelect
          @click.stop
          @update:model-value="updateModules()"
          chips
          width="400"
          multiple
          v-model="state.selectedModules"
        />
      </template>
    </v-toolbar>

    <v-card-text>
      <codemirror v-model="model.nestmlScript" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import axios, { AxiosError, AxiosResponse } from "axios";
import { computed, nextTick, onMounted, reactive, watch } from "vue";

import { notifyError } from "@/utils/dialog";

import NESTModuleSelect from "./NESTModuleSelect.vue";
import { NESTModel } from "../../helpers/model/model";

import { IModule, useModuleStore } from "../../stores/moduleStore";
const moduleStore = useModuleStore();

import { useNESTMLServerStore } from "../../stores/backends/nestmlServerStore";
const nestmlServerStore = useNESTMLServerStore();

interface IGithubTree {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
}

const props = defineProps<{ model: NESTModel }>();
const model = computed(() => props.model as NESTModel);

const state = reactive({
  elementType: "",
  elementTypes: [],
  githubTag: "v7.0.2",
  githubTags: [],
  model: "",
  models: [],
  selectedModules: moduleStore.state.modules.filter((module: IModule) =>
    module.models.includes(model.value.id)
  ),
});

const fetchElementTypes = () => {
  state.model = "";

  if (state.elementTypes.length === 0) {
    axios
      .get(
        `https://api.github.com/repos/nest/nestml/git/trees/${state.githubTag}`
      )
      .then((response: AxiosResponse) => {
        const modelsTree = response.data.tree.find(
          (tree: IGithubTree) => tree.path === "models"
        );
        axios
          .get(
            `https://api.github.com/repos/nest/nestml/git/trees/${modelsTree.sha}`
          )
          .then((response: AxiosResponse) => {
            state.elementTypes = response.data.tree;
          });
      });
  }
};

const fetchGithubTags = () => {
  state.elementType = "";
  state.model = "";

  axios
    .get("https://api.github.com/repos/nest/nestml/tags")
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        state.githubTags = response.data;
      }
    });
};

const fetchModels = (elementType: string | null) => {
  if (elementType) {
    const elementTypeTree = getTree(state.elementTypes, elementType);
    if (elementTypeTree) {
      axios.get(elementTypeTree.url).then((response: AxiosResponse) => {
        state.models = response.data.tree;
      });
    }
  }
};

const getParams = () => {
  nestmlServerStore
    .axiosInstance()
    .post("getParams", {
      element_type: model.value.elementType,
      script: model.value.nestmlScript,
    })
    .then((response: AxiosResponse) => {
      switch (response.status) {
        case 200:
          alert(JSON.stringify(response.data.params, null, 2));
          break;
        case 400:
          notifyError("Failed to get params for model.");
          break;
      }
    })
    .catch((error: AxiosError) => {
      notifyError(error.message);
    });
};

const getTree = (trees: IGithubTree[], path: string) => {
  return trees.find((tree: IGithubTree) => tree.path === path);
};

const loadNESTMLScript = () => {
  if (state.elementType && state.model) {
    const path = `https://raw.githubusercontent.com/nest/nestml/${state.githubTag}/models/${state.elementType}/${state.model}`;
    axios
      .get(path)
      .then((response: AxiosResponse) => {
        if (response.status === 200 && response.data) {
          model.value.nestmlScript = response.data;
          model.value.elementType = state.elementType.slice(
            0,
            state.elementType.length - 1
          );
        }
      })
      .catch(() => {
        model.value.nestmlScript = "";
      });
  }
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
      } else if (module.models.includes(model.value.id)) {
        module.models.splice(module.models.indexOf(model.value.id), 1);
      }
    });
  });
};

const update = () => {
  fetchGithubTags();
  fetchElementTypes();

  state.selectedModules = moduleStore.state.modules.filter((module: IModule) =>
    module.models.includes(model.value.id)
  );
};

onMounted(update);

watch(() => props.model, update);
</script>
