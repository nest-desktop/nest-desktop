import { ICodeNodeDefinition } from "@/helpers/codeGraph/defineCodeNode";

export const getPlotlyArgs = (codeNode: ICodeNodeDefinition): string[] => {
  const args: string[] = [];

  const dataFrame = codeNode.node.getConnectedOutputInterfacesByInterface("data_frame");
  if (dataFrame.length > 0) args.push(`${codeNode.code?.graph.formatInterfaceLabels(dataFrame).join(", ")}`);

  const x = codeNode.node.getConnectedOutputInterfacesByInterface("x");
  if (x.length > 1) args.push(`x=[${codeNode.code?.graph.formatInterfaceLabels(x).join(", ")}]`);
  else if (x.length > 0) args.push(`x=${codeNode.code?.graph.formatInterfaceLabels(x).join(", ")}`);
  else if (codeNode.node.inputs.x.value) args.push(`x="${codeNode.node.inputs.x.value}"`);

  const y = codeNode.node.getConnectedOutputInterfacesByInterface("y");
  if (y.length > 1) args.push(`y=[${codeNode.code?.graph.formatInterfaceLabels(y).join(", ")}]`);
  else if (y.length > 0) args.push(`y=${codeNode.code?.graph.formatInterfaceLabels(y).join(", ")}`);
  else if (codeNode.node.inputs.y.value) args.push(`y="${codeNode.node.inputs.y.value}"`);

  if (!codeNode.node.inputs.nbins?.hidden) {
    const nbins = codeNode.node.getConnectedOutputInterfacesByInterface("nbins");
    if (nbins.length > 0) args.push(`nbins=${codeNode.code?.graph.formatInterfaceLabels(nbins).join(", ")}`);
    else if (codeNode.node.inputs.nbins?.value) args.push(`nbins=${codeNode.node.inputs.nbins?.value}`);
  }

  if (!codeNode.node.inputs.range_x?.hidden) {
    const rangeX = codeNode.node.getConnectedOutputInterfacesByInterface("range_x");
    if (rangeX.length > 0) args.push(`range_x=${codeNode.code?.graph.formatInterfaceLabels(rangeX).join(", ")}`);
    else if (codeNode.node.inputs.range_x?.value) args.push(`range_x=${codeNode.node.inputs.range_x?.value}`);
  }

  return args;
};
