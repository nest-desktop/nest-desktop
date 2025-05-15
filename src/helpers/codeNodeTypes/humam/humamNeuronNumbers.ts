// humamNeuronNumbers.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { parseBoolean } from "@/utils/boolean";
import { CheckboxInterface, displayInSidebar, NumberInterface, TextInputInterface } from "baklavajs";

export default defineCodeNode({
  type: "humam.NeuronNumbers",
  title: "neuron numbers",
  variableName: "nn",
  inputs: {
    surface_area: () => new NumberInterface("surface area", 1),
    source: () => new TextInputInterface("source", ""),
    src_path: () => new TextInputInterface("src path", ""),
    ei_ratio_path: () => new TextInputInterface("ei ratio path", ""),
    min_neurons_per_layer: () => new NumberInterface("mun neurons per layer", 1),
    remove_smaller_layerI: () => new CheckboxInterface("remove smaller layer I", false),
    target: () => new TextInputInterface("target", "").use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const surfaceArea = this.node.getConnectedOutputInterfaceByInterface("surface_area");
    if (surfaceArea.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(surfaceArea).join(", ")}`);
    else args.push(`${this.node.inputs.surface_area.value}`);

    const source = this.node.getConnectedOutputInterfaceByInterface("source");
    if (source.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(source).join(", ")}`);
    else args.push(`"${this.node.inputs.source.value}"`);

    const srcPath = this.node.getConnectedOutputInterfaceByInterface("src_path");
    if (srcPath.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(srcPath).join(", ")}`);
    else args.push(`"${this.node.inputs.src_path.value}"`);

    const EIRatioPath = this.node.getConnectedOutputInterfaceByInterface("ei_ratio_path");
    if (EIRatioPath.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(EIRatioPath).join(", ")}`);
    else args.push(`"${this.node.inputs.ei_ratio_path.value}"`);

    const minNeuronsPerLayer = this.node.getConnectedOutputInterfaceByInterface("min_neurons_per_layer");
    if (minNeuronsPerLayer.length > 0)
      args.push(`${this.code?.graph.formatInterfaceLabels(minNeuronsPerLayer).join(", ")}`);
    else args.push(`${this.node.inputs.min_neurons_per_layer.value}`);

    const removeSmallerLayerI = this.node.getConnectedOutputInterfaceByInterface("remove_smaller_layerI");
    if (removeSmallerLayerI.length > 0)
      args.push(`${this.code?.graph.formatInterfaceLabels(removeSmallerLayerI).join(", ")}`);
    else args.push(`${parseBoolean(this.node.inputs.remove_smaller_layerI.value)}`);

    return `humam.NeuronNumbers(${args.join(", ")})`;
  },
});
