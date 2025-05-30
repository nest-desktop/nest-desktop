import { ICodeNodeDefinition } from "@/helpers/codeGraph/defineCodeNode";

export const getPlotlyArgs = (codeNode: ICodeNodeDefinition): string[] => {
  const args: string[] = [];

  const dataFrame = codeNode.node.getConnectedOutputInterfacesByInterface("data_frame");
  if (dataFrame.length > 0) args.push(`${codeNode.code?.graph.formatInterfaceLabels(dataFrame).join(", ")}`);

  const x = codeNode.node.getConnectedOutputInterfacesByInterface("x");
  if (x.length > 1) args.push(`x=[${codeNode.code?.graph.formatInterfaceLabels(x).join(", ")}]`);
  else if (x.length > 0) args.push(`x=${codeNode.code?.graph.formatInterfaceLabels(x).join(", ")}`);
  else if (codeNode.node.inputs.x.value) args.push(`x=${codeNode.node.inputs.x.value}`);

  const y = codeNode.node.getConnectedOutputInterfacesByInterface("y");
  if (y.length > 1) args.push(`y=[${codeNode.code?.graph.formatInterfaceLabels(y).join(", ")}]`);
  else if (y.length > 0) args.push(`y=${codeNode.code?.graph.formatInterfaceLabels(y).join(", ")}`);
  else if (codeNode.node.inputs.y.value) args.push(`y="${codeNode.node.inputs.y.value}"`);

  return args;
};
