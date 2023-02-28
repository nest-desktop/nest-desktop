<template>
  <div class="systemBar">
    <v-system-bar app color="systemBar" dark>
      <ProjectsMenu v-if="routeName().includes('project')" />
      <ModelsMenu v-if="routeName().includes('model')" />
      <SettingsMenu v-if="routeName() === 'appSettings'" />

      <v-spacer />

      <BackendStatus
        class="mx-1"
        :backend="{ id: 'insiteAccess', text: 'Insite' }"
      />
      <BackendStatus
        class="mx-1"
        :backend="{ id: 'nestSimulator', text: 'NEST' }"
      />
    </v-system-bar>
  </div>
</template>

<script>
import Vue from 'vue';

import BackendStatus from '@/components/systembar/BackendStatus.vue';
import ModelsMenu from '@/components/systembar/ModelsMenu.vue';
import ProjectsMenu from '@/components/systembar/ProjectsMenu.vue';
import SettingsMenu from '@/components/systembar/SettingsMenu.vue';

export default Vue.extend({
  name: 'SystemBar',
  components: {
    BackendStatus,
    ModelsMenu,
    ProjectsMenu,
    SettingsMenu,
  },
  setup(_, { root }) {
    return {
      routeName: () => root.$route.name,
    };
  },
});
</script>
