<template>
  <div class="parameterEdit">
    <v-menu
      :close-on-content-click="false"
      :position-x="state.menu.position.x"
      :position-y="state.menu.position.y"
      :value="state.menu.show"
      dense
      transition="slide-y-transition"
    >
      <v-card :min-width="300" flat tile>
        <v-card-subtitle class="pb-0" v-text="label()" />

        <span v-if="state.content == null">
          <v-list dense>
            <v-list-item
              :key="index"
              @click="item.onClick"
              v-for="(item, index) in state.items"
              v-show="item.visible"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon" />
              </v-list-item-icon>
              <v-list-item-title v-text="item.title" />
              <v-list-item-action v-if="item.actions.length > 0">
                <v-row>
                  <span
                    :key="'action' + action.id"
                    class="mx-1"
                    v-for="action in item.actions"
                  >
                    <v-switch
                      :color="state.color"
                      :value="action.value()"
                      dense
                      hide-details
                      v-if="action.id === 'switch'"
                    />
                  </span>
                </v-row>
              </v-list-item-action>
              <v-list-item-action v-if="item.append">
                <v-icon small v-text="'mdi-menu-right'" />
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </span>

        <span v-if="state.content === 'configSlider'">
          <v-card-text>
            <v-row>
              <v-col class="py-0">
                <v-text-field
                  hide-details
                  label="label"
                  v-model="state.options.label"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col class="py-0" cols="6">
                <v-text-field
                  hide-details
                  label="default"
                  type="number"
                  v-model="state.options.value"
                />
              </v-col>
              <v-col class="py-0" cols="6">
                <v-text-field
                  hide-details
                  label="unit"
                  v-model="state.options.unit"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col class="py-0" cols="4">
                <v-text-field
                  hide-details
                  label="min"
                  type="number"
                  v-model="state.options.min"
                />
              </v-col>
              <v-col class="py-0" cols="4">
                <v-text-field
                  hide-details
                  label="step"
                  type="number"
                  v-if="state.options.step"
                  v-model="state.options.step"
                />
              </v-col>
              <v-col class="py-0" cols="4">
                <v-text-field
                  hide-details
                  label="max"
                  type="number"
                  v-model="state.param.options.max"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="backMenu" outlined small text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
          </v-card-actions>
        </span>

        <span v-if="state.content === 'generateValues'">
          <v-card-text>
            <v-select
              :items="state.valueGenerator.types"
              dense
              hide-details
              v-model="state.valueGenerator.type"
            />
            <v-row no-gutters>
              <v-col
                :key="param.id"
                class="mx-1"
                v-for="param in state.valueGenerator.options"
                v-show="param.visible"
              >
                <v-text-field
                  :label="param.label"
                  class="mt-5"
                  dense
                  hide-details
                  type="number"
                  v-model="state.valueGenerator.params[param.id]"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="backMenu" small outlined text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-spacer />
            <v-btn @click="generateValues" outlined small v-text="'generate'" />
          </v-card-actions>
        </span>
      </v-card>
    </v-menu>

    <v-card @contextmenu="e => showMenu(e)" flat tile>
      <v-row class="px-1 my-0" no-gutters>
        <v-col cols="12">
          <template v-if="state.expertMode">
            <ParameterEditExpert
              :param="state.param"
              @update:param="paramExpertChange"
            />
          </template>

          <template v-else>
            <template v-if="state.options.input === 'arrayInput'">
              <v-textarea
                :label="label()"
                :row-height="12"
                :rows="1"
                :value="state.value"
                @change="value => paramChange(value)"
                auto-grow
                class="my-1"
                hide-details
                outlined
                small
              />
            </template>

            <template v-if="state.options.input === 'checkbox'">
              <v-checkbox
                :color="state.color"
                :label="label()"
                :readonly="state.options.readonly"
                :value="state.value"
                @change="value => paramChange(value)"
                class="ma-1"
                dense
                hide-details
              />
            </template>

            <template v-if="state.options.input === 'checkbox+valueInput'">
              <span class="d-flex">
                <v-checkbox
                  :color="state.color"
                  :label="label()"
                  :readonly="state.options.readonly"
                  class="ma-1"
                  dense
                  hide-details
                  v-model="state.visible"
                />
                <v-spacer />
                <v-text-field
                  :disabled="!state.visible"
                  :label="label()"
                  :value="state.value"
                  @blur="e => paramChange(e.target.value)"
                  @change="paramChange"
                  class="mt-0 ml-2 pt-0"
                  height="32"
                  hide-details
                  single-line
                  style="width: 60px; font-size: 12px"
                  type="number"
                />
              </span>
            </template>

            <template v-if="state.options.input === 'select'">
              <v-select
                :color="state.color"
                :items="state.options.items"
                :label="label()"
                :readonly="state.options.readonly"
                @change="paramChange(state.value)"
                class="ma-1 mt-3"
                dense
                hide-details
                v-model="state.value"
              />
            </template>

            <template
              v-if="
                state.options.input === 'rangeSlider' &&
                Array.isArray(state.value)
              "
            >
              <v-subheader class="paramLabel" v-text="label()" />
              <v-range-slider
                :hide-details="state.message.length === 0"
                :hint="state.message"
                :max="state.options.max"
                :min="state.options.min"
                :persistent-hint="state.message.length > 0"
                :rules="rules"
                :thumb-color="state.color"
                :value="state.value"
                @change="value => paramChange(value)"
                class="align-center"
                dense
                height="40"
                thumb-label
              >
                <template #prepend>
                  <v-text-field
                    :value="state.value[0]"
                    @change="$set(state.value, 0, $event)"
                    class="mt-0 ml-2 pt-0"
                    height="32"
                    hide-details
                    single-line
                    style="width: 60px; font-size: 12px"
                    type="number"
                  />
                </template>
                <template #append>
                  <v-text-field
                    :value="state.value[1]"
                    @change="$set(state.value, 1, $event)"
                    class="mt-0 ml-2 pt-0"
                    height="32"
                    hide-details
                    single-line
                    style="width: 60px; font-size: 12px"
                    type="number"
                  />
                </template>
              </v-range-slider>
            </template>

            <template v-if="state.options.input === 'tickSlider'">
              <v-subheader class="paramLabel" v-text="label()" />
              <v-slider
                :hide-details="state.message.length === 0"
                :hint="state.message"
                :max="state.options.ticks.length - 1"
                :persistent-hint="state.message.length > 0"
                :rules="rules"
                :thumb-color="state.color"
                :tick-labels="state.options.ticks"
                :value="state.value"
                @change="value => paramChange(value)"
                class="mb-2"
                dense
                height="40"
                tick-size="4"
                ticks="always"
              >
                <template #message>
                  <div @click="closeMessage" class="mb-1 message mt-2">
                    <v-divider />
                    <v-row class="mx-0 py-1">
                      <v-col class="text-center" cols="2">
                        <v-icon large right v-text="'mdi-alert-outline'" />
                      </v-col>
                      <v-col cols="10" style="margin: auto">
                        <div v-text="state.message" />
                      </v-col>
                    </v-row>
                    <v-divider />
                  </div>
                </template>
              </v-slider>
            </template>

            <template v-if="state.options.input === 'valueInput'">
              <v-text-field
                :label="label()"
                @blur="e => paramChange(e.target.value)"
                auto-grow
                hide-details
                outlined
                small
                v-model="state.value"
              />
            </template>

            <template v-if="state.options.input === 'valueSlider'">
              <v-subheader class="paramLabel" v-text="label()" />
              <v-slider
                :hide-details="state.message.length === 0"
                :hint="state.message"
                :max="state.options.max || 1"
                :min="state.options.min || 0"
                :persistent-hint="state.message.length > 0"
                :readonly="state.options.readonly || false"
                :rules="rules"
                :step="state.options.step || 1"
                :thumb-color="state.color"
                :value="state.value"
                @change="value => paramChange(value)"
                dense
                height="40"
                thumb-label
              >
                <template #message>
                  <div
                    @click="closeMessage"
                    class="mb-1 message"
                    style="margin-left: -37px; margin-right: -105px"
                  >
                    <v-divider />
                    <v-row class="mx-0 py-1">
                      <v-col class="text-center" cols="2">
                        <v-icon
                          :large="state.options.iconSize === 'large'"
                          :small="state.options.iconSize === 'small'"
                          right
                          v-text="
                            state.options.rules[0].includes('info')
                              ? 'mdi-information-outline'
                              : 'mdi-alert-outline'
                          "
                        />
                      </v-col>
                      <v-col cols="10">
                        <div v-text="state.message" />
                      </v-col>
                    </v-row>
                    <v-divider />
                  </div>
                </template>
                <template #prepend>
                  <v-btn
                    :disabled="
                      (state.value <= state.options.min && false) ||
                      state.options.readonly
                    "
                    @click="decrement"
                    icon
                    small
                  >
                    <v-icon
                      :color="color"
                      class="slider-icon"
                      v-show="!state.options.readonly"
                      v-text="'mdi-minus'"
                    />
                  </v-btn>
                </template>
                <template #append>
                  <v-btn
                    :disabled="
                      (state.value >= state.options.max && false) ||
                      state.options.readonly
                    "
                    @click="increment"
                    icon
                    small
                  >
                    <v-icon
                      :color="color"
                      class="slider-icon"
                      v-show="!state.options.readonly"
                      v-text="'mdi-plus'"
                    />
                  </v-btn>
                  <v-text-field
                    :readonly="state.options.readonly"
                    :step="state.options.step || 1"
                    @blur="e => paramChange(e.target.value)"
                    class="mt-0 ml-2 pt-0"
                    height="32"
                    hide-details
                    single-line
                    style="width: 60px; font-size: 12px"
                    type="number"
                    v-model="state.value"
                  />
                </template>
              </v-slider>
            </template>
          </template>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';

import { ModelParameter } from '@/core/model/modelParameter';
import { NodeParameter } from '@/core/node/nodeParameter';
import { Parameter } from '@/core/parameter/parameter';
import { SynapseParameter } from '@/core/synapse/synapseParameter';
import { ValueGenerator } from '@/core/parameter/valueGenerator';
import ParameterEditExpert from '@/components/parameter/ParameterEditExpert.vue';

export default Vue.extend({
  name: 'ParameterEdit',
  components: {
    ParameterEditExpert,
  },
  props: {
    color: String,
    value: [Object, Array, Number, String, Boolean],
    param: [NodeParameter, ModelParameter, SynapseParameter, Parameter],
    options: Object,
  },
  setup(props, { emit }) {
    type paramTypes =
      | NodeParameter
      | ModelParameter
      | SynapseParameter
      | Parameter
      | undefined;

    const state = reactive({
      color: props.color,
      content: null,
      expertMode: false,
      items: [
        {
          actions: [],
          icon: 'mdi-refresh',
          title: 'Set default value',
          onClick: () => {
            state.param.reset();
            state.param.paramChanges();
            closeMenu();
          },
          visible: true,
        },
        {
          actions: [],
          append: true,
          icon: 'mdi-numeric',
          title: 'Generate values',
          onClick: () => {
            state.content = 'generateValues';
          },
          visible: true,
        },
        {
          actions: [
            {
              id: 'switch',
              value: () => state.expertMode,
            },
          ],
          icon: '$diceMultipleOutline',
          title: 'Expert mode',
          onClick: () => {
            state.param.value = state.value;
            state.param.type = 'constant';
            state.expertMode = !state.expertMode;
          },
          visible: true,
        },
        {
          actions: [],
          append: true,
          icon: 'mdi-pencil-outline',
          title: 'Config slider',
          onClick: () => {
            state.content = 'configSlider';
          },
          visible: true,
        },
        {
          actions: [],
          icon: 'mdi-eye-off-outline',
          title: 'Hide parameter',
          onClick: () => {
            state.param.state.visible = false;
            state.param.paramChanges();
            closeMenu();
          },
          visible: true,
        },
      ],
      menu: {
        show: false,
        position: {
          x: 0,
          y: 0,
        },
      },
      message: '',
      options: props.param ? props.param['options'] : props.options,
      param: props.param as paramTypes,
      showConfig: false,
      timeoutId: undefined,
      value: undefined,
      valueGenerator: new ValueGenerator(),
    });

    /**
     * Serialize for view.
     */
    const serialize = (value: any) => {
      switch (state.options.input) {
        case 'tickSlider':
          return state.options.ticks.indexOf(value);
        default:
          return value;
      }
    };

    /**
     * Deserialize for data objects.
     */
    const deserialize = (value: any) => {
      switch (state.options.input) {
        case 'tickSlider':
          return state.options.ticks[value]; // returns tick values
        case 'arrayInput':
          if (typeof value === 'string') {
            return value.startsWith('[') && value.endsWith(']')
              ? JSON.parse(value)
              : JSON.parse(`[${value}]`); // returns array
          } else {
            return value;
          }
        default:
          return value;
      }
    };

    /**
     * Generate values for an array.
     */
    const generateValues = () => {
      state.valueGenerator.sort =
        state.param.id.includes('time') || state.param.id.includes('Time');
      state.value = state.valueGenerator.generate();
      paramChange(state.value);
    };

    /**
     * Triggers when parameter is changed.
     */
    const paramChange = (value: boolean | number | string) => {
      // if (state.value < state.options.min) {
      //   state.options.min = state.value;
      // }
      // if (state.value > state.options.max) {
      //   state.options.max = state.value;
      // }

      let changed: boolean = true;
      switch (typeof value) {
        case 'string': // text field
          changed = Number(value) !== state.value;
          state.value = Number(value);
          break;
        default:
          changed = value !== state.value;
          state.value = value;
          break;
      }

      // Prevent auto simulation when the value is actually not changed.
      if (changed) {
        emit('update:value', deserialize(state.value));
      }
    };

    /**
     * Triggers when parameter in expert mode is changed.
     */
    const paramExpertChange = () => {
      state.expertMode = !state.param.isConstant;
      state.param.paramChanges();
    };

    /**
     * Show parameter menu.
     */
    const showMenu = function (e: MouseEvent) {
      e.preventDefault();
      if (this.param) {
        // https://thewebdev.info/2020/08/13/vuetify%E2%80%8A-%E2%80%8Amenus-and-context-menu/
        state.menu.show = false;
        state.menu.position.x = e.clientX;
        state.menu.position.y = e.clientY;
        this.$nextTick(() => {
          state.content = null;
          state.menu.show = true;
        });
      }
    };

    /**
     * Parameter label.
     */
    const label = () => {
      if (state.param) {
        return state.param.labelInput;
      } else {
        const label = state.options.label as string;
        return state.options.unit ? label + ` (${state.options.unit})` : label;
      }
    };

    /**
     * Increment value
     */
    const increment = (e: any) => {
      let value = state.value;
      if (e.ctrlKey) {
        value += parseFloat(state.options.step) * 10 || 10;
      } else {
        value += parseFloat(state.options.step) || 1;
      }
      paramChange(value);
    };

    /**
     * Increment value
     */
    const decrement = (e: any) => {
      let value = state.value;
      if (e.ctrlKey) {
        value += parseFloat(state.options.step) * 10 || 10;
      } else {
        value -= parseFloat(state.options.step) || 1;
      }
      paramChange(value);
    };

    /**
     * Return to main menu content.
     */
    const backMenu = () => {
      state.content = null;
    };

    /**
     * Close menu.
     */
    const closeMenu = () => {
      state.content = null;
      state.menu.show = false;
    };

    /**
     * show menu items.
     */
    const showMenuItems = () => {
      state.items[1].visible = state.options.input === 'arrayInput';
      state.items[2].visible = ['valueSlider', 'arrayInput'].includes(
        state.options.input
      );
      state.items[3].visible = state.options.input === 'valueSlider';
    };

    /**
     * Update param and expert mode.
     */
    const update = () => {
      state.color = props.color;
      state.value = serialize(props.value);
      if (props.param) {
        state.options = props.param['options'];
        state.param = props.param as paramTypes;
        state.expertMode = !state.param.isConstant;
      } else {
        state.options = props.options;
      }
      state.options.errorMessages = [];
      showMenuItems();
    };

    /**
     * Close message text.
     */
    const closeMessage = () => {
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
      }
      state.message = '';
    };

    /**
     * Rules for value validation.
     */
    const rules = [
      (value: number) => {
        if (state.timeoutId) {
          clearTimeout(state.timeoutId);
        }
        let messageType: string = '';
        if (state.options.unit && state.options.unit === 'ms' && value < 0) {
          messageType = 'error';
          state.message = `The ${state.options.label} cannot be negative.`;
        } else if (state.options.rules != null) {
          state.options.rules.forEach((rule: string[]) => {
            state.message = eval(rule[0]) ? rule[1] : '';
            messageType = eval(rule[0]) ? rule[2] : '';
          });
        }
        // if (state.message.length > 0) {
        //   state.timeoutId = setTimeout(() => {
        //     state.message = '';
        //   }, 7500);
        // }
        return messageType === 'error' ? state.message : true;
      },
    ];

    onMounted(() => {
      update();
    });

    watch(
      () => [props.color, props.options, props.param, props.value],
      () => {
        update();
      }
    );

    return {
      closeMessage,
      backMenu,
      decrement,
      generateValues,
      increment,
      label,
      paramChange,
      paramExpertChange,
      rules,
      showMenu,
      state,
    };
  },
});
</script>

<style>
.parameterEdit .v-text-field {
  font-size: 12px;
}

.parameterEdit .v-textarea textarea {
  line-height: 1.4em !important;
}

.parameterEdit .v-slider__tick {
  font-size: 11px;
}

.parameterEdit .slider-icon {
  display: none;
}

.parameterEdit:hover .slider-icon {
  display: block;
}

.parameterEdit .message {
  background-color: rgba(0, 0, 0, 0.12);
  cursor: pointer;
}
</style>
