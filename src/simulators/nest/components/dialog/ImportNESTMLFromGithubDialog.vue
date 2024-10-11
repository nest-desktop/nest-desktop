<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center">
      <v-icon icon="mdi:mdi-github" size="small" />
      Load NESTML script from GitHub

      <v-btn @click="closeDialog()" flat icon="mdi:mdi-close" size="small" />
    </v-card-title>

    <v-card-text>
      <v-row class="mb-2">
        <v-select
          :disabled="state.githubTags.length === 0"
          :items="state.githubTags"
          @update:model-value="fetchElementTypes"
          class="mx-2"
          density="compact"
          hide-details
          item-title="name"
          item-value="name"
          label="Select a tag"
          v-model="state.githubTag"
        />

        <v-select
          :disabled="state.elementTypes.length === 0"
          :items="state.elementTypes"
          @update:model-value="fetchModels()"
          class="mx-2"
          density="compact"
          hide-details
          item-title="path"
          item-value="path"
          label="Select an element type"
          v-model="state.elementType"
        />

        <v-select
          :disabled="state.modelFilenames.length === 0"
          :items="state.modelFilenames"
          @update:model-value="fetchNESTMLScript"
          class="mx-2"
          density="compact"
          hide-details
          item-title="path"
          item-value="path"
          label="Select a nestml file"
          v-model="state.modelFilename"
        />

        <v-btn
          :disabled="!state.script"
          @click="loadNESTMLScript()"
          text="load"
          title="Load NESTML script"
        />
      </v-row>

      <v-row class="text-h6" no-gutters>Preview</v-row>
      <v-window style="max-height: 500px; overflow: auto">
        <codemirror disabled v-model="state.script" />
      </v-window>
    </v-card-text>

    <!-- <v-card-actions>
      <v-btn
        :disabled="!state.script"
        @click="loadNESTMLScript()"
        size="small"
        text="load"
        title="Load NESTML script"
      />

      <v-btn
        @click="closeDialog()"
        size="small"
        text="close"
      />
    </v-card-actions> -->
  </v-card>
</template>

<script lang="ts" setup>
import axios, { AxiosResponse } from "axios";
import { nextTick, onMounted, reactive } from "vue";

import { useNESTMLServerStore } from "../../stores/backends/nestmlServerStore";
const nestmlServerStore = useNESTMLServerStore();

const props = defineProps<{ elementType: string }>();

interface IGithubTree {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
}

const state = reactive<{
  elementType: string;
  elementTypes: IGithubTree[];
  githubTag: string | undefined;
  githubTags: IGithubTree[];
  modelFilename: string;
  modelFilenames: IGithubTree[];
  script: string;
}>({
  elementType: "",
  elementTypes: [],
  githubTag: nestmlServerStore.state.response.data?.nestml
    ? "v" + nestmlServerStore.state.response.data?.nestml
    : undefined,
  githubTags: [],
  modelFilename: "",
  modelFilenames: [],
  script: "",
});

const githubAPI = "https://api.github.com/repos/nest/nestml";
const githubRaw = "https://raw.githubusercontent.com/nest/nestml";

const emit = defineEmits(["closeDialog"]);
const closeDialog = (value?: Object) => emit("closeDialog", value);

const fetchElementTypes = () => {
  state.elementType = "";
  state.modelFilename = "";
  state.modelFilenames = [];

  nextTick(() => {
    axios
      .get(`${githubAPI}/git/trees/${state.githubTag}`)
      .then((response: AxiosResponse) => {
        const modelsTree = getTree(response.data.tree, "models");
        if (modelsTree) {
          axios
            .get(`${githubAPI}/git/trees/${modelsTree.sha}`)
            .then((response: AxiosResponse) => {
              state.elementTypes = response.data.tree || [];
            });
        }
      });
  });
};

const fetchGithubTags = async () => {
  state.elementType = "";
  state.modelFilename = "";

  return axios.get(`${githubAPI}/tags`).then((response: AxiosResponse) => {
    if (response.status === 200) {
      state.githubTags = response.data || [];
    }
  });
};

const fetchModels = () => {
  nextTick(() => {
    const elementTypeTree = getTree(state.elementTypes, state.elementType);
    if (elementTypeTree) {
      axios.get(elementTypeTree.url).then((response: AxiosResponse) => {
        state.modelFilenames = response.data.tree;
      });
    }
  });
};

const fetchNESTMLScript = () => {
  nextTick(() => {
    const path = `${githubRaw}/${state.githubTag}/models/${state.elementType}/${state.modelFilename}`;
    axios.get(path).then((response: AxiosResponse) => {
      if (response.status === 200 && response.data) {
        state.script = response.data;
      }
    });
  });
};

const getTree = (trees: IGithubTree[], path: string) =>
  trees.find((tree: IGithubTree) => tree.path === path);

const loadNESTMLScript = () => {
  const modelId = state.modelFilename.split(".")[0];
  const elementType = state.elementType.slice(0, state.elementType.length - 1);
  closeDialog({ elementType, modelId, script: state.script });
};

onMounted(() => {
  fetchGithubTags().then(() => {
    state.elementType = props.elementType + "s";

    if (state.githubTag) {
      fetchElementTypes();
    }
  });
});
</script>
