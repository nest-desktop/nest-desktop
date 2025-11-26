// synapseParameters.ts

import { BaseParameters, type IParamState } from "@/helpers/common";
import type { Class, TSynapse, TSynapseParameter } from "@/types";
import type { ModelParameter } from "@/helpers/model";
import { BaseSynapseParameter } from "./synapseParameter";

export class SynapseParameters extends BaseParameters {
  public _synapse: TSynapse;

  constructor(synapse: TSynapse) {
    super();

    this._synapse = synapse;
  }

  override get Parameter(): Class<BaseSynapseParameter> {
    return BaseSynapseParameter;
  }

  get synapse(): TSynapse {
    return this._synapse;
  }

  get weight(): TSynapseParameter {
    return this.params.weight;
  }

  get weightValue(): number {
    return this.params.weight?.value ?? 1;
  }

  get weightColor(): string {
    if (this.synapse.connection.view.connectRecorder() || this.weightValue === 0) {
      return "grey";
    } else {
      return this.weightValue > 0 ? "blue" : "red";
    }
  }

  get weightLabel(): string {
    return this.weightValue === 0 ? "" : this.weightValue > 0 ? "excitatory" : "inhibitory";
  }

  set weightLabel(value: string) {
    this.params.weight.value = (value === "inhibitory" ? -1 : 1) * Math.abs(this.weightValue);
    // this.params.weight.visible = this.params.weight.value !== 1;
  }

  /**
   * Observer for parameter changes.
   * @remarks It emits network changes.
   */
  override changes(props = {}): void {
    this.logger.trace("changes");

    this.synapse.changes(props);
  }

  /**
   * Load parameters from state.
   * @param paramStates parameter states
   */
  override load(paramStates?: Record<string, IParamState>): void {
    this.logger.trace("load parameters");

    this.emptyParams();

    if (this.synapse.model) {
      this.synapse.model.params.entries.forEach(([modelId, modelParam]: [string, ModelParameter]) => {
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
    } else if (paramStates)
      Object.entries(paramStates).forEach(([paramId, param]: [string, IParamState]) =>
        this.addParameter({ ...param, id: paramId }),
      );
  }
}
