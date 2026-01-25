// synapseParameters.ts

import type { Class, TModel } from "@/types";

import type { BaseSynapse } from "./synapse";
import { BaseSynapseParameter } from "./synapseParameter";
import { ModelParameters } from "../helpers/modelParameters";

export class SynapseParameters<
  TSynapse extends BaseSynapse = BaseSynapse,
> extends ModelParameters<BaseSynapseParameter> {
  public _synapse: TSynapse;

  constructor(synapse: TSynapse) {
    super();

    this._synapse = synapse;
  }

  override get Parameter(): Class<BaseSynapseParameter> {
    return BaseSynapseParameter;
  }

  override get model(): TModel {
    return this.synapse.model;
  }

  get synapse(): TSynapse {
    return this._synapse;
  }

  get weight(): BaseSynapseParameter | undefined {
    return this.params.weight;
  }

  get weightValue(): number {
    return (this.params.weight?.value ?? 1) as number;
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
    if (this.params.weight) this.params.weight.value = (value === "inhibitory" ? -1 : 1) * Math.abs(this.weightValue);
  }
}
