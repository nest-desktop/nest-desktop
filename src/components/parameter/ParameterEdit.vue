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
        <v-card-subtitle class="pb-0" v-text="state.options.label" />

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
                      :value="action.value()"
                      :color="state.color"
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
              <v-col cols="6" class="py-0">
                <v-text-field
                  hide-details
                  label="default"
                  type="number"
                  v-model="state.options.value"
                />
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  v-model="state.options.unit"
                  hide-details
                  label="unit"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" class="py-0">
                <v-text-field
                  hide-details
                  label="min"
                  type="number"
                  v-model="state.options.min"
                />
              </v-col>
              <v-col cols="4" class="py-0">
                <v-text-field
                  hide-details
                  label="step"
                  type="number"
                  v-if="state.options.step"
                  v-model="state.options.step"
                />
              </v-col>
              <v-col cols="4" class="py-0">
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
            <v-btn @click="generateValues" small outlined v-text="'generate'" />
          </v-card-actions>
        </span>
      </v-card>
    </v-menu>

    <v-card @contextmenu="e => showMenu(e)" color="white" flat light tile>
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
                @change="paramChange()"
                auto-grow
                class="my-1"
                hide-details
                outlined
                small
                v-model="state.value"
              />
            </template>

            <template v-if="state.options.input === 'checkbox'">
              <v-checkbox
                :color="state.color"
                :label="label()"
                :readonly="state.options.readonly"
                @change="paramChange()"
                class="ma-1"
                dense
                hide-details
                v-model="state.value"
              />
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
                @change="paramChange"
                class="mb-2"
                dense
                height="40"
                tick-size="4"
                ticks="always"
              >
                <template #message>
                  <div
                    @click="closeMessage"
                    class="mb-1 mt-2"
                    style="background-color: #eeeeee; cursor: pointer"
                  >
                    <v-divider />
                    <v-row class="mx-0 py-1">
                      <v-col class="text-center" cols="2">
                        <v-icon large right v-text="'mdi-alert-outline'" />
                      </v-col>
                      <v-col cols="10">
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
                :value="state.value"
                @blur="e => paramChange(e.target.value)"
                @change="paramChange"
                auto-grow
                hide-details
                outlined
                small
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
                :rules="rules"
                :readonly="state.options.readonly || false"
                :step="state.options.step || 1"
                :thumb-color="state.color"
                :value="state.value"
                @change="paramChange"
                dense
                height="40"
                thumb-label
              >
                <template #message>
                  <div
                    @click="closeMessage"
                    class="mb-1"
                    style="
                      background-color: #eeeeee;
                      cursor: pointer;
                      margin-left: -37px;
                      margin-right: -105px;
                    "
                  >
                    <v-divider />
                    <v-row class="mx-0 py-1">
                      <v-col class="text-center" cols="2">
                        <v-icon
                          :small="state.options.iconSize != null ? true : false"
                          :large="state.options.iconSize != null ? false : true"
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
                      v-text="'mdi-minus'"
                      v-show="!state.options.readonly"
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
                      v-text="'mdi-plus'"
                      v-show="!state.options.readonly"
                    />
                  </v-btn>
                  <v-text-field
                    :readonly="state.options.readonly"
                    :step="state.options.step || 1"
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

import { ValueGenerator } from '@/core/parameter/valueGenerator';

import { ModelParameter } from '@/core/parameter/modelParameter';
import { Parameter } from '@/core/parameter/parameter';
import ParameterEditExpert from '@/components/parameter/ParameterEditExpert.vue';

export default Vue.extend({
  name: 'ParameterEdit',
  components: {
    ParameterEditExpert,
  },
  props: {
    color: String,
    value: [Object, Array, Number, String, Boolean],
    param: [ModelParameter, Parameter],
    options: Object,
  },
  setup(props, { emit }) {
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
            // paramChange();
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
      param: props.param as ModelParameter | Parameter | undefined,
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

    const generateValues = () => {
      state.valueGenerator.sort =
        state.param.id.includes('time') || state.param.id.includes('Time');
      state.value = state.valueGenerator.generate();
      paramChange();
    };

    /**
     * Triggers when parameter is changed.
     */
    const paramChange = (value: any = undefined) => {
      // if (state.value < state.options.min) {
      //   state.options.min = state.value;
      // }
      // if (state.value > state.options.max) {
      //   state.options.max = state.value;
      // }

      let changed: boolean = true;
      if (typeof value === 'number') {
        // slider
        changed = state.value !== value;
        state.value = value;
      } else if (typeof value === 'string') {
        // text field
        changed = state.value !== Number(value);
        state.value = Number(value);
      }
      if (changed) {
        emit('update:value', deserialize(state.value));
      }
    };

    /**
     * Triggers when parameter in expert mode is changed.
     */
    const paramExpertChange = () => {
      state.expertMode = !state.param.isConstant();
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
        return state.param.title;
      } else {
        let text = state.options.label;
        return state.options.unit ? text + ` (${state.options.unit})` : text;
      }
    };

    /**
     * Increment value
     */
    const increment = (e: any) => {
      if (e.ctrlKey) {
        state.value += parseFloat(state.options.step) * 10 || 10;
      } else {
        state.value += parseFloat(state.options.step) || 1;
      }
      paramChange();
    };

    /**
     * Increment value
     */
    const decrement = (e: any) => {
      if (e.ctrlKey) {
        state.value += parseFloat(state.options.step) * 10 || 10;
      } else {
        state.value -= parseFloat(state.options.step) || 1;
      }
      paramChange();
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
        state.param = props.param as ModelParameter | Parameter;
        state.expertMode = !state.param.isConstant();
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
        if (state.message.length > 0) {
          state.timeoutId = setTimeout(() => {
            state.message = '';
          }, 7500);
        }
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
</style>
