// connections.ts

import { NodeInterface, NumberInterface, TextInputInterface } from "baklavajs";

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { IParamProps } from "@/helpers/common/parameter";

import nestConnect from "../codeNodeTypes/nest/nestConnect";
import nestCopyModel from "../codeNodeTypes/nest/nestCopyModel";
import { INESTConnectionProps } from "../connection/connection";
import { INESTCopyModelProps } from "../model/copyModel";
import { NESTCodeGraph } from "./codeGraph";

export const copySynapseModels = (
  graph: CodeGraph | NESTCodeGraph,
  modelsProps?: INESTCopyModelProps[],
  weightRecorders: AbstractCodeNode[] = [],
): void => {
  // Copy synapse model
  if (!modelsProps || modelsProps.length === 0) return;
  let codeNode: AbstractCodeNode;

  modelsProps
    .filter((modelProps: INESTCopyModelProps) => modelProps.existing.includes("synapse"))
    .forEach((modelProps: INESTCopyModelProps, idx: number) => {
      // nest.CopyModel
      codeNode = graph.addNodeAtColumn(nestCopyModel, 3, 1500 + idx * 600);
      // codeNode.state.role = "network";
      codeNode.inputs.existing.value = modelProps.existing;
      codeNode.inputs.new.value = modelProps.new;
      modelProps.params?.forEach((param) => {
        let nodeInterface: NodeInterface;
        switch (typeof param.value) {
          case "number":
            nodeInterface = new NumberInterface(param.id, param.value as number);
            break;
          default:
            nodeInterface = new TextInputInterface(param.id, param.value as string);
            break;
        }
        codeNode.addInput(param.id, nodeInterface);
      });

      if (weightRecorders) {
        const weightRecorderParam = modelProps.params?.find((param) => param.id === "weight_recorder");
        if (weightRecorderParam) {
          const weightRecorderCode = weightRecorders.find(
            (codeNode, idx) => codeNode.variableName + (idx + 1) === weightRecorderParam.value,
          );
          if (weightRecorderCode) graph.addConnection(weightRecorderCode.outputs.out, codeNode.inputs.weight_recorder);
        }
      }
    });
};

export const connectNodes = (
  graph: CodeGraph | NESTCodeGraph,
  connectionsProps?: INESTConnectionProps[],
  nodes: AbstractCodeNode[] = [],
): void => {
  if (!connectionsProps || connectionsProps.length === 0) return;
  let codeNode: AbstractCodeNode;

  connectionsProps.forEach((connectionProps: INESTConnectionProps, idx: number) => {
    // nest.Connect
    codeNode = graph.addNodeAtColumn(nestConnect, 3, 100 + 200 * idx);
    // codeNode.state.role = "network";
    if (idx === 0) codeNode.state.comments = "Connect nodes";
    if (connectionProps.synapse) {
      if (connectionProps.synapse.model) codeNode.inputs.model.value = connectionProps.synapse.model;
      connectionProps.synapse.params?.forEach((param: IParamProps) => {
        if (param.id in codeNode.inputs) {
          codeNode.inputs[param.id].hidden = false;
          codeNode.inputs[param.id].value = param.value;
        }
      });
    }

    if (nodes) {
      graph.addConnection(codeNode.inputs.pre, nodes[connectionProps.source].outputs.out);
      graph.addConnection(nodes[connectionProps.target].outputs.out, codeNode.inputs.post);
    }
  });
};
