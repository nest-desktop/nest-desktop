// nodeParameter.ts

import { ModelParameter } from "@/helpers/model/modelParameter";
import { NodeParameterTypes } from "@/types/nodeParameterTypes";
import { Parameter, ParameterProps } from "@/helpers/parameter";

export interface NodeParameterProps extends ParameterProps {}

export class NodeParameter extends Parameter {
  public _node: NodeParameterTypes;

  constructor(node: NodeParameterTypes, param: NodeParameterProps) {
    super(param);
    this._node = node;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.node.model.params[this.id];
  }

  get node(): NodeParameterTypes {
    return this._node;
  }

  get visible(): boolean {
    return this.node.paramsVisible.includes(this.id);
  }

  set visible(value: boolean) {
    const isVisible = this.node.paramsVisible.includes(this.id);
    if (value && !isVisible) {
      this.node.paramsVisible.push(this.id);
    } else if (!value && isVisible) {
      this.node.paramsVisible = this.node.paramsVisible.filter(
        (paramId: string) => paramId !== this.id
      );
    }
  }

  /**
   * Observer for parameter changes.
   *
   * @remarks
   * It emits node changes.
   */
  override changes(): void {
    this.node.changes();
  }

  /**
   * Hide this parameter.
   */
  hide(): void {
    this.visible = false;
  }

  /**
   * Serialize for JSON.
   * @return parameter object
   */
  toJSON(): NodeParameterProps {
    const param: NodeParameterProps = {
      id: this.id,
      value: this.value,
    };

    // Add value factors if existed.
    if (this.factors.length > 0) {
      param.factors = this.factors;
    }

    // Add rules for validation if existed.
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
