// connections.ts

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { IParamProps } from "@/helpers/common/parameter";

import nestConnect from "../codeNodeTypes/nest/nestConnect";
import { INESTConnectionProps } from "../connection/connection";
import { INESTCopyModelProps } from "../model/copyModel";
import { NESTCodeGraph } from "./codeGraph";
import { copyModel } from "./model";
import { addParameterNode } from "./parameters";

export const copySynapseModels = (
  graph: CodeGraph | NESTCodeGraph,
  modelsProps?: INESTCopyModelProps[],
  weightRecorders: AbstractCodeNode[] = [],
): void => {
  // Copy synapse model
  if (!modelsProps || modelsProps.length === 0) return;
  let codeNode: AbstractCodeNode;

  const copiedNodeModels = modelsProps.filter(
    (modelProps: INESTCopyModelProps) => !modelProps.existing.includes("synapse"),
  );

  modelsProps
    .filter((modelProps: INESTCopyModelProps) => modelProps.existing.includes("synapse"))
    .forEach((modelProps: INESTCopyModelProps, idx: number) => {
      codeNode = copyModel(graph, modelProps, copiedNodeModels.length + idx);

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

    if (connectionProps.params) {
      const params = connectionProps.params.filter((param: IParamProps) => ("visible" in param ? param.visible : true));

      if (params && params.length > 0) {
        const position = { ...codeNode.position };
        position.x -= 400;
        position.y += 75;
        const paramsNode = addParameterNode(graph, params, position);
        graph.addConnection(paramsNode.outputs.out, codeNode.inputs.conn_spec);
      }
    }

    if (connectionProps.synapse) {
      const syn_spec: IParamProps[] = [];
      if (connectionProps.synapse.model && connectionProps.synapse.model !== "static_synapse")
        syn_spec.push({
          id: "synapse_model",
          value: connectionProps.synapse.model,
        });

      // params
      const synParams = connectionProps.synapse.params?.filter((param: IParamProps) =>
        "visible" in param ? param.visible : true,
      );

      if (synParams)
        synParams.forEach((param: IParamProps) => {
          syn_spec.push(param);
        });

      if (syn_spec.length > 0) {
        const position = { ...codeNode.position };
        position.x -= 400;
        position.y += 75;
        const paramsNode = addParameterNode(graph, syn_spec, position);
        graph.addConnection(paramsNode.outputs.out, codeNode.inputs.syn_spec);
      }
    }

    if (nodes) {
      graph.addConnection(codeNode.inputs.pre, nodes[connectionProps.source].outputs.out);
      graph.addConnection(nodes[connectionProps.target].outputs.out, codeNode.inputs.post);
    }
  });
};
