// nodes.ts

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { BaseNodes } from "@/helpers/node/nodes";
import { INodeProps } from "@/helpers/node/node";
import { TNode, TNodeGroup } from "@/types";

import { NorseCode } from "../code/code";
import { NorseNetwork } from "../network/network";
import { NorseNode } from "./node";

export class NorseNodes extends BaseNodes {
  constructor(network: NorseNetwork, nodes?: INodeProps[]) {
    super(network, nodes);
  }

  override get Node() {
    return NorseNode;
  }

  override get nodeItems(): NorseNode[] {
    return this._nodes.filter((node: TNode | TNodeGroup) => node.isNode) as NorseNode[];
  }

  /**
   * Add code nodes.
   * @param node node component.
   */
  override addCodeNodes(node: TNode | TNodeGroup, codeNodes: Record<string, AbstractCodeNode> = {}): void {
    console.log("Add code nodes");

    if (node.isGroup) return;
    const code = this.network.project.code as NorseCode;
    node = node as NorseNode;
    node.codeNodes = codeNodes;

    // node.codeNodes.node = node.codeNodes.node ?? code.addCreateNode(node as NorseCode);

    // if (node.hasSomeVisibleParams)
    //   node.codeNodes.params = node.codeNodes.params ?? code.addNodeParams(node as NorseCode);

    // if (node.codeNodes.params)
    //   code.graph.addConnection(node.codeNodes.params.outputs.out, node.codeNodes.node.inputs.params);

    // node.updateCodeNodes();

    // if (node.model.isRecorder) {
    //   const responseNode = code.graph.nodes.find((node) => node.state.role === "nestDataResponse");
    //   if (responseNode) code.graph.addConnection(node.codeNodes.node.outputs.events, responseNode.inputs.events);
    // }
  }
}
