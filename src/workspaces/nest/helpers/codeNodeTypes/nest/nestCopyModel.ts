// nestCopyModel.ts

import { displayInSidebar, NodeInterface, setType, TextInputInterface } from "baklavajs";

import { AbstractCodeNode, formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { DictInputInterface } from "@/helpers/codeGraph/interface/dictInputInterface";
import { IParamProps } from "@/helpers/common/parameter";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";
import { stringType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

import nestCopyModel from "./nestCopyModel";
import { INESTCopyModelProps, NESTCopyModel } from "../../model/copyModel";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";
import { addParameterNode } from "./nestParameters";

export default defineDynamicCodeNode({
  type: "nest.CopyModel",
  title: "copy model",
  inputs: {
    existing: () => new TextInputInterface("existing", "iaf_psc_alpha").use(setType, stringType),
    new: () => new TextInputInterface("new", "new").use(setType, stringType),
    params: () => new DictInputInterface("params", {}).use(displayInSidebar, true).setHidden(true),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [`"${this.node.inputs.existing.value}"`, `"${this.node.inputs.new.value}"`];

    const params = this.node.getConnectedOutputInterfaceByInterface("params");
    if (params != undefined) args.push(`params=${formatInterfaceLabel(params)}`);

    return `nest.CopyModel(${args.join(", ")})`;
  },
  onPlaced() {
    if (!this.node || !this.code || !this.code.project.network.copyModels) return;
    this.node.view = this.code.project.network.copyModels.allModels[this.indexOfNodeType];
  },
  onUpdate() {
    if (!this.node) return {};

    const inputs: Record<string, () => NodeInterface> = {};
    const outputs: Record<string, () => NodeInterface> = {};

    const node = this.node.view as NESTCopyModel;

    if (node && node.paramsVisible.length > 0) {
      node.filteredParams.forEach((param: IParamProps) => {
        if (param.id === "weight_recorder") return;

        inputs[param.id] = () =>
          new TextInputInterface(param.id, param.value as string).use(displayInSidebar, true).setHidden(true);
      });
    }

    if (this.node.inputs.existing.value.includes("synapse")) {
      inputs["weight_recorder"] = () => new NodeInputInterface("weight_recorder").setHidden(true);
    }

    return { inputs, outputs };
  },
});

export const addNESTCopyModel = (
  graph: CodeGraph | NESTCodeGraph,
  modelProps: INESTCopyModelProps,
  idx: number = -1,
): AbstractCodeNode => {
  if (idx === -1) idx = graph.nodes.filter((node: AbstractCodeNode) => node.type === "nest.CopyModel").length;

  const codeNode = graph.addNodeAtColumn(nestCopyModel, 0 - 1, 100 + 250 * idx, modelProps);
  codeNode.inputs.existing.value = modelProps.existing;
  codeNode.inputs.new.value = modelProps.new;

  // params
  const params = modelProps.params?.filter((param: IParamProps) => ("visible" in param ? param.visible : true));
  if (params && params.length > 0) {
    const position = { ...codeNode.position };
    position.x -= 400;
    position.y += 100;
    const paramsNode = addParameterNode(graph, params, position);
    graph.addConnection(paramsNode.outputs.out, codeNode.inputs.params);
  }

  return codeNode;
};

export const addNESTCopySynapseModel = (
  graph: CodeGraph | NESTCodeGraph,
  modelProps: INESTCopyModelProps,
  weightRecorders: AbstractCodeNode[] = [],
  idx: number = -1,
): AbstractCodeNode => {
  if (idx === -1) idx = graph.nodes.filter((node: AbstractCodeNode) => node.type === "nest.CopyModel").length;

  const codeNode = addNESTCopyModel(graph, modelProps);

  if (weightRecorders) {
    const weightRecorderParam = modelProps.params?.find((param) => param.id === "weight_recorder");
    if (weightRecorderParam) {
      const weightRecorderCode = weightRecorders.find(
        (codeNode, idx) => codeNode.variableName + (idx + 1) === weightRecorderParam.value,
      );
      if (weightRecorderCode) graph.addConnection(weightRecorderCode.outputs.out, codeNode.inputs.weight_recorder);
    }
  }

  return codeNode;
};
