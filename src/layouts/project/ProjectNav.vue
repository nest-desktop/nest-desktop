<template>
    <v-toolbar color="white" density="compact">
      <v-toolbar-title class="mx-1">
        <v-text-field
          clearable
          density="compact"
          hide-details
          placeholder="Search project"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
        />
      </v-toolbar-title>

      <v-btn
        :key="index"
        :title="item.title"
        icon
        size="small"
        v-for="(item, index) in items"
      >
        <v-icon :icon="item.icon" />
      </v-btn>

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
        :title="project.name"
        :key="index"
        :to="'/project/' + project.id"
        v-for="(project, index) in projects"
      />
    </v-list>
</template>

<script lang="ts" setup>
const items = [{ title: "Create a new project", icon: "mdi-plus" }];

const menuItems = [
  { title: "Reload list", icon: "mdi-reload" },
  { title: "Upload", icon: "mdi-upload" },
  { title: "Download", icon: "mdi-download" },
  { title: "Delete", icon: "mdi-trash-can-outline" },
  { title: "Reset database", icon: "mdi-database-sync-outline" },
];

const projects = [
  { id: "23aw125", name: "spike activity" },
  { id: "fdhq530", name: "voltage activity" },
  { id: "04tas30", name: "spike response" },
];

</script>

