<template>
  <div class="parameterEdit">
    <v-menu
      :position-x="state.menu.position.x"
      :position-y="state.menu.position.y"
      :value="state.menu.show"
      dense
      transition="slide-y-transition"
    >
      <v-card tile flat>
        <!-- <v-card-title
          :style="{ backgroundColor: state.color }"
          class="py-1"
          style="color:white; height:40px"
          v-text="paramLabel()"
        /> -->
        <v-subheader v-text="state.options.label" />

        <v-list dense>
          <v-list-item
            :key="index"
            @click="item.onClick"
            v-for="(item, index) in state.items"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon" />
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>

            <v-list-item-action v-show="item.append">
              <v-icon small v-text="'mdi-menu-right'" />
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <v-card @contextmenu="e => showMenu(e)" color="white" flat light tile>
      <v-row class="mx-1 my-0" no-gutters>
        <v-col cols="12">
          <template v-if="state.options.input === 'arrayInput'">
            <v-textarea
              :label="paramLabel()"
              @change="paramChange"
              auto-grow
              hide-details
              outlined
              small
              v-model="state.value"
            />
          </template>

          <template v-if="state.options.input === 'tickSlider'">
            <v-subheader class="paramLabel" v-text="paramLabel()" />
            <v-slider
              :max="state.options.ticks.length - 1"
              :thumb-color="state.color"
              :tick-labels="state.options.ticks"
              @change="paramChange"
              dense
              height="40"
              hide-details
              ticks="always"
              tick-size="4"
              v-model="state.value"
            >
              <!-- <template v-slot:append>
                <v-text-field
                  @change="paramChange"
                  class="mt-0 pt-0"
                  height="32"
                  hide-details
                  single-line
                  readonly
                  style="width: 60px; font-size:12px"
                  type="number"
                  :value="state.options.ticks[state.value]"
                />
              </template> -->
            </v-slider>
          </template>

          <template v-if="state.options.input === 'valueInput'">
            <v-text-field
              :label="paramLabel()"
              @change="paramChange"
              auto-grow
              hide-details
              outlined
              small
              v-model="state.value"
            />
          </template>

          <template v-if="state.options.input === 'valueSlider'">
            <v-subheader class="paramLabel" v-text="paramLabel()" />
            <v-slider
              :max="state.options.max || 1"
              :min="state.options.min || 0"
              :step="state.options.step || 1"
              :thumb-color="state.color"
              @change="paramChange"
              dense
              height="40"
              hide-details
              v-model="state.value"
            >
              <template v-slot:append>
                <v-text-field
                  @change="paramChange"
                  :max="state.options.max || 1"
                  :min="state.options.min || 0"
                  :step="state.options.step || 1"
                  class="mt-0 pt-0"
                  height="32"
                  hide-details
                  single-line
                  style="width: 60px; font-size:12px"
                  type="number"
                  v-model="state.value"
                />
              </template>
            </v-slider>
          </template>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';

import { Parameter } from '@/core/parameter';

export default Vue.extend({
  name: 'ParameterEdit',
  props: {
    color: String,
    value: [Object, Array, Number],
    param: Parameter,
    options: Object,
  },
  setup(props, { emit }) {
    const state = reactive({
      value: undefined,
      param: props.param as Parameter | undefined,
      items: [
        {
          icon: 'mdi-refresh',
          title: 'Set default value',
          onClick: () => {
            state.param.reset();
            state.param.paramChanges();
          },
        },
        {
          icon: 'mdi-dice-multiple-outline',
          title: 'Set random mode',
          onClick: () => {
            state.param.value = {
              parametertype: 'constant',
              specs: { value: state.value },
            };
          },
        },
        {
          icon: 'mdi-eye-off-outline',
          title: 'Hide parameter',
          onClick: () => {
            state.param.visible = false;
            state.param.paramChanges();
          },
        },
      ],
      menu: {
        show: false,
        position: {
          x: 0,
          y: 0,
        },
      },
      options: props.param ? props.param['options'] : props.options,
      color: props.color,
    });

    /**
     * Serialize for view.
     */
    const serialize = (value: any) => {
      if (state.options.input === 'tickSlider') {
        return state.options.ticks.indexOf(value); // returns tick index in ticks
      } else {
        return value;
      }
    };

    /**
     * Deserialize for data objects.
     */
    const deserialize = (value: any) => {
      if (state.options.input === 'tickSlider') {
        return state.options.ticks[value]; // returns tick values
      } else if (state.options.input === 'arrayInput') {
        return JSON.parse(`[${value}]`); // returns array and not string
      } else {
        return value;
      }
    };

    /**
     * Triggers when parameter is changed.
     */
    const paramChange = () => {
      emit('update:value', deserialize(state.value));
    };

    /**
     * Label parameter (with unit).
     */
    const paramLabel = () => {
      let label: String = `${state.options['label']}` || state.options.id;
      if (state.options.unit) {
        label += ` (${state.options['unit']})`;
      }
      return label;
    };

    /**
     * Show parameter menu.
     */
    const showMenu = function(e: MouseEvent) {
      if (this.param) {
        // https://thewebdev.info/2020/08/13/vuetify%E2%80%8A-%E2%80%8Amenus-and-context-menu/
        e.preventDefault();
        state.menu.show = false;
        state.menu.position.x = e.clientX;
        state.menu.position.y = e.clientY;
        this.$nextTick(() => {
          state.menu.show = true;
        });
      }
    };

    onMounted(() => {
      state.value = serialize(props.value);
    });

    watch(
      () => [props.color, props.options, props.param, props.value],
      ([color, options, param, value]) => {
        state.color = color;
        // It obtains setting from model parameter or from options props.
        state.options = param ? param['options'] : options;
        state.value = serialize(value);
      }
    );

    return { paramChange, paramLabel, showMenu, state };
  },
});
</script>

<style>
.parameterEdit .v-text-field {
  font-size: 12px;
}

.parameterEdit .v-slider__tick {
  font-size: 11px;
}
</style>
