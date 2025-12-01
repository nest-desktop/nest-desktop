// nestCopyModel.ts

import {
  CodeNodeInputInterface,
  CodeNodeInterface,
  TextInputInterface,
  defineDynamicCodeNode,
} from "@babsey/code-graph";

// import nestCopyModel from './nestCopyModel'
// import { INESTCopyModelState, NESTCopyModel } from '../../model/copyModel'
// import { NESTCodeGraph } from '../../codeGraph/codeGraph'
// import { updateNESTParameterNode } from './nestParameters'

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
});

// export const addNESTCopyModelNode = (graph: CodeGraph | NESTCodeGraph, idx: number = -1): AbstractCodeNode => {
//   if (idx === -1) idx = graph.nodes.filter((node: AbstractCodeNode) => node.type === 'nest.CopyModel').length
//   return graph.addNodeAtCoordinates(nestCopyModel, getPositionAtColumn(-1, 100 + 250 * idx))
// }

// export const loadNESTCopyModelNode = (
//   graph: CodeGraph | NESTCodeGraph,
//   modelState: INESTCopyModelState,
//   idx: number = -1,
// ): AbstractCodeNode => {
//   const codeNode = addNESTCopyModelNode(graph, idx)
//   codeNode.state.props = modelState

//   codeNode.inputs.existing.value = modelState.existing
//   codeNode.inputs.new.value = modelState.new

//   // params
//   const params = modelState.params?.filter((param: IParamState) => ('visible' in param ? param.visible : true))
//   if (params && params.length > 0) updateNESTParameterNode(graph, codeNode, 'params', params)

//   return codeNode
// }

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
