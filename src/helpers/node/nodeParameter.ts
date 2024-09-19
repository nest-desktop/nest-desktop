// nodeParameter.ts

import { TNodeParameterParent } from '@/types';

import { BaseParameter, IParamProps } from '../common/parameter';
import { ModelParameter } from '../model/modelParameter';

export interface INodeParamProps extends IParamProps {}

export class NodeParameter extends BaseParameter {
  public _node: TNodeParameterParent;

  constructor(node: TNodeParameterParent, paramProps: INodeParamProps) {
    super(paramProps, { minLevel: 3 });
    this._node = node;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.node.model.params[this.id];
  }

  get node(): TNodeParameterParent {
    return this._node;
  }

  override get parent(): TNodeParameterParent {
    return this.node;
  }

  /**
   * Serialize for JSON.
   * @return parameter props
   */
  override toJSON(): INodeParamProps {
    const paramProps: INodeParamProps = {
      id: this.id,
      label: this.label,
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
