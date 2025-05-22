// nestCopyModel.ts

import { displayInSidebar, NodeInterface, setType, TextInputInterface } from "baklavajs";

import { DictInputInterface } from "@/helpers/codeGraph/interface/dictInputInterface";
import { IParamProps } from "@/helpers/common/parameter";
import { NESTCopyModel } from "../../model/copyModel";
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

    const params = this.node.getConnectedOutputInterfaceByInterface("params");
    if (params.length > 0) args.push(`params=${this.code?.graph.formatInterfaceLabels(params).join(",\n\t")}`);

    return `nest.CopyModel(${args.join(", ")})`;
  },
  onPlaced() {
    if (!this.node || !this.code) return;
    this.node.networkItem = this.code.project.network.copyModels.all[this.indexOfNodeType];
  },
  onUpdate() {
    if (!this.node) return {};

    const inputs: Record<string, () => NodeInterface> = {};
    const outputs: Record<string, () => NodeInterface> = {};

    const node = this.node.networkItem as NESTCopyModel;

    if (node && node.paramsVisible.length > 0) {
      node.filteredParams.forEach((param: IParamProps) => {
        if (param.id === "weight_recorder") return;

        inputs[param.id] = () =>
          new TextInputInterface(param.id, param.value as string).use(displayInSidebar, true).setHidden(true);
      });
    }

    if (this.node.inputs.existing.value.includes("synapse")) {
      inputs["weight_recorder"] = () => new NodeInputInterface("weight_recorder");
    }

    return { inputs, outputs };
  },
});
