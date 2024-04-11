<template>
  <v-card class="appDetails">
    <v-list density="compact">
      <v-list-item>
        <v-row>
          <v-col
            class="font-weight-bold text-left"
            cols="4"
          >
            Documentation
          </v-col>
          <v-col
            class="text-right"
            cols="8"
          >
            <a
              :href="doc"
              target="_blank"
            >
              {{ doc }}
            </a>
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item>
        <v-row>
          <v-col
            class="font-weight-bold text-left"
            cols="4"
          >
            Source code
          </v-col>
          <v-col
            class="text-right"
            cols="8"
          >
            <a
              :href="repo"
              target="_blank"
            >
              {{ repo }}
            </a>
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item>
        <v-row>
          <v-col
            class="font-weight-bold text-left"
            cols="4"
          >
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
      <v-list-item>
        <v-row>
          <v-col
            class="font-weight-bold text-left"
            cols="4"
          >
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
      <v-list-item>
        <v-row>
          <v-col
            class="font-weight-bold text-left"
            cols="4"
          >
            Contact
          </v-col>
          <v-col
            class="text-caption text-right"
            cols="8"
          >
            <a
              :href="mailText"
              v-text="contactName"
            />
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";
import { detect } from "detect-browser";

const appVersion = process.env.APP_VERSION;
const license = "MIT License";
const contactName = "📧 Sebastian Spreizer";
const mailto = "spreizer@uni-trier.de";
const mailSubject = `[NEST Desktop ${appVersion}]`;
const doc = "https://nest-desktop.readthedocs.io";
const repo = "https://github.com/nest-desktop/nest-desktop";

const state = reactive({
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
  a:hover {
    text-decoration: underline !important;
  }
}
</style>
