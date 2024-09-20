<template>
  <Card class="ma-1" v-if="model.show">
    <v-card-title class="model-title">
      <v-select
        :item-props="true"
        :items="state.items"
        :label="state.elementType + ' model'"
        class="model-select text-primary"
        density="compact"
        hide-details
        item-title="label"
        item-value="id"
        v-model="model.existingModelId"
      >
        <template #append>
          <div class="d-print-none menu">
            <v-menu :close-on-content-click="false" v-model="state.menu">
              <template #activator="{ props }">
                <v-btn
                  color="primary"
                  icon="mdi:mdi-order-bool-ascending-variant"
                  size="small"
                  v-bind="props"
                  variant="text"
                />
              </template>

              <v-card>
                <v-card-text>
                  <template v-if="model.params">
                    <v-checkbox
                      :key="index"
                      :label="param.label"
                      :value="param.id"
                      density="compact"
                      hide-details
                      v-for="(param, index) in Object.values(model.params)"
                      v-model="model.paramsVisible"
                    >
                      <template #append>
                        {{ param.id }}: {{ param.value }}
                        {{ param.unit }}
                      </template>
                    </v-checkbox>
                  </template>
                </v-card-text>

                <v-card-actions>
                  <v-btn @click.stop="() => model.showAllParams()" text="all" />
                  <v-btn
                    @click.stop="() => model.hideAllParams()"
                    text="none"
                  />
                  <v-spacer />
                  <v-btn @click.stop="state.menu = false" text="close" />
                </v-card-actions>
              </v-card>
            </v-menu>

            <v-btn color="primary" icon size="small" variant="text">
              <v-icon icon="mdi:mdi-dots-vertical" />
              <CopyModelMenu :model />
            </v-btn>
          </div>
        </template>

        <template #item="{ props }">
          <v-list-item @click="select(props)" class="model-item">
            {{ props.title }}

            <template #append>
              <v-btn
                @click.stop="select(props, () => (state.menu = true))"
                class="icon"
                icon="mdi:mdi-menu-right"
                size="x-small"
                v-if="state.elementType"
              />
            </template>
          </v-list-item>
        </template>

        <template #prepend-item v-if="state.elementType">
          <v-list-item
            @click="
              () => {
                state.elementType = '';
                state.items = elementTypes;
              }
            "
          >
            Other element types

            <template #prepend>
              <v-icon icon="mdi:mdi-menu-left" />
            </template>
          </v-list-item>
        </template>
      </v-select>
    </v-card-title>

    <v-card-text>
      <v-text-field
        class="ma-1"
        density="compact"
        hide-details
        label="New label"
        v-model="model.newModelId"
      />

      <v-list class="py-0" v-if="model.paramsVisible.length > 0">
        <ParamListItem
          :key="index"
          :param="model.params[paramId]"
          v-for="(paramId, index) in model.paramsVisible"
        />
      </v-list>
    </v-card-text>
  </Card>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";

import Card from "@/components/common/Card.vue";
import ParamListItem from "@/components/parameter/ParamListItem.vue";

import CopyModelMenu from "./CopyModelMenu.vue";
import { NESTModel } from "../../helpers/model/model";
import { NESTCopyModel } from "../../helpers/model/copyModel";

const props = defineProps<{ model: NESTCopyModel }>();
const model = computed(() => props.model);

const state = reactive<{
  elementType: string;
  items: (NESTModel | { title: string; value: string })[];
  menu: boolean;
  panelIdx: number | null;
}>({
  elementType: "",
  items: [],
  menu: false,
  panelIdx: null,
});

const elementTypes = [
  { title: "neuron", value: "neuron" },
  { title: "recorder", value: "recorder" },
  { title: "stimulator", value: "stimulator" },
];

const select = (props: Record<string, unknown>, callback?: () => void) => {
  if (["neuron", "recorder", "stimulator"].includes(props.value as string)) {
    state.elementType = props.value as string;
    state.items =
      model.value.network.project.modelDBStore.getModelsByElementType(
        state.elementType
      ) as NESTModel[];
  } else {
    model.value.existingModelId = props.value as string;
  }

  if (callback) {
    callback();
  }
};

onMounted(() => {
  state.items = model.value.models;
  state.elementType = model.value.elementType;
});
</script>

<!-- <style lang="scss">
.model-title {
  .model-select {
    .v-label {
      font-size: 13px;
    }
  }

  .menu {
    opacity: 0;
  }

  &:hover {
    .menu {
      opacity: 1;
    }
  }
}

.v-list {
  overflow: visible;

  .v-list-item__content {
    overflow: visible;
  }
}

.v-input__prepend,
.v-input__append {
  padding-top: 0 !important;
}

.model-item {
  .icon {
    display: none;
  }

  &:hover {
    .icon {
      display: block;
    }
  }
}
</style> -->
