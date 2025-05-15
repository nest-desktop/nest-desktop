<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center">
      <v-icon icon="mdi:mdi-import" size="small" />
      Import

      <v-btn flat icon="mdi:mdi-close" size="small" @click="closeDialog()" />
    </v-card-title>

    <v-toolbar class="px-2" color="transparent" density="compact">
      <v-btn-toggle v-model="state.source" class="mr-1" density="compact" mandatory>
        <v-btn v-for="(source, index) in sources" :key="index" style="min-width: 40px" v-bind="source" />
      </v-btn-toggle>

      <template v-if="state.source === 'github'">
        <v-btn-toggle
          v-model="state.githubGroup"
          class="mx-1"
          density="compact"
          mandatory
          @update:model-value="getTreesFromGithub()"
        >
          <v-btn v-for="(source, index) in groups" :key="index" style="min-width: 40px" v-bind="source" />
        </v-btn-toggle>

        <v-select
          v-model="state.githubSelectedTree"
          :disabled="state.githubTrees.length === 0"
          :items="state.githubTrees"
          :label="state.githubGroup + ' path'"
          class="mx-1"
          density="compact"
          flat
          hide-details
          item-title="path"
          prepend-icon="mdi:mdi-github"
          return-object
          @update:model-value="getFilesFromGithub"
        />

        <v-select
          v-model="state.githubSelectedFile"
          :disabled="state.githubFiles.length === 0"
          :items="state.githubFiles"
          class="mx-1"
          density="compact"
          flat
          hide-details
          item-title="path"
          label="File"
          return-object
          @update:model-value="updateURLFromGithub"
        />

        <v-btn flat prepend-icon="mdi:mdi-download" text="fetch" variant="outlined" @click="fetchProps()" />
      </template>

      <template v-else-if="state.source === 'drive'">
        <v-file-input
          density="compact"
          flat
          hide-details
          label="File"
          show-size
          title="Click to select a file"
          truncate-length="100"
          @update:model-value="loadProjectsFromDrive"
        >
          <template #append>
            <v-btn flat prepend-icon="mdi:mdi-upload" text="upload" @upload="loadProjectsFromDrive" />
          </template>
        </v-file-input>
      </template>

      <template v-else-if="state.source === 'url'">
        <v-text-field
          v-model="state.url"
          class="ma-0 pa-0"
          clearable
          density="compact"
          flat
          full-width
          hide-details
          label="URL"
          prepend-icon="mdi:mdi-web"
          title="Please enter the project's URL"
        >
          <template #append>
            <v-btn flat prepend-icon="mdi:mdi-download" text="fetch" @click="fetchProps()" />
          </template>
        </v-text-field>
      </template>

      <template v-else>
        <v-icon icon="mdi:mdi-arrow-left-thin" />
        Please select one source of files to import.
      </template>
    </v-toolbar>

    <v-data-table-virtual
      v-model="state.selected"
      :group-by="[{ key: 'group', order: 'asc' }]"
      :headers
      :items="state.items"
      :show-expand="false"
      item-selectable="valid"
      item-value="name"
      return-object
      show-select
    >
      <!-- <template #group-header="{ item, columns, toggleGroup, isGroupOpen }">
            <tr>
              <td :colspan="columns.length">
                <v-btn
                  :icon="isGroupOpen(item) ? '$expand' : '$next'"
                  :ref="
                    () => {
                      if (!isGroupOpen(item)) toggleGroup(item);
                    }
                  "
                  @click="toggleGroup(item)"
                  size="small"
                  variant="text"
                />
                {{ item.value }}
              </td>
            </tr>
          </template> -->

      <!-- <template #item.actions>
        <v-btn
          icon="mdi:mdi-code-json"
          size="x-small"
          variant="text"
        />
      </template> -->

      <template #[`item.valid`]="{ value }">
        <v-icon :color="value ? 'success' : 'error'" :icon="value ? 'mdi:mdi-check' : 'mdi:mdi-close'" />
      </template>

      <!-- <template #expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length" v-if="item.group === 'project'">
                {{ item.props.network.nodes.length }} nodes,
                {{ item.props.network.connections.length }} connections
              </td>
            </tr>
          </template> -->
    </v-data-table-virtual>

    <v-card-actions>
      <v-btn
        v-if="currentWorkspace === 'nest'"
        icon="mdi:mdi-database-arrow-up-outline"
        size="small"
        title="fetch from old database"
        variant="text"
        @click="fetchFromOldDatabase()"
      />

      <v-spacer />

      <v-btn
        :disabled="state.selected.length === 0"
        prepend-icon="mdi:mdi-import"
        text="import selected"
        @click="
          () => {
            importSelected();
            closeDialog();
          }
        "
      />
      <v-btn prepend-icon="mdi:mdi-delete-empty-outline" text="clear" @click="state.items = []" />
      <v-btn text="close" @click="closeDialog()" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive } from "vue";
import axios, { AxiosResponse } from "axios";

import { BaseModelDB } from "@/helpers/model/modelDB";
import { BaseProjectDB } from "@/helpers/project/projectDB";
import { INESTCopyModelProps } from "@/workspaces/nest/helpers/model/copyModel";
import { INodeGroupProps } from "@/helpers/node/nodeGroup";
import { INodeProps } from "@/helpers/node/node";
import { TModelProps, TNetworkProps, TProjectProps } from "@/types";
import { isNESTNetworkProps } from "@/workspaces/nest/helpers/network/network";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

interface IImportProps {
  group: string;
  name: string;
  props: TModelProps | TProjectProps;
  valid: boolean | undefined;
}

interface IGithubTree {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
}

const emit = defineEmits(["closeDialog"]);
const closeDialog = (value?: string | boolean) => emit("closeDialog", value);

const currentWorkspace = computed(() => appStore.state.currentWorkspace);
const modelDBStore = computed(() => appStore.currentWorkspace.stores.modelDBStore);
const projectDBStore = computed(() => appStore.currentWorkspace.stores.projectDBStore);

const state = reactive<{
  githubFiles: IGithubTree[];
  githubGroup: string;
  githubSelectedFile: IGithubTree;
  githubSelectedTree: IGithubTree;
  githubTag: string;
  githubTrees: IGithubTree[];
  items: IImportProps[];
  selected: TModelProps | TProjectProps[];
  source: string;
  url: string;
}>({
  githubFiles: [],
  githubGroup: "project",
  githubSelectedFile: { path: "" } as IGithubTree,
  githubSelectedTree: { path: "" } as IGithubTree,
  githubTag: "v3",
  githubTrees: [],
  items: [
    // {
    //   group: "project",
    //   props: { createdAt: "date 1", name: "test" },
    //   valid: true,
    // },
    // {
    //   group: "project",
    //   props: { createdAt: "date 2", name: "foo bar" },
    //   valid: false,
    // },
    // {
    //   group: "model",
    //   props: { label: "foo bar" },
    //   valid: true,
    // },
  ] as IImportProps[],
  selected: [],
  source: "",
  url: "",
});

const groups = [
  {
    icon: "graph:network",
    title: "project repo",
    value: "projects",
  },
  {
    icon: "nest:logo",
    title: "model repo",
    value: "models",
  },
];

const sources = [
  {
    icon: "mdi:mdi-paperclip",
    title: "Import from drive",
    value: "drive",
  },
  {
    icon: "mdi:mdi-github",
    title: "Import from GitHub",
    value: "github",
  },
  {
    icon: "mdi:mdi-web",
    title: "Import from URL",
    value: "url",
  },
];

const headers = [
  { title: "Name", value: "name" },
  { title: "Created at", key: "props.createdAt" },
  { title: "Version", key: "props.version" },
  { title: "Valid", key: "valid" },
  // { title: "Actions", key: "actions" },
];

const githubAPI = (group?: string) =>
  `https://api.github.com/repos/nest-desktop/nest-desktop-${group || state.githubGroup}/git/trees/`;
const githubRawURL = (group?: string) =>
  `https://raw.githubusercontent.com/nest-desktop/nest-desktop-${group || state.githubGroup}/${state.githubTag}/`;

/**
 * Add and validate props.
 */
const addProps = (dataRaw: (TModelProps | TProjectProps) | (TModelProps | TProjectProps)[]) => {
  if (dataRaw == undefined) return;

  const dataProps: (TModelProps | TProjectProps)[] = Array.isArray(dataRaw) ? dataRaw : [dataRaw];
  dataProps.forEach((props: TModelProps | TProjectProps) => {
    let valid = false;

    const group = "elementType" in props ? "model" : "network" in props ? "project" : undefined;

    if (group === undefined) return;

    const modelIds: string[] = [];
    let projectProps: TProjectProps;
    let modelProps: TModelProps;
    let name: string = "";
    let networkProps: TNetworkProps;

    switch (group) {
      case "model":
        modelProps = props as TModelProps;
        name = modelProps.label || "";
        valid = modelDBStore.value.validateModel(modelProps);
        break;
      case "project":
        projectProps = props as TProjectProps;
        name = projectProps.name || "";
        valid = projectDBStore.value.validateProject(projectProps);

        networkProps = projectProps.network as TNetworkProps;

        // Get model Ids from copied models if not installed in NEST Desktop.
        if (networkProps && isNESTNetworkProps(networkProps)) {
          networkProps.models?.forEach((modelProps: INESTCopyModelProps) => {
            if (!modelProps.existing) return;

            if (!modelDBStore.value.hasModel(modelProps.existing) && !modelIds.includes(modelProps.existing)) {
              modelIds.push(modelProps.existing);
            }
          });
        }

        // Get model Ids from node models if not installed in NEST Desktop.
        networkProps.nodes?.forEach((nodeProps: INodeProps | INodeGroupProps) => {
          if (!("model" in nodeProps)) return;

          const nodeItemProps = nodeProps as INodeProps;
          if (
            nodeItemProps.model &&
            !modelDBStore.value.hasModel(nodeItemProps.model) &&
            !modelIds.includes(nodeItemProps.model)
          ) {
            modelIds.push(nodeItemProps.model);
          }
        });

        axios.get(githubRawURL("models") + `index.json`).then((response: AxiosResponse<Record<string, string>>) => {
          if (!response.data) return;

          modelIds.forEach((modelId: string) => {
            const path = response.data[modelId];
            if (!path) return;

            getModelFromGithub(path, modelId);
          });
        });

        break;
    }

    state.items.push({
      group,
      name,
      props,
      valid,
    });
  });
};

/**
 * Get model from github.
 */
const getModelFromGithub = (path: string, modelId: string) => {
  axios.get(githubRawURL("models") + path).then((response: AxiosResponse<TModelProps | TModelProps[]>) => {
    if (!response.data) return;

    const modelsProps: TModelProps[] = Array.isArray(response.data) ? response.data : [response.data];

    const modelProps = modelsProps.find((modelProps: TModelProps) => modelProps.id === modelId);
    if (!modelProps) return;
    const valid = modelDBStore.value.validateModel(modelProps);

    state.items.push({
      group: "model",
      name: modelProps.label || "",
      props: modelProps,
      valid,
    });
  });
};

/**
 * Get files from github.
 */
const getFilesFromGithub = (tree: IGithubTree) => {
  state.githubSelectedFile = { path: "" } as IGithubTree;
  state.githubFiles = [];

  axios.get(githubAPI() + tree.sha).then((response: AxiosResponse<{ tree: IGithubTree[] }>) => {
    state.githubFiles = response.data.tree.filter((d: IGithubTree) => d.type === "blob" && d.path.endsWith(".json"));
  });
};

/**
 * Get trees from github.
 */
const getTreesFromGithub = () => {
  state.githubSelectedTree = { path: "" } as IGithubTree;
  state.githubSelectedFile = { path: "" } as IGithubTree;
  state.githubFiles = [];
  state.githubTrees = [];
  nextTick(() => {
    axios
      .get(githubAPI() + `${state.githubTag}?recursive=true`)
      .then((response: AxiosResponse<{ tree: IGithubTree[] }>) => {
        state.githubTrees = response.data.tree.filter((tree: IGithubTree) => tree.type === "tree");
      });
  });
};

/**
 * Fetch props from old database.
 */
const fetchFromOldDatabase = () => {
  const modelDB = new BaseModelDB("MODEL_STORE");
  const projectDB = new BaseProjectDB("PROJECT_STORE");

  modelDB.list("updatedAt", true).then((modelsProps: TModelProps[]) =>
    modelsProps.forEach((modelProps: TModelProps) => {
      delete modelProps._id;
      delete modelProps._rev;
      addProps(modelProps);
    }),
  );

  projectDB.list("updatedAt", true).then((projectsProps: TProjectProps[]) =>
    projectsProps.forEach((projectProps: TProjectProps) => {
      delete projectProps._id;
      delete projectProps._rev;
      addProps(projectProps);
    }),
  );
};

/**
 * Fetch props from URL.
 */
const fetchProps = (url?: string) => {
  if (state.url.length === 0) return;
  axios
    .get(url || state.url)
    .then((response: AxiosResponse<TModelProps | TProjectProps | (TProjectProps | TModelProps)[]>) =>
      addProps(response.data),
    );
};

/**
 * Import selected.
 */
const importSelected = () => {
  importSelectedModels();
  importSelectedProjects();
};

/**
 * Import selected models.
 */
const importSelectedModels = () => {
  const modelsProps: TModelProps[] = state.selected
    .filter((data: IImportProps) => data.group === "model")
    .map((data: IImportProps) => data.props) as TModelProps[];
  modelDBStore.value.importModels(modelsProps);
};

/**
 * Import selected projects.
 */
const importSelectedProjects = () => {
  const projectsProps: TProjectProps[] = state.selected
    .filter((data: IImportProps) => data.group === "project")
    .map((data: IImportProps) => data.props) as TProjectProps[];
  projectDBStore.value.importProjects(projectsProps);
};

/**
 * Load projects from drive.
 */
const loadProjectsFromDrive = (files: File | File[]) => {
  const file = Array.isArray(files) ? files[0] : files;
  if (!file) return;

  const fileReader = new FileReader();
  fileReader.readAsText(file);
  fileReader.addEventListener("load", (event: ProgressEvent<FileReader>) =>
    addProps(JSON.parse(event.target?.result as string)),
  );
};

/**
 * Update URL from github.
 */
const updateURLFromGithub = () => {
  nextTick(() => {
    const tree = state.githubSelectedTree;
    if (!tree && !Object.keys(tree).includes("path")) return;

    state.url = githubRawURL() + `${tree.path}/${state.githubSelectedFile.path}`;
  });
};
</script>
