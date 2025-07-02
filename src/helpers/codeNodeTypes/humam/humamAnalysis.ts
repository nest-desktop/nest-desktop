// humamAnalysis.ts

import { TextInputInterface } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

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

    const anaParams = this.node.getConnectedOutputInterfaceByInterface("ana_params");
    if (anaParams != undefined) args.push(`${formatInterfaceLabel(anaParams)}`);

    const netDict = this.node.getConnectedOutputInterfaceByInterface("net_dict");
    if (netDict != undefined) args.push(`${formatInterfaceLabel(netDict)}`);

    const simDict = this.node.getConnectedOutputInterfaceByInterface("sim_dict");
    if (simDict != undefined) args.push(`${formatInterfaceLabel(simDict)}`);

    const simFolder = this.node.getConnectedOutputInterfaceByInterface("sim_folder");
    if (simFolder != undefined) args.push(`${formatInterfaceLabel(simFolder)}`);
    else args.push(`"${this.node.inputs.sim_folder.value}"`);

    const basePath = this.node.getConnectedOutputInterfaceByInterface("base_path");
    if (basePath != undefined) args.push(`${formatInterfaceLabel(basePath)}`);
    else args.push(`"${this.node.inputs.base_path.value}"`);

    return `humam.Analysis(${args.join(", ")})`;
  },
});
