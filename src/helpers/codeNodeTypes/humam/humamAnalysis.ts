// humamAnalysis.ts

import { TextInputInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";

export default defineCodeNode({
  type: "humam.Analysis",
  title: "analysis",
  variableName: "ana",
  inputs: {
    ana_params: () => new NodeInputInterface("params"),
    net_dict: () => new NodeInputInterface("net dict"),
    sim_dict: () => new NodeInputInterface("sim dict"),
    sim_folder: () => new TextInputInterface("sim folder", ""),
    base_path: () => new TextInputInterface("base path", ""),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const anaParams = this.node.getConnectedOutputInterfacesByInterface("ana_params");
    if (anaParams.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(anaParams).join(", ")}`);

    const netDict = this.node.getConnectedOutputInterfacesByInterface("net_dict");
    if (netDict.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(netDict).join(", ")}`);

    const simDict = this.node.getConnectedOutputInterfacesByInterface("sim_dict");
    if (simDict.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(simDict).join(", ")}`);

    const simFolder = this.node.getConnectedOutputInterfacesByInterface("sim_folder");
    if (simFolder.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(simFolder).join(", ")}`);
    else args.push(`"${this.node.inputs.sim_folder.value}"`);

    const basePath = this.node.getConnectedOutputInterfacesByInterface("base_path");
    if (basePath.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(basePath).join(", ")}`);
    else args.push(`"${this.node.inputs.base_path.value}"`);

    return `humam.Analysis(${args.join(", ")})`;
  },
});
