<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn
        append-icon="mdi-menu-down"
        size="x-small"
        v-bind="props"
        variant="text"
      >
        <template #prepend>
          <v-icon
            :color="appStore.simulator.color"
            :icon="appStore.simulator.icon"
          />
        </template>
        {{ appStore.simulator.title }}
      </v-btn>
    </template>

    <v-list density="compact">
      <v-list-item
        :key="index"
        :value="item.id"
        @click="() => Object.assign(appStore.simulator, item)"
        v-for="(item, index) in simulatorItems"
      >
        <template #prepend>
          <v-icon :icon="item.icon" :color="item.color" size="small" />
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <v-menu>
    <template #activator="{ props }">
      <v-btn
        append-icon="mdi-menu-down"
        size="x-small"
        v-bind="props"
        variant="text"
      >
        settings
      </v-btn>
    </template>

    <v-list density="compact">
      <v-list-item
        :key="index"
        :value="item.id"
        @click="item.onClick"
        v-for="(item, index) in settingsItems"
      >
        <template #prepend>
          <v-icon :icon="item.icon" size="small" />
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <v-spacer />

  <v-btn
    @click.stop="() => nestSimulatorStore.backend.check()"
    size="x-small"
    variant="text"
  >
    {{ appStore.simulator.title }}
    <v-icon
      :color="nestSimulatorStore.backend.state.ready ? 'green' : 'red'"
      class="mx-1"
      icon="mdi-circle"
    />
  </v-btn>
</template>

<script lang="ts" setup>
import { DatabaseService } from "@/helpers/database";
import { useAppStore } from "@/store/appStore";
import { useNESTSimulatorStore } from "@nest/store/backends/nestSimulatorStore";

const appStore = useAppStore();
const nestSimulatorStore = useNESTSimulatorStore();
nestSimulatorStore.backend.check();

DatabaseService;

const settingsItems = [
  {
    icon: "mdi-cog-refresh-outline",
    id: "clearConfig",
    title: "Clear config",
    onClick: () => localStorage.clear(),
  },
  {
    icon: "mdi-database-refresh-outline",
    id: "destroyDatabase",
    title: "Destroy database",
    onClick: () => {
      const databases = ["NEST_MODEL_STORE", "NEST_PROJECT_STORE"];
      databases.forEach((url) => {
        const db = new DatabaseService(url);
        db.destroy();
      });
    },
  },
];

const simulatorItems = [
  { id: "nest", title: "NEST", icon: "simulator:nest", color: "nest" },
  { id: "pynn", title: "PyNN", icon: "simulator:pynn" },
  { id: "arbor", title: "Arbor", icon: "simulator:arbor" },
  { id: "norse", title: "Norse", icon: "mdi-google-downasaur" },
];
</script>
