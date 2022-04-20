import { NodeCompartment } from './nodeCompartment';
import { Parameter } from '../parameter/parameter';

export class NodeCompartmentParameter extends Parameter {
  constructor(nodeCompartment: NodeCompartment, param: any) {
    super(nodeCompartment, param);
  }

  get nodeCompartment(): NodeCompartment {
    return this.parent as NodeCompartment;
  }

  /**
   * Get options from node compartment component.
   */
  override get options(): NodeCompartmentParameter {
    const param: NodeCompartmentParameter = this.nodeCompartment.params.find(
      (p: NodeCompartmentParameter) => p.id === this.id
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
    this.nodeCompartment.nodeChanges();
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
