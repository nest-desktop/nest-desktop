// nodeParameter.ts

import { IParamProps, IParamTypeSpec } from "@/helpers/common/parameter";
import { NodeParameter } from "@/helpers/node/nodeParameter";

import { NESTNode } from "./node";

export class NESTNodeParameter extends NodeParameter {
  constructor(node: NESTNode, paramProps: IParamProps) {
    super(node, paramProps);
  }

  /**
   * Generate the Python code for this parameter.
   * @returns string code
   */
  override toPythonCode(): string {
    let value: string;
    if (this.isConstant) {
      // Constant value.
      if (this.format === "integer") {
        // Integer value
        value = this.toFixed(this.value as number, 0);
      } else if (this.format === "float") {
        // Float value
        value = this.toFixed(this.value as number);
      } else if (typeof this.value === "string") {
        // TODO: this condition should be checked if it is really possible.
        // String value
        value = this.value as string;
      } else if (typeof this.value === "boolean") {
        // Boolean value
        value = this.value ? "True" : "False";
      } else if (Array.isArray(this.value)) {
        value = JSON.stringify(this.value.map((value) => value));
      } else {
        value = JSON.stringify(this.value);
      }
    } else if (this.type.id.startsWith("np")) {
      const specs: string = this.specs
        .filter((spec: IParamTypeSpec) => !(spec.optional && spec.value === spec.default))
        .map((spec: IParamTypeSpec) => spec.value)
        .join(", ");
      value = `${this.type.id}(${specs})`;
    } else if (this.type.id === "spatial.distance") {
      // Distance-dependent linear function.
      const specs: IParamTypeSpec[] = this.specs;
      value = "";
      value += specs[0].value !== 1 ? `${specs[0].value} * ` : "";
      value += `nest.${this.type.id}`;
      value += specs[1].value !== 0 ? ` + ${specs[1].value}` : "";
    } else if (this.type.id.startsWith("spatial")) {
      // Spatial distribution.
      const specs: string = this.specs.map((spec: IParamTypeSpec) => spec.value).join(", ");
      value = `nest.${this.type.id}(nest.spatial.distance, ${specs})`;
    } else {
      // Non-spatial distribution.
      const specs: string = this.specs.map((spec: IParamTypeSpec) => spec.value).join(", ");
      value = `nest.${this.type.id}(${specs})`;
    }
    return value;
  }
}
