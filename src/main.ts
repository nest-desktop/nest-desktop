/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";

// Create app
const app = createApp(App);

// Register plugins
registerPlugins(app);

// Mount app
app.mount("#app");
