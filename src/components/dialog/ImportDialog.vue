<template>
  <v-dialog max-width="1280">
    <template #default="{ isActive }">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <v-icon icon="mdi:mdi-import" size="small" />
          Import

          <v-btn
            @click="isActive.value = false"
            flat
            icon="mdi:mdi-close"
            size="small"
          />
        </v-card-title>

        <v-toolbar class="px-2" color="transparent" density="compact">
          <v-btn-toggle
            class="mr-1"
            density="compact"
            mandatory
            v-model="state.source"
            variant="outlined"
          >
            <v-btn
              :key="index"
              style="min-width: 40px"
              v-bind="source"
              v-for="(source, index) in sources"
            />
          </v-btn-toggle>

          <template v-if="state.source === 'github'">
            <v-btn-toggle
              @update:model-value="getTreesFromGithub"
              class="mx-1"
              density="compact"
              mandatory
              v-model="state.githubGroup"
              variant="outlined"
            >
              <v-btn
                :key="index"
                style="min-width: 40px"
                v-bind="source"
                v-for="(source, index) in groups"
              />
            </v-btn-toggle>

            <v-select
              :disabled="state.githubTrees.length === 0"
              :items="state.githubTrees"
              :label="state.githubGroup + ' path'"
              @update:model-value="getFilesFromGithub"
              class="mx-1"
              density="compact"
              flat
              hide-details
              item-title="path"
              prepend-icon="mdi:mdi-github"
              return-object
              v-model="state.githubSelectedTree"
              variant="outlined"
            />

            <v-select
              :disabled="state.githubFiles.length === 0"
              :items="state.githubFiles"
              @update:model-value="updateURLFromGithub"
              class="mx-1"
              density="compact"
              flat
              hide-details
              item-title="path"
              label="File"
              return-object
              v-model="state.githubSelectedFile"
              variant="outlined"
            />

            <v-btn
              @click="fetchProps()"
              flat
              prepend-icon="mdi:mdi-download"
              variant="outlined"
            >
              Fetch
            </v-btn>
          </template>

          <template v-else-if="state.source === 'drive'">
            <v-file-input
              @update:model-value="loadProjectsFromDrive"
              density="compact"
              flat
              hide-details
              label="File"
              show-size
              title="Click to select a file"
              truncate-length="100"
              variant="outlined"
            >
              <template #append>
                <v-btn
                  @upload="loadProjectsFromDrive"
                  flat
                  prepend-icon="mdi:mdi-upload"
                  variant="outlined"
                >
                  Upload
                </v-btn>
              </template>
            </v-file-input>
          </template>

          <template v-else-if="state.source === 'url'">
            <v-text-field
              class="ma-0 pa-0"
              clearable
              density="compact"
              flat
              full-width
              hide-details
              label="URL"
              prepend-icon="mdi:mdi-web"
              title="Please enter the project's URL"
              v-model="state.url"
              variant="outlined"
            >
              <template #append>
                <v-btn
                  @click="fetchProps()"
                  flat
                  prepend-icon="mdi:mdi-download"
                  variant="outlined"
                >
                  Fetch
                </v-btn>
              </template>
            </v-text-field>
          </template>

          <template v-else>
            <v-icon icon="mdi:mdi-arrow-left-thin" />
            Please select one source of files to import.
          </template>
        </v-toolbar>

        <v-data-table-virtual
          :group-by="[{ key: 'group', order: 'asc' }]"
          :headers
          :items="state.items"
          :show-expand="false"
          item-selectable="valid"
          item-value="name"
          return-object
          show-select
          v-model="state.selected"
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

          <template #item.valid="{ value }">
            <v-icon
              :color="value ? 'success' : 'error'"
              :icon="value ? 'mdi-check' : 'mdi-close'"
            />
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
            :disabled="state.selected.length === 0"
            @click="
              () => {
                importSelected();
                isActive.value = false;
              }
            "
            prepend-icon="mdi:mdi-import"
            size="small"
            text="import selected"
            variant="outlined"
          />

          <v-btn
            @click="state.items = []"
            prepend-icon="mdi:mdi-delete-empty-outline"
            size="small"
            text="Clear"
            variant="outlined"
          />

          <v-btn
            @click="isActive.value = false"
            size="small"
            text="close"
            variant="outlined"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, nextTick, reactive } from "vue";
import axios, { AxiosResponse } from "axios";

import { INESTCopyModelProps } from "@/simulators/nest/helpers/model/copyModel";
import { isNESTNetworkProps } from "@/simulators/nest/helpers/network/network";

import { TModelDBStore } from "@/stores/model/defineModelDBStore";
import { INodeGroupProps } from "@/helpers/node/nodeGroup";
import { INodeProps } from "@/helpers/node/node";
import { TModelProps, TNetworkProps, TProjectProps } from "@/types";
import { TProjectDBStore } from "@/stores/project/defineProjectDBStore";

// import { useAppStore } from "@/stores/appStore";
// const appStore = useAppStore();

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

const props = defineProps<{
  modelDBStore: TModelDBStore;
  projectDBStore: TProjectDBStore;
}>();

const modelDBStore = computed(() => props.modelDBStore);
const projectDBStore = computed(() => props.projectDBStore);

const state = reactive({
  githubFiles: [] as IGithubTree[],
  githubGroup: "project",
  githubSelectedFile: { path: "" } as IGithubTree,
  githubSelectedTree: { path: "" } as IGithubTree,
  githubTag: "v3",
  githubTrees: [] as IGithubTree[],
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
    icon: "network:network",
    title: "Import projects",
    value: "projects",
  },
  {
    icon: "nest:logo",
    title: "Import models",
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
];

const githubAPI = (group?: string) =>
  `https://api.github.com/repos/nest-desktop/nest-desktop-${
    group || state.githubGroup
  }/git/trees/`;
const githubRawURL = (group?: string) =>
  `https://raw.githubusercontent.com/nest-desktop/nest-desktop-${
    group || state.githubGroup
  }/${state.githubTag}/`;

/**
 * Add and validate props.
 */
const addProps = (
  dataRaw: (TModelProps | TProjectProps) | (TModelProps | TProjectProps)[]
) => {
  if (dataRaw == undefined) return;

  const dataProps: (TModelProps | TProjectProps)[] = Array.isArray(dataRaw)
    ? dataRaw
    : [dataRaw];
  dataProps.forEach((props: TModelProps | TProjectProps) => {
    let valid = false;

    const group =
      "elementType" in props
        ? "model"
        : "network" in props
        ? "project"
        : undefined;

    if (group === undefined) return;

    const modelIds: string[] = [];
    let projectProps: TProjectProps;
    let modelProps: TModelProps;
    let name: string = "";

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

        const networkProps = projectProps.network as TNetworkProps;

        // Get model Ids from copied models if not installed in NEST Desktop.
        if (networkProps && isNESTNetworkProps(networkProps)) {
          networkProps.models?.forEach((modelProps: INESTCopyModelProps) => {
            if (!modelProps.existing) return;

            if (
              !modelDBStore.value.hasModel(modelProps.existing) &&
              !modelIds.includes(modelProps.existing)
            ) {
              modelIds.push(modelProps.existing);
            }
          });
        }

        // Get model Ids from node models if not installed in NEST Desktop.
        networkProps.nodes?.forEach(
          (nodeProps: INodeProps | INodeGroupProps) => {
            if (!("model" in nodeProps)) return;

            const nodeItemProps = nodeProps as INodeProps;
            if (
              nodeItemProps.model &&
              !modelDBStore.value.hasModel(nodeItemProps.model) &&
              !modelIds.includes(nodeItemProps.model)
            ) {
              modelIds.push(nodeItemProps.model);
            }
          }
        );

        axios
          .get(githubRawURL("models") + `index.json`)
          .then(
            (
              response: AxiosResponse<any, { data: Record<string, string> }>
            ) => {
              if (!response.data) return;

              modelIds.forEach((modelId: string) => {
                const path = response.data[modelId];
                if (!path) return;

                getModelFromGithub(path, modelId);
              });
            }
          );

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
  axios
    .get(githubRawURL("models") + path)
    .then(
      (response: AxiosResponse<any, { data: TModelProps | TModelProps[] }>) => {
        if (!response.data) return;

        const modelsProps: TModelProps[] = Array.isArray(response.data)
          ? response.data
          : [response.data];

        const modelProps = modelsProps.find(
          (modelProps: TModelProps) => modelProps.id === modelId
        );
        if (!modelProps) return;
        const valid = modelDBStore.value.validateModel(props);

        state.items.push({
          group: "model",
          name: modelProps.label || "",
          props: modelProps,
          valid,
        });
      }
    );
};

/**
 * Get files from github.
 */
const getFilesFromGithub = (tree: IGithubTree) => {
  state.githubSelectedFile = { path: "" } as IGithubTree;
  state.githubFiles = [];

  axios
    .get(githubAPI() + tree.sha)
    .then((response: AxiosResponse<any, { data: { tree: IGithubTree[] } }>) => {
      state.githubFiles = response.data.tree.filter(
        (d: IGithubTree) => d.type === "blob" && d.path.endsWith(".json")
      );
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
      .then(
        (response: AxiosResponse<any, { data: { tree: IGithubTree[] } }>) => {
          state.githubTrees = response.data.tree.filter(
            (tree: IGithubTree) => tree.type === "tree"
          );
        }
      );
  });
};

/**
 * Fetch props from URL.
 */
const fetchProps = (url?: string) => {
  if (state.url.length === 0) return;
  axios.get(url || state.url).then(
    (
      response: AxiosResponse<
        any,
        {
          data: TModelProps | TProjectProps | (TProjectProps | TModelProps)[];
        }
      >
    ) => addProps(response.data)
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
    addProps(JSON.parse(event.target?.result as string))
  );
};

/**
 * Update URL from github.
 */
const updateURLFromGithub = () => {
  nextTick(() => {
    const tree = state.githubSelectedTree;
    if (!tree && !Object.keys(tree).includes("path")) {
      return;
    }
    state.url =
      githubRawURL() + `${tree.path}/${state.githubSelectedFile.path}`;
  });
};
</script>
