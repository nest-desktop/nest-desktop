// nodeReceptorParameters.ts

import { ModelReceptorParameter } from '../../model/modelReceptor/modelReceptorParameter';
import { NodeParameter, nodeParamProps } from '../nodeParameter';
import { NodeReceptor } from './nodeReceptor';

export class NodeReceptorParameter extends NodeParameter {
  constructor(nodeReceptor: NodeReceptor, param: nodeParamProps) {
    super(nodeReceptor, param);
  }

  get nodeReceptor(): NodeReceptor {
    return this.parent as NodeReceptor;
  }

  /**
   * TODO: Correct this options to get options for input
   * Get the options from the node compartment component.
   */
  override get options(): ModelReceptorParameter {
    const modelReceptor = this.nodeReceptor.model;
    const param: ModelReceptorParameter = modelReceptor
      ? modelReceptor.params.find(
          (p: ModelReceptorParameter) => p.id === this.id
        )
      : undefined;
    return param;
  }

  /**
   * Trigger changes when the parameter is changed.
   */
  override paramChanges(): void {
    this.nodeReceptor.nodeChanges();
  }
}
