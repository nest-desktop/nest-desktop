// nodeSlice.ts

import { BaseObj } from "@/helpers/common/base";
import type { IParamState } from "@/helpers/common/parameter";
import type { NodeParameter } from "@/networkGraph/helpers/node/nodeParameter";
import type { TNodeGroup } from "@/types";

import type { NESTNode } from "./node";

export class NESTNodeSlice extends BaseObj {
  // private readonly _name = "NESTNodeSlice";
  private _node: NESTNode | TNodeGroup;
  private _params: Record<string, NodeParameter> = {};
  private _visible: boolean = false;

  constructor(node: NESTNode | TNodeGroup) {
    super({
      config: { name: "NESTNodeSlice", simulator: "nest" },
    });

    this._node = node;
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
   * Load node slice from states.
   * @param paramStates param states
   */
  load(paramStates: IParamState[] = []): void {
    this._params = {};
    this.config?.localStorage.params.forEach((param: IParamState) => {
      if (paramStates.length > 0) {
        const paramState: IParamState | undefined = paramStates.find(
          (paramState: IParamState) => paramState.id === param.id,
        );
        if (paramState) {
          param.value = paramState.value;
          param.disabled = false;
        }
      }
      this._params[param.id] = new NodeParameter(this.nodeItem, param);
    });

    this._visible = paramStates.length > 0;
  }

  /**
   * Save node slice to state.
   * @return param states
   */
  override save(): IParamState[] {
    return Object.values(this._params)
      .filter((param: NodeParameter) => !param.disabled)
      .map((param: NodeParameter) => {
        return {
          id: param.id,
          value: param.value,
        };
      });
  }

  toggleVisible(): void {
    this._visible = !this._visible;
  }

  /**
   * Update node slice.
   */
  update(): void {
    if (this._node.isNode && this._params.stop.disabled) this._params.stop.state.value = this.nodeItem.size;
  }
}
