// modelDBStore.ts

import type { IParamState } from "@/parameter";
import { defineModelDBStore } from "@/model";

import { NESTModel } from "../model";
import { NESTModelDB } from "./modelDB";

const modelAssets = [
  "ac_generator",
  "dc_generator",
  "hh_psc_alpha",
  "iaf_cond_alpha",
  "iaf_psc_alpha",
  "inhomogeneous_poisson_generator",
  "multimeter",
  "noise_generator",
  "parrot_neuron",
  "poisson_generator",
  "spike_generator",
  "spike_recorder",
  "static_synapse",
  "step_current_generator",
  "voltmeter",
];

export const useNESTModelDBStore = defineModelDBStore<NESTModel>({
  Model: NESTModel,
  ModelDB: NESTModelDB,
  modelAssets,
  workspace: "nest",
});

const interfaces = [
  "CheckboxInterface",
  "IntegerInterface",
  "ListInputInterface",
  "NumberInterface",
  "SelectInterface",
  "TupleInputInterface",
];

export const getNESTModelParameterStates = (modelId: string) => {
  const modelDBStore = useNESTModelDBStore();
  const model = modelDBStore.findModel(modelId);

  // default model params states
  const defaultParamStates: Record<string, IParamState> = {};
  if (model && model.params.keys && model.params.keys.length > 0) {
    model.params.keys.forEach((modelParamKey: string) => {
      const param = model.params.get(modelParamKey);
      if (param) {
        const paramState: IParamState = {
          id: modelParamKey,
          hidden: true,
          value: param.value,
        };
        if (param.props.codeNodeInterface && interfaces.includes(param.props.codeNodeInterface)) {
          paramState.component = param.props.codeNodeInterface;
        }
        defaultParamStates[modelParamKey] = paramState;
      }
    });
  }

  return defaultParamStates;
};
