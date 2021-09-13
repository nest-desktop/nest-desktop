<template>
  <div model="model" v-if="state.model">
    <v-app-bar
      app
      class="no-print"
      clipped-left
      clipped-right
      color="model"
      dark
      dense
      flat
    >
      <v-btn-toggle
        group
        light
        mandatory
        style="margin-left: -16px"
        v-model="state.modeIdx"
      >
        <v-tooltip :open-delay="1000" bottom>
          <template #activator="{ on, attrs }">
            <v-btn class="mx-0 px-6" v-bind="attrs" v-on="on">
              <v-col>
                <v-row style="place-content: center">
                  <v-icon v-text="'mdi-text-box-outline'" />
                </v-row>
                <v-row
                  style="place-content: center; font-size: 10px"
                  v-text="'Doc'"
                />
              </v-col>
            </v-btn>
          </template>
          View model documentation
        </v-tooltip>

        <v-tooltip :open-delay="1000" bottom>
          <template #activator="{ on, attrs }">
            <v-btn class="mx-0 px-6" v-bind="attrs" v-on="on">
              <v-col>
                <v-row style="place-content: center">
                  <v-icon v-text="'mdi-chart-line'" />
                </v-row>
                <v-row
                  style="place-content: center; font-size: 10px"
                  v-text="'Explorer'"
                />
              </v-col>
            </v-btn>
          </template>
          Explore model
        </v-tooltip>

        <!-- <v-tooltip :open-delay="1000" bottom>
          <template #activator="{ on, attrs }">
            <v-btn class="mx-0 px-6" v-bind="attrs" v-on="on">
              <v-col>
                <v-row style="place-content: center">
                  <v-icon v-text="'mdi-pencil'" />
                </v-row>
                <v-row
                  style="place-content: center; font-size: 10px"
                  v-text="'Editor'"
                />
              </v-col>
            </v-btn>
          </template>
          Edit model
        </v-tooltip> -->
      </v-btn-toggle>

      <v-spacer />
      <v-toolbar-title class="pl-12" v-text="state.model.label" />
      <v-spacer />
    </v-app-bar>

    <v-main>
      <ModelDocumentation :id="state.modelId" v-if="state.modeIdx == 0" />
      <ModelExplorer :id="state.modelId" v-if="state.modeIdx == 1" />
      <ModelEditor :id="state.modelId" v-if="state.modeIdx == 2" />
    </v-main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';
import ModelDocumentation from '@/components/model/ModelDocumentation.vue';
import ModelEditor from '@/components/model/ModelEditor.vue';
import ModelExplorer from '@/components/model/ModelExplorer.vue';
import core from '@/core';

export default Vue.extend({
  name: 'Model',
  components: {
    ModelDocumentation,
    ModelEditor,
    ModelExplorer,
  },
  props: {
    id: String,
  },
  setup(props) {
    const state = reactive({
      modeIdx: 0,
      modelId: '',
      model: {},
    });

    onMounted(() => {
      state.modelId = props.id as string;
      state.model = core.app.getModel(state.modelId);
    });

    watch(
      () => props.id,
      id => {
        state.modelId = id as string;
        state.model = core.app.getModel(state.modelId);
      }
    );
    return { state };
  },
});
</script>
