// nodeParameter.ts

import { Node } from "@/types/nodeTypes";
import { Parameter, ParameterProps } from "@/helpers/parameter";

import { ModelParameter } from "../model/modelParameter";


export interface NodeParameterProps extends ParameterProps {}

export class NodeParameter extends Parameter {
  private _parent: Node;

  constructor(node: Node, param: NodeParameterProps) {
    super(param);
    this._parent = node;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.node.model.params[this.id];
  }

  get node(): Node {
    return this._parent as Node;
  }

  get parent(): Node {
    return this._parent;
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
