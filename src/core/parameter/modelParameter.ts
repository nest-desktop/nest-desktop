import { Model } from '../model/model';
import { Node } from '../node/node';
import { Parameter } from './parameter';
import { Synapse } from '../connection/synapse';

export class ModelParameter extends Parameter {
  // private _parent: Model | Node | Synapse; // parent

  constructor(parent: Model | Node | Synapse, param: any) {
    super(parent, param);
  }

  // get parent(): Model | Node | Synapse {
  //   return this._parent;
  // }

  get options(): any {
    let model: Model;
    if (this.parent.name === 'Model') {
      model = this.parent as Model;
    } else {
      const parent = this.parent as Node | Synapse;
      model = parent.model as Model;
    }
    const param: ModelParameter = model
      ? model.params.find((p: ModelParameter) => p.id === this.id)
      : null;
    return param;
  }

  /**
   * Reset value taken from options.
   */
  reset(): void {
    this.type = 'constant';
    this.value = this.options.value;
  }

  /**
   * Updates when parameter is changed.
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
   */
  toJSON(): any {
    const params: any = {
      id: this.id,
      type: this.type,
      value: this.value,
    };
    if (this.parent.name === 'Model') {
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
      params.factors = this.factors;
      params.visible = this.visible;
      if (this.isRandom()) {
        params.specs = this.specs;
      }
    }
    return params;
  }
}
