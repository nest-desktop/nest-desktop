<template>
  <div class="about" align="center">
    <v-list dense max-width="500px" color="grey lighten-5">
      <v-list-item>
        <v-row class="ml-1">
          <v-col
            align="start"
            class="font-weight-bold"
            cols="4"
            v-text="'Documentation'"
          />
          <v-col cols="8">
            <a
              :href="state.doc"
              onmouseover="style='text-decoration:underline'"
              onmouseout="style='text-decoration:none'"
              target="_blank"
              v-text="state.doc"
            />
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item>
        <v-row class="grey lighten-5 ml-1">
          <v-col
            align="start"
            class="font-weight-bold"
            cols="4"
            v-text="'Source code'"
          />
          <v-col cols="8">
            <a
              :href="state.repo"
              onmouseover="style='text-decoration:underline'"
              onmouseout="style='text-decoration:none'"
              target="_blank"
              v-text="state.repo"
            />
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item>
        <v-row class="ml-1">
          <v-col
            align="start"
            class="font-weight-bold"
            cols="4"
            v-text="'License'"
          />
          <v-col cols="8" v-text="state.license" />
        </v-row>
      </v-list-item>
      <v-list-item>
        <v-row class="ml-1">
          <v-col
            align="start"
            class="font-weight-bold"
            cols="4"
            v-text="'Current version'"
          />
          <v-col cols="8" v-text="state.version" />
        </v-row>
      </v-list-item>
      <v-list-item>
        <v-row class="ml-1">
          <v-col
            align="start"
            class="font-weight-bold"
            cols="4"
            v-text="'Contact'"
          />
          <v-col cols="8">
            <a
              :href="
                state.contactMailHeader +
                mailText[0] +
                state.clientType +
                mailText[1] +
                state.browserName +
                mailText[2] +
                state.browserVersion +
                mailText[3] +
                state.version +
                mailText[4] +
                state.serverVersion +
                mailText[5] +
                state.osType +
                mailText[6]
              "
              onmouseover="style='text-decoration:underline'"
              onmouseout="style='text-decoration:none'"
              v-text="state.contactName"
            />
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { onBeforeMount, reactive } from '@vue/composition-api';
import core from '@/core';

import { detect } from 'detect-browser';
export default {
  name: 'About',
  setup() {
    const state = reactive({
      browserName: '',
      browserVersion: '',
      clientType: '',
      contactMailHeader:
        'mailto:spreizer@uni-trier.de?subject=[NEST Desktop ' +
        core.app.version +
        ']',
      contactName: '📧 Sebastian Spreizer',
      doc: 'https://nest-desktop.readthedocs.io',
      license: 'MIT License',
      osType: '',
      repo: 'https://github.com/nest-desktop/nest-desktop',
      serverVersion: core.app.nestServer.state.simulatorVersion,
      version: core.app.version,
    });
    const mailText = [
      '&body=%2D%2D%2D%2D %0D%0APlease do not delete the following lines! %0D%0AClient type: ',
      '%0D%0ABrowser name: ',
      '%0D%0ABrowser version: ',
      '%0D%0ANEST Desktop version: ',
      '%0D%0ANEST Server version: ',
      '%0D%0AOS type: ',
      '%0D%0A %2D%2D%2D%2D %0D%0A%0D%0A(your message text...)',
    ];

    // TODO: change to onRenderTriggered in Vue 3 to catch updates as well
    onBeforeMount(() => {
      // Fetch the NEST Server version.
      core.app.nestServer.check().then(() => {
        state.serverVersion = core.app.nestServer.state.simulatorVersion;
      });

      // Fetch the debugging information
      const info = detect();
      if (info) {
        state.clientType = info.type;
        state.browserName = info.name;
        state.browserVersion = info.version;
        state.osType = info.os;
      }
    });

    return {
      state,
      mailText,
    };
  },
};
</script>

<style>
.about .v-list {
  font-size: 12px;
}
.about .v-list-item {
  height: 28px !important;
  min-height: 28px !important;
}
.about a {
  text-decoration: none;
  color: black !important;
}
.about .col-4,
.about .col-8 {
  padding: 4px;
}
</style>
