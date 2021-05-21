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
    const params: any = {
      id: this.id,
      value: this.value,
    };
    if (this.parent.name === 'Model') {
      // For model component
      params.input = this.input;
      params.label = this.label;
      params.unit = this.unit;
      if (this.input === 'valueSlider') {
        params.min = this.min;
        params.max = this.max;
        params.step = this.step;
      } else if (this.input === 'tickSlider') {
        params.ticks = this.ticks;
      }
    } else {
      if (this.factors.length > 0) {
        params.factors = this.factors;
      }
      if (!this.isConstant()) {
        params.type = this.type;
      }
      if (this.visible === false) {
        params.visible = this.visible;
      }
    }
    return params;
  }
}
