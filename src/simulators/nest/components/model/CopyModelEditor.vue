<template>
  <Card
    v-if="model.show"
    class="ma-1"
  >
    <v-expansion-panels variant="accordion">
      <v-expansion-panel>
        <v-expansion-panel-title class="ma-0 pa-0 pr-3 pl-1 pt-1">
          <v-btn-group
            class="py-1 pr-2"
            style="width: 100%"
            variant="text"
          >
            <v-avatar>
              <v-icon
                :icon="state.elementType == 'synapse'
                  ? 'mdi:mdi-checkbox-multiple-blank-circle-outline'
                  : 'mdi:mdi-content-copy'"
              />
            </v-avatar>

            <v-select
              v-model="model.existingModelId"
              :item-props="true"
              :items="state.items"
              :label="state.elementType + ' model'"
              class="model-select text-primary mx-1"
              density="compact"
              hide-details
              item-title="label"
              item-value="id"
              @click.stop
            >
              <template #item="{ props:itemProps }">
                <v-list-item
                  class="model-item"
                  @click="select(itemProps)"
                >
                  {{ itemProps.title }}

                  <template #append>
                    <v-btn
                      v-if="state.elementType"
                      class="icon"
                      icon="mdi:mdi-menu-right"
                      size="x-small"
                      variant="text"
                      @click.stop="select(itemProps, () => (state.menu = true))"
                    />
                  </template>
                </v-list-item>
              </template>

              <template
                v-if="state.elementType"
                #prepend-item
              >
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

            <v-menu
              v-model="state.menu"
              :close-on-content-click="false"
            >
              <template #activator="{ props:btnProps }">
                <v-btn
                  class="menu-btn"
                  icon="mdi:mdi-order-bool-ascending-variant"
                  size="small"
                  rounded="pill"
                  variant="text"
                  v-bind="btnProps"
                  @click.prevent
                  @click.stop
                />
              </template>

              <v-card>
                <v-card-text>
                  <template v-if="model.params">
                    <v-checkbox
                      v-for="(param, index) in model.model.paramsAll"
                      :key="index"
                      v-model="model.paramsVisible"
                      :label="param.label"
                      :value="param.id"
                      density="compact"
                      hide-details
                    >
                      <template #append>
                        {{ param.id }}: {{ param.value }}
                        {{ param.unit }}
                      </template>
                    </v-checkbox>
                  </template>
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    text="all"
                    @click.stop="() => model.showAllParams()"
                  />
                  <v-btn
                    text="none"
                    @click.stop="() => model.hideAllParams()"
                  />
                  <v-spacer />
                  <v-btn
                    text="close"
                    @click.stop="state.menu = false"
                  />
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
            v-model="model.newModelId"
            class="ma-1"
            density="compact"
            hide-details
            label="New label"
          />

          <v-list
            v-if="model.paramsVisible.length > 0"
            class="py-0"
          >
            <ParamListItem
              v-for="(paramId, index) in model.paramsVisible"
              :key="index"
              :param="model.params[paramId]"
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
