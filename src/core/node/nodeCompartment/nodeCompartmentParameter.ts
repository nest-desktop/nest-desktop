import { NodeCompartment } from './nodeCompartment';
import { NodeParameter } from '../nodeParameter';
import { ModelCompartmentParameter } from '../../model/modelCompartmentParameter';

export class NodeCompartmentParameter extends NodeParameter {
  constructor(nodeCompartment: NodeCompartment, param: any) {
    super(nodeCompartment, param);
  }

  get nodeCompartment(): NodeCompartment {
    return this.parent as NodeCompartment;
  }

  /**
   * Get options from model compartment component.
   */
  override get options(): ModelCompartmentParameter {
    const param: ModelCompartmentParameter = this.nodeCompartment.node.model
      ? this.nodeCompartment.node.model.params.find((p: ModelCompartmentParameter) => p.id === this.id)
      : undefined;
    return param;
  }

  /**
   * Trigger changes when parameter is changed.
   */
  override paramChanges(): void {
    this.nodeCompartment.nodeChanges();
  }

}
