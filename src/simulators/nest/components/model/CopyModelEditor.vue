<template>
  <Card class="ma-1" v-if="model.show">
    <v-expansion-panels variant="accordion">
      <v-expansion-panel>
        <v-expansion-panel-title class="ma-0 pa-0 pr-3 pl-1 pt-1">
          <v-btn-group class="py-1 pr-2" style="width: 100%" variant="text">

            <v-avatar>
              <v-icon
                :icon="state.elementType == 'synapse'
                  ? 'mdi:mdi-checkbox-multiple-blank-circle-outline'
                  : 'mdi:mdi-content-copy'"
              />
            </v-avatar>

            <v-select
              :item-props="true"
              :items="state.items"
              :label="state.elementType + ' model'"
              @click.stop
              class="model-select text-primary mx-1"
              density="compact"
              hide-details
              item-title="label"
              item-value="id"
              v-model="model.existingModelId"
            >
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
                      variant="text"
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

            <v-menu :close-on-content-click="false" v-model="state.menu">
              <template #activator="{ props }">
                <v-btn
                  @click.prevent
                  @click.stop
                  class="menu-btn"
                  icon="mdi:mdi-order-bool-ascending-variant"
                  size="small"
                  rounded="pill"
                  variant="text"
                  v-bind="props"
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
                      v-for="(param, index) in model.model.paramsAll"
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

            <Menu>
              <slot>
                <CopyModelMenu :model />
              </slot>
            </Menu>

          </v-btn-group>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
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
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </Card>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";

import Card from "@/components/common/Card.vue";
import Menu from "@/components/common/Menu.vue";
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

<style lang="scss">
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
</style>
