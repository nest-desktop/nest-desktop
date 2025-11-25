// nodeParameters.ts

import { BaseParameters, type IParamState } from "@/helpers/common";
import type { ModelParameter } from "@/helpers/model";
import type { Class, TNode, TNodeParameterParent } from "@/types";

import { NodeParameter } from "./nodeParameter";

export class NodeParameters extends BaseParameters {
  public _node: TNodeParameterParent;

  constructor(node: TNode) {
    super();

    this._node = node;
  }

  override get Parameter(): Class<NodeParameter> {
    return NodeParameter;
  }

  get modelParams(): Record<string, ModelParameter> {
    return this.node.model.params;
  }

  get node(): TNode {
    return this._node;
  }

  // get parent(): TNode {
  //   return this._node;
  // }

  /**
   * Observer for parameter changes.
   * @remarks It emits network changes.
   */
  override changes(props = {}): void {
    this.logger.trace("changes");

    this.node.changes(props);
  }

  /**
   * Load parameters from state.
   * @param paramStates parameter states
   */
  override load(paramStates?: Record<string, IParamState>): void {
    this.logger.trace("load parameters");

    this.emptyParams();
    if (this.node.model) {
      this.node.model.paramsAll.forEach((modelParam: ModelParameter) => {
        if (paramStates && paramStates) {
          const nodeParamState = paramStates[modelParam.id];
          if (nodeParamState) {
            this.addParameter(
              {
                ...nodeParamState,
                ...modelParam,
              },
              true,
            );
          } else {
            this.addParameter(modelParam);
          }
        } else {
          this.addParameter(modelParam);
        }
      });
    } else if (paramStates) {
      Object.entries(paramStates).forEach(([paramKey, param]: [string, IParamState]) =>
        this.addParameter({ ...param, id: paramKey }, true),
      );
    }
  }
}
