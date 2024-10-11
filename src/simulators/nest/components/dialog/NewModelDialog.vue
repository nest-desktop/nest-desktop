<template>
  <v-card width="800">
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-text-field
            @update:model-value="updateModelId"
            class="py-1"
            density="compact"
            label="model label"
            v-model="model.state.label"
          />
        </v-col>

        <v-col cols="6">
          <NESTMLModelSelect
            :model="(model as NESTModel)"
            @update:model-value="updateOnSelect"
            class="pt-1"
          />
        </v-col>
      </v-row>

      <!-- <v-row class="text-h6" no-gutters>Preview</v-row> -->
      <v-window style="max-height: 450px; overflow: auto">
        <codemirror v-model="model.nestmlScript" />
      </v-window>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="closeDialog(false)" text="cancel" title="Cancel" />
      <v-btn @click="closeDialog(true)" text="create" title="Create" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from "vue";
import NESTMLModelSelect from "../model/NESTMLModelSelect.vue";
import { NESTModel } from "../../helpers/model/model";

const props = defineProps<{ modelValue: string }>();
const model = ref(new NESTModel({ custom: true }));

const emit = defineEmits(["closeDialog"]);
const closeDialog = (response: boolean) =>
  emit("closeDialog", response ? model.value : undefined);

const updateModelId = (modelLabel: string) =>
  nextTick(() => model.value.replaceModelId(modelLabel));

const updateOnSelect = () => {
  const modelLabel = model.value.state.label;
  model.value.replaceModelId(modelLabel);
};

onMounted(() => {
  model.value.state.label = props.modelValue;
  model.value.replaceModelId(model.value.state.label);
});
</script>
