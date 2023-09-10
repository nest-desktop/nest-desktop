// nodeSlice.ts

import { Config } from "@/helpers/common/config";
import { NodeParameter, NodeParameterProps } from "@/helpers/node/nodeParameter";

import { NESTNode } from "./nestNode";

export class NESTNodeSlice extends Config {
  private readonly _name = "NESTNodeSlice";
  private _node: NESTNode;
  private _params: { [key: string]: NodeParameter } = {};
  private _visible: boolean = false;

  constructor(node: NESTNode, params: NodeParameterProps[] = []) {
    super("NESTNodeSlice");
    this._node = node;
    this.initParameters(params);
    this._visible = params.length > 0;
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

    const indices = params.map((param: NodeParameter) =>
      param.disabled ? null : param.value
    );
    return `[${indices.join(":")}]`;
  }

  get node(): NESTNode {
    return this._node;
  }

  get visible(): boolean {
    return this._visible;
  }

  get name(): string {
    return this._name;
  }

  get params(): { [key: string]: NodeParameter } {
    return this._params;
  }

  /**
   * Initialize parameters.
   */
  initParameters(params: NodeParameterProps[] = []): void {
    this._params = {};
    this.config.params.forEach((param: NodeParameterProps) => {
      if (params.length > 0) {
        const p: NodeParameterProps | undefined = params.find(
          (p: NodeParameterProps) => p.id === param.id
        );
        if (p) {
          param.value = p.value;
          param.disabled = false;
        }
      }
      this._params[param.id] = new NodeParameter(this._node, param);
    });
  }

  toggleVisible(): void {
    this._visible = !this._visible;
  }

  /**
   * Serialize for JSON.
   * @return node slice object
   */
  toJSON(): NodeParameterProps[] {
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
    if (this._params.stop.disabled) {
      this._params.stop.value = this._node.size;
    }
  }
}
