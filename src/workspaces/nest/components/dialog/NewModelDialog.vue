<template>
  <v-card width="800">
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="model.state.label"
            class="py-1"
            density="compact"
            label="model label"
            @update:model-value="updateModelId"
          />
        </v-col>

        <v-col cols="6">
          <NESTMLModelSelect :model="(model as NESTModel)" class="pt-1" @update:model-value="updateOnSelect" />
        </v-col>
      </v-row>

      <!-- <v-row class="text-h6" no-gutters>Preview</v-row> -->
      <v-window style="max-height: 450px; overflow: auto">
        <codemirror v-model="model.nestmlScript" />
      </v-window>
    </v-card-text>

    <v-card-actions>
      <v-btn
        append-icon="mdi:mdi-open-in-new"
        href="https://nestml.readthedocs.io"
        target="_blank"
        text="help"
        title="Doc about NESTML"
      />

      <v-spacer />
      <v-btn text="create" title="Create" @click="closeDialog(true)" />
      <v-btn text="cancel" title="Cancel" @click="closeDialog(false)" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import NESTMLModelSelect from "../model/NESTMLModelSelect.vue";
import { NESTModel } from "../../helpers/model/model";

const props = defineProps<{ modelValue: string }>();
const model = ref(new NESTModel({ custom: true }));

const emit = defineEmits(["closeDialog"]);
const closeDialog = (response: boolean) => emit("closeDialog", response ? model.value : undefined);

const updateModelId = (modelLabel: string) => nextTick(() => model.value.replaceModelId(modelLabel));

const updateOnSelect = () => {
  const modelLabel = model.value.state.label;
  model.value.replaceModelId(modelLabel);
};

onMounted(() => {
  model.value.state.label = props.modelValue;
  model.value.replaceModelId(model.value.state.label);
});
</script>
