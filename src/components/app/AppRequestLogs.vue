<template>
  <v-navigation-drawer
    v-model="appStore.state.logsOpen"
    location="right"
    temporary
    width="400"
  >
    <v-toolbar color="transparent" density="compact" title="Request logs">
      <template #append>
        <v-btn-toggle
          class="mx-2"
          density="compact"
          v-model="appStore.state.filterTag"
          variant="outlined"
        >
          <v-btn
            color="error"
            icon="mdi:mdi-alert-circle-outline"
            size="small"
            title="Show only error logs"
            value="error"
            width="40px"
          />
          <v-btn
            color="success"
            icon="mdi:mdi-check-circle-outline"
            size="small"
            title="Show only success logs"
            value="success"
            width="40px"
          />
        </v-btn-toggle>

        <v-btn
          icon="mdi:mdi-playlist-remove"
          size="small"
          title="Clear all logs"
          @click="appStore.clearLogs()"
        />
        <v-btn
          icon="mdi:mdi-menu-close"
          size="small"
          title="Close request logs"
          @click="appStore.state.logsOpen = false"
        />
      </template>
    </v-toolbar>

    <div class="mx-4">
      <v-btn
        block
        class="px-2"
        density="compact"
        variant="outlined"
        text="Show all logs"
        v-if="appStore.state.filterTag"
        @click="appStore.state.filterTag = ''"
      />
    </div>

    <v-list class="px-1" density="compact">
      <v-divider />

      <v-list-item
        v-for="(log, index) in appStore.state.requestLogs"
        :key="index"
        class="px-0"
        v-show="
          appStore.state.filterTag
            ? log.type === appStore.state.filterTag
            : true
        "
      >
        <v-card class="pb-2" tile variant="text">
          <v-toolbar color="transparent" density="compact">
            <template #prepend>
              <v-icon :color="log.type" :icon="icons[log.type]" />
            </template>

            <v-toolbar-title color="primary" class="text-subtitle-1">
              {{ log.date }}
            </v-toolbar-title>

            <template #append>
              <v-btn
                icon="mdi:mdi-close"
                size="small"
                @click="appStore.state.requestLogs.splice(index, 1)"
              />
            </template>
          </v-toolbar>

          <v-card-text class="px-2 py-0">
            <span v-html="log.text" />
          </v-card-text>
        </v-card>

        <v-divider />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const icons: Record<string, string> = {
  error: "mdi:mdi-alert-circle-outline",
  success: "mdi:mdi-check-circle-outline",
};
</script>
