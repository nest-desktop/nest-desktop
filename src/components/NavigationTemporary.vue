<template>
  <div class="navigation">
    <v-navigation-drawer
      :mini-variant="state.miniVariant"
      :mobile-breakpoint="false"
      app
      clipped
      permament
    >
      <v-toolbar dense flat dark color="accent">
        <v-icon
          @click="state.miniVariant = !state.miniVariant"
          v-text="state.miniVariant ? 'mdi-chevron-right' : 'mdi-chevron-left'"
        />
      </v-toolbar>

      <v-list dense nav>
        <v-list-item title="Home" to="/">
          <v-list-item-icon>
            <v-icon v-text="'mdi-home'" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="'Home'" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          :key="route.id"
          :title="route.title"
          @click="() => open(route.id)"
          v-for="route in routes"
          :class="{ 'v-list-item--active': state.navList === route.id }"
        >
          <v-list-item-icon>
            <v-icon v-text="route.icon" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="route.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer
      v-model="state.show"
      app
      temporary
      width="320"
      style="top:48px"
    >
      <ModelNavList v-if="state.navList === 'models'" />
      <ProjectNavList v-if="state.navList === 'projects'" />
      <SettingNavList v-if="state.navList === 'settings'" />
    </v-navigation-drawer>
  </div>
</template>

<script>
import { reactive } from "@vue/composition-api";
import ModelNavList from "@/components/model/ModelNavList";
import ProjectNavList from "@/components/project/ProjectNavList";
import SettingNavList from "@/components/setting/SettingNavList";

export default {
  name: "Navigation",
  components: {
    ModelNavList,
    ProjectNavList,
    SettingNavList
  },
  setup(props) {
    const routes = [
      {
        id: "models",
        icon: "mdi-engine-outline",
        title: "Models"
      },
      {
        id: "projects",
        icon: "mdi-brain",
        title: "Projects"
      },
      {
        id: "settings",
        icon: "mdi-cogs",
        title: "Settings"
      }
    ];
    const state = reactive({
      navList: "projects",
      show: false,
      miniVariant: true
    });
    const open = navList => {
      state.navList = navList;
      state.show = true;
    };
    const onClickOutside = () => {
      console.log(state.show);
    };
    return {
      routes,
      state,
      open,
      onClickOutside
    };
  }
};
</script>
