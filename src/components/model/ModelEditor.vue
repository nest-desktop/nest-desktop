<template>
  <div class="modelEditor" v-if="modelView.state.model">
    <v-card
      flat
      style="height: calc(100vh - 48px); overflow-y: auto"
      v-if="modelView.hasModel()"
    >
      <v-card-title>
        <v-text-field
          hide-details
          label="label"
          v-model="modelView.state.model.label"
        />
      </v-card-title>

      <v-card-subtitle
        v-if="
          modelView.state.model.recordables != null &&
          modelView.state.model.recordables.length > 0
        "
      >
        Recordables:
        <span
          :key="recordable.id"
          v-for="recordable in modelView.state.model.recordables"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-chip
                class="ma-1"
                outlined
                small
                v-bind="attrs"
                v-on="on"
                v-text="recordable.id"
              />
            </template>
            {{ recordable.label }}
            <span v-if="recordable.unit"> ({{ recordable.unit }})</span>
          </v-tooltip>
        </span>
      </v-card-subtitle>

      <v-card-text>
        <v-data-table
          :disable-pagination="true"
          :fixed-header="true"
          :headers="headers"
          :hide-default-footer="true"
          :items-per-page="-1"
          :items="modelView.state.model.params"
        >
          <template #[`item.value`]="{ item }">
            <v-text-field
              @change="modelView.updateProject()"
              dense
              hide-details
              v-model="item.value"
            />
          </template>
          <template #[`item.unit`]="{ item }">
            <v-text-field dense hide-details v-model="item.unit" />
          </template>
          <template #[`item.label`]="{ item }">
            <v-text-field dense hide-details v-model="item.label" />
          </template>
          <template #[`item.input`]="{ item }">
            <v-select :items="items" dense hide-details v-model="item.input" />
          </template>
          <template #[`item.inputSpec`]="{ item }">
            <span class="d-flex" cols="3" v-if="item.input === 'valueSlider'">
              <v-text-field
                class="px-1"
                dense
                hide-details
                label="min"
                v-model="item.min"
              />
              <v-text-field
                class="px-1"
                dense
                hide-details
                label="max"
                v-model="item.max"
              />
              <v-text-field
                class="px-1"
                dense
                hide-details
                label="step"
                v-model="item.step"
              />
            </span>

            <span class="d-flex" cols="3" v-if="item.input === 'tickSlider'">
              <v-text-field
                class="px-1"
                dense
                hide-details
                label="ticks"
                v-model="item.ticks"
              />
            </span>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="() => modelView.state.model.save()" outlined small>
          Save
        </v-btn>
        <v-btn
          @click="() => modelView.app.importModelFromGithub()"
          outlined
          small
        >
          Update model from GitHub
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card flat tile v-else>
      <v-card-text>
        No model found in database. Please import the model first.
      </v-card-text>
      <v-card-actions>
        <v-btn
          :disabled="!modelView.state.fileExistedGithub"
          @click="() => modelView.app.importModelFromGithub()"
          outlined
          small
        >
          Import model from GitHub
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import core from '@/core';

/**
 * Model editor to configure the input settings.
 */
export default Vue.extend({
  name: 'ModelEditor',
  setup() {
    const modelView = core.app.model.view;

    const headers: any[] = [
      {
        text: 'id',
        value: 'id',
        width: '12%',
      },
      { text: 'value', value: 'value' },
      { divider: true, text: 'unit', value: 'unit', width: '8%' },
      { text: 'label', value: 'label', width: '30%' },
      {
        divider: true,
        text: 'input',
        value: 'input',
        width: '12%',
      },
      {
        sortable: false,
        text: 'input specifications',
        value: 'inputSpec',
      },
    ];

    const items = [
      { text: 'array input', value: 'arrayInput' },
      { text: 'tick slider', value: 'tickSlider' },
      { text: 'value input', value: 'valueInput' },
      { text: 'value slider', value: 'valueSlider' },
    ];

    return { headers, items, modelView };
  },
});
</script>
