// nodeParameter.ts

import { ModelParameter } from "../model/modelParameter";
import { Node } from "./node";
import { NodeCompartment } from "./nodeCompartment/nodeCompartment";
import { NodeReceptor } from "./nodeReceptor/nodeReceptor";
import { Parameter, ParameterProps } from "../parameter";

type nodeTypes = Node | NodeCompartment | NodeReceptor;

export interface NodeParamProps extends ParameterProps {}

export class NodeParameter extends Parameter {
  constructor(node: nodeTypes, param: NodeParamProps) {
    super(node, param);
  }

  get isVisible(): boolean {
    return this.node.paramsVisible.includes(this.id);
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.node.model.params[this.id];
  }

  get node(): Node {
    return this.parent as Node;
  }

  /**
   * Trigger changes when the parameter is changed.
   */
  override paramChanges(): void {
    this.node.nodeChanges();
  }

  /**
   * Serialize for JSON.
   * @return node parameter object
   */
  override toJSON(): NodeParamProps {
    const param: NodeParamProps = {
      id: this.id,
      value: this.value,
    };

    // Add the value factors if existed.
    if (this.factors.length > 0) {
      param.factors = this.factors;
    }

    // Add the rules for validation if existed.
    if (this.rules.length > 0) {
      param.rules = this.rules;
    }

    // Add param type if not constant.
    if (!this.isConstant) {
      param.type = this.typeToJSON();
    }

    return param;
  }
}
