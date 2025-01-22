// nodeOutputInterface.ts

import { markRaw } from "vue";

import NodeOutputComponent from "@/components/codeGraph/NodeOutputComponent.vue";
import { CodeNodeInterface } from "./codeNodeInterface";

export class NodeOutputInterface<T = any> extends CodeNodeInterface<T> {
  private _codeTemplate = "";

  constructor(name: string = "", codeTemplate: string = "") {
    super(name, null as T);
    this._codeTemplate = codeTemplate;
    this.setComponent(markRaw(NodeOutputComponent));
  }

  get codeTemplate(): string {
    return this._codeTemplate;
  }

  get label(): string {
    return `${this.node?.label}${this.codeTemplate ? this.codeTemplate : ""}`;
  }

  // get value(): T {
  //   if (this.node) return this.node.label as T;
  //   return this._value as T;
  // }
}
