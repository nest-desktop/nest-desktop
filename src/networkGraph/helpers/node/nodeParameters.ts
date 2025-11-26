// nodeParameters.ts

import { BaseParameters, type IParamState } from "@/helpers/common";
import type { ModelParameter } from "@/helpers/model";
import type { Class } from "@/types";
import type { ModelParameters } from "@/helpers/model/modelParameters";

import { NodeParameter } from "./nodeParameter";
import type { BaseNode } from "./node";

export class NodeParameters extends BaseParameters {
  public _node: BaseNode;

  constructor(node: BaseNode) {
    super();

    this._node = node;
  }

  override get Parameter(): Class<NodeParameter> {
    return NodeParameter;
  }

  get modelParams(): ModelParameters {
    return this.node.model.params;
  }

  get node(): BaseNode {
    return this._node;
  }

  /**
   * Observer for parameter changes.
   * @remarks It emits network changes.
   */
  override changes(props = {}): void {
    this.logger.trace("changes");

    this.node.changes(props);
  }

  /**
   * Load node parameters from state.
   * @param paramStates node parameter states
   */
  override load(paramStates?: Record<string, IParamState>): void {
    this.logger.trace("load parameters");

    this.emptyParams();
    if (this.node.model) {
      this.node.model.params.entries.forEach(([modelId, modelParam]: [string, ModelParameter]) => {
        if (paramStates && paramStates) {
          const nodeParamState = paramStates[modelId];
          if (nodeParamState) {
            this.addParameter(
              {
                ...nodeParamState,
                ...modelParam,
                id: modelId,
              },
              true,
            );
          } else {
            this.addParameter({ ...modelParam, id: modelId });
          }
        } else {
          this.addParameter({ ...modelParam, id: modelId });
        }
      });
    } else if (paramStates) {
      Object.entries(paramStates).forEach(([paramKey, param]: [string, IParamState]) =>
        this.addParameter({ ...param, id: paramKey }, true),
      );
    }
  }
}
