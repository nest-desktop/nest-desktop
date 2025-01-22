// nodeInputInterface.ts

import { markRaw } from "vue";

import NodeInputComponent from "@/components/codeGraph/NodeInputComponent.vue";
import { CodeNodeInterface } from "./codeNodeInterface";

export class NodeInputInterface<T = any> extends CodeNodeInterface<T> {
  constructor(name: string = "") {
    super(name, null as T);
    this.setComponent(markRaw(NodeInputComponent));
  }

  // get value(): T {
  //   const nodes = this.node?.getConnectedNodesByInterface(this.name);
  //   if (nodes) return nodes.map((node) => node.label).join(", ") as T;
  //   return this._value;
  // }

  get code(): string {
    const nodes = this.node?.getConnectedNodesByInterface(this.name);
    if (nodes)
      return nodes.map((node) => (node.state.integrated ? node.codeTemplate : node.label)).join(", ") as string;
    return this.value as string;
  }
}
