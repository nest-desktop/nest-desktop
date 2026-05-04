// nestCopyModel.ts

import {
  CodeNodeInputInterface,
  CodeNodeInterface,
  TextInputInterface,
  defineDynamicCodeNode,
  getPositionAtColumn,
  type AbstractCodeNode,
  type CodeGraph,
} from "@babsey/code-graph";

import type { ICodeMaskParamState } from "@/codeGraph";

import type { INESTCopyModelState } from "../../network/copyModel";
import { updateNESTParameterNode, updateParameterInterfaces } from "./nestParameters";
import { getNESTModelParameterStates } from "../../model";

export const nestCopyModel = defineDynamicCodeNode({
  type: "nest.CopyModel",
  title: "copy model",
  inputs: {
    existing: () => new TextInputInterface("existing", "iaf_psc_alpha"),
    new: () => new TextInputInterface("new", "new"),
    params: () => new CodeNodeInputInterface("params", "{}").setOptional(true),
  },
  onUpdate() {
    const inputs: Record<string, () => CodeNodeInterface> = {};

    // const node = this.node.view as NESTCopyModel

    // if (node && node.paramsVisible.length > 0) {
    //   node.filteredParams.forEach((param: IParamState) => {
    //     if (param.id === 'weight_recorder') return

    //     inputs[param.id] = () => new TextInputInterface(param.id, param.value as string).setOptional(true)
    //   })
    // }

    if (this.inputs.existing.value.includes("synapse")) {
      inputs["weight_recorder"] = () => new CodeNodeInputInterface("weight_recorder").setOptional(true);
    }

    return { inputs };
  },
  onConnected() {
    if (!this.code || !this.code.project) return;

    const paramsNode = this.getConnectedNodeByInterface("params", "inputs");
    if (paramsNode) {
      let paramStates: Record<string, ICodeMaskParamState>;
      if (this.mask) {
        this.mask.params.registerCodeNode(paramsNode);
        paramStates = this.mask.params.save();
      } else {
        paramStates = getNESTModelParameterStates(this.inputs?.existing.value);
      }
      updateParameterInterfaces(this, "params", paramStates);
    }
  },
  onUnconnected() {
    const paramsNode = this.getConnectedNodeByInterface("params", "inputs");
    if (!paramsNode) this.inputs.params.setHidden(true);
  },
});

export const addNESTCopyModelNode = (graph: CodeGraph, idx: number = -1): AbstractCodeNode => {
  if (idx === -1) idx = graph.getNodesByType("nest.CopyModel").length;
  return graph.addNodeAtCoordinates(new nestCopyModel(), getPositionAtColumn(-1, 100 + 250 * idx));
};

export const loadNESTCopyModelNode = (
  graph: CodeGraph,
  modelState: INESTCopyModelState,
  idx: number = -1,
): AbstractCodeNode => {
  const codeNode = addNESTCopyModelNode(graph, idx);
  updateNESTCopyModel(codeNode, modelState);

  return codeNode;
};

// export const loadNESTCopySynapseModelNode = (
//   graph: CodeGraph | NESTCodeGraph,
//   modelState: INESTCopyModelState,
//   weightRecorders: AbstractCodeNode[] = [],
//   idx: number = -1,
// ): AbstractCodeNode => {
//   const codeNode = loadNESTCopyModelNode(graph, modelState, idx)

//   if (weightRecorders) {
//     const weightRecorderParam = modelState.params?.find((param) => param.id === 'weight_recorder')
//     if (weightRecorderParam) {
//       const weightRecorderCode = weightRecorders.find(
//         (codeNode, idx) => codeNode.variableName + (idx + 1) === weightRecorderParam.value,
//       )
//       if (weightRecorderCode) graph.addConnection(weightRecorderCode.outputs.out, codeNode.inputs.weight_recorder)
//     }
//   }

//   return codeNode
// }

export const updateNESTCopyModel = (codeNode: AbstractCodeNode, modelState: INESTCopyModelState): void => {
  codeNode.updateInputValues(modelState);

  // Load params
  const defaultParamStates = getNESTModelParameterStates(modelState.model);
  let paramStates: Record<string, ICodeMaskParamState>;
  if (modelState.params) {
    const paramKeys = Object.keys(modelState.params);
    if (paramKeys.length === 0) return;

    paramStates = {};
    // all param states
    Object.keys(defaultParamStates).forEach((paramId) => {
      const paramState = modelState.params[paramId] ?? {};

      paramStates[paramId] = {
        ...defaultParamStates[paramId],
        ...paramState,
        hidden: !paramKeys.includes(paramId),
      };
    });

    updateNESTParameterNode(codeNode, "params", paramStates);
  }
};
