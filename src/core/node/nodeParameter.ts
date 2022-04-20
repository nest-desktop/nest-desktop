import { ModelParameter } from '../model/modelParameter';
import { Node } from './node';
import { Parameter } from '../parameter/parameter';

export class NodeParameter extends Parameter {
  constructor(node: Node, param: any) {
    super(node, param);
  }

  get node(): Node {
    return this.parent as Node;
  }

  /**
   * Get options from model component.
   */
  override get options(): ModelParameter {
    const param: ModelParameter = this.node.model
      ? this.node.model.params.find((p: ModelParameter) => p.id === this.id)
      : undefined;
    return param;
  }

  /**
   * Reset constant value taken from node component.
   */
  override reset(): void {
    this.type = 'constant';
    this.value = this.options.value;
  }

  /**
   * Trigger changes when parameter is changed.
   */
  override paramChanges(): void {
    this.node.nodeChanges();
  }

  /**
   * Serialize for JSON.
   * @return model parameter object
   */
  override toJSON(): any {
    const param: any = {
      id: this.id,
      value: this.value,
    };

    param.visible = this.visible;

    // Add value factors if existed.
    if (this.factors.length > 0) {
      param.factors = this.factors;
    }

    // Add parameter type if not constant.
    if (!this.isConstant) {
      param.type = this.type;
    }

    // Add rules for validation if existed.
    if (this.rules.length > 0) {
      param.rules = this.rules;
    }

    return param;
  }
}
