// mount.ts

import { type ComponentMountingOptions, mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

/**
 * Mount a component with a fresh Vuetify instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mountWithVuetify = <T>(component: T, options: ComponentMountingOptions<any> = {}) =>
  mount(component, {
    ...options,
    global: {
      ...options.global,
      plugins: [createVuetify({ components, directives }), ...(options.global?.plugins ?? [])],
    },
  });
