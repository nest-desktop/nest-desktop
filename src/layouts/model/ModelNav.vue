<template>
    <v-toolbar color="transparent" density="compact">
      <v-toolbar-title class="mx-1">
        <v-text-field
          clearable
          density="compact"
          hide-details
          placeholder="Search model"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
        />
      </v-toolbar-title>

      <v-menu transition="slide-y-transition">
        <template #activator="{ props }">
          <v-btn size="small" icon v-bind="props">
            <v-icon icon="mdi-dots-vertical" />
          </v-btn>
        </template>

        <v-list density="compact">
          <v-list-item
            :key="index"
            :value="index"
            v-for="(item, index) in menuItems"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-list>
      <v-list-item
        :title="model.label"
        :to="'/model/' + model.id"
        :subtitle="model.type"
        :key="index"
        v-for="(model, index) in models"
      />
    </v-list>
</template>

<script lang="ts" setup>
const menuItems = [
  { title: "Upload", icon: "mdi-upload" },
  { title: "Download", icon: "mdi-download" },
  { title: "Reload", icon: "mdi-reload" },
  { title: "Delete", icon: "mdi-trash-can-outline" },
];

const models = [
  { id: "dc_generator", label: "DC generator", type: "stimulus" },
  { id: "iaf_cond_alpha", label: "IAF cond alpha", type: "neuron" },
  { id: "iaf_psc_alpha", label: "IAF psc alpha", type: "neuron" },
  { id: "spike_recorder", label: "spike recorder", type: "recorder" },
];
</script>