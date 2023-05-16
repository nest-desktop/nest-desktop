<template>
  <v-container class="sandbox">
    <v-navigation-drawer permanent>
      <v-tabs direction="vertical">
        <v-tab :key="tab" :to="`${tab}`" :value="tab" v-for="(_, tab) in tabs">
          {{ tab }}
        </v-tab>
      </v-tabs>
    </v-navigation-drawer>

    <component :is="tabs[currentTab]" class="tab" />
  </v-container>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

import SandboxAlert from "@/components/sandbox/SandboxAlert.vue";
import SandboxButton from "@/components/sandbox/SandboxButton.vue";
import SandboxButtonToggle from "@/components/sandbox/SandboxButtonToggle.vue";
import SandboxCard from "@/components/sandbox/SandboxCard.vue";
import SandboxColorPicker from "@/components/sandbox/SandboxColorPicker.vue";
import SandboxItemGroup from "@/components/sandbox/SandboxItemGroup.vue";
import SandboxNodeCard from "@/components/sandbox/SandboxNodeCard.vue";
import SandboxSlider from "@/components/sandbox/SandboxSlider.vue";
import SandboxTabs from "@/components/sandbox/SandboxTabs.vue";

const props = defineProps({
  tab: {type: String, default: "alert"},
});

const currentTab = ref(props.tab);

const tabs: any = {
  alert: SandboxAlert,
  button: SandboxButton,
  buttonToggle: SandboxButtonToggle,
  card: SandboxCard,
  colorPicker: SandboxColorPicker,
  itemGroup: SandboxItemGroup,
  nodeCard: SandboxNodeCard,
  slider: SandboxSlider,
  tabs: SandboxTabs,
};

watch(() => props.tab, () => currentTab.value = props.tab)
</script>

<style lang="scss">
.sandbox .v-card {
  margin: 4px;
}
</style>
