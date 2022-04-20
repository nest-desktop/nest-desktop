import { NodeReceptor } from './nodeReceptor';
import { Parameter } from '../../parameter/parameter';

export class NodeReceptorParameter extends Parameter {
  constructor(nodeReceptor: NodeReceptor, param: any) {
    super(nodeReceptor, param);
  }

  get nodeReceptor(): NodeReceptor {
    return this.parent as NodeReceptor;
  }


  /**
   * TODO: Correct this options to get options for input
   * Get options from node compartment component.
   */
  override get options(): NodeReceptorParameter {
    const param: NodeReceptorParameter = this.nodeReceptor.params.find(
      (p: NodeReceptorParameter) => p.id === this.id
    );
    return param;
  }

  /**
   * Reset constant value taken from model component.
   */
  override reset(): void {
    this.type = 'constant';
    this.value = this.options.value;
  }

  /**
   * Trigger changes when parameter is changed.
   */
  override paramChanges(): void {
    this.nodeReceptor.nodeChanges();
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
