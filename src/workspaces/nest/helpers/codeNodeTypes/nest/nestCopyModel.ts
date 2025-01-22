// nestCopyModel.ts

import { displayInSidebar, NodeInterface, setType, TextInputInterface } from "baklavajs";

import { DictInputInterface } from "@/helpers/codeGraph/interface/dictInputInterface";
import { IParamProps } from "@/helpers/common/parameter";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";
import { stringType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineDynamicCodeNode({
  type: "nest.CopyModel",
  title: "copy model",
  inputs: {
    existing: () => new TextInputInterface("existing", "iaf_psc_alpha").use(setType, stringType),
    new: () => new TextInputInterface("new", "new").use(setType, stringType),
    params: () => new DictInputInterface("params", {}),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args = [`"${this.node.inputs.existing.value}"`, `"${this.node.inputs.new.value}"`];

    if (this.node.networkItem) {
      const params: string[] = [];
      this.node.networkItem.filteredParams.forEach((param) => {
        params.push(`"${param.id}": ${JSON.stringify(param.value)}`);
      });

      const weightRecorders = this.node.getConnectedOutputInterfaceByInterface("weight_recorder");
      if (weightRecorders.length > 0)
        params.push(`"weight_recorder": ${this.code?.graph.formatInterfaceLabels(weightRecorders).join(", ")}`);

      if (params.length > 0) args.push(`params={\n\t${params.join(",\n\t")}\n}`);
    }

    return `nest.CopyModel(${args.join(", ")})`;
  },
  onPlaced() {
    if (!this.code) return;
    this.networkItem = this.code.project.network.copyModels.all[this.indexOfNodeType];
    if (!this.networkItem) return;
    this.networkItem.codeNode = this;
  },
  onUpdate() {
    const inputs: Record<string, () => NodeInterface> = {};
    const outputs: Record<string, () => NodeInterface> = {};

    if (this.node?.networkItem && this.node?.networkItem.paramsVisible.length > 0) {
      this.node?.networkItem.filteredParams.forEach((param: IParamProps) => {
        if (param.id === "weight_recorder") return;

        inputs[param.id] = () =>
          new TextInputInterface(param.id, param.value as string).use(displayInSidebar, true).setHidden(true);
      });
    }

    if (this.node?.inputs.existing.value.includes("synapse")) {
      inputs["weight_recorder"] = () => new NodeInputInterface("weight_recorder");
    }

    return { inputs, outputs };
  },
});
