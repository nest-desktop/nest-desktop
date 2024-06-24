<template>
  <v-card>
    <v-toolbar class="px-2" color="transparent" density="compact" tile>
      Load NESTML template from GitHub

      <template #append>
        <v-btn>Load</v-btn>
      </template>
    </v-toolbar>

    <v-card-text>
      <codemirror v-model="state.script" />
    </v-card-text>

    <v-card-actions>
      <v-spacer />

      <v-combobox
        :append-inner-icon="
          state.valid && !simulatorStore.state.modules.includes(state.search)
            ? 'mdi:mdi-plus'
            : false
        "
        :hide-no-data="false"
        :items="simulatorStore.state.modules"
        :rules
        @click:append-inner="
          state.valid ? simulatorStore.addModule(state.search) : ''
        "
        class="px-2"
        density="compact"
        hide-details="auto"
        label="Module which model is installed to"
        max-width="400"
        prepend-inner-icon="mdi:mdi-memory"
        v-model:search="state.search"
        v-model="state.selectedModule"
        variant="outlined"
      >
        <template #no-data>
          <v-list-item>
            <v-list-item-title>
              No results matching "
              <strong>{{ state.search }}</strong
              >".
              <span v-if="state.valid">
                Click <kbd>+</kbd> to create a new one.
              </span>
            </v-list-item-title>
          </v-list-item>
        </template>

        <template #item="{ index, item, props }">
          <v-list-item :key="index" class="module-item" v-bind="props" title="">
            <template #append>
              <v-btn
                @click.stop="simulatorStore.removeModule(item.title)"
                class="icon"
                icon="mdi:mdi-close"
                flat
                size="x-small"
              />
            </template>

            {{ item.title }}
          </v-list-item>
        </template>
      </v-combobox>

      <v-btn
        @click="generateModel"
        :disabled="!state.valid || state.script.length === 0"
      >
        Generate
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, watch } from "vue";
import axios, { AxiosError, AxiosResponse } from "axios";

import { notifyError, notifySuccess } from "@/helpers/common/dialog";

const props = defineProps<{ modelId: string }>();
const modelId = computed(() => props.modelId);

const state = reactive({
  script: "",
  search: "nestmlmodule",
  selectedModule: "nestmlmodule",
  valid: false,
});

const rules = [
  (value: string) => {
    state.valid = value.endsWith("module");
    return state.valid || "The module name must ends with `module`.";
  },
];

import { useSimulatorStore } from "../../stores/simulatorStore";
const simulatorStore = useSimulatorStore();

const generateModel = () => {
  axios
    .post("http://localhost:52426/generate", {
      module_name: state.selectedModule,
      models: [
        {
          name: modelId.value,
          script: state.script,
        },
      ],
    })
    .then((response: AxiosResponse) => {
      switch (response.status) {
        case 200:
          notifySuccess(
            `Models (${response.data.status["INSTALLED"].join(
              ","
            )}) are successfully generated in "${state.selectedModule}" module.`
          );
          break;
        case 400:
          notifyError("Failed to generate model.");
          break;
      }
    })
    .catch((error: AxiosError) => {
      notifyError(error.message);
    });
};

const loadNESTMLScript = () => {
  axios
    .get(
      `https://raw.githubusercontent.com/nest/nestml/v7.0.2/models/neurons/${modelId.value}.nestml`
    )
    .then((response: AxiosResponse) => {
      if (response.data) {
        state.script = response.data;
      }
    })
    .catch(() => {
      state.script = "";
    });
};

onMounted(() => {
  loadNESTMLScript();
});

watch(() => props.modelId, loadNESTMLScript);
</script>

<style lang="scss">
.module-item {
  .icon {
    display: none;
  }

  &:hover {
    .icon {
      display: block;
    }
  }
}
</style>
