// nodeParameter.ts

import { ModelParameter } from "../model/modelParameter";
import { Node } from "./node";
import { NodeCompartment } from "./nodeCompartment/nodeCompartment";
import { NodeReceptor } from "./nodeReceptor/nodeReceptor";
import { Parameter, parameterProps } from "../parameter";

type nodeTypes = Node | NodeCompartment | NodeReceptor;

export interface nodeParamProps extends parameterProps {}

export class NodeParameter extends Parameter {
  constructor(node: nodeTypes, param: nodeParamProps) {
    super(node, param);
  }

  get node(): Node {
    return this.parent as Node;
  }

  /**
   * Get options from the model component.
   */
  override get options(): { [key: string]: Number | String } {
    const param: ModelParameter = this.node.model.params[this.id];
    return {
      max: param.max,
      min: param.min,
      step: param.step,
      label: param.label,
      unit: param.unit,
    };
  }

  get isVisible(): boolean {
    return this.node.paramsVisible.includes(this.id);
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
  override toJSON(): nodeParamProps {
    const param: nodeParamProps = {
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
