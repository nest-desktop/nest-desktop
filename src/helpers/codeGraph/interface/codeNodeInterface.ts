// codeNodeInterface.ts

import { markRaw } from "vue";
import { Graph, NodeInterface } from "baklavajs";

import CodeNodeInterfaceComponent from "@/components/codeGraph/CodeNodeInterfaceComponent.vue";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import { AbstractCodeNode } from "../codeNode";

export class CodeNodeInterface<T = unknown> extends NodeInterface<T> {
  public graphId: string = "";

  constructor(name: string, value: T) {
    super(name, value);
    this.setComponent(markRaw(CodeNodeInterfaceComponent));
  }

  get node(): AbstractCodeNode | undefined {
    const codeGraphStore = useCodeGraphStore();

    let graph: Graph;
    if (this.graphId) {
      const graphs = Array.from(codeGraphStore.editor.graphs);
      graph = graphs.find((graph: Graph) => graph.id === this.graphId) as Graph;
    } else {
      graph = codeGraphStore.editor.graph as Graph;
    }

    return graph.findNodeById(this.nodeId) as AbstractCodeNode;
  }

  setValue(value: T): void {
    this.value = value;
    this.setHidden(false);
  }
}
