// nodeParameters.ts

import type { Class, TModel } from "@/types";

import { NodeParameter } from "./nodeParameter";
import type { BaseNode } from "./node";
import { ModelParameters } from "../helpers/modelParameters";

export class NodeParameters<TNode extends BaseNode = BaseNode> extends ModelParameters<NodeParameter> {
  public _node: TNode;

  constructor(node: TNode) {
    super();

    this._node = node;
  }

  override get Parameter(): Class<NodeParameter> {
    return NodeParameter;
  }

  get node(): TNode {
    return this._node;
  }

  override get model(): TModel {
    return this.node.model;
  }
}
