<template>
  <v-toolbar class="project-nav" color="transparent" density="compact">
    <v-text-field
      class="mx-1"
      clearable
      density="compact"
      hide-details
      placeholder="Search project"
      prepend-inner-icon="mdi-magnify"
      single-line
      variant="outlined"
    />

    <v-btn
      :to="{ name: 'nestProjectNew' }"
      icon
      size="small"
      title="Create a new project"
    >
      <v-icon icon="mdi-plus" />
    </v-btn>

    <v-menu>
      <template #activator="{ props }">
        <v-btn icon="mdi-dots-vertical" size="small" v-bind="props" />
      </template>

      <v-list density="compact">
        <v-list-item
          :key="index"
          :value="index"
          v-for="(item, index) in projectsItems"
        >
          <template #prepend>
            <v-icon :icon="item.icon" />
          </template>

          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar>

  <v-list density="compact" lines="two" nav>
    <v-list-item
      :key="index"
      :subtitle="`${project.network.nodes.length} nodes, ${project.network.connections.length} connections`"
      :title="project.name"
      :to="{
        name: 'nestProject',
        params: { projectId: project._id },
      }"
      v-for="(project, index) in projectDBStore.projects"
    >
      <template #append>
        <v-btn
          @click="(e: MouseEvent) => {
            e.preventDefault()
            project.save()
            }"
          :disabled="!project.state?.changes"
          icon="mdi-content-save-check-outline"
          size="small"
          variant="text"
          v-show="project.doc"
        />

        <v-menu>
          <template #activator="{ props }">
            <v-btn
              @click="(e: MouseEvent) => e.preventDefault()"
              class="list-item-menu"
              icon="mdi-dots-vertical"
              size="x-small"
              v-bind="props"
              variant="text"
            />
          </template>

          <v-list density="compact">
            <v-list-item
              v-for="(item, index) in projectItems"
              :key="index"
              :value="index"
            >
              <template #prepend>
                <v-icon :icon="item.icon" />
              </template>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-list-item>
  </v-list>
</template>

<script lang="ts" setup>
import { useNESTProjectDBStore } from "@nest/store/project/nestProjectDBStore";
const projectDBStore = useNESTProjectDBStore();

const projectsItems = [
  { title: "Upload", icon: "mdi-upload" },
  { title: "Download", icon: "mdi-download" },
  { title: "Delete", icon: "mdi-trash-can-outline" },
  { title: "Reload list", icon: "mdi-reload" },
  { title: "Reset database", icon: "mdi-database-sync-outline" },
];

const projectItems = [
  { title: "Rename", icon: "mdi-pencil" },
  { title: "Save", icon: "mdi-content-save-outline" },
  { title: "Upload", icon: "mdi-upload" },
  { title: "Download", icon: "mdi-download" },
  { title: "Delete", icon: "mdi-trash-can-outline" },
];
</script>
