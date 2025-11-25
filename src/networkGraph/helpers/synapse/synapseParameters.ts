// synapseParameters.ts

import { BaseParameters, type IParamState } from "@/helpers/common";
import type { Class, TSynapse } from "@/types";
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

  // get weight(): number {
  //   const weight: TSynapseParameter = this.params.weight;
  //   return weight ? (weight.value as number) : 1;
  // }

  // set weight(value: number) {
  //   this.params.weight.state.value = value;
  //   this.changes({ checkSynWeights: true });
  // }

  get weightColor(): string {
    if (this.synapse.connection.view.connectRecorder() || this.params.weight.value === 0) {
      return "grey";
    } else {
      return this.params.weight.value > 0 ? "blue" : "red";
    }
  }

  get weightLabel(): string {
    return this.params.weight.value === 0 ? "" : this.params.weight.value > 0 ? "excitatory" : "inhibitory";
  }

  set weightLabel(value: string) {
    this.params.weight.value = (value === "inhibitory" ? -1 : 1) * Math.abs(this.params.weight.value as number);
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
    if (paramStates)
      Object.entries(paramStates).forEach(([paramId, param]: [string, IParamState]) =>
        this.addParameter({ ...param, id: paramId }),
      );
  }
}
