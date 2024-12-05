<template>
  <v-list class="appDetails" density="compact">
    <v-list-item href="https://github.com/nest-desktop/nest-desktop/blob/dev/LICENSE" target="_blank">
      <v-row>
        <v-col class="font-weight-bold text-left" cols="4">
          <v-icon class="mx-2" icon="mdi:mdi-license" />
          License
        </v-col>
        <v-col class="text-right" cols="8">
          {{ license }}
        </v-col>
      </v-row>
    </v-list-item>

    <v-list-item href="https://github.com/nest-desktop/nest-desktop/releases/" target="_blank">
      <v-row>
        <v-col class="font-weight-bold text-left" cols="4">
          <v-icon class="mx-2" icon="mdi:mdi-tag-outline" />
          Current version
        </v-col>
        <v-col class="text-right" cols="8">
          {{ appVersion }}
        </v-col>
      </v-row>
    </v-list-item>

    <v-list-item :href="mailText" target="_blank">
      <v-row>
        <v-col class="font-weight-bold text-left" cols="4">
          <v-icon class="mx-2" icon="mdi:mdi-email-outline" />
          Contact
        </v-col>
        <v-col class="text-caption text-right" cols="8">
          {{ contactName }}
        </v-col>
      </v-row>
    </v-list-item>

    <template v-if="appStore.state.devMode">
      <v-list-item>
        <v-row>
          <v-col class="font-weight-bold text-left" cols="4">
            <v-icon class="mx-2" icon="mdi:mdi-magnify" />
            Client info
          </v-col>
          <v-col class="text-caption text-right" cols="8">
            <v-chip
              :text="state.browserName + ' ' + state.browserVersion"
              prepend-icon="mdi:mdi-application-outline"
              size="x-small"
              variant="text"
            />
            <v-chip :text="state.osType" prepend-icon="mdi:mdi-desktop-tower-monitor" size="x-small" variant="text" />
          </v-col>
        </v-row>
      </v-list-item>
    </template>
  </v-list>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";
import { detect } from "detect-browser";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const appVersion = process.env.APP_VERSION;
const license = "MIT License";
const contactName = "Sebastian Spreizer";
const mailto = "spreizer@web.de";
const mailSubject = `[NEST Desktop ${appVersion}]`;

const state = reactive<{
  browserName: string;
  browserVersion: string;
  clientType: string;
  osType: string;
}>({
  browserName: "",
  browserVersion: "",
  clientType: "",
  osType: "",
});

const mailBody = () => [
  "(your message text...)",
  "",
  "%2D%2D%2D%2D",
  "Please do not delete the following lines!",
  "",
  `Client type: ${state.clientType}`,
  `Browser name: ${state.browserName}`,
  `Browser version: ${state.browserVersion}`,
  `NEST Desktop version: ${appVersion}`,
  `OS type: ${state.osType}`,
];

const mailText = computed(() => `mailto:${mailto}?subject=${mailSubject}&body=${mailBody().join("%0D%0A")}`);

const info = detect();
if (info) {
  state.clientType = info.type;
  state.browserName = info.name;
  state.browserVersion = info.version || "";
  state.osType = info.os || "";
}
</script>

<style lang="scss">
.appDetails {
  font-size: 12px;

  .v-list-item {
    min-height: 28px !important;
  }
}
</style>
