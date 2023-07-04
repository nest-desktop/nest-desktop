// nodeParameter.ts

import {
  Parameter,
  ParameterProps,
} from "@/helpers/parameter";

import { ModelParameter } from "../model/modelParameter";
import { Node } from "./node";
import { NodeCompartment } from "./nodeCompartment/nodeCompartment";
import { NodeReceptor } from "./nodeReceptor/nodeReceptor";

type NodeTypes = Node | NodeCompartment | NodeReceptor;

export interface NodeParameterProps extends ParameterProps {}

export class NodeParameter extends Parameter {
  private _parent: NodeTypes;

  constructor(node: NodeTypes, param: NodeParameterProps) {
    super(param);
    this._parent = node;
  }

  get isVisible(): boolean {
    return this.node.paramsVisible.includes(this.id);
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.node.model.params[this.id];
  }

  get node(): Node {
    return this._parent as Node;
  }

  get parent(): NodeTypes {
    return this._parent;
  }

  /**
   * Observer for parameter changes.
   *
   * @remarks
   * It emits node changes.
   */
  override changes(): void {
    this.node.changes();
  }

  /**
  * Serialize for JSON.
  * @return parameter object
  */
 toJSON(): NodeParameterProps {
   const param: any = {
     id: this.id,
     value: this.value,
   };



   // Add value factors if existed.
   if (this.factors.length > 0) {
     param.factors = this.factors;
   }

   // Add rules for validation if existed.
   if (this.rules.length > 0) {
     param.rules = this.rules;
   }

   // Add param type if not constant.
   if (!this.isConstant) {
     param.type = this.typeToJSON();
   }

   return param;
 }
}
