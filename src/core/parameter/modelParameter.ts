import { Model } from '../model/model';
import { Node } from '../node/node';
import { Parameter } from './parameter';
import { Synapse } from '../connection/synapse';

export class ModelParameter extends Parameter {
  constructor(parent: Model | Node | Synapse, param: any) {
    super(parent, param);
  }

  /**
   * Get options from model component.
   */
  get options(): ModelParameter | undefined {
    let model: Model;
    if (this.parent.name === 'Model') {
      model = this.parent as Model;
    } else {
      const parent = this.parent as Node | Synapse;
      model = parent.model as Model;
    }
    const param: ModelParameter = model
      ? model.params.find((p: ModelParameter) => p.id === this.id)
      : undefined;
    return param;
  }

  /**
   * Reset constant value taken from model component.
   */
  reset(): void {
    this.type = 'constant';
    this.value = this.options.value;
  }

  /**
   * Trigger changes when parameter is changed.
   */
  paramChanges(): void {
    if (this.parent.name === 'Node') {
      const node = this.parent as Node;
      node.nodeChanges();
    } else if (this.parent.name === 'Synapse') {
      const synapse = this.parent as Synapse;
      synapse.synapseChanges();
    }
  }

  /**
   * Serialize for JSON.
   * @return model parameter object
   */
  toJSON(): any {
    const param: any = {
      id: this.id,
      value: this.value,
    };

    if (this.parent.name === 'Model') {
      // For model component
      param.input = this.input;
      param.label = this.label;
      param.unit = this.unit;
      if (this.input === 'valueSlider') {
        param.min = this.min;
        param.max = this.max;
        param.step = this.step;
      } else if (this.input === 'tickSlider') {
        param.ticks = this.ticks;
      }
    } else {
      param.visible = this.visible;

      // Add value factors if existed.
      if (this.factors.length > 0) {
        param.factors = this.factors;
      }

      // Add parameter type if not constant.
      if (!this.isConstant()) {
        param.type = this.type;
      }
    }

    // Add rules for validation if existed.
    if (this.rules.length > 0) {
      param.rules = this.rules;
    }

    return param;
  }
}
