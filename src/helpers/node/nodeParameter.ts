// nodeParameter.ts

import { ModelParameter } from "../model/modelParameter";
import { TNodeParameter } from "@/types/nodeParameterTypes";
import { IParamProps, Parameter } from "../common/parameter";

export interface INodeParamProps extends IParamProps {}

export class NodeParameter extends Parameter {
  public _node: TNodeParameter;

  constructor(node: TNodeParameter, paramProps: INodeParamProps) {
    super(paramProps, { minLevel: 3 });

    this._node = node;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.node.model.params[this.id];
  }

  get node(): TNodeParameter {
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
   * @return parameter props
   */
  toJSON(): INodeParamProps {
    const paramProps: INodeParamProps = {
      id: this.id,
      value: this.value,
    };

    // Add value factors if existed.
    if (this.factors.length > 0) {
      paramProps.factors = this.factors;
    }

    // Add rules for validation if existed.
    if (this.rules.length > 0) {
      paramProps.rules = this.rules;
    }

    // Add param type if not constant.
    if (!this.isConstant) {
      paramProps.type = this.typeToJSON();
    }

    return paramProps;
  }
}
