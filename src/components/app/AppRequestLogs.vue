<template>
  <v-navigation-drawer v-model="appStore.state.logsOpen" location="right" temporary width="400">
    <v-toolbar color="transparent" density="compact" title="Request logs">
      <template #append>
        <v-btn-toggle v-model="appStore.state.filterTag" class="mx-2" density="compact">
          <v-btn
            color="error"
            icon="mdi:mdi-alert-circle-outline"
            size="small"
            title="Show only error logs"
            value="error"
            width="40"
          />
          <v-btn
            color="success"
            icon="mdi:mdi-check-circle-outline"
            size="small"
            title="Show only success logs"
            value="success"
            width="40"
          />
        </v-btn-toggle>

        <v-btn icon="mdi:mdi-playlist-remove" size="small" title="Clear all logs" @click="appStore.clearLogs()" />
        <v-btn
          icon="mdi:mdi-menu-close"
          size="small"
          title="Hide request logs"
          @click="appStore.state.logsOpen = false"
        />
      </template>
    </v-toolbar>

    <div class="mx-4">
      <v-btn
        v-if="appStore.state.filterTag"
        block
        class="px-2"
        density="compact"
        text="Show all logs"
        @click="appStore.state.filterTag = ''"
      />
    </div>

    <v-list class="px-1" density="compact">
      <v-divider />

      <v-list-item
        v-for="(log, index) in appStore.state.requestLogs"
        v-show="appStore.state.filterTag ? log.level === appStore.state.filterTag : true"
        :key="index"
        class="pa-0"
      >
        <v-toolbar color="transparent" density="compact">
          <template #prepend>
            <v-icon :color="log.level" :icon="icons[log.level]" />
          </template>

          <v-toolbar-title :text="log.date" color="primary" class="text-subtitle-1" />

          <template #append>
            <v-btn icon="mdi:mdi-close" size="x-small" @click="appStore.state.requestLogs.splice(index, 1)" />
          </template>
        </v-toolbar>

        <div class="px-4">
          {{ log.htmlContent }}
        </div>

        <v-divider class="my-1" />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const icons: Record<string, string> = {
  error: "mdi:mdi-alert-circle-outline",
  success: "mdi:mdi-check-circle-outline",
};
</script>
