// codeNodeInterface.ts

import { markRaw } from "vue";
import { NodeInterface } from "baklavajs";

import CodeNodeInterfaceComponent from "@/components/codeGraph/CodeNodeInterfaceComponent.vue";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import { AbstractCodeNode } from "../codeNode";

export class CodeNodeInterface<T = any> extends NodeInterface<T> {
  constructor(name: string, value: T) {
    super(name, value);
    this.setComponent(markRaw(CodeNodeInterfaceComponent));
  }

  get node(): AbstractCodeNode | undefined {
    const codegraphStore = useCodeGraphStore();
    const graph = codegraphStore.editor.graph;
    return graph.findNodeById(this.nodeId) as AbstractCodeNode;
  }
}
