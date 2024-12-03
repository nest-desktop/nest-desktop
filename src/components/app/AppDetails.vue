<template>
  <v-card class="appDetails">
    <v-list density="compact">
      <v-list-item
        href="https://github.com/nest-desktop/nest-desktop/blob/dev/LICENSE"
        target="_blank"
      >
        <v-row>
          <v-col
            class="font-weight-bold text-left"
            cols="4"
          >
            <v-icon
              class="mx-2"
              icon="mdi:mdi-license"
            />
            License
          </v-col>
          <v-col
            class="text-right"
            cols="8"
          >
            {{ license }}
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item
        href="
          https://github.com/nest-desktop/nest-desktop/releases/
        "
        target="_blank"
      >
        <v-row>
          <v-col
            class="font-weight-bold text-left"
            cols="4"
          >
            <v-icon
              class="mx-2"
              icon="mdi:mdi-tag-outline"
            />
            Current version
          </v-col>
          <v-col
            class="text-right"
            cols="8"
          >
            {{ appVersion }}
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item
        :href="mailText"
        target="_blank"
      >
        <v-row>
          <v-col
            class="font-weight-bold text-left"
            cols="4"
          >
            <v-icon
              class="mx-2"
              icon="mdi:mdi-email-outline"
            />
            Contact
          </v-col>
          <v-col
            class="text-caption text-right"
            cols="8"
          >
            {{ contactName }}
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item>
        <v-row>
          <v-col
            class="font-weight-bold text-left"
            cols="4"
          >
            <v-icon
              class="mx-2"
              icon="mdi:mdi-magnify"
            />
            Client info
          </v-col>
          <v-col
            class="text-caption text-right"
            cols="8"
          >
            <v-chip
              :text="state.browserName + ' ' + state.browserVersion"
              prepend-icon="mdi:mdi-application-outline"
              size="x-small"
              variant="text"
            />
            <v-chip
              :text="state.osType"
              prepend-icon="mdi:mdi-desktop-tower-monitor"
              size="x-small"
              variant="text"
            />
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list
      class="my-2"
      density="compact"
    >
      <v-list-subheader>References</v-list-subheader>
      <v-list-item
        v-for="(item, index) in refItems"
        :key="index"
        append-icon="mdi:mdi-open-in-new"
        target="_blank"
        v-bind="item"
        :title="item.title + ' (' + item.href + ')'"
      />
    </v-list>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";
import { detect } from "detect-browser";

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

const mailText = computed(
  () =>
    `mailto:${mailto}?subject=${mailSubject}&body=${mailBody().join("%0D%0A")}`
);

const info = detect();
if (info) {
  state.clientType = info.type;
  state.browserName = info.name;
  state.browserVersion = info.version || "";
  state.osType = info.os || "";
}

const refItems = [
{
    href: "https://nest-desktop.github.io",
    prependIcon: "mdi:mdi-home",
    title: "Official page",
  },
  {
    href: "https://nest-desktop.readthedocs.io",
    prependIcon: "mdi:mdi-book-open",
    title: "Guides",
  },
  {
    href: "https://github.com/nest-desktop/nest-desktop",
    prependIcon: "mdi:mdi-github",
    title: "Source code",
  },
];
</script>

<style lang="scss">
.appDetails {
  .col-4,
  .col-8 {
    padding: 4px;
  }
  .v-list {
    font-size: 12px;
  }
  .v-list-item {
    min-height: 28px !important;
  }
}
</style>
