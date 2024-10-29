<template>
  <v-btn
    height="100%"
    rounded="0"
    style="min-width: 32px"
    variant="plain"
    width="32"
  >
    <v-icon icon="mdi:mdi-menu-down" />

    <v-menu activator="parent" target=".tab-model-explorer">
      <v-list density="compact">
        <v-list-item
          :key="index"
          :prepend-icon="project.icon"
          :title="project.name"
          @click="selectProject(project.id)"
          v-for="(project, index) in projects"
        />
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script lang="ts" setup>
defineProps<{
  projects: { id: string; name: string; icon: string }[];
  modelValue: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const selectProject = (projectId: string) => {
  emit("update:modelValue", projectId);
};
</script>
