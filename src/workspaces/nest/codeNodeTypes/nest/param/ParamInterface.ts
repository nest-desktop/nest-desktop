// paramInterface.ts

import { markRaw } from "vue";
import { CodeNodeInterface } from "@babsey/code-graph";

import ParamInterfaceComponent from "./ParamInterface.vue";

export class ParamInterface<T = unknown> extends CodeNodeInterface<T> {
  constructor(name: string, value: T) {
    super(name, value);
    this.setComponent(markRaw(ParamInterfaceComponent));
  }
}

export { ParamInterfaceComponent };
