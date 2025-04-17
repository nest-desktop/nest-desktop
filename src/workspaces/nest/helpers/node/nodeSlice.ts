// nodeSlice.ts

import { BaseObj } from "@/helpers/common/base";
import { IParamProps } from "@/helpers/common/parameter";
import { NodeParameter } from "@/helpers/node/nodeParameter";
import { TNodeGroup } from "@/types";

import { NESTNode } from "./node";

export class NESTNodeSlice extends BaseObj {
  // private readonly _name = "NESTNodeSlice";
  private _node: NESTNode | TNodeGroup;
  private _params: Record<string, NodeParameter> = {};
  private _visible: boolean = false;

  constructor(node: NESTNode | TNodeGroup, paramsProps: IParamProps[] = []) {
    super({
      config: { name: "NESTNodeSlice", simulator: "nest" },
    });

    this._node = node;
    this.initParameters(paramsProps);
    this._visible = paramsProps.length > 0;
  }

  /**
   * Get indices of node slicing
   */
  get indices(): string {
    if (Object.keys(this._params).length === 0) {
      return "";
    }

    const start: NodeParameter = this._params.start;
    const stop: NodeParameter = this._params.stop;
    const step: NodeParameter = this._params.step;

    if (start.disabled && stop.disabled && step.disabled) {
      return "";
    }

    const params: NodeParameter[] = [start, stop];
    if (!step.disabled) {
      params.push(step);
    }

    const indices = params.map((param: NodeParameter) => (param.disabled ? null : param.value));
    return `[${indices.join(":")}]`;
  }

  get node(): NESTNode | TNodeGroup {
    return this._node;
  }

  get nodeGroup(): TNodeGroup {
    return this._node as TNodeGroup;
  }

  get nodeItem(): NESTNode {
    return this._node as NESTNode;
  }

  get visible(): boolean {
    return this._visible;
  }

  // get name(): string {
  //   return this._name;
  // }

  get params(): Record<string, NodeParameter> {
    return this._params;
  }

  /**
   * Initialize parameters.
   */
  initParameters(paramsProps: IParamProps[] = []): void {
    this._params = {};
    this.config?.localStorage.params.forEach((param: IParamProps) => {
      if (paramsProps.length > 0) {
        const paramProps: IParamProps | undefined = paramsProps.find(
          (paramProps: IParamProps) => paramProps.id === param.id,
        );
        if (paramProps) {
          param.value = paramProps.value;
          param.disabled = false;
        }
      }
      this._params[param.id] = new NodeParameter(this.nodeItem, param);
    });
  }

  toggleVisible(): void {
    this._visible = !this._visible;
  }

  /**
   * Serialize for JSON.
   * @return param props of node slice
   */
  toJSON(): IParamProps[] {
    return Object.values(this._params)
      .filter((param: NodeParameter) => !param.disabled)
      .map((param: NodeParameter) => {
        return {
          id: param.id,
          value: param.value,
        };
      });
  }

  /**
   * Update node slice.
   */
  update(): void {
    if (this._node.isNode && this._params.stop.disabled) this._params.stop.state.value = this.nodeItem.size;
  }
}
